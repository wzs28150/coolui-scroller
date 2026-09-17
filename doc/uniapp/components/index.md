# 组件总览 / 命名对照

uni-app 版组件与原生微信小程序版一一对应，能力与配置项一致；**标签统一加 `coolui-scroller-` 前缀**，个别组件的保留字属性做了改名（详见[与原生微信小程序版的差异](/uniapp/platform-diff)）。

## 命名对照表

| 功能 | uni-app 标签 | 原生微信小程序（目录） | 文档 |
| --- | --- | --- | --- |
| 滚动容器 | `coolui-scroller` | `coolui-scroller/scroller/index` | [文档](/uniapp/components/scroller) |
| 列表项（水波纹） | `coolui-scroller-item` | `coolui-scroller/item/index` | [文档](/uniapp/components/item) |
| 长列表窗口化（推荐） | `coolui-scroller-longlist` | 原生无同名组件（对应 `scroll-page` 的思路） | [文档](/uniapp/components/longlist) |
| 长列表分页（旧方案） | `coolui-scroller-page` | `coolui-scroller/scroll-page/index` | [文档](/uniapp/components/page) |
| 空列表占位 | `coolui-scroller-empty` | `coolui-scroller/empty/index` | [文档](/uniapp/components/empty) |
| 手势提示 | `coolui-scroller-handtip` | `coolui-scroller/handtip/index` | [文档](/uniapp/components/handtip) |
| 加载更多 | `coolui-scroller-loadmore` | `coolui-scroller/loadmore/index` | [文档](/uniapp/components/loadmore) |
| 下拉刷新 | `coolui-scroller-refresh` | `coolui-scroller/refresh/index` | [文档](/uniapp/components/refresh) |
| 下拉视差 | `coolui-scroller-parallax` | `coolui-scroller/parallax/index` | [文档](/uniapp/components/parallax) |
| 分类导航 | `coolui-scroller-nav` | `coolui-scroller/nav/index` | [文档](/uniapp/components/nav) |
| 顶部导航栏 | `coolui-scroller-nav-bar` | `coolui-scroller/nav-bar/index`（原生无独立文档页） | [文档](/uniapp/components/navBar) |
| 切换容器 | `coolui-scroller-nav-pannel` | `coolui-scroller/nav-pannel/index` | [文档](/uniapp/components/navPannel) |
| 搜索框 | `coolui-scroller-search`（属性是 `keyword`） | `coolui-scroller/search/index` | [文档](/uniapp/components/search) |
| 排序筛选 | `coolui-scroller-sort` / `coolui-scroller-sort-item` | `coolui-scroller/sort/index` + `coolui-scroller/sort/item` | [文档](/uniapp/components/sort) |
| 下拉二楼 | `coolui-scroller-second-floor` / `coolui-scroller-second-floor-refresh` | `coolui-scroller/second-floor/index`（+ `second-floor-refresh`） | [文档](/uniapp/components/floor) |
| 回到顶部 | `coolui-scroller-back-to-top` | `coolui-scroller/backToTop/index` | [文档](/uniapp/components/backToTop) |

## 公共约定

- **引入**：配好 [easycom](/uniapp/install#方式一easycom推荐) 后直接写标签，无需 `import`；也可全局注册或页面内局部引入。
- **事件**：原生 `bind:xxx` 在这里写成 `@xxx`；受控属性通过 `@update:propName` 同步，可简写为 `v-model:propName`。
- **插槽**：插槽名与原生一致（`#header`、`#refresh`、`#empty`、`#loadmore`、`#backToTop` 等），保持组件的**嵌套层级**即可，无需额外配置。
- **组件通信**：原生用 `relations` 自动关联父子组件，uni-app 版改为 Vue `provide/inject`，所以层级关系不要打乱。
- **样式**：原生 `externalClasses` 在这里换成 `virtualHost + apply-shared`，页面里覆盖组件内部样式请用 `:deep(...)`。
- **类型**：公共类型集中在 `types.d.ts`，可 `import type { CooluiScrollerProps, CooluiRefreshConfig } from 'coolui-scroller-uni/types'`。

各组件详细属性与示例见左侧「组件」下的独立页面。
