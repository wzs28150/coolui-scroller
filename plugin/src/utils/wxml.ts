import * as vscode from 'vscode'
import { Platform } from '../types'

export interface WxmlContext {
  /** 光标是否位于开始标签括号内 */
  inTag: boolean
  /** 所在标签名 */
  tagName: string
  /** 光标正在输入标签名 */
  afterTagStart: boolean
  /** 光标所在的属性名（在等号前/等值中） */
  attrName?: string
  /** 属性值使用的引号 */
  quote?: '"' | "'"
  /** 已输入的属性值前缀 */
  valuePrefix?: string
  /** 标签名在文档中的范围，用于替换 */
  tagRange?: vscode.Range
  /** 属性值在文档中的范围（不含引号），用于替换 */
  valueRange?: vscode.Range
}

export function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** 是否为 uni-app 的 .vue 单文件组件 */
export function isVueDocument(document: vscode.TextDocument): boolean {
  return document.languageId === 'vue' || document.uri.fsPath.endsWith('.vue')
}

/** 当前文档对应的组件平台 */
export function platformOf(document: vscode.TextDocument): Platform {
  return isVueDocument(document) ? 'uniapp' : 'native'
}

/** 光标是否位于 .vue 的 <template> 区域内（排除 script / style） */
function isInsideVueTemplate(text: string, offset: number): boolean {
  const upto = text.slice(0, offset)
  const lastTemplateOpen = upto.lastIndexOf('<template')
  if (lastTemplateOpen === -1) return false
  if (upto.lastIndexOf('</template>') > lastTemplateOpen) return false
  for (const tag of ['script', 'style']) {
    const open = upto.lastIndexOf(`<${tag}`)
    if (open === -1 || open < lastTemplateOpen) continue
    if (upto.lastIndexOf(`</${tag}>`) < open) return false
  }
  return true
}

/** 解析光标在 WXML 中的位置上下文 */
export function getWxmlContext(document: vscode.TextDocument, position: vscode.Position): WxmlContext {
  const text = document.getText()
  const offset = document.offsetAt(position)
  const empty: WxmlContext = { inTag: false, tagName: '', afterTagStart: false }

  // .vue 只在 <template> 区域内提供提示
  if (isVueDocument(document) && !isInsideVueTemplate(text, offset)) return empty

  const lt = text.lastIndexOf('<', Math.max(0, offset - 1))
  if (lt === -1) return empty

  // 注释 <!-- --> 与 <![CDATA[ ]]>
  if (/^<(?:!--|!\[)/.test(text.slice(lt, lt + 4))) return empty

  // 标签是否已闭合（跳过引号内容）
  let quote: '"' | "'" | undefined
  let closed = false
  for (let i = lt; i < offset; i++) {
    const ch = text[i]
    if (quote) {
      if (ch === quote) quote = undefined
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'"
      continue
    }
    if (ch === '>') {
      closed = true
      break
    }
  }
  if (closed) return empty

  const nameMatch = /^<\/?([^\s/>]*)/.exec(text.slice(lt))
  if (!nameMatch) return empty
  const tagName = nameMatch[1]
  const nameStart = lt + (nameMatch[0].length - tagName.length)
  const tagRange = new vscode.Range(
    document.positionAt(nameStart),
    document.positionAt(nameStart + tagName.length)
  )

  const before = text.slice(lt, offset)
  const afterTagStart = /^<\/?[^\s/>]*$/.test(before)
  const context: WxmlContext = { inTag: true, tagName, afterTagStart, tagRange }
  if (afterTagStart) return context

  const tail = /([^\s=/>]+)\s*=\s*(?:(["'])([\s\S]*))?$/.exec(before)
  if (tail) {
    context.attrName = tail[1]
    if (tail[2]) {
      context.quote = tail[2] as '"' | "'"
      context.valuePrefix = tail[3]
      const valueStart = offset - (tail[3]?.length || 0)
      context.valueRange = new vscode.Range(document.positionAt(valueStart), position)
    }
  }
  return context
}

/** 获取光标处未闭合的外层标签栈 */
export function getOpenTagStack(text: string, upTo: number): string[] {
  const stack: string[] = []
  const re = /<(\/?)([a-zA-Z][\w:.-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > upTo) break
    const [, slash, name, attrs, selfClose] = m
    if (slash === '/') {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] === name) {
          stack.splice(i, 1)
          break
        }
      }
      continue
    }
    if (selfClose === '/') continue
    // 自闭合判断兜底：标签串本身以 / 结束
    if (attrs.trimEnd().endsWith('/')) continue
    stack.push(name)
  }
  return stack
}

export function getParentTag(document: vscode.TextDocument, position: vscode.Position): string | undefined {
  const text = document.getText()
  const offset = document.offsetAt(position)
  const lt = text.lastIndexOf('<', Math.max(0, offset - 1))
  if (lt === -1) return undefined
  const stack = getOpenTagStack(text, lt - 1)
  // 跳过 uni-app 的 <template #slot>，直接取真正的组件父级
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i] !== 'template') return stack[i]
  }
  return undefined
}

/** 光标所在的完整 word 区间（支持属性名里的 : . - @ #），光标落在词中间也能命中 */
export function getWordRangeAt(
  document: vscode.TextDocument,
  position: vscode.Position,
  pattern: RegExp = /[\w:.\-@]+/
): vscode.Range | undefined {
  const line = document.lineAt(position.line).text
  const re = new RegExp(pattern.source, 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    const start = m.index
    const end = start + m[0].length
    if (position.character >= start && position.character <= end) {
      return new vscode.Range(position.line, start, position.line, end)
    }
    if (m[0].length === 0) re.lastIndex++
    if (end >= line.length) break
  }
  return undefined
}

/** 遍历文档里所有开始标签 */
export function collectStartTags(document: vscode.TextDocument): { tag: string; range: vscode.Range }[] {
  const text = document.getText()
  const result: { tag: string; range: vscode.Range }[] = []
  const re = /<([a-zA-Z][\w:.-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const start = m.index + 1
    result.push({
      tag: m[1],
      range: new vscode.Range(document.positionAt(start), document.positionAt(start + m[1].length)),
    })
  }
  return result
}
