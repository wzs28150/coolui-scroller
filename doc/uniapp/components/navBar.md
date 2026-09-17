# NavBar 顶部导航栏

`<coolui-scroller-nav-bar>` 是自定义顶部导航栏，配合[下拉二楼](/uniapp/components/floor)使用（放在 `second-floor` 的 `nav-bar` 插槽里），也可单独用于自定义导航栏页面。

> 原生侧同样有 `coolui-scroller/nav-bar/index` 组件，但暂时没有独立文档页。

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller-second-floor ref="mySecondFloor" :threshold="val" @refresh="onRefresh">
    <template #nav-bar>
      <coolui-scroller-nav-bar :config="navBarConfig">下拉二楼</coolui-scroller-nav-bar>
    </template>

    <view class="demopage">页面内容</view>
  </coolui-scroller-second-floor>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref(0) // 下拉进度 0~1
const navBarConfig = ref({
  back: { show: true },                  // 是否显示返回按钮
  background: { color: '#ffffff' },      // 背景色
  text: { color: '#000000', shadow: 0 }, // 文字颜色与阴影
})

function onRefresh() {
  // 二楼下拉刷新
}
</script>
```

```vue [选项式 API]
<template>
  <coolui-scroller-second-floor ref="mySecondFloor" :threshold="val" @refresh="onRefresh">
    <template #nav-bar>
      <coolui-scroller-nav-bar :config="navBarConfig">下拉二楼</coolui-scroller-nav-bar>
    </template>

    <view class="demopage">页面内容</view>
  </coolui-scroller-second-floor>
</template>

<script>
export default {
  data() {
    return {
      val: 0, // 下拉进度 0~1
      navBarConfig: {
        back: { show: true },                  // 是否显示返回按钮
        background: { color: '#ffffff' },      // 背景色
        text: { color: '#000000', shadow: 0 }, // 文字颜色与阴影
      },
    }
  },
  methods: {
    onRefresh() {
      // 二楼下拉刷新
    },
  },
}
</script>
```

::::

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 导航栏类型 | _String_ | `'default'` |
| config | 导航栏配置（`back` / `background` / `text`） | _Object_ | `{}`（内部默认见下） |

`config` 默认值：`{ back: { show: true }, background: { color: '#fff' }, text: { color: '#000', shadow: 0 } }`

## 插槽

| 插槽 | 说明 |
| --- | --- |
| 默认 | 导航栏标题内容 |

## 与原生版的差异

- 属性一致；
- 原生 `externalClasses: ['nav-bar-class']` 已移除，页面里用 `:deep()` 覆盖样式。

## 相关

- [SecondFloor 下拉二楼组件](/uniapp/components/floor)
