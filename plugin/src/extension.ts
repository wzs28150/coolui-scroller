import * as vscode from 'vscode'
import { TagResolver, resolveComponent } from './tags'
import { allComponents } from './meta'
import { WxmlCompletionProvider } from './providers/completion'
import { WxmlHoverProvider } from './providers/hover'
import { JsonCompletionProvider } from './providers/jsonCompletion'
import { AddMissingImportAction, MissingImportDiagnostics } from './providers/diagnostics'
import { addUsingComponentsCommand, insertComponent, openDocs } from './commands'
import { config, TRIGGER_TAGS } from './utils/config'
import { getWordRangeAt, getWxmlContext, platformOf } from './utils/wxml'

const wxmlSelector: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/*.wxml' },
  { scheme: 'file', language: 'wxml' },
]

const vueSelector: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/*.vue' },
  { scheme: 'file', language: 'vue' },
  { scheme: 'file', language: 'vue-html' },
]

/** 组件提示同时作用于原生 WXML 与 uni-app 的 .vue */
const componentSelector: vscode.DocumentSelector = [...wxmlSelector, ...vueSelector]

const jsonSelector: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/*.json' },
  { scheme: 'file', pattern: '**/*.jsonc' },
]

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel('coolui-scroller')
  const version = context.extension?.packageJSON?.version ?? '0.0.0'
  const nativeCount = allComponents('native').length
  const uniappCount = allComponents('uniapp').length
  output.appendLine(
    `coolui-scroller v${version} 已激活：native ${nativeCount} 个 / uni-app ${uniappCount} 个组件`
  )

  const resolver = new TagResolver()
  const diagnostics = new MissingImportDiagnostics(resolver)

  context.subscriptions.push(
    output,
    vscode.languages.registerCompletionItemProvider(
      componentSelector,
      new WxmlCompletionProvider(resolver),
      ...TRIGGER_TAGS
    ),
    vscode.languages.registerHoverProvider(componentSelector, new WxmlHoverProvider(resolver)),
    vscode.languages.registerCodeActionsProvider(componentSelector, new AddMissingImportAction(resolver), {
      providedCodeActionKinds: [AddMissingImportAction.PROVIDED],
    }),
    vscode.languages.registerCompletionItemProvider(jsonSelector, new JsonCompletionProvider(), '"'),
    vscode.commands.registerCommand('coolui-scroller.insertComponent', () => insertComponent(resolver)),
    vscode.commands.registerCommand('coolui-scroller.usingComponents.add', () =>
      addUsingComponentsCommand(resolver)
    ),
    vscode.commands.registerCommand('coolui-scroller.openDocs', () => openDocs()),
    vscode.commands.registerCommand('coolui-scroller.diagnose', () => diagnose(resolver, output, version)),
    diagnostics
  )

  const isTarget = (document: vscode.TextDocument) =>
    document.languageId === 'wxml' ||
    document.uri.fsPath.endsWith('.wxml') ||
    document.languageId === 'vue' ||
    document.uri.fsPath.endsWith('.vue')

  const refresh = (document?: vscode.TextDocument) => {
    const target = document || vscode.window.activeTextEditor?.document
    if (!target) return
    if (isTarget(target)) diagnostics.refresh(target)
  }

  let timer: NodeJS.Timeout | undefined
  const refreshSoon = (document: vscode.TextDocument) => {
    if (!isTarget(document)) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => diagnostics.refresh(document), 400)
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => refresh(editor?.document)),
    vscode.workspace.onDidChangeTextDocument((e) => refreshSoon(e.document)),
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (!isTarget(document)) {
        // json 变化后很可能是 usingComponents 更新了
        resolver.invalidate()
        refresh()
        return
      }
      refresh(document)
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration('cooluiScroller')) return
      vscode.workspace.textDocuments.filter(isTarget).forEach((doc) => diagnostics.refresh(doc))
    }),
    { dispose: () => timer && clearTimeout(timer) }
  )

  refresh(vscode.window.activeTextEditor?.document)
}

/** 诊断：把当前文档与光标解析结果输出到「输出」面板，便于排查提示为何不生效 */
function diagnose(resolver: TagResolver, output: vscode.OutputChannel, version: string): void {
  const editor = vscode.window.activeTextEditor
  const lines: string[] = [
    `[诊断] coolui-scroller v${version}`,
    `配置：enable=${config.enabled} diagnostics=${config.diagnostics}`,
  ]

  if (!editor) {
    lines.push('没有活动编辑器：请先打开 .wxml 或 .vue，把光标放到标签/属性上再运行本命令')
  } else {
    const document = editor.document
    const position = editor.selection.active
    const platform = platformOf(document)
    lines.push(`文件：${document.uri.fsPath}`)
    lines.push(`languageId：${document.languageId}`)
    lines.push(`识别平台：${platform}`)
    lines.push(`光标：第 ${position.line + 1} 行 第 ${position.character + 1} 列`)

    const ctx = getWxmlContext(document, position)
    lines.push(
      `上下文：inTag=${ctx.inTag} afterTagStart=${ctx.afterTagStart} tag="${ctx.tagName}" attr="${ctx.attrName ?? ''}"`
    )

    const wordRange = getWordRangeAt(document, position)
    const word = wordRange ? document.getText(wordRange) : ''
    lines.push(`光标词：${word || '(无)'}`)

    const tags = resolver.resolve(document)
    lines.push(`已声明标签：${tags.declared.size} 个（关联 json：${tags.jsonFiles.length} 个）`)

    const comp = resolveComponent(tags, ctx.tagName, platform)
    lines.push(`匹配组件：${comp ? `${comp.tag}（${comp.platform}）` : '(无)'}`)

    if (comp && word) {
      const propName = word.replace(/^v-bind:/, '').replace(/^:/, '')
      const eventName = word.replace(/^v-on:/, '').replace(/^@/, '')
      lines.push(`属性命中：${comp.props.some((p) => p.name === propName) ? propName : '(无)'}`)
      lines.push(`事件命中：${comp.events.some((e) => e.name === eventName) ? eventName : '(无)'}`)
    }
  }

  output.appendLine(lines.join('\n'))
  output.appendLine('—'.repeat(40))
  output.show(true)
  void vscode.window.showInformationMessage(
    'coolui-scroller 诊断结果已输出到「输出」面板（通道选 coolui-scroller）'
  )
}

export function deactivate(): void {
  /* 无需清理 */
}
