import * as vscode from 'vscode'
import { importPathOf, tagSuggestions } from '../meta'
import { config } from '../utils/config'
import { findUsingComponentsBlock } from '../utils/jsonEdit'

/** 在 json / jsonc 的 usingComponents 中补全 key（标签名）与 value（组件路径） */
export class JsonCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[] | undefined> {
    if (!config.enabled) return undefined
    const text = document.getText()
    const offset = document.offsetAt(position)
    const block = findUsingComponentsBlock(text)
    if (!block || offset < block.start || offset > block.end) return undefined

    const line = document.lineAt(position.line).text
    const before = line.slice(0, position.character)

    // 值位置："xxx": "|
    const valueMatch = /"([^"]+)"\s*:\s*"([^"]*)$/.exec(before)
    if (valueMatch) {
      const start = position.character - (valueMatch[2]?.length || 0)
      const range = new vscode.Range(position.line, start, position.line, position.character)
      return tagSuggestions('native').map(({ label, comp }) => {
        const item = new vscode.CompletionItem(importPathOf(comp), vscode.CompletionItemKind.Value)
        item.detail = comp.title
        item.documentation = comp.desc
        item.range = range
        item.filterText = `${label} ${importPathOf(comp)}`
        item.insertText = importPathOf(comp)
        return item
      })
    }

    // key 位置："xx|
    const keyMatch = /"([^"]*)$/.exec(before)
    if (keyMatch) {
      const start = position.character - (keyMatch[1]?.length || 0)
      const range = new vscode.Range(position.line, start, position.line, position.character)
      return tagSuggestions('native').map(({ label, comp }) => {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Reference)
        item.detail = `${comp.title} · ${importPathOf(comp)}`
        item.documentation = comp.desc
        item.range = range
        item.insertText = `${label}": "${importPathOf(comp)}`
        return item
      })
    }
    return undefined
  }
}
