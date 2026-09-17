/** 纯文本方式读写小程序 json 里的 usingComponents（兼容带注释的 jsonc） */

export interface UsingComponentsBlock {
  /** 内容起始（不含外层 `{`） */
  start: number
  /** 内容结束（指向 `}`） */
  end: number
}

export function findBlockEnd(text: string, braceIndex: number): number {
  let depth = 0
  let quote: string | null = null
  for (let i = braceIndex; i < text.length; i++) {
    const ch = text[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '/' && text[i + 1] === '/') {
      const nl = text.indexOf('\n', i)
      i = nl === -1 ? text.length : nl
      continue
    }
    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2)
      i = end === -1 ? text.length : end + 1
      continue
    }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

export function findUsingComponentsBlock(text: string): UsingComponentsBlock | undefined {
  const keyRe = /"usingComponents"\s*:\s*/g
  while (keyRe.exec(text)) {
    let idx = keyRe.lastIndex
    while (idx < text.length && /\s/.test(text[idx])) idx++
    if (text[idx] !== '{') break
    const end = findBlockEnd(text, idx)
    if (end === -1) break
    return { start: idx + 1, end }
  }
  return undefined
}

/** 读取 usingComponents 里已有的 tag -> path */
export function readUsingComponents(text: string): Map<string, string> {
  const map = new Map<string, string>()
  const block = findUsingComponentsBlock(text)
  if (!block) return map
  const body = text.slice(block.start, block.end)
  const re = /(?:^|[,{\n])\s*"([^"\n]+)"\s*:\s*"([^"\n]*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) map.set(m[1], m[2])
  return map
}

function indentOfLineAt(text: string, index: number): string {
  let i = index
  while (i > 0 && text[i - 1] !== '\n') i--
  const lineStart = i
  while (i < text.length && /[ \t]/.test(text[i])) i++
  return text.slice(lineStart, i)
}

/**
 * 向 usingComponents 中追加若干项，返回新的文本。
 * 保持原有内容（含注释）不变，只做增量插入。
 */
export function addUsingComponents(
  text: string,
  entries: { tag: string; path: string }[]
): string | undefined {
  const existing = readUsingComponents(text)
  const adds = entries.filter((e) => !existing.has(e.tag))
  if (!adds.length) return undefined

  const block = findUsingComponentsBlock(text)
  const indent = block
    ? indentOfLineAt(text, block.end).replace(/[^ \t]/g, '')
    : indentOfLineAt(text, Math.max(0, text.indexOf('{') + 1)).replace(/[^ \t]/g, '')
  const lineIndent = indent + '  '
  const lines = adds.map((e) => `${lineIndent}"${e.tag}": "${e.path}"`)

  if (block) {
    const body = text.slice(block.start, block.end)
    const trimmed = body.replace(/\s+$/, '')
    const insertAt = block.start + trimmed.length
    const comma = trimmed.length && !trimmed.endsWith(',') ? ',' : ''
    const insertion = `${comma}\n${lines.join(',\n')}\n${indent}`
    return text.slice(0, insertAt) + insertion + text.slice(insertAt)
  }

  // 没有 usingComponents，插入到根对象开头
  const rootBrace = text.indexOf('{')
  if (rootBrace === -1) return undefined
  const head = text.slice(0, rootBrace + 1)
  const tail = text.slice(rootBrace + 1)
  const comma = /\{\s*\}/.test(text.slice(0, Math.min(text.length, rootBrace + 200))) ? '' : ','
  const insertion = `\n${indent}"usingComponents": {\n${lines.join(',\n')}\n${indent}}${comma}`
  return head + insertion + tail
}
