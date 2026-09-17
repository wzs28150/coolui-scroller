/**
 * 冒烟测试：用最小 vscode mock 加载打包产物，验证补全 / 悬停 / json 编辑逻辑。
 * 运行：node scripts/smoke.mjs（需先执行 node scripts/build.mjs）
 */
import assert from 'node:assert'
import Module from 'node:module'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/* ------------------------------ vscode mock ------------------------------ */

class Position {
  constructor(line, character) {
    this.line = line
    this.character = character
  }
}

class Range {
  constructor(start, arg2, endLine, endCharacter) {
    if (typeof start === 'number') {
      this.start = new Position(start, arg2)
      this.end = new Position(endLine, endCharacter)
    } else {
      this.start = start
      this.end = arg2
    }
  }
  contains(pos) {
    if (pos.line < this.start.line || pos.line > this.end.line) return false
    if (pos.line === this.start.line && pos.character < this.start.character) return false
    if (pos.line === this.end.line && pos.character > this.end.character) return false
    return true
  }
}

class MarkdownString {
  constructor(value = '') {
    this.value = value
  }
  appendMarkdown(text) {
    this.value += text
  }
  appendCodeblock(code) {
    this.value += `\n${code}\n`
  }
}

class SnippetString {
  constructor(value) {
    this.value = value
  }
}

class CompletionItem {
  constructor(label, kind) {
    this.label = typeof label === 'string' ? label : label.label
    this.kind = kind
  }
}

class Diagnostic {
  constructor(range, message, severity) {
    this.range = range
    this.message = message
    this.severity = severity
  }
}

class CodeAction {
  constructor(title, kind) {
    this.title = title
    this.kind = kind
  }
}

class WorkspaceEdit {
  replace() {}
}

class Hover {
  constructor(contents, range) {
    this.contents = contents
    this.range = range
  }
}

const disposable = { dispose() {} }

const vscodeMock = {
  Position,
  Range,
  MarkdownString,
  SnippetString,
  CompletionItem,
  Diagnostic,
  CodeAction,
  WorkspaceEdit,
  Hover,
  Uri: { file: (p) => ({ fsPath: p }), parse: (p) => ({ fsPath: p }) },
  CompletionItemKind: {
    Class: 6,
    Property: 9,
    Event: 13,
    Value: 11,
    Field: 4,
    Reference: 17,
    EnumMember: 12,
  },
  CompletionItemTag: { Deprecated: 1 },
  DiagnosticSeverity: { Warning: 2 },
  DiagnosticTag: { Unnecessary: 1 },
  CodeActionKind: { QuickFix: 'quickfix' },
  languages: {
    registerCompletionItemProvider: () => disposable,
    registerHoverProvider: () => disposable,
    registerCodeActionsProvider: () => disposable,
    createDiagnosticCollection: () => ({ set() {}, delete() {}, dispose() {} }),
  },
  workspace: {
    getConfiguration: () => ({ get: (_key, fallback) => fallback }),
    onDidChangeTextDocument: () => disposable,
    onDidSaveTextDocument: () => disposable,
    onDidChangeConfiguration: () => disposable,
    textDocuments: [],
    openTextDocument: async () => {
      throw new Error('not implemented')
    },
  },
  window: {
    activeTextEditor: undefined,
    onDidChangeActiveTextEditor: () => disposable,
    showWarningMessage: () => undefined,
    showInformationMessage: () => undefined,
    showQuickPick: async () => undefined,
    createOutputChannel: () => ({ appendLine() {}, show() {}, dispose() {} }),
  },
  commands: { registerCommand: () => disposable },
  env: { openExternal: async () => undefined },
}

const originalLoad = Module._load
Module._load = function (request, parent, isMain) {
  if (request === 'vscode') return vscodeMock
  return originalLoad.call(this, request, parent, isMain)
}

const lib = require('../dist/internal.js')

/* ------------------------------ 测试辅助 ------------------------------ */

class MockDocument {
  constructor(text, fsPath = 'h:/coolui-scroller/demo/native/pages/hand/index.wxml', languageId = 'wxml') {
    this._text = text
    this._lines = text.split('\n')
    this.languageId = languageId
    this.uri = { fsPath, scheme: 'file' }
    this.fileName = fsPath
    this.version = 1
  }
  offsetAt(pos) {
    let offset = 0
    for (let i = 0; i < pos.line; i++) offset += this._lines[i].length + 1
    return offset + pos.character
  }
  positionAt(offset) {
    let rest = offset
    for (let i = 0; i < this._lines.length; i++) {
      const len = this._lines[i].length + 1
      if (rest <= this._lines[i].length) return new Position(i, rest)
      rest -= len
    }
    return new Position(0, 0)
  }
  lineAt(arg) {
    const line = typeof arg === 'number' ? arg : arg.line
    return { text: this._lines[line] ?? '', lineNumber: line }
  }
  getText(range) {
    if (!range) return this._text
    return this._text.slice(this.offsetAt(range.start), this.offsetAt(range.end))
  }
}

const results = []
function check(name, fn) {
  try {
    fn()
    results.push(`  PASS  ${name}`)
  } catch (error) {
    results.push(`  FAIL  ${name}\n        ${error.message}`)
    process.exitCode = 1
  }
}

async function checkAsync(name, fn) {
  try {
    await fn()
    results.push(`  PASS  ${name}`)
  } catch (error) {
    results.push(`  FAIL  ${name}\n        ${error.message}`)
    process.exitCode = 1
  }
}

const resolver = new lib.TagResolver()
const completion = new lib.WxmlCompletionProvider(resolver)
const hover = new lib.WxmlHoverProvider(resolver)
const jsonCompletion = new lib.JsonCompletionProvider()

async function completeAt(text, fsPath, languageId = 'wxml') {
  const document = new MockDocument(text, fsPath, languageId)
  const offset = text.length
  const position = document.positionAt(offset)
  return completion.provideCompletionItems(document, position)
}

const VUE_PATH = 'h:/coolui-scroller/demo/test-uniapp/pages/index/index.vue'

function labels(items) {
  return (items || []).map((item) => item.label)
}

/* -------------------------------- 用例 -------------------------------- */

console.log('coolui-scroller VSCode 插件冒烟测试\n')

check('元数据：按标签名查找组件', () => {
  assert.strictEqual(lib.findComponentByTag('scroller')?.key, 'scroller')
  assert.strictEqual(lib.findComponentByTag('backToTop')?.key, 'backToTop')
  assert.strictEqual(lib.findComponentByTag('second-floor')?.key, 'second-floor')
})

check('元数据：按引入路径反查组件', () => {
  assert.strictEqual(lib.findComponentByPath('coolui-scroller/scroller/index')?.key, 'scroller')
  assert.strictEqual(lib.findComponentByPath('coolui-scroller/sort/index')?.key, 'sort/index')
  assert.strictEqual(lib.findComponentByPath('coolui-scroller/sort/item')?.key, 'sort/item')
  assert.strictEqual(
    lib.findComponentByPath('../../../packages/native/scroller/index')?.key,
    'scroller'
  )
})

await checkAsync('补全：输入 <scro 时给出 scroller 标签', async () => {
  const items = await completeAt('<scro')
  assert.ok(labels(items).includes('scroller'), `实际: ${labels(items).join(',')}`)
  const scroller = items.find((i) => i.label === 'scroller')
  assert.ok(scroller.insertText.value.includes('bind:loadmore'), '标签片段应带常用事件')
})

await checkAsync('补全：标签内给出组件属性', async () => {
  const items = await completeAt('<scroller ')
  const names = labels(items)
  assert.ok(names.includes('isEmpty'), `实际: ${names.join(',')}`)
  assert.ok(names.includes('enableFlex'), `实际: ${names.join(',')}`)
})

await checkAsync('补全：给出 bind: 事件', async () => {
  const items = await completeAt('<scroller bind:')
  const names = labels(items)
  assert.ok(names.includes('bind:loadmore'), `实际: ${names.join(',')}`)
  assert.ok(names.includes('bind:refresh'), `实际: ${names.join(',')}`)
})

await checkAsync('补全：boolean 属性给出 true/false', async () => {
  const items = await completeAt('<scroller isEmpty="')
  const names = labels(items)
  assert.ok(names.includes('{{true}}'), `实际: ${JSON.stringify(names)}`)
  assert.ok(names.includes('{{false}}'), `实际: ${JSON.stringify(names)}`)
})

await checkAsync('补全：枚举属性给出可选值', async () => {
  const items = await completeAt('<refresh type="')
  const names = labels(items)
  assert.ok(names.includes('base') && names.includes('diy'), `实际: ${names.join(',')}`)
})

await checkAsync('补全：slot 值来自父组件插槽', async () => {
  const text = '<scroller>\n  <view slot="'
  const document = new MockDocument(text)
  const position = document.positionAt(text.length)
  const ctx = lib.getWxmlContext(document, position)
  const items = await completion.provideCompletionItems(document, position)
  const names = labels(items)
  assert.ok(names.includes('header'), `上下文=${JSON.stringify(ctx)} 实际=${JSON.stringify(names)}`)
  assert.ok(names.includes('refresh'), `实际: ${JSON.stringify(names)}`)
})

await checkAsync('悬停：属性名显示文档', async () => {
  const document = new MockDocument('<scroller isEmpty="{{true}}">')
  const position = document.positionAt('<scroller isEmpty'.length)
  const result = await hover.provideHover(document, position)
  assert.ok(result, '应有悬停内容')
  const list = Array.isArray(result.contents) ? result.contents : [result.contents]
  const text = list.map((c) => c.value || String(c)).join('')
  assert.ok(text.includes('isEmpty'), `实际: ${text.slice(0, 80)}`)
  assert.ok(text.includes('boolean'), '应包含类型说明')
})

await checkAsync('悬停：标签名显示组件文档', async () => {
  const document = new MockDocument('<scroller isEmpty="{{true}}">')
  const position = document.positionAt('<scroller'.length)
  const result = await hover.provideHover(document, position)
  assert.ok(result, '应有悬停内容')
  const list = Array.isArray(result.contents) ? result.contents : [result.contents]
  const text = list.map((c) => c.value || String(c)).join('')
  assert.ok(text.includes('coolui-scroller/scroller/index'), '应包含引入路径')
})

check('json 编辑：向已有 usingComponents 追加', () => {
  const original = `{\n  "usingComponents": {\n    "item": "coolui-scroller/item/index"\n  },\n  "disableScroll": true\n}`
  const updated = lib.jsonEdit.addUsingComponents(original, [
    { tag: 'scroller', path: 'coolui-scroller/scroller/index' },
  ])
  const using = lib.jsonEdit.readUsingComponents(updated)
  assert.strictEqual(using.get('item'), 'coolui-scroller/item/index')
  assert.strictEqual(using.get('scroller'), 'coolui-scroller/scroller/index')
  assert.ok(updated.includes('"disableScroll": true'), '不应破坏其它字段')
})

check('json 编辑：空 usingComponents 与缺失字段', () => {
  const empty = `{\n  "usingComponents": {}\n}`
  const updatedEmpty = lib.jsonEdit.addUsingComponents(empty, [
    { tag: 'scroller', path: 'coolui-scroller/scroller/index' },
  ])
  assert.strictEqual(
    lib.jsonEdit.readUsingComponents(updatedEmpty).get('scroller'),
    'coolui-scroller/scroller/index'
  )

  const none = `{\n  "navigationBarTitleText": "列表"\n}`
  const updatedNone = lib.jsonEdit.addUsingComponents(none, [
    { tag: 'scroller', path: 'coolui-scroller/scroller/index' },
  ])
  assert.strictEqual(
    lib.jsonEdit.readUsingComponents(updatedNone).get('scroller'),
    'coolui-scroller/scroller/index'
  )
  assert.ok(updatedNone.includes('navigationBarTitleText'), '应保留原有字段')
  assert.strictEqual(lib.jsonEdit.addUsingComponents(none, [{ tag: 'x', path: 'y' }]).match(/usingComponents/g).length, 1)
})

check('json 编辑：带注释的 jsonc 也能保留注释', () => {
  const text = `{\n  // 全局组件\n  "usingComponents": {\n    // 列表项\n    "item": "coolui-scroller/item/index"\n  }\n}`
  const updated = lib.jsonEdit.addUsingComponents(text, [{ tag: 'scroller', path: 'p' }])
  assert.ok(updated.includes('// 全局组件') && updated.includes('// 列表项'), '注释应保留')
})

check('json 编辑：已存在的组件不再重复写入', () => {
  const text = `{\n  "usingComponents": {\n    "scroller": "coolui-scroller/scroller/index"\n  }\n}`
  assert.strictEqual(lib.jsonEdit.addUsingComponents(text, [{ tag: 'scroller', path: 'p' }]), undefined)
})

await checkAsync('json 补全：usingComponents 的值建议', async () => {
  const prefix = `{\n  "usingComponents": {\n    "myScroller": "coolui-scroller/scr`
  const text = `${prefix}"\n  }\n}\n`
  const document = new MockDocument(text, 'h:/coolui-scroller/demo/native/pages/hand/index.json', 'json')
  const position = document.positionAt(prefix.length)
  const items = await jsonCompletion.provideCompletionItems(document, position)
  const names = labels(items)
  assert.ok(
    names.includes('coolui-scroller/scroller/index'),
    `实际: ${JSON.stringify(names.slice(0, 5))}`
  )
})

await checkAsync('json 补全：usingComponents 的 key 建议', async () => {
  const prefix = `{\n  "usingComponents": {\n    "scro`
  const text = `${prefix}": "coolui-scroller/scroller/index"\n  }\n}\n`
  const document = new MockDocument(text, 'h:/coolui-scroller/demo/native/pages/hand/index.json', 'json')
  const position = document.positionAt(prefix.length)
  const items = await jsonCompletion.provideCompletionItems(document, position)
  const names = labels(items)
  assert.ok(names.includes('scroller'), `实际: ${JSON.stringify(names.slice(0, 5))}`)
})

check('诊断：未引入的组件给出告警', () => {
  const document = new MockDocument('<view>\n  <scroller></scroller>\n  <handtip />\n</view>')
  const diagnostics = new lib.MissingImportDiagnostics(resolver)
  diagnostics.refresh(document)
  const collection = []
  const spy = { set: (_uri, items) => collection.push(...items), delete() {} }
  // 复用被 mock 的 collection，这里直接检查内部已计算结果
  diagnostics.collection = spy
  diagnostics.refresh(document)
  assert.strictEqual(collection.length, 1, `应只有 scroller 未引入，实际 ${collection.length}`)
  assert.strictEqual(document.getText(collection[0].range), 'scroller')
})

check('插件：activate 正常注册', () => {
  const subscriptions = []
  lib.activate({ subscriptions })
  assert.ok(subscriptions.length >= 6, `注册项过少: ${subscriptions.length}`)
})

/* ------------------------------ uni-app 用例 ------------------------------ */

check('uni-app 元数据：可按标签与 .vue 路径查找', () => {
  assert.strictEqual(lib.findComponentByTag('coolui-scroller')?.platform, 'uniapp')
  assert.strictEqual(lib.findComponentByTag('coolui-scroller-refresh')?.key, 'coolui-scroller-refresh')
  assert.strictEqual(
    lib.findComponentByPath(
      'coolui-scroller-uni/components/coolui-scroller-refresh/coolui-scroller-refresh.vue'
    )?.key,
    'coolui-scroller-refresh'
  )
})

await checkAsync('uni-app 补全：.vue 中输入 <coolui-scroller-refres 给出标签', async () => {
  const items = await completeAt('<template>\n  <coolui-scroller-refres', VUE_PATH, 'vue')
  const names = labels(items)
  assert.ok(names.includes('coolui-scroller-refresh'), `实际: ${names.join(',')}`)
  const refresh = items.find((i) => i.label === 'coolui-scroller-refresh')
  assert.ok(refresh.insertText.value.includes('@'), '标签片段应使用 @ 事件写法')
})

await checkAsync('uni-app 补全：.vue 中给出 @ 事件', async () => {
  const items = await completeAt('<template>\n  <coolui-scroller @', VUE_PATH, 'vue')
  const names = labels(items)
  assert.ok(names.includes('@refresh'), `实际: ${names.join(',')}`)
  assert.ok(names.includes('@loadmore'), `实际: ${names.join(',')}`)
})

await checkAsync('uni-app 补全：.vue 中给出组件属性', async () => {
  const items = await completeAt('<template>\n  <coolui-scroller ', VUE_PATH, 'vue')
  assert.ok(labels(items).includes('isEmpty'), `实际: ${labels(items).join(',')}`)
})

await checkAsync('uni-app 补全：.vue 中 # 提示具名插槽', async () => {
  const text = '<coolui-scroller>\n  <template #'
  const document = new MockDocument(text, VUE_PATH, 'vue')
  const position = document.positionAt(text.length)
  const items = await completion.provideCompletionItems(document, position)
  const names = labels(items)
  assert.ok(names.includes('refresh'), `实际: ${JSON.stringify(names)}`)
  assert.ok(names.includes('loadmore'), `实际: ${JSON.stringify(names)}`)
})

await checkAsync('uni-app 悬停：.vue 中 :isEmpty 显示属性文档', async () => {
  const text = '<template>\n  <coolui-scroller :isEmpty="isEmpty">\n</template>'
  const document = new MockDocument(text, VUE_PATH, 'vue')
  const position = document.positionAt('<template>\n  <coolui-scroller :isEmpty'.length)
  const result = await hover.provideHover(document, position)
  assert.ok(result, '应有悬停内容')
  const list = Array.isArray(result.contents) ? result.contents : [result.contents]
  const value = list.map((c) => c.value || String(c)).join('')
  assert.ok(value.includes('isEmpty'), `实际: ${value.slice(0, 80)}`)
  assert.ok(value.includes(':isEmpty'), '示例应使用 uni-app 的 :prop 写法')
})

await checkAsync('悬停：光标在属性词中间也能命中（native）', async () => {
  const text = '<scroller isEmpty="{{true}}">'
  const document = new MockDocument(text)
  const position = document.positionAt(text.indexOf('isEmpty') + 4)
  const result = await hover.provideHover(document, position)
  assert.ok(result, '词中间悬停应有内容')
})

await checkAsync('uni-app 悬停：光标在 :isEmpty 词中间也能命中', async () => {
  const text = '<template>\n  <coolui-scroller :isEmpty="isEmpty">\n</template>'
  const document = new MockDocument(text, VUE_PATH, 'vue')
  const position = document.positionAt(text.indexOf(':isEmpty') + 4)
  const result = await hover.provideHover(document, position)
  assert.ok(result, '词中间悬停应有内容')
  const list = Array.isArray(result.contents) ? result.contents : [result.contents]
  const value = list.map((c) => c.value || String(c)).join('')
  assert.ok(value.includes('isEmpty'), `实际: ${value.slice(0, 80)}`)
})

await checkAsync('平台隔离：.wxml 中不提示 uni-app 标签', async () => {
  const names = labels(await completeAt('<coolui-scroll'))
  assert.ok(!names.includes('coolui-scroller'), `实际: ${names.join(',')}`)
})

await checkAsync('平台隔离：.vue 的 script 区域不提示', async () => {
  const text = '<template>\n  <view></view>\n</template>\n\n<script setup>\nconst a = "<scro'
  const document = new MockDocument(text, VUE_PATH, 'vue')
  const position = document.positionAt(text.length)
  const items = await completion.provideCompletionItems(document, position)
  assert.ok(!items || items.length === 0, `script 区域不应提示，实际: ${JSON.stringify(labels(items))}`)
})

console.log(results.join('\n'))
console.log(
  `\n${process.exitCode ? '存在失败的用例' : '全部用例通过'}（共 ${results.length} 项）`
)
