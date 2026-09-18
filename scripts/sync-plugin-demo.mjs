/**
 * 把 demo/uniapp/src（npm 包版示例工程）的页面同步到 demo/uniapp-plugin（HBuilderX 工程），
 * 让插件市场的「示例工程」与仓库里的 demo 完全一致。
 *
 * 两个工程只差运行环境，同步时要处理三件事：
 *
 * 1. auto-import
 *    demo/uniapp 用 unplugin-auto-import 注入 Vue API 与 uni 生命周期，页面里不写 import；
 *    HBuilderX 没有这个插件，所以按「实际用到的名字」补上显式 import。
 *
 * 2. 模块路径
 *    demo/uniapp 从 npm 包取类型与工具（coolui-scroller-uni/...）；
 *    插件工程里组件在 uni_modules/coolui-scroller 下，改成 @/uni_modules/coolui-scroller/...。
 *
 * 3. pages.json
 *    去掉 easycom 配置（uni_modules 插件的 components/ 目录符合 easycom 默认规则，无需配置）。
 *
 * 另外：main.ts 里的入口补丁不需要同步 —— utils/platform.js 内部已经实现了
 * 同样的 H5/App 兜底（给 body 加 .coolui-nav-loading），App.vue 的全局样式照旧生效。
 *
 * 用法：pnpm sync:plugin-demo
 *      （pnpm build:uni-modules 会顺带调用，发布插件前只需要跑那一个命令）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SRC_DIR = path.join(ROOT, 'demo/uniapp/src')
const DEST_DIR = path.join(ROOT, 'demo/uniapp-plugin')

/** 整体镜像到插件工程的目录（同步前会先清空，保持两边一致） */
const MIRROR_DIRS = ['pages', 'static', 'wxcomponents', 'components']

/** 单独复制的文件 */
const COPY_FILES = ['types.ts', 'App.vue']

/** 绝不触碰的条目：插件本体与 HBuilderX 工程自身文件 */
const KEEP_ENTRIES = ['uni_modules', 'unpackage', 'manifest.json', 'uni.scss', 'README.md', 'main.js', 'pages.json']

/** npm 包路径 → uni_modules 插件路径 */
const MODULE_ALIASES = [['coolui-scroller-uni/', '@/uni_modules/coolui-scroller/']]

/** unplugin-auto-import 注入的 Vue API（与 demo/uniapp/vite.config.mjs 的 'vue' 预设一致） */
const VUE_AUTO_IMPORTS = [
  'computed', 'createApp', 'customRef', 'defineAsyncComponent', 'defineComponent', 'effectScope',
  'getCurrentInstance', 'getCurrentScope', 'getCurrentWatcher', 'h', 'inject', 'isProxy', 'isReactive',
  'isReadonly', 'isRef', 'isShallow', 'markRaw', 'nextTick', 'onActivated', 'onBeforeMount',
  'onBeforeUnmount', 'onBeforeUpdate', 'onDeactivated', 'onErrorCaptured', 'onMounted', 'onRenderTracked',
  'onRenderTriggered', 'onScopeDispose', 'onServerPrefetch', 'onUnmounted', 'onUpdated', 'onWatcherCleanup',
  'provide', 'reactive', 'readonly', 'ref', 'resolveComponent', 'shallowReactive', 'shallowReadonly',
  'shallowRef', 'toRaw', 'toRef', 'toRefs', 'toValue', 'triggerRef', 'unref', 'useAttrs', 'useCssModule',
  'useCssVars', 'useId', 'useModel', 'useSlots', 'useTemplateRef', 'watch', 'watchEffect',
  'watchPostEffect', 'watchSyncEffect',
]

/** unplugin-auto-import 注入的 uni-app 页面生命周期 */
const UNI_AUTO_IMPORTS = [
  'onHide', 'onLaunch', 'onLoad', 'onPageScroll', 'onPullDownRefresh', 'onReachBottom', 'onReady',
  'onShareAppMessage', 'onShow', 'onUnload',
]

/* ------------------------------------------------------------------ *
 * 代码转换
 * ------------------------------------------------------------------ */

/** 去掉注释与 import 语句，只留下真正的代码（用于判断某个名字有没有被用到） */
function stripCommentsAndImports(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/^\s*import\s[\s\S]*?\sfrom\s*['"][^'"]+['"]\s*;?[ \t]*$/gm, '')
    .replace(/^\s*import\s*['"][^'"]+['"]\s*;?[ \t]*$/gm, '')
}

/**
 * 该文件里「被调用/被实例化」的名字，即 auto-import 需要补的名字。
 * 只在后面跟 `(` 或 `<` 时才算命中，避免把 class="h-10"、'/static/watch.png' 这类字符串算进来。
 */
function detectUsedNames(code, names) {
  const body = stripCommentsAndImports(code)
  return names.filter((name) => new RegExp(`(?<![\\w$.])${name}(?![\\w$])\\s*[<(]`).test(body))
}

/** 文件里已经 import 进来的名字（含 default 导入与 `as` 别名） */
function collectImportedNames(code) {
  const names = new Set()
  const re = /import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"][^'"]+['"]/g
  let matched
  while ((matched = re.exec(code))) {
    const clause = matched[1]
    const braces = /\{([\s\S]*?)\}/.exec(clause)
    if (braces) {
      braces[1].split(',').forEach((part) => {
        const name = part.trim().split(/\s+as\s+/).pop().trim()
        if (name) names.add(name)
      })
    }
    const defaultName = clause.replace(/\{[\s\S]*?\}/, '').replace(/[,\s]+/g, '')
    if (defaultName && !defaultName.startsWith('*')) names.add(defaultName)
  }
  return names
}

/** 改写模块路径 */
function rewriteModulePaths(code) {
  let out = code
  for (const [from, to] of MODULE_ALIASES) out = out.split(from).join(to)
  return out
}

/**
 * 给 `<script setup>` 补上 auto-import 丢失的 import。
 * 返回 { code, injected }，injected 形如 ['vue: ref, computed', '@dcloudio/uni-app: onLoad']。
 */
function injectAutoImports(code, relFile) {
  if (!/<script\s+setup/.test(code)) {
    const needed = detectUsedNames(code, [...VUE_AUTO_IMPORTS, ...UNI_AUTO_IMPORTS])
    if (needed.length) {
      throw new Error(
        `[sync-plugin-demo] ${relFile} 用到了 auto-import（${needed.join(', ')}），但没有 <script setup>，需要手工处理`
      )
    }
    return { code, injected: [] }
  }

  const imported = collectImportedNames(code)
  const vueNames = detectUsedNames(code, VUE_AUTO_IMPORTS).filter((name) => !imported.has(name))
  const uniNames = detectUsedNames(code, UNI_AUTO_IMPORTS).filter((name) => !imported.has(name))

  if (!vueNames.length && !uniNames.length) return { code, injected: [] }

  const lines = []
  if (vueNames.length) lines.push(`import { ${vueNames.join(', ')} } from 'vue'`)
  if (uniNames.length) lines.push(`import { ${uniNames.join(', ')} } from '@dcloudio/uni-app'`)

  const out = code.replace(/<script\s+setup[^>]*>/, (openTag) => `${openTag}\n${lines.join('\n')}`)

  const injected = []
  if (vueNames.length) injected.push(`vue: ${vueNames.join(', ')}`)
  if (uniNames.length) injected.push(`@dcloudio/uni-app: ${uniNames.join(', ')}`)
  return { code: out, injected }
}

/** 需要按文本处理（改写路径 / 补 import）的扩展名；其余一律按二进制原样复制 */
const TEXT_EXTENSIONS = new Set(['.vue', '.ts', '.js', '.mjs', '.json', '.wxml', '.wxss', '.scss', '.css'])

/** 复制单个文件并做转换 */
function syncFile(from, to, relDest) {
  fs.mkdirSync(path.dirname(to), { recursive: true })

  // 图片等二进制文件直接复制，不能按 utf8 读写（会损坏内容）
  if (!TEXT_EXTENSIONS.has(path.extname(from).toLowerCase())) {
    fs.copyFileSync(from, to)
    return { injected: [] }
  }

  let code = rewriteModulePaths(fs.readFileSync(from, 'utf8'))

  let injected = []
  if (path.extname(from).toLowerCase() === '.vue') {
    const result = injectAutoImports(code, relDest)
    code = result.code
    injected = result.injected
  }

  fs.writeFileSync(to, code, 'utf8')
  return { injected }
}

/** 递归列出目录下的所有文件（供 build-uni-modules.mjs 复用） */
export function listFiles(dir) {
  const out = []
  ;(function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name)
      if (entry.isDirectory()) walk(abs)
      else out.push(abs)
    }
  })(dir)
  return out
}

/**
 * 删掉目标目录里源工程已不存在的文件，并清理空目录。
 * 目录用逐文件删除而不是整树 rmSync：某些环境（如安全删除拦截）会拒绝目录删除，
 * 失败时只告警不中断 —— 留几个旧文件不影响工程运行。
 */
export function pruneStaleFiles(destRoot, dir, srcRels, label) {
  // 统一按 posix 分隔符比较：调用方传进来的可能是 'a/b.txt'（手写常量）或 'a\\b.txt'（path.relative）
  const keep = new Set([...srcRels].map((rel) => rel.replace(/\\/g, '/')))
  const relativeOf = (abs) => path.relative(destRoot, abs).replace(/\\/g, '/')

  const stale = listFiles(dir).filter((abs) => !keep.has(relativeOf(abs)))
  const failed = []

  for (const abs of stale) {
    try {
      fs.unlinkSync(abs)
    } catch (e) {
      failed.push(relativeOf(abs))
    }
  }

  const dirs = []
  ;(function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const abs = path.join(current, entry.name)
        walk(abs)
        dirs.push(abs)
      }
    }
  })(dir)
  for (const abs of dirs) {
    try {
      if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs)
    } catch (e) {
      // 目录非空或被占用：忽略
    }
  }

  if (stale.length) console.log(`[sync-plugin-demo]   清理 ${label}/ 下已不存在的 ${stale.length} 个文件`)
  if (failed.length) {
    console.warn(`[sync-plugin-demo]   ⚠ ${failed.length} 个旧文件删除失败，请手工清理：${failed.join(', ')}`)
  }
}

/* ------------------------------------------------------------------ *
 * pages.json
 * ------------------------------------------------------------------ */

/**
 * 摘掉 pages.json 里的 easycom 配置块。
 * 用大括号配对定位，而不是正则 —— 原文件的行尾/缩进不固定，正则容易漏匹配。
 */
function removeEasycomBlock(raw) {
  const start = raw.search(/^[ \t]*"easycom"\s*:/m)
  if (start === -1) return raw

  const braceStart = raw.indexOf('{', start)
  if (braceStart === -1) throw new Error('[sync-plugin-demo] pages.json 的 easycom 配置格式异常')

  let depth = 0
  let cursor = braceStart
  for (; cursor < raw.length; cursor++) {
    if (raw[cursor] === '{') depth++
    else if (raw[cursor] === '}') {
      depth--
      if (depth === 0) break
    }
  }
  if (depth !== 0) throw new Error('[sync-plugin-demo] pages.json 的 easycom 配置大括号不配对')

  // 连同行尾的逗号和换行一起去掉，但保留下一行自己的缩进
  let end = cursor + 1
  while (end < raw.length && /[ \t]/.test(raw[end])) end++
  if (raw[end] === ',') end++
  if (raw[end] === '\r') end++
  if (raw[end] === '\n') end++

  const lineStart = raw.lastIndexOf('\n', start) + 1
  return raw.slice(0, lineStart) + raw.slice(end)
}

function buildPagesJson() {
  const raw = fs.readFileSync(path.join(SRC_DIR, 'pages.json'), 'utf8')

  // 去掉 easycom：uni_modules 插件的 components/ 目录符合 easycom 默认规则，无需自定义规则
  const withoutEasycom = removeEasycomBlock(raw)
  if (withoutEasycom === raw) throw new Error('[sync-plugin-demo] 没能从 demo/uniapp/src/pages.json 里去掉 easycom 配置')
  if (withoutEasycom.includes('coolui-scroller-uni/')) {
    throw new Error('[sync-plugin-demo] pages.json 里还残留 npm 包引用')
  }

  // 换行统一成 LF，方便 diff
  return `${withoutEasycom.replace(/\r\n/g, '\n').trimEnd()}\n`
}

/* ------------------------------------------------------------------ *
 * 同步结果自查
 * ------------------------------------------------------------------ */

/** 插件工程里不属于「示例工程」的目录（同步产物校验时跳过） */
function isProjectFile(abs) {
  return !abs.includes(`${path.sep}uni_modules${path.sep}`) && !abs.includes(`${path.sep}unpackage${path.sep}`)
}

/**
 * 校验同步结果：任何一项不过就报错，避免带着问题去发布插件。
 * 检查 4 件事：不再引用 npm 包、auto-import 已补齐、/static/ 图片都在、pages.json 的页面都有文件。
 */
function verifyPluginDemo() {
  const problems = []
  const files = listFiles(DEST_DIR).filter(isProjectFile)
  const textFiles = files.filter((abs) => TEXT_EXTENSIONS.has(path.extname(abs).toLowerCase()))

  for (const abs of textFiles) {
    const rel = path.relative(DEST_DIR, abs).replace(/\\/g, '/')
    const code = fs.readFileSync(abs, 'utf8')

    // 1. 插件工程里不该再出现 npm 包路径
    if (code.includes('coolui-scroller-uni/')) problems.push(`${rel}：仍引用 npm 包路径 coolui-scroller-uni/`)

    // 2. auto-import 必须已显式补齐
    if (path.extname(abs).toLowerCase() === '.vue') {
      const imported = collectImportedNames(code)
      const missing = [...VUE_AUTO_IMPORTS, ...UNI_AUTO_IMPORTS].filter(
        (name) => !imported.has(name) && detectUsedNames(code, [name]).length > 0
      )
      if (missing.length) problems.push(`${rel}：未补齐 auto-import → ${missing.join(', ')}`)
    }

    // 3. /static/ 下引用的图片必须存在（动态拼接的路径没有扩展名，跳过）
    for (const matched of code.matchAll(/['"](\/static\/[^'"]+)['"]/g)) {
      const ref = matched[1]
      if (!/\.[a-z0-9]+$/i.test(ref)) continue
      if (!fs.existsSync(path.join(DEST_DIR, ref))) problems.push(`${rel}：引用的 ${ref} 不存在`)
    }
  }

  // 4. pages.json 里声明的每个页面都要有对应的 .vue 文件
  const pagesJson = fs.readFileSync(path.join(DEST_DIR, 'pages.json'), 'utf8')
  const pageFiles = files
    .filter((abs) => abs.endsWith('.vue'))
    .map((abs) => path.relative(DEST_DIR, abs).replace(/\\/g, '/'))

  for (const matched of pagesJson.matchAll(/"path"\s*:\s*"([^"]+)"/g)) {
    const declared = matched[1]
    const hit = pageFiles.some(
      (rel) => rel === `${declared}.vue` || rel.endsWith(`/${declared}.vue`)
    )
    if (!hit) problems.push(`pages.json 声明的 ${declared} 找不到对应 .vue 文件`)
  }

  if (problems.length) {
    throw new Error(`[sync-plugin-demo] 校验未通过：\n  - ${problems.join('\n  - ')}`)
  }

  console.log(
    `[sync-plugin-demo] 校验通过：${pageFiles.length} 个页面、${files.length} 个文件，无 npm 包引用残留 / auto-import 已补齐 / 静态资源与路由齐全`
  )
}

/* ------------------------------------------------------------------ *
 * 主流程
 * ------------------------------------------------------------------ */

export function syncPluginDemo() {
  if (!fs.existsSync(SRC_DIR)) throw new Error(`[sync-plugin-demo] 找不到源工程 ${SRC_DIR}`)

  const report = []

  // 1. 镜像目录：逐文件覆盖写入，再清理源工程已经不存在的历史文件
  //    （不用 fs.rmSync 整目录删除：某些环境会拦截目录删除，且没必要）
  for (const dir of MIRROR_DIRS) {
    const from = path.join(SRC_DIR, dir)
    const to = path.join(DEST_DIR, dir)
    if (!fs.existsSync(from)) continue
    if (KEEP_ENTRIES.includes(dir)) throw new Error(`[sync-plugin-demo] 拒绝镜像受保护目录 ${dir}`)
    fs.mkdirSync(to, { recursive: true })

    const srcFiles = listFiles(from)
    const srcRels = new Set()

    for (const abs of srcFiles) {
      const rel = path.relative(SRC_DIR, abs)
      srcRels.add(rel)
      const { injected } = syncFile(abs, path.join(DEST_DIR, rel), rel)
      if (injected.length) report.push(`${rel}  ← ${injected.join(' | ')}`)
    }

    pruneStaleFiles(DEST_DIR, to, srcRels, dir)
  }

  // 2. 单文件
  for (const file of COPY_FILES) {
    const { injected } = syncFile(path.join(SRC_DIR, file), path.join(DEST_DIR, file), file)
    if (injected.length) report.push(`${file}  ← ${injected.join(' | ')}`)
  }

  // 3. pages.json
  fs.writeFileSync(path.join(DEST_DIR, 'pages.json'), buildPagesJson(), 'utf8')

  console.log(`[sync-plugin-demo] 已同步 demo/uniapp/src → demo/uniapp-plugin（${MIRROR_DIRS.join(' ')} 等）`)
  for (const line of report) console.log(`[sync-plugin-demo]   补齐 auto-import：${line}`)
  console.log('[sync-plugin-demo] 已生成 pages.json（不含 easycom 配置）')
  verifyPluginDemo()
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) syncPluginDemo()
