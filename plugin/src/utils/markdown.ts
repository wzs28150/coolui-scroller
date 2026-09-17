import * as vscode from 'vscode'
import { ComponentMeta, EventMeta, PropMeta, SlotMeta } from '../types'
import { config } from './config'

function escape(text: string): string {
  return (text || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()
}

/** 文档里的相对链接转成线上地址 */
export function linkify(text: string): string {
  return text.replace(/\]\((?:\.\/)?([\w-]+)\.md(#[\w-]*)?\)/g, (_, name: string, hash: string) => {
    return `](${config.docsBaseUrl}/${name}${hash || ''})`
  })
}

/** 文档站点地址：native 与 uni-app 分别位于不同目录 */
export function docsUrl(comp: ComponentMeta): string {
  const base = comp.platform === 'uniapp' ? config.uniappDocsBaseUrl : config.docsBaseUrl
  return comp.doc ? `${base}/${comp.doc}` : base
}

/** 事件绑定写法：native 用 bind:，uni-app 用 @ */
export function eventBinding(comp: ComponentMeta, name: string): string {
  return comp.platform === 'uniapp' ? `@${name}` : `bind:${name}`
}

function pascal(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

function codeLang(comp: ComponentMeta): string {
  return comp.platform === 'uniapp' ? 'vue' : 'wxml'
}

export function build(detail: string, value = ''): vscode.MarkdownString {
  const md = new vscode.MarkdownString()
  md.appendCodeblock(detail, 'wxml')
  if (value) md.appendMarkdown(value)
  md.isTrusted = true
  return md
}

function typeLabel(type: string): string {
  return type || 'any'
}

/** 组件的整体文档（悬停标签名时展示） */
export function componentDoc(comp: ComponentMeta, importPath: string): vscode.MarkdownString {
  const md = new vscode.MarkdownString()
  md.isTrusted = true
  md.appendMarkdown(`**${escape(comp.title)}**\n\n`)
  if (comp.desc) md.appendMarkdown(`${linkify(escape(comp.desc))}\n\n`)
  if (comp.platform === 'uniapp') {
    md.appendCodeblock(`import ${pascal(comp.tag)} from '${importPath}'`, 'ts')
  } else {
    md.appendCodeblock(`"${comp.tag}": "${importPath}"`, 'json')
  }

  if (comp.props.length) {
    md.appendMarkdown('\n\n**属性**\n\n')
    md.appendMarkdown('| 属性 | 类型 | 默认值 |\n| --- | --- | --- |\n')
    for (const prop of comp.props.slice(0, 10)) {
      md.appendMarkdown(
        `| \`${escape(prop.name)}\` | ${escape(typeLabel(prop.type))} | ${escape(prop.default ?? '-')} |\n`
      )
    }
    if (comp.props.length > 10) md.appendMarkdown(`\n其余 ${comp.props.length - 10} 个属性见文档\n`)
  }
  if (comp.events.length) {
    md.appendMarkdown('\n\n**事件**\n\n')
    for (const event of comp.events) {
      md.appendMarkdown(`- \`${eventBinding(comp, event.name)}\`${event.desc ? ` — ${escape(event.desc)}` : ''}\n`)
    }
  }
  if (comp.slots.length) {
    md.appendMarkdown('\n\n**插槽**\n\n')
    for (const slot of comp.slots) md.appendMarkdown(`- \`${slot.name}\`${slot.desc ? ` — ${escape(slot.desc)}` : ''}\n`)
  }
  md.appendMarkdown(`\n\n[组件文档](${docsUrl(comp)})`)
  return md
}

export function propDoc(comp: ComponentMeta, prop: PropMeta): vscode.MarkdownString {
  const md = new vscode.MarkdownString()
  md.isTrusted = true
  const head = prop.deprecated ? `~~\`${escape(prop.name)}\`~~` : `\`${escape(prop.name)}\``
  md.appendMarkdown(`**${head}** · \`${escape(typeLabel(prop.type))}\` · ${escape(comp.title)}\n\n`)
  if (prop.deprecated) md.appendMarkdown('⚠️ **已废弃**\n\n')
  if (prop.desc) md.appendMarkdown(`${linkify(escape(prop.desc))}\n\n`)
  md.appendMarkdown(`默认值：\`${escape(prop.default ?? '-')}\`\n\n`)
  if (prop.enum?.length) md.appendMarkdown(`可选值：${prop.enum.map((v) => `\`${v}\``).join('、')}\n\n`)
  if (prop.version) md.appendMarkdown(`自 \`${prop.version}\` 起可用\n\n`)
  md.appendCodeblock(
    comp.platform === 'uniapp' ? `<${comp.tag} :${prop.name}="value">` : `<${comp.tag} ${prop.name}="{{value}}">`,
    codeLang(comp)
  )
  return md
}

export function eventDoc(comp: ComponentMeta, event: EventMeta): vscode.MarkdownString {
  const md = new vscode.MarkdownString()
  md.isTrusted = true
  md.appendMarkdown(`**\`${escape(eventBinding(comp, event.name))}\`** · 事件 · ${escape(comp.title)}\n\n`)
  if (event.desc) md.appendMarkdown(`${linkify(escape(event.desc))}\n\n`)
  if (event.detail && event.detail !== '无') md.appendMarkdown(`返回参数：${escape(event.detail)}\n\n`)
  if (event.usage) md.appendMarkdown(`用法：\`${escape(event.usage)}\`\n\n`)
  if (event.version) md.appendMarkdown(`自 \`${event.version}\` 起可用\n\n`)
  md.appendCodeblock(`<${comp.tag} ${eventBinding(comp, event.name)}="handler">`, codeLang(comp))
  return md
}

export function slotDoc(comp: ComponentMeta, slot: SlotMeta): vscode.MarkdownString {
  const md = new vscode.MarkdownString()
  md.isTrusted = true
  md.appendMarkdown(`**\`${slot.name}\`** · 插槽 · ${escape(comp.title)}\n\n`)
  if (slot.desc) md.appendMarkdown(`${linkify(escape(slot.desc))}\n\n`)
  if (slot.usage) md.appendMarkdown(`可用组件：${escape(slot.usage)}\n\n`)
  md.appendCodeblock(
    comp.platform === 'uniapp' ? `<template #${slot.name}></template>` : `<view slot="${slot.name}"></view>`,
    codeLang(comp)
  )
  return md
}
