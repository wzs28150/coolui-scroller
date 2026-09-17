import * as vscode from 'vscode'
import { ComponentMeta } from '../types'
import { findComponentByTag, importPathOf } from '../meta'
import { TagResolver, jsonFilesFor } from '../tags'
import { config } from '../utils/config'
import { addUsingComponents } from '../utils/jsonEdit'
import { collectStartTags } from '../utils/wxml'

export const MISSING_IMPORT_CODE = 'coolui-scroller.missingImport'

/** 检查 WXML 中用到的组件是否已在 json 的 usingComponents 里引入 */
export class MissingImportDiagnostics {
  private readonly collection: vscode.DiagnosticCollection

  constructor(private readonly resolver: TagResolver) {
    this.collection = vscode.languages.createDiagnosticCollection('coolui-scroller')
  }

  refresh(document: vscode.TextDocument): void {
    if (!this.support(document) || !config.enabled || !config.diagnostics) {
      this.collection.delete(document.uri)
      return
    }
    const tags = this.resolver.resolve(document)
    if (!tags.targetJson) {
      this.collection.delete(document.uri)
      return
    }

    const diagnostics: vscode.Diagnostic[] = []
    for (const { tag, range } of collectStartTags(document)) {
      if (tags.declared.has(tag)) continue
      const comp = findComponentByTag(tag)
      if (!comp) continue
      const jsonName = tags.targetJson.split(/[\\/]/).pop() || 'app.json'
      const diagnostic = new vscode.Diagnostic(
        range,
        `<${tag}> 未在 ${jsonName} 的 usingComponents 中引入`,
        vscode.DiagnosticSeverity.Warning
      )
      diagnostic.code = MISSING_IMPORT_CODE
      diagnostic.source = 'coolui-scroller'
      diagnostic.tags = [vscode.DiagnosticTag.Unnecessary]
      diagnostics.push(diagnostic)
    }
    this.collection.set(document.uri, diagnostics)
  }

  clear(document: vscode.TextDocument): void {
    this.collection.delete(document.uri)
  }

  support(document: vscode.TextDocument): boolean {
    return document.languageId === 'wxml' || document.uri.fsPath.endsWith('.wxml')
  }

  dispose(): void {
    this.collection.dispose()
  }
}

/** 提供「引入缺失组件」的快速修复 */
export class AddMissingImportAction implements vscode.CodeActionProvider {
  static readonly PROVIDED = vscode.CodeActionKind.QuickFix

  constructor(private readonly resolver: TagResolver) {}

  async provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext
  ): Promise<vscode.CodeAction[]> {
    if (!config.enabled) return []
    const { targetJson } = jsonFilesFor(document)
    if (!targetJson) return []
    const missing = context.diagnostics.filter((d) => d.code === MISSING_IMPORT_CODE)
    if (!missing.length) return []

    let jsonDocument: vscode.TextDocument
    try {
      jsonDocument = await vscode.workspace.openTextDocument(targetJson)
    } catch {
      return []
    }

    const actions: vscode.CodeAction[] = []
    for (const diagnostic of missing) {
      const tag = document.getText(diagnostic.range)
      const comp: ComponentMeta | undefined = findComponentByTag(tag)
      if (!comp || !tag) continue

      const edit = this.buildEdit(jsonDocument, comp, tag)
      if (!edit) continue
      const action = new vscode.CodeAction(
        `引入 "${tag}": "${importPathOf(comp)}"`,
        AddMissingImportAction.PROVIDED
      )
      action.edit = edit
      action.diagnostics = [diagnostic]
      action.isPreferred = true
      this.resolver.invalidate(targetJson)
      actions.push(action)
    }
    return actions
  }

  private buildEdit(
    jsonDocument: vscode.TextDocument,
    comp: ComponentMeta,
    tag: string
  ): vscode.WorkspaceEdit | undefined {
    const updated = addUsingComponents(jsonDocument.getText(), [{ tag, path: importPathOf(comp) }])
    if (!updated) return undefined
    const edit = new vscode.WorkspaceEdit()
    const end = jsonDocument.positionAt(jsonDocument.getText().length)
    edit.replace(jsonDocument.uri, new vscode.Range(new vscode.Position(0, 0), end), updated)
    return edit
  }
}
