# 安装与引入

本页是**原生微信小程序版**（npm 包 `coolui-scroller`）的接入方式：直接在微信小程序原生项目里使用，不走 uni-app 编译。

::: tip 用的是 uni-app？
请看 [uni-app 版安装与引入](/uniapp/install)，或点顶部导航切换平台。两个版本组件能力与配置项基本一致，差别在引入方式与个别平台差异。
:::

## 环境要求

| 项 | 说明 |
| --- | --- |
| 运行环境 | 微信小程序，基础库建议 2.x 及以上 |
| 开发者工具 | 需支持 **构建 npm**（工具 → 构建 npm） |
| 项目依赖 | 页面需要 `scroll-view` 的下拉、触底能力，基础库不要过低 |

## 安装

```bash
npm i coolui-scroller --production
```

如果项目还没有 `package.json`，先在项目根目录执行 `npm init -y` 生成。

### 构建 npm

安装完成后，在微信开发者工具里点击「工具 → 构建 npm」：

<img src="/images/set1.png" alt="构建 npm" />

当项目里出现 `miniprogram_npm` 目录，就说明构建完成了：

<img src="/images/set2.png" alt="构建结果" />

## 引入

在 `app.json` 全局引入，或在需要的页面 `index.json` 里按需引入：

```json
"usingComponents": {
  "scroller": "coolui-scroller/scroller/index",
  "refresh": "coolui-scroller/refresh/index"
}
```

左侧的 key（`scroller`、`refresh`）是**标签名，可以自己改**，例如改成 `my-scroller` 后模板里就用 `<my-scroller>`。

### 全量引入清单

按需取用即可（`sort-item` 是 `sort` 的子组件，需要一起引入）：

```json
"usingComponents": {
  "scroller": "coolui-scroller/scroller/index",
  "item": "coolui-scroller/item/index",
  "scroll-page": "coolui-scroller/scroll-page/index",
  "empty": "coolui-scroller/empty/index",
  "handtip": "coolui-scroller/handtip/index",
  "loadmore": "coolui-scroller/loadmore/index",
  "refresh": "coolui-scroller/refresh/index",
  "parallax": "coolui-scroller/parallax/index",
  "nav": "coolui-scroller/nav/index",
  "nav-bar": "coolui-scroller/nav-bar/index",
  "nav-pannel": "coolui-scroller/nav-pannel/index",
  "search": "coolui-scroller/search/index",
  "sort": "coolui-scroller/sort/index",
  "sort-item": "coolui-scroller/sort/item",
  "second-floor": "coolui-scroller/second-floor/index",
  "second-floor-refresh": "coolui-scroller/second-floor-refresh/index",
  "backtotop": "coolui-scroller/backToTop/index"
}
```

### 页面结构

```html
<scroller class="my-scroller">
  ...
</scroller>
```

### 参数配置

配置写在页面 `data` 里（或在组件上以属性传入），v3 起功能细化到各个组件，具体见 [Scroller 滚动组件](/native/components/scroller) 等各组件文档。

:::: tip 写 WXML 时有补全和中文提示
安装[编辑器插件](/advanced/plugin)后，组件标签、属性、事件、插槽都会自动补全，悬停可看中文说明；用到组件但漏了 `usingComponents` 时会告警，并支持一键引入。
::::

## 组件清单

| 组件 | 目录 | 说明 | 文档 |
| --- | --- | --- | --- |
| Scroller | `scroller` | 滚动容器：下拉刷新 / 上拉加载 / 空态 / 回到顶部插槽 | [文档](/native/components/scroller) |
| Item | `item` | 列表项，自带点击水波纹 | [文档](/native/components/item) |
| ScrollPage | `scroll-page` | 长列表分页（按页占位，减少节点数） | [文档](/native/components/page) |
| Empty | `empty` | 空列表占位 | [文档](/native/components/empty) |
| Handtip | `handtip` | 首次进入的手势提示 | [文档](/native/components/handtip) |
| Loadmore | `loadmore` | 上拉加载更多 | [文档](/native/components/loadmore) |
| Refresh | `refresh` | 下拉刷新动画（含小程序原生样式） | [文档](/native/components/refresh) |
| Parallax | `parallax` | 下拉视差位移 | [文档](/native/components/parallax) |
| Nav | `nav` | 分类导航 | [文档](/native/components/nav) |
| NavBar | `nav-bar` | 顶部导航栏 | — |
| NavPannel | `nav-pannel` | 切换容器（导航 + 内容联动） | [文档](/native/components/navPannel) |
| Search | `search` | 搜索框 | [文档](/native/components/search) |
| Sort / SortItem | `sort` / `sort/item` | 排序与分类筛选 | [文档](/native/components/sort) |
| SecondFloor | `second-floor` / `second-floor-refresh` | 下拉二楼 | [文档](/native/components/floor) |
| BackToTop | `backToTop` | 回到顶部 | [文档](/native/components/backToTop) |

## 示例 demo

扫码预览、以及用微信开发者工具打开示例工程（`demo/native`）的方式，见 [示例 demo](/case/)。

## 下一步

- [组件库介绍](/native/guide)：设计初衷、版本演进与长列表方案
- [编辑器插件](/advanced/plugin)：WXML 里的组件补全、悬停文档与引入诊断
- [常见问题](/advanced/faq)：下拉没弹性、H5 滚动条、列表间距等高频问题
