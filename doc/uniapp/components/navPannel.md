# NavPannel 切换组件

`<coolui-scroller-nav-pannel>` 是内容切换容器：默认插槽里放多个 `coolui-scroller`，通过 `active` 切换显示哪一个，常与[分类导航](/uniapp/components/nav)配合。

> 对应原生微信小程序版：[NavPannel 切换组件](/native/components/navPannel)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller-nav-pannel :active="active" :animation="animation">
    <coolui-scroller class="scroller0" background="#f2f2f2" @contentHeight="getHeight">
      <template #refresh>
        <coolui-scroller-refresh type="logoText" :config="logoConfig" />
      </template>
      <view class="pannel">第一屏内容</view>
    </coolui-scroller>

    <coolui-scroller class="scroller1" background="#f2f2f2" @contentHeight="getHeight">
      <view class="pannel">第二屏内容</view>
    </coolui-scroller>
  </coolui-scroller-nav-pannel>
</template>
```

```js
export default {
  data() {
    return {
      active: 0,        // 当前显示第几屏，由 nav 的 change 事件同步
      animation: true,  // 是否开启切换动画
    }
  },
  methods: {
    getHeight(height) {
      // 各屏内容高度，用于撑开容器
    },
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 当前显示第几屏 | _Number_ | `0` |
| animation | 切换是否带过渡动画 | _Boolean_ | `false` |
| type | 切换方式：`side`（左右滑动）/ `fade`（淡入淡出） | _String_ | `'side'` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| 默认 | 多个 `coolui-scroller`，顺序与 `active` 对应 |

## 与原生版的差异

- 属性一致；
- 实现方式不同：原生通过 `relations` 统计子 `scroller` 的数量与宽高来定位，uni-app 版改为纯 CSS（`transform: translateX(-100% * active)`），因此**子 scroller 必须是直接子节点**，中间不要再包一层。

## 相关

- [Nav 分类导航组件](/uniapp/components/nav) · [Scroller 滚动容器](/uniapp/components/scroller)
