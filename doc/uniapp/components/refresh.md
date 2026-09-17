# Refresh 下拉刷新组件

`<coolui-scroller-refresh>` 提供下拉刷新动画，放在 `coolui-scroller` 的 `refresh` 插槽里。`type` 支持 `default`（小程序原生三个圆点）、`base`、`logoText`、`diy` 四种效果。

> 对应原生微信小程序版：[Refresh 下拉刷新组件](/native/components/refresh)

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #refresh>
      <coolui-scroller-refresh type="default" :config="refreshSetting" />
    </template>

    <view class="item" v-for="(item, index) in list" :key="index">{{ item.title }}</view>
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CooluiRefreshConfig } from 'coolui-scroller-uni/types'

const isEmpty = ref(false)
const list = ref<{ title: string }[]>([])

// 下拉行程(background.height) 大于 refresh 自身高度(height) 时，
// 松手先回落到 height 显示加载动画、刷新完成再整体回弹，也就是「两段回弹」的弹性感
const refreshSetting = ref<CooluiRefreshConfig>({
  style: 'black',       // 圆点深色 / 浅色
  height: 50,           // refresh 自身高度
  background: {
    color: '#f2f2f2',
    height: 120,        // 下拉行程
  },
})

function refresh() {
  // 刷新完成后 resolve()
  return Promise.resolve()
}

function loadmore() {
  // 加载完成后 resolve()
  return Promise.resolve()
}
</script>
```

```vue [选项式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #refresh>
      <coolui-scroller-refresh type="default" :config="refreshSetting" />
    </template>

    <view class="item" v-for="(item, index) in list" :key="index">{{ item.title }}</view>
  </coolui-scroller>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false,
      list: [],
      // 下拉行程(background.height) 大于 refresh 自身高度(height) 时，
      // 松手先回落到 height 显示加载动画、刷新完成再整体回弹，也就是「两段回弹」的弹性感
      refreshSetting: {
        style: 'black',       // 圆点深色 / 浅色
        height: 50,           // refresh 自身高度
        background: {
          color: '#f2f2f2',
          height: 120,        // 下拉行程
        },
      },
    }
  },
  methods: {
    refresh() {
      // 刷新完成后 resolve()
      return Promise.resolve()
    },
    loadmore() {
      // 加载完成后 resolve()
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
| type | 下拉效果：`default`（小程序原生）/ `base` / `logoText` / `diy` | _String_ | `'default'` |
| threshold | 下拉进度 0~1，支持 `v-model:threshold` | _Number_ | `0` |
| isloading | 是否加载中 | _Boolean_ | `false` |
| refreshstate | 刷新状态：`pulldown` / `loosen` / `loading`，支持 `v-model:refreshstate` | _String_ | `'pulldown'` |
| config | 下拉配置（与默认配置深合并） | _Object_ | `{}` |

### config 常用项

| 字段 | 说明 | 默认值 |
| --- | --- | --- |
| height | refresh 自身高度（松手后回落到这里显示加载动画） | `50` |
| background.height | 下拉行程，设得比 `height` 大才有两段回弹的弹性感 | — |
| background.color / img | 下拉背景颜色 / 图片 | — |
| style | 圆点深色 `black` 或浅色 | `'black'` |
| shake | 下拉时是否抖动 | `false` |
| isAutoTriggered | 松手后是否自动回弹（`false` 时需手动调用 `scroller.settriggered(false)` 配合） | `true` |
| text.color / shadow | `base` / `logoText` 类型的文字颜色与阴影 | `{ color: '#000', shadow: 0 }` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:threshold / thresholdChange | 下拉进度变化 | `threshold: number` |
| update:refreshstate / refreshstateChange | 刷新状态变化 | `state: 'pulldown' \| 'loosen' \| 'loading'` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| parallax | 视差区域，配合 [`coolui-scroller-parallax`](/uniapp/components/parallax) 使用（`type="diy"`） |
| 默认 | `diy` 类型的自定义内容 |

## 与原生版的差异

- props 完全一致；动画实现上原生用 `wx.createAnimation`，uni-app 版用 CSS transition；
- 原生 `externalClasses: ['refresh-class']` 换成 `virtualHost + apply-shared`，页面里用 `:deep()` 覆盖样式；
- 新增 `update:threshold` / `update:refreshstate`（可写 `v-model:threshold`），原生的 `thresholdChange` / `refreshstateChange` 依然保留。

## 相关

- [快速开始](/uniapp/quickstart) · [常见问题：下拉没有弹性](/advanced/faq#下拉刷新没有弹性回弹感)
