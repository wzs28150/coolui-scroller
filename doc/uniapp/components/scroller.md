# Scroller 滚动容器

`<coolui-scroller>` 是列表能力的底座：下拉刷新 / 上拉加载 / 空列表 / 回到顶部都通过它的插槽接入。

> 对应原生微信小程序版：[Scroller 滚动组件](/native/components/scroller)；写法差异见[与原生微信小程序版的差异](/uniapp/platform-diff)。

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller
    :isEmpty="isEmpty"
    background="#f2f2f2"
    @refresh="refresh"
    @loadmore="loadmore"
  >
    <!-- 下拉刷新 -->
    <template #refresh>
      <coolui-scroller-refresh type="default" :config="refreshSetting" />
    </template>

    <!-- 列表内容 -->
    <coolui-scroller-item v-for="(item, index) in list" :key="index">
      <view class="item">{{ item.title }}</view>
    </coolui-scroller-item>

    <!-- 空列表 -->
    <template #empty>
      <coolui-scroller-empty emptyImg="/static/empty.png" emptyText="暂无内容" />
    </template>

    <!-- 加载更多 -->
    <template #loadmore>
      <coolui-scroller-loadmore :status="status" />
    </template>
  </coolui-scroller>
</template>
```

```js
export default {
  data() {
    return {
      isEmpty: false,
      list: [],
      status: 'more',
      refreshSetting: { height: 50, background: { color: '#f2f2f2', height: 120 } },
    }
  },
  methods: {
    // @refresh / @loadmore 需要返回 promise，返回前不要 resolve，否则动画会提前收起
    refresh() {
      return this.getList(1)
    },
    loadmore() {
      return this.getList(this.page + 1)
    },
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isEmpty | 数据为空态，渲染 `empty` 插槽 | _Boolean_ | `false` |
| background | 背景色（保留字段，组件内部未使用，与原生一致） | _String_ | `#f2f2f2` |
| isBackBtn | 兼容字段，回到顶部按钮的显隐实际由 back-to-top 组件注册决定 | _Boolean_ | `false` |
| enableFlex | 透传给 `scroll-view` 的 `enable-flex` | _Boolean_ | `false` |
| toView | 滚动到指定元素 id（`scroll-into-view`） | _String_ | `''` |
| top | 滚动位置，支持 `v-model:top` | _Number_ | `0` |
| animation | 滚动是否带过渡动画 | _Boolean_ | `true` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| refresh | 下拉刷新触发 | — |
| loadmore | 上拉触底触发 | — |
| restore | 刷新流程结束（回弹完成） | — |
| contentHeight | 内容高度变化 | `height: number` |
| update:top | 滚动位置变化（配 `v-model:top`） | `top: number` |
| scroll | 滚动中，常用于长列表 | `event`（原始滚动事件对象） |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| header | 列表顶部（不参与滚动区域） |
| refresh | 下拉刷新组件位置 |
| 默认 | 列表内容 |
| empty | 空列表内容，`isEmpty` 为 true 时显示 |
| loadmore | 加载更多位置 |
| backToTop | 回到顶部按钮位置 |

## 与原生版的差异

- 组件通信由原生 `relations` 改为 `provide/inject`，**父子层级不要打乱**；
- 新增 `v-model:top`（`update:top` 事件），原生没有；
- `scroll` 事件透传原始滚动事件对象，原生只透出 `{ scrollTop }`。

## 相关

- [Refresh 下拉刷新组件](/uniapp/components/refresh) · [Loadmore 加载更多组件](/uniapp/components/loadmore) · [Empty 空列表组件](/uniapp/components/empty)
- [快速开始](/uniapp/quickstart)：最小可运行示例
