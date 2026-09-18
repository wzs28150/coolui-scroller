# AGENTS.md

给 AI 编码助手（Cursor / Claude Code / Codex / Copilot 等）的说明。分两部分：**在业务项目里使用这套组件**、**在本仓库里修改这套组件**。

> 本文件不在仓库根目录，位于 `doc/AGENTS.md`。它同时是随 npm 包发布的 `packages/native/AGENTS.md`、`packages/uniapp/AGENTS.md` 的**唯一手写来源**（生成器会摘取下面的「用法速查」章节）。

## 这个库是什么

coolui-scroller 是一个专注小程序「下拉刷新 / 上拉加载 / 长列表」的组件库，双版本同仓维护：

| 版本 | npm 包 | 源码目录 | 技术栈 |
| --- | --- | --- | --- |
| 原生微信小程序版 | `coolui-scroller` | `packages/native/` | WXML / WXSS / JS，父子组件用 `relations` 自动关联 |
| uni-app 版 | `coolui-scroller-uni` | `packages/uniapp/` | Vue（`<script setup lang="ts">`），父子组件用 `provide/inject` |

两版**组件能力与配置项一致**，差别只在引入方式与个别平台写法。改任何 API 都要同时改两边。

## 先读这些（AI 友好的文档）

- `doc/public/llms-full.txt`（线上：https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt）——**全部组件 API 与示例合并成的单文件全文**，需要了解组件用法时优先整份读入。
- `doc/public/llms.txt`（线上：https://wzs28150.github.io/coolui-scroller/v4/llms.txt）——文档索引，按需取页。
- `doc/native/components/*.md`、`doc/uniapp/components/*.md`——单组件文档（属性 / 插槽 / 事件 / 方法 / 示例表格）。
- `packages/uniapp/types.d.ts`——uni-app 版全部 props / 事件 / 组件间通信 API 的类型定义，最精确。
- `packages/native/<组件>/index.js` 的 `properties` / `methods`——原生版的准确定义。
- `packages/native/llms.txt`、`packages/uniapp/llms.txt` 与各自的 `AGENTS.md`——随 npm 包发布给使用方的版本。

## 用法速查（在业务项目里写代码时）

### 心智模型

`<scroller>`（uni-app：`<coolui-scroller>`）是滚动容器，其余能力全部通过**具名插槽**装配子组件：

| 插槽 | 放什么 | 说明 |
| --- | --- | --- |
| `header` | nav / search / sort | 固定在顶部的头部区 |
| `refresh` | refresh（可再嵌 parallax） | **放了才有下拉刷新** |
| 默认插槽 | item / scroll-page / longlist / 自己的列表 | 列表主体 |
| `loadmore` | loadmore | 触底加载区 |
| `empty` | empty | `isEmpty` 为 true 时显示 |
| `backToTop` | backToTop | 滚动超过阈值后显示 |

页面要设置 `"disableScroll": true`（原生写在页面 `index.json`，uni-app 写在 `pages.json`），否则页面级下拉会和组件下拉冲突。

### 最小可用示例（原生微信小程序）

```jsonc
// index.json
{
  "usingComponents": {
    "scroller": "coolui-scroller/scroller/index",
    "refresh": "coolui-scroller/refresh/index",
    "item": "coolui-scroller/item/index",
    "loadmore": "coolui-scroller/loadmore/index",
    "empty": "coolui-scroller/empty/index"
  },
  "disableScroll": true
}
```

```html
<!-- index.wxml -->
<scroller isEmpty="{{isEmpty}}" bind:refresh="refresh" bind:loadmore="loadmore">
  <refresh slot="refresh" type="default" config="{{refreshConfig}}" />

  <item wx:for="{{list}}" wx:key="id">{{item.title}}</item>

  <loadmore slot="loadmore" status="{{loadStatus}}" />
  <empty slot="empty" emptyText="暂无内容" />
</scroller>
```

```js
// index.js
Page({
  data: {
    list: [],
    page: 1,
    isEmpty: false,
    loadStatus: 'more', // more | loading | noMore
    // background.height 大于 height 才有"先回落到 height、刷新完再整体回弹"的弹性感
    refreshConfig: { height: 50, background: { color: '#f2f2f2', height: 120 } },
  },
  onLoad() {
    this.fetchList(1)
  },
  fetchList(page) {
    // 请求数据后：this.setData({ list, isEmpty: list.length === 0, loadStatus: 'more' })
  },
  refresh() {
    this.setData({ page: 1, list: [] })
    this.fetchList(1) // 数据真正返回后组件才收起刷新动画
  },
  loadmore() {
    this.setData({ page: this.data.page + 1, loadStatus: 'loading' })
    this.fetchList(this.data.page)
  },
})
```

### 最小可用示例（uni-app）

```jsonc
// pages.json：easycom 免 import（推荐）
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^coolui-scroller(-.*)?$": "coolui-scroller-uni/components/coolui-scroller$1/coolui-scroller$1.vue"
    }
  }
}
```

```vue
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #refresh>
      <coolui-scroller-refresh :config="{ height: 50, background: { height: 120 } }" />
    </template>

    <coolui-scroller-item v-for="item in list" :key="item.id">{{ item.title }}</coolui-scroller-item>

    <template #loadmore>
      <coolui-scroller-loadmore :status="loadStatus" />
    </template>
  </coolui-scroller>
</template>
```

### 事件与常用属性对照

| 作用 | 原生微信小程序 | uni-app |
| --- | --- | --- |
| 下拉刷新回调 | `bind:refresh` | `@refresh` |
| 触底加载回调 | `bind:loadmore` | `@loadmore` |
| 内容区高度（px） | `bind:contentHeight`（`res.detail`） | `@contentHeight` |
| 空数据 | `isEmpty="{{...}}"` | `:isEmpty="..."` |
| 手动收起刷新 | 组件实例 `settriggered(false)` | 同左（`ref` 调用） |

加载更多状态：`loadmore` 的 `status` 取 `more` / `loading` / `noMore`。
下拉刷新类型：`refresh` 的 `type` 取 `default`（原生三点）/ `base` / `logoText` / `diy`。

### 高频坑（写代码时先自检）

1. 没设 `disableScroll` → 页面级下拉与组件下拉冲突。
2. 下拉手感发硬 → refresh 的 `background.height` 要大于 `height`（例：`height: 50`、`background.height: 120`）。
3. 刷新 / 加载动画提前收起 → 回调里要等请求真正返回再结束（uni-app 版返回 promise 时，别在请求完成前 resolve）。
4. 长列表：原生用 `scroll-page`；uni-app 首选 `coolui-scroller-longlist`（窗口化，渲染节点数与总页数无关）。
5. H5 出现页面级滚动条 → 全屏页高度用 `calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px))`，并用 `/* #ifdef H5 */` 包裹。
6. uni-app 保留字改名：search 的 `key` → `keyword`（`@update:keyword`），handtip 的 `key` → `storageKey`。
7. 组件通信靠**嵌套层级**：不要拆散 `scroller` → `refresh` → `parallax`、`sort` → `sort-item`、`nav-pannel` → `scroller`、`second-floor` → `second-floor-refresh` / `nav-bar`。
8. 页面 `scoped` 样式穿不进组件插槽：给插槽内容自己的 class，别写 `.coolui-scroller .item` 这类跨组件选择器。

## 在本仓库里改代码

### 目录

| 路径 | 说明 |
| --- | --- |
| `packages/native/` | 原生微信小程序版：每个组件一个目录（`index.js` / `.json` / `.wxml` / `.wxss` / `.scss`） |
| `packages/uniapp/` | uni-app 版：`components/coolui-scroller-*/`、`utils/`、`types.d.ts`、`index.js` |
| `doc/` | VitePress 文档站，**唯一事实来源**；`doc/.vitepress/config.js` 里维护 sidebar 组件清单 |
| `doc/AGENTS.md` | 本文件：AI 协作说明，同时是两个包内 `AGENTS.md` 的来源 |
| `demo/native/`、`demo/uniapp/` | 示例工程 |
| `v2/`、`v3/`、`v4/` | 历史版本与文档构建产物，不要手改 |
| `scripts/build-llms.mjs` | 生成 AI 文档：`doc/public/` 下的 `llms.txt` / `llms-full.txt`，以及 `packages/*/llms.txt` / `packages/*/AGENTS.md` |

### 改一个组件要同步的地方

1. 原生实现：`packages/native/<目录>/`
2. uni-app 实现：`packages/uniapp/components/coolui-scroller-<名称>/`
3. uni-app 公共类型：`packages/uniapp/types.d.ts`
4. 文档：`doc/native/components/*.md` 与 `doc/uniapp/components/*.md`（属性 / 插槽 / 事件表格）
5. 新增组件时：`doc/.vitepress/config.js` 的 sidebar、`packages/uniapp/index.js` 导出，以及（如需要）`packages/native/` 的入口
6. 重新生成 AI 文档：`pnpm docs:llms`

### 命令

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动文档站开发服务 |
| `pnpm build` | 构建文档站到 `v4/` |
| `pnpm docs:llms` | 重新生成 AI 文档（`doc/public/` 下 + 两个 npm 包内） |
| `pnpm dev:uniapp` / `pnpm build:uniapp` | 编译 uni-app demo 到微信小程序 |
| `cd packages/uniapp && pnpm type-check` | uni-app 版类型检查（vue-tsc） |

### 约定

- 组件行为以 `doc/` 为准，代码改动必须同步更新文档。
- 两个版本的 API 保持同名同义；确实不一致时，必须在 `doc/uniapp/platform-diff.md` 记录。
- AI 文档的生成物：`doc/public/llms.txt`、`doc/public/llms-full.txt`，以及 `packages/native/`、`packages/uniapp/` 下的 `llms.txt` / `AGENTS.md`——都不要手改；本文件（`doc/AGENTS.md`）是包内 `AGENTS.md` 的唯一手写来源，改完 `doc/` 或本文件后执行 `pnpm docs:llms`。
- 文案、注释用中文，与现有代码风格保持一致。
