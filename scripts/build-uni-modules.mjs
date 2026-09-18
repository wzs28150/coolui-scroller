#!/usr/bin/env node
/**
 * 把 packages/uniapp 同步成 DCloud 插件市场要求的 uni_modules 插件。
 *
 * 产物：demo/uniapp-plugin/uni_modules/<插件ID>/
 *   ├─ components/ utils/ types.d.ts index.js   从 packages/uniapp 原样复制
 *   ├─ package.json                             uni_modules 规范（字段见下方）
 *   ├─ readme.md                                插件市场详情页正文（自动生成）
 *   └─ changelog.md                             仅首次生成，之后手工维护
 *
 * 用法：pnpm build:uni-modules
 *
 * 说明：组件里用的是 `../../utils/xxx`、`../../types` 两级相对引用，与 packages/uniapp
 * 的目录深度完全一致，所以复制后不需要改任何源码；components 目录也符合 easycom
 * 默认规则（components/<组件名>/<组件名>.vue），使用者导入后无需配置。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { listFiles, pruneStaleFiles, syncPluginDemo } from './sync-plugin-demo.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

/* ------------------------------------------------------------------ *
 * 需要你修改的地方
 * ------------------------------------------------------------------ */

/**
 * 插件 ID 规则为 `作者ID-插件英文名称`（https://uniapp.dcloud.io/plugin/uni_modules.html）：
 * 两段都只能用英文与数字，作者ID 至少 2 位、不能包含 DCloud / uni 等关键字，整个 ID 最长 20 个字符。
 * 作者ID 由作者自定义，官方不要求与 DCloud 账号绑定（账号里也没有此字段可查）。
 * 这里取 `coolui-scroller`：作者ID 用产品名 `coolui`，插件名用 `scroller`，共 15 个字符。
 */
const AUTHOR_ID = 'coolui'
const PLUGIN_NAME = 'scroller'
const PLUGIN_ID = `${AUTHOR_ID}-${PLUGIN_NAME}`

/* ------------------------------------------------------------------ *
 * 路径与常量
 * ------------------------------------------------------------------ */

const SRC_DIR = path.join(ROOT, 'packages/uniapp')
const PLUGIN_DIR = path.join(ROOT, 'demo/uniapp-plugin/uni_modules', PLUGIN_ID)
const DOCS_URL = 'https://wzs28150.github.io/coolui-scroller/v4/uniapp/install'
const FULL_DOCS_URL = 'https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt'
const REPO_URL = 'https://github.com/wzs28150/coolui-scroller'
const NPM_URL = 'https://www.npmjs.com/package/coolui-scroller-uni'

/** 原样复制到插件根目录的条目（顺序无关） */
const COPY_ENTRIES = ['components', 'utils', 'types.d.ts', 'index.js']

/** 组件说明，用于生成 readme 里的组件清单（键为组件目录名） */
const COMPONENT_DESC = {
  'coolui-scroller': '滚动容器（下拉刷新 / 上拉加载 / 空态 / 回到顶部插槽）',
  'coolui-scroller-refresh': '下拉刷新动画（原生三点 / 基础 / LOGO 文字 / 完全自定义）',
  'coolui-scroller-loadmore': '加载更多（more / loading / noMore 三态）',
  'coolui-scroller-back-to-top': '回到顶部悬浮按钮',
  'coolui-scroller-empty': '空列表占位',
  'coolui-scroller-item': '列表项（带点击水波纹）',
  'coolui-scroller-page': '长列表分页（旧方案：整页占位）',
  'coolui-scroller-longlist': '长列表窗口化容器（推荐，节点数与总页数无关）',
  'coolui-scroller-parallax': '下拉视差位移',
  'coolui-scroller-nav': '分类导航',
  'coolui-scroller-nav-bar': '顶部导航栏',
  'coolui-scroller-nav-pannel': '导航与内容联动切换容器',
  'coolui-scroller-search': '搜索框',
  'coolui-scroller-sort': '排序 / 分类筛选',
  'coolui-scroller-sort-item': '排序 / 筛选的单项（配合 sort 使用）',
  'coolui-scroller-second-floor': '下拉二楼',
  'coolui-scroller-second-floor-refresh': '下拉二楼的刷新与回弹（配合 second-floor 使用）',
  'coolui-scroller-handtip': '首次进入的手势提示',
}

/* ------------------------------------------------------------------ *
 * 生成
 * ------------------------------------------------------------------ */

function readVersion() {
  const json = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'package.json'), 'utf8'))
  return json.version
}

function buildPackageJson(version) {
  return (
    JSON.stringify(
      {
        id: PLUGIN_ID,
        displayName: 'coolui-scroller 下拉刷新上拉加载',
        version,
        description:
          '小程序下拉刷新、上拉加载、长列表组件库（uni-app 版）：滚动容器 + 下拉动画 + 加载更多 + 空态 + 导航搜索筛选 + 下拉二楼，一套代码编译到各端小程序 / H5 / App。',
        keywords: ['下拉刷新', '上拉加载', '长列表', 'scroller', '组件库'],
        repository: 'github:wzs28150/coolui-scroller',
        engines: { HBuilderX: '^3.1.0' },
        dcloudext: {
          category: ['前端组件', '通用组件'],
          type: 'component-vue',
          declaration: {
            ads: '本插件不含任何广告',
            data: '不采集、不上传任何数据，不请求任何服务器',
            permissions: '不申请任何系统权限',
          },
          npmurl: NPM_URL,
          contact: { qq: '' },
        },
      },
      null,
      2
    ) + '\n'
  )
}

function buildReadme(version) {
  const components = fs
    .readdirSync(path.join(PLUGIN_DIR, 'components'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const componentRows = components
    .map((name) => `| \`${name}\` | ${COMPONENT_DESC[name] || '—'} |`)
    .join('\n')

  return `# coolui-scroller 下拉刷新上拉加载

专注小程序**下拉刷新 / 上拉加载 / 长列表**的组件库（uni-app 版），一套代码编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序以及 H5、App。

当前版本：\`${version}\`

## 特性

- **下拉刷新**：内置小程序原生三点效果，另有基础箭头、LOGO 文字、完全自定义四种模式
- **上拉加载**：\`more\` / \`loading\` / \`noMore\` 三态，文案与颜色可配
- **长列表**：窗口化渲染，只渲染可视窗口内的页，渲染节点数与总页数无关
- **配套组件**：空态、回到顶部、分类导航、搜索、排序筛选、下拉二楼、手势提示
- **组合式用法**：以 \`<coolui-scroller>\` 为容器，其余能力通过具名插槽自由装配

## 引入

本插件符合 uni_modules 规范，且组件目录符合 easycom 默认规则，**导入后无需任何配置**，直接在模板里写标签即可：

\`\`\`vue
<coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
  <template #refresh>
    <coolui-scroller-refresh :config="{ height: 50, background: { height: 120 } }" />
  </template>

  <coolui-scroller-item v-for="item in list" :key="item.id">{{ item.title }}</coolui-scroller-item>

  <template #loadmore>
    <coolui-scroller-loadmore :status="loadStatus" />
  </template>
</coolui-scroller>
\`\`\`

页面的 \`pages.json\` 中需要打开 \`disableScroll\`，避免页面级下拉与组件下拉冲突：

\`\`\`json
{
  "path": "pages/index/index",
  "style": { "disableScroll": true }
}
\`\`\`

> 也可以不用 uni_modules，直接安装 npm 包：\`npm i coolui-scroller-uni\`（[文档](${DOCS_URL})）。

## 快速开始

\`\`\`vue
<template>
  <view class="page">
    <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
      <template #refresh>
        <coolui-scroller-refresh :config="refreshConfig" />
      </template>

      <coolui-scroller-item v-for="item in list" :key="item.id">
        {{ item.title }}
      </coolui-scroller-item>

      <template #loadmore>
        <coolui-scroller-loadmore :status="loadStatus" />
      </template>

      <template #empty>
        <coolui-scroller-empty emptyText="暂无内容" />
      </template>
    </coolui-scroller>
  </view>
</template>

\`\`\`js
export default {
  data() {
    return {
      list: [],
      page: 1,
      isEmpty: false,
      loadStatus: 'more', // more | loading | noMore
      // background.height 大于 height，才有"松手先回落、刷新完再整体回弹"的弹性感
      refreshConfig: { height: 50, background: { color: '#f2f2f2', height: 120 } },
    }
  },
  onLoad() {
    this.fetchList(1)
  },
  methods: {
    fetchList(page) {
      // 请求数据，返回 promise；数据真正返回后组件才收起刷新 / 加载动画
      return new Promise((resolve) => {
        setTimeout(() => {
          this.list = this.list.concat([{ id: page, title: '第 ' + page + ' 页' }])
          this.isEmpty = this.list.length === 0
          this.loadStatus = 'more'
          resolve()
        }, 600)
      })
    },
    refresh() {
      this.page = 1
      this.list = []
      return this.fetchList(1)
    },
    loadmore() {
      this.loadStatus = 'loading'
      this.page += 1
      return this.fetchList(this.page)
    },
  },
}
\`\`\`

\`\`\`css
.page {
  height: 100%;
}
\`\`\`

## 组件清单

| 组件标签 | 说明 |
| --- | --- |
${componentRows}

插槽名与原生微信小程序版一致：\`#header\`、\`#refresh\`、\`#loadmore\`、\`#empty\`、\`#backToTop\`，默认插槽放列表内容。保持组件的嵌套层级（如 \`coolui-scroller\` → \`coolui-scroller-refresh\`）即可，组件间通信由 \`provide/inject\` 自动完成。

## 组件 API

完整属性、事件、插槽、配置项与各端差异见文档站：

- [安装与引入](${DOCS_URL})
- [全部组件 API（单文件全文，也适合交给 AI 助手）](${FULL_DOCS_URL})

## 相关链接

- 文档站：<https://wzs28150.github.io/coolui-scroller/v4/>
- 仓库：<${REPO_URL}>
- npm：<${NPM_URL}>
- 编辑器插件（WXML / Vue 补全与悬停文档）：<https://wzs28150.github.io/coolui-scroller/v4/advanced/plugin>
`
}

function buildChangelog(version) {
  const today = new Date().toISOString().slice(0, 10)
  return `# 更新日志

## ${version}

- 发布到 DCloud 插件市场，与 npm 包 \`coolui-scroller-uni@${version}\` 源码一致。
- 组件目录符合 easycom 默认规则，导入后无需配置。
- 日期：${today}
`
}

function main() {
  if (!fs.existsSync(path.join(SRC_DIR, 'package.json'))) {
    throw new Error(`[build-uni-modules] 找不到源目录：${SRC_DIR}`)
  }

  const version = readVersion()
  fs.mkdirSync(PLUGIN_DIR, { recursive: true })

  // 期望的文件清单：复制完用它清理已经不存在的旧文件
  // （不用整目录 fs.rmSync：某些环境会拦截目录删除，且逐文件清理同样干净）
  const expected = new Set(['package.json', 'readme.md', 'changelog.md'])

  for (const entry of COPY_ENTRIES) {
    const from = path.join(SRC_DIR, entry)
    if (!fs.existsSync(from)) {
      throw new Error(`[build-uni-modules] 源目录缺少 ${entry}，请检查 packages/uniapp`)
    }
    fs.cpSync(from, path.join(PLUGIN_DIR, entry), { recursive: true })

    if (fs.statSync(from).isDirectory()) {
      for (const abs of listFiles(from)) {
        expected.add(path.relative(SRC_DIR, abs).split(path.sep).join('/'))
      }
    } else {
      expected.add(entry)
    }
  }

  fs.writeFileSync(path.join(PLUGIN_DIR, 'package.json'), buildPackageJson(version), 'utf8')
  fs.writeFileSync(path.join(PLUGIN_DIR, 'readme.md'), buildReadme(version), 'utf8')

  // changelog 只在首次生成，之后由人工维护（避免每次同步覆盖掉历史记录）
  const changelogPath = path.join(PLUGIN_DIR, 'changelog.md')
  if (!fs.existsSync(changelogPath)) {
    fs.writeFileSync(changelogPath, buildChangelog(version), 'utf8')
    console.log('[build-uni-modules] 已创建 changelog.md（之后由人工维护）')
  }

  pruneStaleFiles(PLUGIN_DIR, PLUGIN_DIR, expected, `uni_modules/${PLUGIN_ID}`)

  // 清理是「按清单保留」，一旦清单和实际文件对不上就会误删，这里兜底校验一次
  for (const entry of COPY_ENTRIES) {
    if (!fs.existsSync(path.join(PLUGIN_DIR, entry))) {
      throw new Error(`[build-uni-modules] 同步后缺少 ${entry}，清理逻辑可能误删了文件，请检查`)
    }
  }

  const fileCount = countFiles(PLUGIN_DIR)
  console.log(`[build-uni-modules] 已生成 demo/uniapp-plugin/uni_modules/${PLUGIN_ID}`)
  console.log(`[build-uni-modules] 版本 ${version}，共 ${fileCount} 个文件（插件 ID：${PLUGIN_ID}）`)

  // 顺带把示例工程的页面同步成与 demo/uniapp 一致（发布插件时两个都要，放一起省得漏）
  syncPluginDemo()
}

function countFiles(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name))
    else count += 1
  }
  return count
}

main()
