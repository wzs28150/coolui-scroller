# Item 列表项组件

`<coolui-scroller-item>` 是列表项容器，自带点击水波纹。

> 对应原生微信小程序版：[Item 列表项组件](/native/components/item)

## 代码演示

:::: code-group

```vue [组合式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-item v-for="(item, index) in list" :id="'item' + index" :key="index" ripple>
      <view class="item">
        <image class="item-image" lazy-load :src="item.img" />
        <view class="item-title">{{ index }}.{{ item.title }}</view>
      </view>
    </coolui-scroller-item>
  </coolui-scroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isEmpty = ref(false)
const list = ref<{ title: string; img: string }[]>([])

function refresh() {
  return Promise.resolve()
}

function loadmore() {
  return Promise.resolve()
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .item-image {
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
  }

  .item-title {
    flex: 1;
    font-size: 30rpx;
  }
}
</style>
```

```vue [选项式 API]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-item v-for="(item, index) in list" :id="'item' + index" :key="index" ripple>
      <view class="item">
        <image class="item-image" lazy-load :src="item.img" />
        <view class="item-title">{{ index }}.{{ item.title }}</view>
      </view>
    </coolui-scroller-item>
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

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .item-image {
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
  }

  .item-title {
    flex: 1;
    font-size: 30rpx;
  }
}
</style>
```

::::

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| ripple | 点击是否开启水波纹 | _Boolean_ | `false` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| 默认 | 列表项内容 |

## 与原生版的差异

- 属性一致（只有 `ripple`）；
- 水波纹动画名由 `ripple` 改为 `coolui-ripple`，如果页面里自定义过动画名需要注意。

## 相关

- [Scroller 滚动容器](/uniapp/components/scroller) · [Longlist 长列表窗口化](/uniapp/components/longlist)
