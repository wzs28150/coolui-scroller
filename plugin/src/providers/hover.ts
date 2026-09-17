import * as vscode from 'vscode'
import { importPathOf } from '../meta'
import { TagResolver, resolveComponent } from '../tags'
import { config } from '../utils/config'
import { componentDoc, eventDoc, propDoc, slotDoc } from '../utils/markdown'
import { getParentTag, getWordRangeAt, getWxmlContext, platformOf } from '../utils/wxml'

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export class WxmlHoverProvider implements vscode.HoverProvider {
  constructor(private readonly resolver: TagResolver) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover | undefined> {
    if (!config.enabled) return undefined
    const platform = platformOf(document)
    const ctx = getWxmlContext(document, position)
    if (!ctx.inTag) return undefined

    const wordRange = getWordRangeAt(document, position, /[\w:.\-@#]+/)
    if (!wordRange) return undefined
    const word = document.getText(wordRange)
    if (!word) return undefined

    const tags = this.resolver.resolve(document)

    // 插槽：native 的 slot="x" 与 uni-app 的 #x
    const slotName = word.startsWith('#')
      ? word.slice(1)
      : ctx.attrName === 'slot' && ctx.valueRange?.contains(position)
        ? ctx.valuePrefix
        : undefined
    if (slotName) {
      const parent = resolveComponent(tags, getParentTag(document, position), platform)
      const slot = parent?.slots.find((s) => s.name === slotName)
      if (parent && slot) return new vscode.Hover(slotDoc(parent, slot), wordRange)
    }

    const comp = resolveComponent(tags, ctx.tagName, platform)
    if (!comp) return undefined

    // 标签名
    if (word === ctx.tagName) return new vscode.Hover(componentDoc(comp, importPathOf(comp)), wordRange)

    // 属性：native 的 name / uni-app 的 :name、v-bind:name
    const propName = word.replace(/^v-bind:/, '').replace(/^:/, '')
    const prop = comp.props.find((p) => p.name === propName)
    if (prop) return new vscode.Hover(propDoc(comp, prop), wordRange)

    // 事件：uni-app 的 @x / v-on:x，native 的 bind:x / catch:x / bindXxx
    const eventName = word.replace(/^v-on:/, '').replace(/^@/, '')
    const event =
      comp.events.find((e) => e.name === eventName) ||
      comp.events.find((e) => word === `bind:${e.name}` || word === `catch:${e.name}`) ||
      comp.events.find((e) => word === `bind${capitalize(e.name)}` || word === `catch${capitalize(e.name)}`)
    if (event) return new vscode.Hover(eventDoc(comp, event), wordRange)

    // 外部样式类
    if (comp.externalClasses.includes(word)) {
      return new vscode.Hover(componentDoc(comp, importPathOf(comp)), wordRange)
    }
    return undefined
  }
}
