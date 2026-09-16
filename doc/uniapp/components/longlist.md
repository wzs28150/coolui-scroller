# Longlist 长列表窗口化（推荐）

`<coolui-scroller-longlist>` 是 uni-app 版**新增**的长列表容器（原生侧没有同名组件）：窗口外的内容折叠为上下占位块，**渲染的节点数与总页数无关**，数据量大时比整页占位更稳。

> 新项目建议用它；旧方案见 [Page 长列表分页](/uniapp/components/page)。

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller
    :isEmpty="isEmpty"
    background="#f2f2f2"
    @refresh="refresh"
    @loadmore="loadmore"
    @scroll="onScroll"
  >
    <template #refresh>
      <coolui-scroller-refresh type="default" :config="refreshSetting" />
    </template>

    <coolui-scroller-longlist :pages="list" :scroll-top="scrollTop">
      <template #page="{ items, pageIndex }">
        <coolui-scroller-item v-for="(item, index) in items" :key="index">
          <view class="item">{{ pageIndex }} - {{ item.title }}</view>
        </coolui-scroller-item>
      </template>
    </coolui-scroller-longlist>
  </coolui-scroller>
</template>
```

```js
export default {
  data() {
    return {
      list: [],      // 二维数组：pages[pageIndex] 是该页的 item 数组
      scrollTop: 0,
    }
  },
  methods: {
    // 把 scroller 的滚动距离透传进来，组件据此判断窗口位置
    onScroll(e) {
      this.scrollTop = e.detail.scrollTop
    },
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pages | 分页数据，`pages[pageIndex]` 为该页的 item 数组 | _Array_ | `[]` |
| heights | 初始页高缓存（已测量过的页高，避免首次渲染跳动） | _Array_ | `[]` |
| scrollTop | 当前滚动距离，由 `scroller` 的 `@scroll` 透传 | _Number_ | `0` |
| overscan | 窗口前后各多渲染几页 | _Number_ | `1` |
| estimateHeight | 未测量页的估算高度（`0` 时取已测量页的均值，兜底 300） | _Number_ | `0` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| page | **作用域插槽**，参数 `{ items, pageIndex }`，渲染单页内容 |

## 使用要点

1. `pages` 是**二维数组**（页 → items），不是扁平列表；
2. 必须把 `coolui-scroller` 的 `@scroll` 传给 `scroll-top`，否则无法判断窗口；
3. 每页内容高度尽量一致，`estimateHeight` 与实际差得越多，滚动条长度就越不准；
4. 与滚动容器嵌套层级保持不变即可，组件之间通过 `provide/inject` 通信。

## 相关

- [Page 长列表分页（旧方案）](/uniapp/components/page)
- [原生微信小程序版的长列表](/native/components/page)：`scroll-page` 按页整页占位
