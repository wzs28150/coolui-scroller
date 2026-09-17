# Page 长列表分页（旧方案）

`<coolui-scroller-page>` 是长列表分页的旧方案：**按页整页占位**，未渲染的页用等高占位块撑起高度，减少同时存在的节点数。

> 新项目建议使用 [Longlist 长列表窗口化](/uniapp/components/longlist)（窗口外折叠为上下占位块，节点数与总页数无关）。

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-page
      v-for="(pageItems, pageIndex) in list"
      :key="pageIndex"
      :pageList="pageItems"
    >
      <coolui-scroller-item v-for="(item, index) in pageItems" :key="index" ripple>
        <view class="item">{{ item.title }}</view>
      </coolui-scroller-item>
    </coolui-scroller-page>
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isEmpty = ref(false)
// 二维数组：list[pageIndex] 是该页的 item 数组
const list = ref<{ title: string }[][]>([])

function refresh() {
  return Promise.resolve()
}

function loadmore() {
  return Promise.resolve()
}
</script>
```

```vue [选项式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-page
      v-for="(pageItems, pageIndex) in list"
      :key="pageIndex"
      :pageList="pageItems"
    >
      <coolui-scroller-item v-for="(item, index) in pageItems" :key="index" ripple>
        <view class="item">{{ item.title }}</view>
      </coolui-scroller-item>
    </coolui-scroller-page>
  </coolui-scroller>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false,
      list: [], // 二维数组：list[pageIndex] 是该页的 item 数组
    }
  },
  methods: {
    refresh() {
      return Promise.resolve()
    },
    loadmore() {
      return Promise.resolve()
    },
  },
}
</script>
```

::::

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pageList | 当前页的数据；只给了 `height` 时渲染为占位块 | _Array_ | `[]` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| 默认 | 单页内容（一般放若干 `coolui-scroller-item`） |

## 与原生版的差异

- 属性与原生 `scroll-page` 的 `pageList` 一致；
- 原生侧需要额外引入组件提供的方法来计算每页高度（见[原生长列表文档](/native/components/page#代码演示)），uni-app 版由 [Longlist](/uniapp/components/longlist) 承担窗口计算，**优先用 Longlist**。

## 相关

- [Longlist 长列表窗口化（推荐）](/uniapp/components/longlist)
