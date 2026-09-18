# AGENTS.md · coolui-scroller-uni

coolui-scroller 的**uni-app 版**，npm 包 `coolui-scroller-uni@1.0.2`。

## 先读这些

- 本目录的 [`llms.txt`](./llms.txt)——该包的文档索引与关键事实。
- 线上 [`llms-full.txt`](https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt)——全部组件 API 与示例的单文件全文，需要深入了解某组件时优先读它。
- 官方文档站：https://wzs28150.github.io/coolui-scroller/v4/uniapp/install

> 本文件由组件库的 `scripts/build-llms.mjs` 生成，请勿手工编辑。

## 用法速查

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
