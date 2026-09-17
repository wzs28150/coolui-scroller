import * as vscode from 'vscode'
import { ComponentMeta, Platform } from './types'
import { allComponents, importPathOf } from './meta'
import { platformOf } from './utils/wxml'
import { TagResolver, jsonFilesFor } from './tags'
import { docsUrl } from './utils/markdown'
import { tagSnippet } from './providers/completion'

interface ComponentPickItem extends vscode.QuickPickItem {
  comp: ComponentMeta
}

function pickItems(platform?: Platform): ComponentPickItem[] {
  return allComponents(platform).map((comp) => ({
    label: comp.tag,
    description: comp.title,
    detail: `${importPathOf(comp)}${comp.desc ? ` · ${comp.desc}` : ''}`,
    comp,
  }))
}

async function pickComponent(
  placeHolder: string,
  platform?: Platform
): Promise<ComponentPickItem | undefined> {
  return vscode.window.showQuickPick(pickItems(platform), {
    placeHolder,
    matchOnDescription: true,
    matchOnDetail: true,
  })
}

/** 在当前光标处插入组件，并按需写入 usingComponents */
export async function insertComponent(resolver: TagResolver): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showWarningMessage('请先在 WXML 或 Vue 模板中放置光标')
    return
  }
  const picked = await pickComponent('选择要插入的 coolui-scroller 组件', platformOf(editor.document))
  if (!picked) return

  const tags = resolver.resolve(editor.document)
  const declared = [...tags.declared.entries()].some(([, comp]) => comp.key === picked.comp.key)
  if (!declared && tags.targetJson) {
    resolver.addToJson(tags.targetJson, picked.comp, picked.comp.tag)
  }
  await editor.insertSnippet(tagSnippet(picked.comp, picked.comp.tag, true), editor.selection)
}

/** 把组件引入到当前文档对应的 json */
export async function addUsingComponentsCommand(resolver: TagResolver): Promise<void> {
  const document = vscode.window.activeTextEditor?.document
  if (!document) {
    vscode.window.showWarningMessage('请先打开小程序页面文件')
    return
  }
  const { targetJson } = jsonFilesFor(document)
  if (!targetJson) {
    vscode.window.showWarningMessage('未找到可写入的 json 文件（需要页面同名 json 或 app.json）')
    return
  }
  const picked = await pickComponent('选择要引入的组件', 'native')
  if (!picked) return
  const ok = resolver.addToJson(targetJson, picked.comp, picked.comp.tag)
  vscode.window.showInformationMessage(
    ok ? `已引入 "${picked.comp.tag}": "${importPathOf(picked.comp)}"` : `${picked.comp.tag} 已经引入过了`
  )
}

/** 打开组件在线文档 */
export async function openDocs(): Promise<void> {
  const picked = await pickComponent('选择要查看文档的组件')
  if (!picked) return
  const url = docsUrl(picked.comp)
  await vscode.env.openExternal(vscode.Uri.parse(url))
}


