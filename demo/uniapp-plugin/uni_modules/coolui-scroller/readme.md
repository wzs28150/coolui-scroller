# coolui-scroller 下拉刷新上拉加载

专注小程序**下拉刷新 / 上拉加载 / 长列表**的组件库（uni-app 版），一套代码编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序以及 H5、App。

当前版本：`1.0.2`

## 特性

- **下拉刷新**：内置小程序原生三点效果，另有基础箭头、LOGO 文字、完全自定义四种模式
- **上拉加载**：`more` / `loading` / `noMore` 三态，文案与颜色可配
- **长列表**：窗口化渲染，只渲染可视窗口内的页，渲染节点数与总页数无关
- **配套组件**：空态、回到顶部、分类导航、搜索、排序筛选、下拉二楼、手势提示
- **组合式用法**：以 `<coolui-scroller>` 为容器，其余能力通过具名插槽自由装配

## 引入

本插件符合 uni_modules 规范，且组件目录符合 easycom 默认规则，**导入后无需任何配置**，直接在模板里写标签即可：

```vue
<coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
  <template #refresh>
    <coolui-scroller-refresh :config="{ height: 50, background: { height: 120 } }" />
  </template>

  <coolui-scroller-item v-for="item in list" :key="item.id">{{ item.title }}</coolui-scroller-item>

  <template #loadmore>
    <coolui-scroller-loadmore :status="loadStatus" />
  </template>
</coolui-scroller>
```

页面的 `pages.json` 中需要打开 `disableScroll`，避免页面级下拉与组件下拉冲突：

```json
{
  "path": "pages/index/index",
  "style": { "disableScroll": true }
}
```

> 也可以不用 uni_modules，直接安装 npm 包：`npm i coolui-scroller-uni`（[文档](https://wzs28150.github.io/coolui-scroller/v4/uniapp/install)）。

## 快速开始

```vue
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

```js
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
```

```css
.page {
  height: 100%;
}
```

## 组件清单

| 组件标签 | 说明 |
| --- | --- |
| `coolui-scroller` | 滚动容器（下拉刷新 / 上拉加载 / 空态 / 回到顶部插槽） |
| `coolui-scroller-back-to-top` | 回到顶部悬浮按钮 |
| `coolui-scroller-empty` | 空列表占位 |
| `coolui-scroller-handtip` | 首次进入的手势提示 |
| `coolui-scroller-item` | 列表项（带点击水波纹） |
| `coolui-scroller-loadmore` | 加载更多（more / loading / noMore 三态） |
| `coolui-scroller-longlist` | 长列表窗口化容器（推荐，节点数与总页数无关） |
| `coolui-scroller-nav` | 分类导航 |
| `coolui-scroller-nav-bar` | 顶部导航栏 |
| `coolui-scroller-nav-pannel` | 导航与内容联动切换容器 |
| `coolui-scroller-page` | 长列表分页（旧方案：整页占位） |
| `coolui-scroller-parallax` | 下拉视差位移 |
| `coolui-scroller-refresh` | 下拉刷新动画（原生三点 / 基础 / LOGO 文字 / 完全自定义） |
| `coolui-scroller-search` | 搜索框 |
| `coolui-scroller-second-floor` | 下拉二楼 |
| `coolui-scroller-second-floor-refresh` | 下拉二楼的刷新与回弹（配合 second-floor 使用） |
| `coolui-scroller-sort` | 排序 / 分类筛选 |
| `coolui-scroller-sort-item` | 排序 / 筛选的单项（配合 sort 使用） |

插槽名与原生微信小程序版一致：`#header`、`#refresh`、`#loadmore`、`#empty`、`#backToTop`，默认插槽放列表内容。保持组件的嵌套层级（如 `coolui-scroller` → `coolui-scroller-refresh`）即可，组件间通信由 `provide/inject` 自动完成。

## 组件 API

完整属性、事件、插槽、配置项与各端差异见文档站：

- [安装与引入](https://wzs28150.github.io/coolui-scroller/v4/uniapp/install)
- [全部组件 API（单文件全文，也适合交给 AI 助手）](https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt)

## 相关链接

- 文档站：<https://wzs28150.github.io/coolui-scroller/v4/>
- 仓库：<https://github.com/wzs28150/coolui-scroller>
- npm：<https://www.npmjs.com/package/coolui-scroller-uni>
- 编辑器插件（WXML / Vue 补全与悬停文档）：<https://wzs28150.github.io/coolui-scroller/v4/advanced/plugin>
