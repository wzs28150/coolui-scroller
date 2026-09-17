import * as vscode from 'vscode'
import { ComponentMeta, EventMeta, Platform, PropMeta } from '../types'
import { importPathOf, tagSuggestions } from '../meta'
import { DocumentTags, TagResolver, resolveComponent } from '../tags'
import { config } from '../utils/config'
import { componentDoc, eventDoc, propDoc, slotDoc } from '../utils/markdown'
import { getParentTag, getWordRangeAt, getWxmlContext, platformOf, WxmlContext } from '../utils/wxml'

function valueSnippet(prop: PropMeta, index: number): string {
  // 布尔属性统一用 {{true}} / {{false}}，与文档习惯保持一致
  if (prop.type === 'boolean') return `{{\${${index}|true,false|}}}`
  if (prop.enum?.length) return `\${${index}|${prop.enum.join(',')}|}`
  return `{{$${index}}}`
}

/** 事件绑定写法：native 用 bind:，uni-app 用 @ */
function eventAttr(comp: ComponentMeta, name: string): string {
  return comp.platform === 'uniapp' ? `@${name}` : `bind:${name}`
}

export function tagSnippet(comp: ComponentMeta, tag: string, withLt = false): vscode.SnippetString {
  const quick = comp.props.filter((p) => !p.deprecated && p.type !== 'object').slice(0, 3)
  const events = comp.events.slice(0, 2)
  let index = 1
  const attrs = quick.map((prop) => ` ${prop.name}="${valueSnippet(prop, index++)}"`)
  attrs.push(...events.map((event) => ` ${eventAttr(comp, event.name)}="$${index++}"`))
  const lt = withLt ? '<' : ''
  const hasSlot = comp.slots.length > 1 || comp.slots.some((s) => s.name !== 'default')
  if (!hasSlot) {
    return new vscode.SnippetString(`${lt}${tag}${attrs.join('')} />`)
  }
  return new vscode.SnippetString(`${lt}${tag}${attrs.join('')}>\n\t$0\n</${tag}>`)
}

function propItem(comp: ComponentMeta, prop: PropMeta, range?: vscode.Range): vscode.CompletionItem {
  const item = new vscode.CompletionItem(prop.name, vscode.CompletionItemKind.Property)
  item.insertText = new vscode.SnippetString(`${prop.name}="${valueSnippet(prop, 1)}"`)
  item.detail = `${prop.deprecated ? '(已废弃) ' : ''}${prop.type} = ${prop.default ?? '-'}`
  item.documentation = propDoc(comp, prop)
  item.range = range
  if (prop.deprecated) item.tags = [vscode.CompletionItemTag.Deprecated]
  item.sortText = String(prop.deprecated ? '9' : '1') + prop.name
  return item
}

function eventItems(comp: ComponentMeta, event: EventMeta, range?: vscode.Range): vscode.CompletionItem[] {
  const make = (label: string, sort: string) => {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Event)
    item.insertText = new vscode.SnippetString(`${label}="$1"`)
    item.detail = `事件 · ${comp.title}`
    item.documentation = eventDoc(comp, event)
    item.range = range
    item.sortText = sort
    return item
  }
  if (comp.platform === 'uniapp') {
    return [make(`@${event.name}`, `2${event.name}`), make(`v-on:${event.name}`, `3${event.name}`)]
  }
  return [make(`bind:${event.name}`, `2${event.name}`), make(`catch:${event.name}`, `3${event.name}`)]
}

function slotValueItems(
  document: vscode.TextDocument,
  position: vscode.Position,
  tags: DocumentTags,
  platform: Platform
) {
  const parentName = getParentTag(document, position)
  if (!parentName) return []
  const parent = resolveComponent(tags, parentName, platform)
  if (!parent?.slots.length) return []
  return parent.slots.map((slot) => {
    const item = new vscode.CompletionItem(slot.name, vscode.CompletionItemKind.Field)
    item.detail = `插槽 · ${parent.title}`
    item.documentation = slotDoc(parent, slot)
    item.sortText = `0${slot.name}`
    return item
  })
}

function propValueItems(prop: PropMeta, comp: ComponentMeta): vscode.CompletionItem[] {
  if (prop.type === 'boolean') {
    return ['{{true}}', '{{false}}'].map((value) => {
      const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value)
      item.detail = `${prop.name} · boolean`
      item.documentation = propDoc(comp, prop)
      return item
    })
  }
  if (prop.enum?.length) {
    return prop.enum.map((value) => {
      const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.EnumMember)
      item.detail = `${prop.name} 可取的值`
      item.documentation = propDoc(comp, prop)
      return item
    })
  }
  return []
}

export class WxmlCompletionProvider implements vscode.CompletionItemProvider {
  constructor(private readonly resolver: TagResolver) {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[] | undefined> {
    if (!config.enabled) return undefined
    const platform = platformOf(document)
    const ctx: WxmlContext = getWxmlContext(document, position)
    const tags = this.resolver.resolve(document)

    if (ctx.afterTagStart) {
      return tagSuggestions(platform).map(({ label, comp }) => {
        // 使用字符串 label：对象式 CompletionItemLabel 需要 VSCode 1.79+，低版本会导致补全项不可见
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Class)
        item.insertText = tagSnippet(comp, label)
        item.detail = `${comp.title} · ${importPathOf(comp)}`
        item.documentation = componentDoc(comp, importPathOf(comp))
        item.range = ctx.tagRange
        item.filterText = label
        item.sortText = `0${label}`
        return item
      })
    }

    if (!ctx.inTag) return undefined

    // uni-app 具名插槽：<template #refresh>
    if (platform === 'uniapp') {
      const line = document.lineAt(position.line).text.slice(0, position.character)
      const hash = /#([\w-]*)$/.exec(line)
      if (hash) {
        const parent = resolveComponent(tags, getParentTag(document, position), platform)
        if (parent?.slots.length) {
          const start = position.character - hash[1].length
          const range = new vscode.Range(position.line, start, position.line, position.character)
          return parent.slots.map((slot) => {
            const item = new vscode.CompletionItem(slot.name, vscode.CompletionItemKind.Field)
            item.detail = `插槽 · ${parent.title}`
            item.documentation = slotDoc(parent, slot)
            item.range = range
            item.sortText = `0${slot.name}`
            return item
          })
        }
      }
    }

    // 属性值（slot 由父组件提供，与当前标签无关）
    if (ctx.attrName && ctx.valueRange) {
      if (ctx.attrName === 'slot') return slotValueItems(document, position, tags, platform)
      const owner = resolveComponent(tags, ctx.tagName, platform)
      if (!owner) return undefined
      const valueProp = owner.props.find((p) => p.name === ctx.attrName)
      return valueProp ? propValueItems(valueProp, owner) : undefined
    }

    const comp = resolveComponent(tags, ctx.tagName, platform)
    if (!comp) return undefined

    // 属性名 / 事件名
    const wordRange = getWordRangeAt(document, position)
    const declared = new Set(comp.props.map((p) => p.name))
    const items: vscode.CompletionItem[] = comp.props.map((prop) => propItem(comp, prop, wordRange))
    for (const event of comp.events) items.push(...eventItems(comp, event, wordRange))
    for (const cls of comp.externalClasses) {
      if (declared.has(cls)) continue
      const item = new vscode.CompletionItem(cls, vscode.CompletionItemKind.Property)
      item.insertText = new vscode.SnippetString(`${cls}="$1"`)
      item.detail = '外部样式类'
      item.documentation = componentDoc(comp, importPathOf(comp))
      item.range = wordRange
      item.sortText = `4${cls}`
      items.push(item)
    }
    return items
  }
}
