# BackToTop 回到顶部组件

`<coolui-scroller-back-to-top>` 是回到顶部按钮，放在 `coolui-scroller` 的 `backToTop` 插槽里；滚动超过阈值后显示，一段时间无操作自动隐藏。

> 对应原生微信小程序版：[BackToTop 回到顶部组件](/native/components/backToTop)

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-item v-for="(item, index) in list" :key="index">
      <view class="item">{{ item.title }}</view>
    </coolui-scroller-item>

    <template #backToTop>
      <coolui-scroller-back-to-top :delay="3000" :threshold="100" />
    </template>
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isEmpty = ref(false)
const list = ref<{ title: string }[]>([])

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
    <coolui-scroller-item v-for="(item, index) in list" :key="index">
      <view class="item">{{ item.title }}</view>
    </coolui-scroller-item>

    <template #backToTop>
      <coolui-scroller-back-to-top :delay="3000" :threshold="100" />
    </template>
  </coolui-scroller>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false,
      list: [],
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
| delay | 显示后自动隐藏的延时（ms），`0` 表示不自动隐藏 | _Number_ | `3000` |
| threshold | 滚动超过该距离后显示按钮 | _Number_ | `100` |

## 实例方法

通过 `ref` 获取组件实例后调用：

| 方法 | 说明 |
| --- | --- |
| backToTop() | 手动回到顶部 |

## 与原生版的差异

- 属性一致；
- 原生 `externalClasses: ['my-class']` 已移除，页面里用 `:deep()` 覆盖样式。

## 相关

- [Scroller 滚动容器](/uniapp/components/scroller)
