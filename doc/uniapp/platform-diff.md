# 与原生微信小程序版的差异

uni-app 版（`coolui-scroller-uni`）的组件能力、交互效果与原生微信小程序版保持一致，**props 与配置项可直接对照原生微信小程序版文档**。差异集中在下面两类：与原生微信小程序版的写法差异、各端（小程序 / H5 / App）的运行差异。

## 一、与原生微信小程序版的写法差异

| 项 | 原生微信小程序版 | uni-app 版 |
| --- | --- | --- |
| 组件标签 | `scroller`、`refresh`、`item`…（可自定义 tag 名） | 统一 `coolui-scroller-*` 前缀，如 `coolui-scroller-refresh` |
| 事件 | `bind:refresh` / `bind:loadmore` | `@refresh` / `@loadmore` |
| 受控属性 | 直接改 data | 通过 `@update:propName` 同步，如 sort-item 的 `@update:value` |
| 保留字属性 | search 组件用 `key` | 改名为 `keyword`，用 `@update:keyword` 同步 |
| 组件通信 | 小程序 `relations` 关联父子组件 | Vue `provide/inject` |
| 长列表 | `scroll-page`（整页占位） | `coolui-scroller-page`（旧方案）+ `coolui-scroller-longlist`（窗口化，推荐） |
| 类型 | — | `.vue` + `types.ts`，可 `import type { CooluiScrollerProps } from 'coolui-scroller-uni/types'` |

需要在组件之间通信的嵌套关系（保持层级即可，无需手动配置）：

- `coolui-scroller` → `coolui-scroller-refresh` / `coolui-scroller-back-to-top`
- `coolui-scroller-refresh` → `coolui-scroller-parallax`
- `coolui-scroller-nav-pannel` → `coolui-scroller`
- `coolui-scroller-sort` → `coolui-scroller-sort-item`
- `coolui-scroller-second-floor` → `coolui-scroller-second-floor-refresh` / `coolui-scroller-nav-bar`

## 二、各端运行差异

### H5 内置导航栏会额外占高

uni-app 在 H5 端会额外渲染内置导航栏（高度就是 CSS 变量 `--window-top`，默认 44px），而 `pages.json` 里的 `disableScroll` **只在小程序端生效**。于是全屏页写 `height: 100vh` 时会比可视区高出一截，出现页面级滚动条（小程序端一直正常，所以就容易漏）。

```scss
/* #ifdef H5 */
.page {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */
```

- 用 `--window-top` / `--window-bottom`（tabbar）而不是写死 44px；默认值 `0px` 兜底，变量缺失时不会反向变矮。
- `#ifdef H5` 包裹后，这段样式在小程序 / App 端构建时会被剥离，行为不变。
- 自定义导航栏（`navigationStyle: custom`）的页面 `--window-top` 为 0，无需处理。

### 插槽与样式作用域

小程序端组件插槽**不是作用域插槽**，且页面里 `scoped` 样式穿不进组件插槽。所以：

- 页面里给插槽内容写样式时，选择器要落在插槽内容本身（例如给内容加自己的 class），不要指望 `.coolui-scroller .item` 这类跨组件选择器；
- 若要统一列表项间距、内边距，写在组件/列表项自身的样式上，或给插槽内容加 class 后再写。

### 下拉刷新动画与「原生效果」

`type: 'default'` 会走小程序原生的下拉样式（三个圆点动画）。**同一个组件、同一个 type，两个页面观感不同，多半是刷新配置不一致**：`background.height`（下拉行程）大于 `height`（刷新自身高度）时，松手先回落到 `height` 显示加载动画、刷新完成后再整体回弹，也就是「两段回弹」的弹性感；不设置时行程很快就饱和，只剩单段回弹，手感偏硬。

### App 端

组件按源码参与编译，App 端与小程序端表现一致；H5 的高度处理同样适用于 App 端内嵌 WebView 的场景。App 资源包用 `npm run build:app` 产出，安装包需要在 HBuilderX 里云打包生成。

## 相关阅读

- [常见问题](/advanced/faq)：下拉没弹性、页面滚动条、列表间距等
- [安装与引入](/uniapp/install) / [快速开始](/uniapp/quickstart)
