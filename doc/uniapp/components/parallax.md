# Parallax 下拉视差组件

`<coolui-scroller-parallax>` 让元素随下拉产生位移，**必须放在 `coolui-scroller-refresh` 的 `parallax` 插槽里**（配合 `type="diy"`），它自己会从 refresh 拿到下拉进度。

> 对应原生微信小程序版：[Parallax 下拉视差组件](/native/components/parallax)

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #refresh>
      <coolui-scroller-refresh type="diy" :config="parallaxSetting">
        <template #parallax>
          <coolui-scroller-parallax class="parallax-item parallax-item1" direction="to top" :parallax="35">
            从下往上
          </coolui-scroller-parallax>
          <coolui-scroller-parallax class="parallax-item parallax-item2" direction="to bottom" :parallax="35">
            从上往下
          </coolui-scroller-parallax>
        </template>
      </coolui-scroller-refresh>
    </template>

    <view class="item" v-for="(item, index) in list" :key="index">{{ item.title }}</view>
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isEmpty = ref(false)
const list = ref<{ title: string }[]>([])
const parallaxSetting = ref({
  height: 100,
  background: { color: '#f2f2f2', height: 150 },
})

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
    <template #refresh>
      <coolui-scroller-refresh type="diy" :config="parallaxSetting">
        <template #parallax>
          <coolui-scroller-parallax class="parallax-item parallax-item1" direction="to top" :parallax="35">
            从下往上
          </coolui-scroller-parallax>
          <coolui-scroller-parallax class="parallax-item parallax-item2" direction="to bottom" :parallax="35">
            从上往下
          </coolui-scroller-parallax>
        </template>
      </coolui-scroller-refresh>
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
      parallaxSetting: {
        height: 100,
        background: { color: '#f2f2f2', height: 150 },
      },
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
| parallax | 视差系数，值越大位移越明显 | _Number_ | `0` |
| direction | 位移方向：`to top` / `to bottom` / `to left` / `to right` | _String_ | `'to bottom'` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| 默认 | 需要产生视差的内容 |

## 与原生版的差异

- props 完全一致；
- 原生通过 `relations` 从 refresh 组件读取 `threshold` 与 `config`，uni-app 版改为 `inject('cooluiRefresh')`，因此**必须放在 refresh 的 `parallax` 插槽内**，层级不要打乱；
- 原生 `externalClasses: ['parallax-class']` 已移除，页面里用 `:deep()` 覆盖样式。

## 相关

- [Refresh 下拉刷新组件](/uniapp/components/refresh) · [示例：有趣的下拉](/case/case)
