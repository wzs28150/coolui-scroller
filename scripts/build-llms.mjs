#!/usr/bin/env node
/**
 * 生成面向 LLM / AI 编码助手的文档：
 *
 *   doc/public/llms.txt      索引文件（https://llmstxt.org 约定）：这是什么 + 关键文档链接
 *   doc/public/llms-full.txt 把 doc/ 下的全部文档合并成的单文件全文（随文档站发布到线上）
 *   packages/<包>/llms.txt   随 npm 包发布的该包文档索引
 *   packages/<包>/AGENTS.md  随 npm 包发布的使用说明（取自 doc/AGENTS.md 的「用法速查」章节）
 *
 * 用法：pnpm docs:llms   （文档构建前会自动执行）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOC_DIR = path.join(ROOT, 'doc')
const PUBLIC_DIR = path.join(DOC_DIR, 'public')

/** 文档站线上地址 */
const SITE = 'https://wzs28150.github.io/coolui-scroller/v4'
const GITHUB = 'https://github.com/wzs28150/coolui-scroller'
const NPM_NATIVE = 'https://www.npmjs.com/package/coolui-scroller'
const NPM_UNI = 'https://www.npmjs.com/package/coolui-scroller-uni'

const GENERATED_NOTE =
  '本文件由 `scripts/build-llms.mjs` 依据 `doc/` 下的 Markdown 文档自动生成，请勿手工编辑；修改文档后执行 `pnpm docs:llms` 重新生成。'

/* ------------------------------------------------------------------ *
 * 文档清单（同时用于 llms.txt 索引与 llms-full.txt 正文，顺序即正文顺序）
 * ------------------------------------------------------------------ */

const DOC_GENERAL = [
  {
    file: 'native/guide.md',
    title: 'coolui-scroller 组件库介绍',
    desc: '组件库定位、设计初衷、版本演进与 v4 长列表窗口化方案',
  },
  {
    file: 'native/install.md',
    title: '原生微信小程序版：安装与引入',
    desc: 'npm 安装、构建 npm、usingComponents 全量清单、组件清单',
  },
]

const DOC_NATIVE_COMPONENTS = [
  { file: 'native/components/scroller.md', title: 'Scroller 滚动组件', tag: 'scroller', desc: '地基组件，必引；具名插槽 header / refresh / loadmore / empty / backToTop' },
  { file: 'native/components/item.md', title: 'Item 列表项组件', tag: 'item', desc: '自带点击水波纹的列表项' },
  { file: 'native/components/page.md', title: 'ScrollPage 长列表分页组件', tag: 'scroll-page', desc: '按页占位，适合长列表' },
  { file: 'native/components/empty.md', title: 'Empty 空列表组件', tag: 'empty', desc: '空数据占位图与文案' },
  { file: 'native/components/handtip.md', title: 'Handtip 手势提示组件', tag: 'handtip', desc: '首次进入的手势引导蒙层' },
  { file: 'native/components/loadmore.md', title: 'Loadmore 加载更多组件', tag: 'loadmore', desc: 'status：more / loading / noMore' },
  { file: 'native/components/refresh.md', title: 'Refresh 下拉刷新组件', tag: 'refresh', desc: 'type：default / base / logoText / diy' },
  { file: 'native/components/parallax.md', title: 'Parallax 下拉视差组件', tag: 'parallax', desc: '下拉时内容的视差位移' },
  { file: 'native/components/nav.md', title: 'Nav 分类导航组件', tag: 'nav', desc: '横向分类导航（下划线 / 圆角 / 朴素样式）' },
  { file: 'native/components/navPannel.md', title: 'NavPannel 切换组件', tag: 'nav-pannel', desc: '导航与内容联动切换' },
  { file: 'native/components/search.md', title: 'Search 搜索组件', tag: 'search', desc: '搜索框（属性为 key）' },
  { file: 'native/components/sort.md', title: 'Sort 排序及分类筛选组件', tag: 'sort / sort-item', desc: '下拉排序与分类筛选' },
  { file: 'native/components/floor.md', title: 'SecondFloor 下拉二楼组件', tag: 'second-floor', desc: '下拉进入二楼，可配 second-floor-refresh' },
  { file: 'native/components/backToTop.md', title: 'BackToTop 回到顶部组件', tag: 'backtotop', desc: '滚动超过阈值显示，点击回到顶部' },
]

const DOC_UNIAPP_START = [
  {
    file: 'uniapp/install.md',
    title: 'uni-app 版：安装与引入',
    desc: 'easycom / 全局注册 / 局部引入、TypeScript 支持',
  },
  {
    file: 'uniapp/quickstart.md',
    title: 'uni-app 版：快速开始',
    desc: '最小可运行的下拉刷新 + 上拉加载示例',
  },
  {
    file: 'uniapp/platform-diff.md',
    title: 'uni-app 版：与原生版的差异',
    desc: '事件命名、保留字属性、小程序 / H5 / App 各端差异',
  },
]

const DOC_UNIAPP_COMPONENTS = [
  { file: 'uniapp/components/index.md', title: 'uni-app 组件总览与命名对照', desc: '与原生标签的对照表与公共约定' },
  { file: 'uniapp/components/scroller.md', title: 'Scroller 滚动容器', tag: 'coolui-scroller' },
  { file: 'uniapp/components/item.md', title: 'Item 列表项组件', tag: 'coolui-scroller-item' },
  { file: 'uniapp/components/longlist.md', title: 'Longlist 长列表窗口化容器（推荐）', tag: 'coolui-scroller-longlist', desc: '节点数与总页数无关' },
  { file: 'uniapp/components/page.md', title: 'Page 长列表分页（旧方案）', tag: 'coolui-scroller-page' },
  { file: 'uniapp/components/empty.md', title: 'Empty 空列表组件', tag: 'coolui-scroller-empty' },
  { file: 'uniapp/components/handtip.md', title: 'Handtip 手势提示组件', tag: 'coolui-scroller-handtip' },
  { file: 'uniapp/components/loadmore.md', title: 'Loadmore 加载更多组件', tag: 'coolui-scroller-loadmore' },
  { file: 'uniapp/components/refresh.md', title: 'Refresh 下拉刷新组件', tag: 'coolui-scroller-refresh' },
  { file: 'uniapp/components/parallax.md', title: 'Parallax 下拉视差组件', tag: 'coolui-scroller-parallax' },
  { file: 'uniapp/components/nav.md', title: 'Nav 分类导航组件', tag: 'coolui-scroller-nav' },
  { file: 'uniapp/components/navBar.md', title: 'NavBar 顶部导航栏', tag: 'coolui-scroller-nav-bar' },
  { file: 'uniapp/components/navPannel.md', title: 'NavPannel 切换组件', tag: 'coolui-scroller-nav-pannel' },
  { file: 'uniapp/components/search.md', title: 'Search 搜索组件', tag: 'coolui-scroller-search', desc: '属性为 keyword（Vue 保留字改名）' },
  { file: 'uniapp/components/sort.md', title: 'Sort 排序及分类筛选组件', tag: 'coolui-scroller-sort / coolui-scroller-sort-item' },
  { file: 'uniapp/components/floor.md', title: 'SecondFloor 下拉二楼组件', tag: 'coolui-scroller-second-floor' },
  { file: 'uniapp/components/backToTop.md', title: 'BackToTop 回到顶部组件', tag: 'coolui-scroller-back-to-top' },
]

const DOC_ADVANCED = [
  {
    file: 'advanced/faq.md',
    title: '常见问题 FAQ',
    desc: '下拉没弹性、H5 页面滚动条、列表间距、长列表高度、easycom 不生效等',
  },
]

/** llms-full.txt 的分组顺序 */
const FULL_GROUPS = [
  { heading: '一、通用：这是什么、怎么安装', docs: DOC_GENERAL },
  { heading: '二、原生微信小程序版（coolui-scroller）组件', docs: DOC_NATIVE_COMPONENTS },
  { heading: '三、uni-app 版（coolui-scroller-uni）：安装与快速开始', docs: DOC_UNIAPP_START },
  { heading: '四、uni-app 版组件', docs: DOC_UNIAPP_COMPONENTS },
  { heading: '五、进阶：常见问题', docs: DOC_ADVANCED },
]

/* ------------------------------------------------------------------ *
 * URL / Markdown 处理
 * ------------------------------------------------------------------ */

/** doc 下的相对路径 -> 线上文档地址 */
function docUrl(relFile) {
  let p = relFile.replace(/\.md$/, '')
  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length) + '/'
  return `${SITE}/${p}`
}

/** 把文档里的链接/图片地址补全成可访问的绝对地址 */
function resolveUrl(target, relFile) {
  if (!target) return target
  if (/^(https?:)?\/\//.test(target) || target.startsWith('#') || target.startsWith('mailto:')) {
    return target
  }
  const hashIndex = target.indexOf('#')
  const pathPart = hashIndex === -1 ? target : target.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : target.slice(hashIndex)

  // 站点绝对路径：/images/x.jpg、/native/components/page
  if (pathPart.startsWith('/')) {
    const clean = pathPart.replace(/\.md$/, '')
    return `${SITE}${clean === '/' ? '/' : clean}${hash}`
  }

  // doc 内部相对路径：./refresh.md#xxx
  if (/\.md$/.test(pathPart)) {
    const dir = path.posix.dirname(relFile)
    const resolved = path.posix.normalize(path.posix.join(dir, pathPart))
    return `${docUrl(resolved)}${hash}`
  }

  return target
}

const VITEPRESS_CONTAINER_TYPES = new Set([
  'tip',
  'info',
  'warning',
  'danger',
  'details',
  'code-group',
  'raw',
  'note',
  'important',
  'caution',
])

/** 纯装饰性的 HTML 容器（VitePress 用来做 tab / 目录的原生结构），整块丢弃 */
const DECORATIVE_BLOCKS = [
  {
    open: /^<div\b[^>]*\bvp-code-group\b/i,
    openRe: /<div\b/gi,
    closeRe: /<\/div>/gi,
    keepImages: true,
  },
  {
    open: /^<nav\b[^>]*\btable-of-contents\b/i,
    openRe: /<nav\b/gi,
    closeRe: /<\/nav>/gi,
    keepImages: false,
  },
]

/** <img ...> -> Markdown 图片（shield 徽章之类的纯装饰图片丢弃） */
function imgTagToMarkdown(tag, relFile) {
  const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag)
  if (!src) return ''
  if (/img\.shields\.io|badge/i.test(src[1])) return ''
  const alt = /\balt\s*=\s*["']([^"']*)["']/i.exec(tag)
  return `![${alt ? alt[1] : ''}](${resolveUrl(src[1], relFile)})`
}

/** 常见 HTML 实体还原成普通字符 */
function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
}

/**
 * 去掉一段文本里的 HTML 标签（支持标签跨多行），<img> 转成 Markdown 图片。
 * 返回 { text, pending }，pending 是未闭合标签的开头，交给下一行继续处理。
 */
function stripHtmlTags(segment, relFile) {
  let out = ''
  let i = 0
  while (i < segment.length) {
    const lt = segment.indexOf('<', i)
    if (lt === -1) {
      out += segment.slice(i)
      break
    }
    out += segment.slice(i, lt)
    const gt = segment.indexOf('>', lt)
    if (gt === -1) return { text: out, pending: segment.slice(lt) }
    const tag = segment.slice(lt, gt + 1)
    if (/^<img\b/i.test(tag)) out += imgTagToMarkdown(tag, relFile)
    i = gt + 1
  }
  return { text: out, pending: '' }
}

/**
 * 把单个 VitePress Markdown 文档清洗成适合 LLM 阅读的纯 Markdown：
 * 去掉 frontmatter / `<script>` 块 / VitePress 容器标记 / 装饰性 HTML 标签，
 * 把相对链接与图片地址补全成绝对地址，并把标题降一级（文档标题由外部提供）。
 */
function cleanMarkdown(raw, relFile) {
  let lines = raw.replace(/\r\n?/g, '\n').split('\n')

  // YAML frontmatter
  if (lines[0] && lines[0].trim() === '---') {
    const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---')
    if (end > 0) lines = lines.slice(end + 1)
  }

  const out = []
  let fence = null
  let inScript = false
  let sawH1 = false
  let pendingTag = ''
  let skipBlock = null
  let skipImages = []

  for (let line of lines) {
    const trimmed = line.trim()

    // 非代码块内的 <script> ... </script>
    if (!fence) {
      if (inScript) {
        if (trimmed.includes('</script>')) inScript = false
        continue
      }
      if (/^<script\b/i.test(trimmed)) {
        if (!trimmed.includes('</script>')) inScript = true
        continue
      }
    }

    const fenceMatch = /^\s*(`{3,}|~{3,})(.*)$/.exec(line)
    if (fence) {
      if (fenceMatch) {
        const marker = fenceMatch[1]
        const info = (fenceMatch[2] || '').trim()
        if (marker[0] === fence.char && marker.length >= fence.len && info === '') {
          out.push(marker)
          fence = null
          continue
        }
      }
      out.push(line)
      continue
    }
    if (fenceMatch) {
      const marker = fenceMatch[1]
      fence = { char: marker[0], len: marker.length }
      // ```html [index.wxml] -> **index.wxml** + ```html
      const info = /^(`{3,}|~{3,})\s*([\w+#.-]*)\s*(?:\[([^\]]+)\])?\s*$/.exec(line)
      const lang = info && info[2] ? info[2] : ''
      const fileName = info && info[3] ? info[3].trim() : ''
      if (fileName) {
        out.push(`**${fileName}**`)
        out.push('')
      }
      out.push(marker + lang)
      continue
    }

    // 上一个跨行 HTML 标签的续行
    if (pendingTag) {
      const gt = line.indexOf('>')
      if (gt === -1) continue
      line = line.slice(gt + 1)
      pendingTag = ''
    }

    // 装饰性 HTML 容器：整块丢弃（按需保留其中的图片）
    if (skipBlock) {
      const opens = (line.match(skipBlock.openRe) || []).length
      const closes = (line.match(skipBlock.closeRe) || []).length
      if (skipBlock.keepImages) {
        const img = /<img\b[^>]*>/i.exec(line)
        if (img) skipImages.push(imgTagToMarkdown(img[0], relFile))
      }
      skipBlock.depth += opens - closes
      if (skipBlock.depth <= 0) {
        if (skipImages.length) {
          out.push(...skipImages)
          out.push('')
        }
        skipBlock = null
        skipImages = []
      }
      continue
    }
    const decorative = DECORATIVE_BLOCKS.find((rule) => rule.open.test(line.trim()))
    if (decorative) {
      skipBlock = { ...decorative, depth: 1 }
      continue
    }

    // VitePress 容器标记（::: tip ... / :::: code-group / 收尾的 :::）
    const container = /^:{3,}\s*(.*)$/.exec(line)
    if (container) {
      const body = container[1].trim()
      const type = body.split(/\s+/)[0] || ''
      const title = body.slice(type.length).trim()
      if (VITEPRESS_CONTAINER_TYPES.has(type)) {
        if (title) {
          out.push(`> ${title}`)
          out.push('')
        }
      } else if (body && !VITEPRESS_CONTAINER_TYPES.has(body)) {
        out.push(`> ${body}`)
        out.push('')
      }
      continue
    }

    // 行内代码（反引号）原样保留，其余片段剔除 HTML 标签
    let text = ''
    for (const segment of line.split(/(`+[^`]*`+)/g)) {
      if (segment.startsWith('`')) {
        text += segment
        continue
      }
      const { text: cleaned, pending } = stripHtmlTags(segment, relFile)
      text += decodeEntities(cleaned)
      if (pending) {
        pendingTag = pending
        break
      }
    }

    text = text.replace(/\{#[^}]*\}/g, '')
    text = text.replace(/(!?\[[^\]]*\]\()([^)\s]+)(\))/g, (m, pre, target, post) => {
      return pre + resolveUrl(target, relFile) + post
    })
    text = text.trimEnd()

    // 标题：去掉文档自身的 H1（由外部统一给出），其余降一级
    const heading = /^(#{1,6})\s+(.*)$/.exec(text)
    if (heading) {
      if (heading[1] === '#' && !sawH1) {
        sawH1 = true
        continue
      }
      const level = Math.min(6, heading[1].length + 1)
      text = `${'#'.repeat(level)} ${heading[2]}`
    }

    out.push(text)
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** 读取并清洗一份文档 */
function readDoc(relFile) {
  const abs = path.join(DOC_DIR, relFile)
  if (!fs.existsSync(abs)) {
    throw new Error(`[build-llms] 找不到文档：doc/${relFile}`)
  }
  return cleanMarkdown(fs.readFileSync(abs, 'utf8'), relFile)
}

/** 生成列表项：- [标题](url): 说明（有 tag 时补上标签名） */
function listItem(doc) {
  const notes = []
  if (doc.tag) notes.push(`标签 \`${doc.tag}\``)
  if (doc.desc) notes.push(doc.desc)
  return `- [${doc.title}](${docUrl(doc.file)})${notes.length ? ': ' + notes.join('；') : ''}`
}

/* ------------------------------------------------------------------ *
 * 生成 llms.txt（索引）
 * ------------------------------------------------------------------ */

/** 「关键事实」逐条列出，仓库版与包内版索引共用 */
const KEY_FACTS = [
  '核心是滚动容器 `<scroller>`（uni-app 版为 `<coolui-scroller>`），其余能力通过**具名插槽**装配子组件：`header`（导航 / 搜索 / 筛选）、`refresh`（放下拉刷新组件才开启下拉）、默认插槽（列表内容）、`loadmore`、`empty`、`backToTop`。',
  '页面需在 `index.json` / `pages.json` 中设置 `"disableScroll": true`，避免页面级下拉与组件下拉冲突。',
  '事件：原生用 `bind:refresh` / `bind:loadmore` / `bind:contentHeight`，uni-app 版用 `@refresh` / `@loadmore` / `@contentHeight`。',
  '加载更多状态：`loadmore` 的 `status` 取 `more` / `loading` / `noMore`。',
  '长列表：原生用 `scroll-page`（长列表分页）；uni-app 版推荐 `coolui-scroller-longlist`（窗口化容器，渲染节点数与总页数无关）。',
  '组件通信依赖父子嵌套层级（原生 `relations`、uni-app `provide/inject`），不要拆散 `scroller`→`refresh`→`parallax`、`sort`→`sort-item`、`nav-pannel`→`scroller`、`second-floor`→`second-floor-refresh` 等关系。',
  'uni-app 版保留字改名：search 的 `key` → `keyword`（`@update:keyword`），handtip 的 `key` → `storageKey`。',
]

function buildIndex() {
  const lines = [
    '# coolui-scroller',
    '',
    '> coolui-scroller 是一个专注小程序「下拉刷新 / 上拉加载 / 长列表」的组件库，提供两个 npm 包：',
    '>',
    '> - 原生微信小程序版 `coolui-scroller`（微信原生项目，`packages/native/`）',
    '> - uni-app 版 `coolui-scroller-uni`（Vue 2 / Vue 3，可编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序及 H5、App，`packages/uniapp/`）',
    '>',
    '> 两个版本的**组件能力与配置项一致**，差别只在引入方式与个别平台写法。',
    '>',
    `> 想一次读全量内容，请直接取 [llms-full.txt](${SITE}/llms-full.txt)（全部组件 API + 示例的单文件全文）。`,
    '',
    '## 关键事实（先读这段）',
    '',
    ...KEY_FACTS.map((fact) => `- ${fact}`),
    '',
    '## 快速开始',
    '',
    ...DOC_GENERAL.map(listItem),
    ...DOC_UNIAPP_START.map(listItem),
    '',
    '## 原生微信小程序版组件',
    '',
    ...DOC_NATIVE_COMPONENTS.map(listItem),
    '',
    '## uni-app 版组件',
    '',
    ...DOC_UNIAPP_COMPONENTS.map(listItem),
    '',
    '## 进阶',
    '',
    ...DOC_ADVANCED.map(listItem),
    `- [更新日志](${SITE}/version): 各版本变更记录（判断某 API 从哪个版本可用时查这里）`,
    '',
    '## Optional',
    '',
    `- [llms-full.txt](${SITE}/llms-full.txt): 上述全部文档的合并全文，AI 推荐一次读入`,
    `- [示例 demo](${SITE}/case/): 示例工程 demo/native 与 demo/uniapp`,
    `- [GitHub 仓库](${GITHUB})`,
    `- [npm: coolui-scroller](${NPM_NATIVE})`,
    `- [npm: coolui-scroller-uni](${NPM_UNI})`,
    '',
  ]
  return lines.join('\n')
}

/* ------------------------------------------------------------------ *
 * 生成 llms-full.txt（全文）
 * ------------------------------------------------------------------ */

function buildFullText() {
  const toc = FULL_GROUPS.map((group) => {
    const items = group.docs.map((doc) => `  - [${doc.title}](${docUrl(doc.file)})`).join('\n')
    return `- **${group.heading}**\n${items}`
  }).join('\n')

  const parts = [
    '# coolui-scroller · 完整文档（LLM 单文件版）',
    '',
    '> coolui-scroller 是一个专注小程序「下拉刷新 / 上拉加载 / 长列表」的组件库，提供两个 npm 包：',
    '>',
    '> - 原生微信小程序版 `coolui-scroller`（微信原生项目）',
    '> - uni-app 版 `coolui-scroller-uni`（Vue 2 / Vue 3，可编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序及 H5、App）',
    '>',
    '> 两个版本的**组件能力与配置项一致**，差别只在引入方式与个别平台写法。',
    '>',
    `> 文档站：${SITE}/ ｜ 仓库：${GITHUB}`,
    '>',
    `> ${GENERATED_NOTE}`,
    '',
    '## 目录',
    '',
    toc,
    '',
  ]

  for (const group of FULL_GROUPS) {
    parts.push(`# ${group.heading}`, '')
    for (const doc of group.docs) {
      parts.push(`## ${doc.title}`, '')
      parts.push(`> 在线文档：${docUrl(doc.file)} ｜ 来源：\`doc/${doc.file}\``, '')
      parts.push(readDoc(doc.file), '')
      parts.push('---', '')
    }
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/* ------------------------------------------------------------------ *
 * 随 npm 包发布的 AI 文档（装到用户项目后 node_modules 里可读到）
 * ------------------------------------------------------------------ */

/**
 * 说明：用户 `npm i` 后拿到的是各自包目录，仓库根目录的文件不会进包，
 * 而且 AI 工具默认很少主动翻 node_modules。
 * 所以这里给每个包生成两份小体积文件（体积远小于 llms-full.txt）：
 *   - llms.txt    该包的文档索引 + 关键事实 + 线上全量文档地址
 *   - AGENTS.md   该包的使用说明（复用根 AGENTS.md 的「用法速查」章节，单一来源）
 * 用户在自己项目里让 AI 读 `node_modules/<包名>/AGENTS.md` 即可。
 */
const PACKAGES = [
  {
    dir: 'packages/native',
    pkgName: 'coolui-scroller',
    label: '原生微信小程序版',
    docsUrl: `${SITE}/native/install`,
    startDocs: [
      {
        file: 'native/install.md',
        title: '安装与引入',
        desc: 'npm 安装、构建 npm、usingComponents 全量清单',
      },
      { file: 'native/guide.md', title: '组件库介绍', desc: '组件库定位与 v4 长列表窗口化方案' },
    ],
    componentDocs: DOC_NATIVE_COMPONENTS,
  },
  {
    dir: 'packages/uniapp',
    pkgName: 'coolui-scroller-uni',
    label: 'uni-app 版',
    docsUrl: `${SITE}/uniapp/install`,
    startDocs: DOC_UNIAPP_START,
    componentDocs: DOC_UNIAPP_COMPONENTS,
  },
]

/** 读取包自身的版本号 */
function readPackageVersion(pkgDir) {
  const json = JSON.parse(fs.readFileSync(path.join(ROOT, pkgDir, 'package.json'), 'utf8'))
  return json.version
}

/** 包内 llms.txt：该包的文档索引 */
function buildPackageIndex(pkg) {
  const version = readPackageVersion(pkg.dir)
  return [
    `# ${pkg.pkgName}`,
    '',
    `> \`${pkg.pkgName}@${version}\`：coolui-scroller 的**${pkg.label}**，一个小程序「下拉刷新 / 上拉加载 / 长列表」组件库。`,
    '>',
    `> 全部组件 API 与示例的单文件全文（推荐一次读入）：[llms-full.txt](${SITE}/llms-full.txt)`,
    `> 官方文档站：${pkg.docsUrl}`,
    '',
    '## 关键事实（先读这段）',
    '',
    ...KEY_FACTS.map((fact) => `- ${fact}`),
    '',
    `## 快速开始（${pkg.label}）`,
    '',
    ...pkg.startDocs.map(listItem),
    '',
    '## 组件',
    '',
    ...pkg.componentDocs.map(listItem),
    '',
    '## 进阶',
    '',
    ...DOC_ADVANCED.map(listItem),
    '',
    '## Optional',
    '',
    `- [llms-full.txt](${SITE}/llms-full.txt): 全部文档的合并全文，AI 推荐一次读入`,
    `- [AGENTS.md](./AGENTS.md): 组件心智模型、最小可用示例、高频坑`,
    `- [GitHub 仓库](${GITHUB})`,
    `- [npm: ${pkg.pkgName}](https://www.npmjs.com/package/${pkg.pkgName})`,
    '',
  ].join('\n')
}

/** 取出 doc/AGENTS.md 里给使用方看的「用法速查」章节（单一来源，避免两处维护） */
function readAgentsUsageSection() {
  const raw = fs.readFileSync(path.join(DOC_DIR, 'AGENTS.md'), 'utf8').replace(/\r\n?/g, '\n')
  const lines = raw.split('\n')
  const start = lines.findIndex((line) => line.startsWith('## 用法速查'))
  if (start === -1) throw new Error('[build-llms] doc/AGENTS.md 中找不到「## 用法速查」章节')
  const next = lines.findIndex((line, i) => i > start && line.startsWith('## '))
  return lines
    .slice(start, next === -1 ? undefined : next)
    .join('\n')
    .replace(/^## 用法速查.*$/m, '## 用法速查')
    .trim()
}

/** 包内 AGENTS.md：面向「在自己项目里使用该包」的 AI 说明 */
function buildPackageAgents(pkg) {
  const version = readPackageVersion(pkg.dir)
  return [
    `# AGENTS.md · ${pkg.pkgName}`,
    '',
    `coolui-scroller 的**${pkg.label}**，npm 包 \`${pkg.pkgName}@${version}\`。`,
    '',
    '## 先读这些',
    '',
    `- 本目录的 [\`llms.txt\`](./llms.txt)——该包的文档索引与关键事实。`,
    `- 线上 [\`llms-full.txt\`](${SITE}/llms-full.txt)——全部组件 API 与示例的单文件全文，需要深入了解某组件时优先读它。`,
    `- 官方文档站：${pkg.docsUrl}`,
    '',
    '> 本文件由组件库的 `scripts/build-llms.mjs` 生成，请勿手工编辑。',
    '',
    readAgentsUsageSection(),
    '',
  ].join('\n')
}

/* ------------------------------------------------------------------ *
 * 输出
 * ------------------------------------------------------------------ */

function main() {
  const index = buildIndex()
  const full = buildFullText()

  const targets = [
    [path.join(PUBLIC_DIR, 'llms.txt'), index],
    [path.join(PUBLIC_DIR, 'llms-full.txt'), full],
  ]

  // 随 npm 包发布的索引与使用说明
  for (const pkg of PACKAGES) {
    const pkgDir = path.join(ROOT, pkg.dir)
    targets.push(
      [path.join(pkgDir, 'llms.txt'), buildPackageIndex(pkg)],
      [path.join(pkgDir, 'AGENTS.md'), buildPackageAgents(pkg)]
    )
  }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  for (const [target, content] of targets) {
    fs.writeFileSync(target, content, 'utf8')
    console.log(`[build-llms] 已生成 ${path.relative(ROOT, target)}（${content.length} 字符）`)
  }
}

main()
