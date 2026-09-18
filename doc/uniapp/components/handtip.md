# Handtip 手势提示组件

`<coolui-scroller-handtip>` 用于第一次进入时提示用户「下拉刷新 / 上拉加载」等手势，看过一次后不再出现（用 `storageKey` 记录）。

> 对应原生微信小程序版：[Handtip 手势提示组件](/native/components/handtip)

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-handtip
      top="下拉刷新"
      bottom="上拉加载"
      left="侧滑切换"
      right="侧滑切换"
      :opacity="0.7"
      storageKey="hand2"
      @close="onClose"
    />
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isEmpty = ref(false)

function onClose() {
  // 提示关闭
}

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
    <coolui-scroller-handtip
      top="下拉刷新"
      bottom="上拉加载"
      left="侧滑切换"
      right="侧滑切换"
      :opacity="0.7"
      storageKey="hand2"
      @close="onClose"
    />
  </coolui-scroller>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false,
    }
  },
  methods: {
    onClose() {
      // 提示关闭
    },
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
| top | 顶部提示文字 | _String_ | `''` |
| bottom | 底部提示文字 | _String_ | `''` |
| left | 左侧提示文字 | _String_ | `''` |
| right | 右侧提示文字 | _String_ | `''` |
| storageKey | 记录"已提示过"的 storage key，换 key 可让提示重新出现 | _String_ | `'isTipShow'` |
| opacity | 遮罩透明度 | _Number_ | `0.5` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| close | 提示关闭时触发 | — |

## 与原生版的差异

- **属性改名**：原生用 `key`（Vue 中的保留字），uni-app 版改为 **`storageKey`**，默认值同为 `'isTipShow'`；
- 新增 `close` 事件（原生没有）；
- `top` / `bottom` / `left` / `right` 原生默认 `0`，uni-app 版默认 `''`（不显示对应方向的文字）；
- **H5 端自动避开内置导航栏**：遮罩是 `position: fixed`，而 H5 的内置导航栏（`--window-top`，默认 44px）算在页面视口里，组件内部已按它做了上下偏移，顶部的关闭按钮与「下拉刷新」提示不会被导航栏压住。小程序 / App 端导航栏在页面外，样式不变；`navigationStyle: custom` 的页面 `--window-top` 为 0，等价于不偏移。
