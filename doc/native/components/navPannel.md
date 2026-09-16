# nav-pannel 切换组件

## 介绍

该组件为解决多列表之间相互切换的组件。组件可设置第几个列表显示及是否开启动画。页面多个列表时想要判断只显示一个,如果用 wx:if 判断则切换后会丢失列表滚动的状态,比如我已经将列表滚动到了中间部分,切换后再回来就会重新加载,使用改组件可解决问题。

## 注意

1. nav-pannel 下只能有 scroller
2. nav-pannel 自身或父级元素需设置高度,组件本身 height: 100%

<img src="/images/navpannel1.gif" style="max-width:375px;" alt="示例图一" />

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "nav-pannel": "coolui-scroller/nav-pannel/index",
}
```

## 代码演示

1. 排序

可设置 animation 增加切换动画

::: code-group

```html [index.wxml]
<view class="pannel-inner" style="height:100vh">
  <nav-pannel active="{{active}}" animation="{{animation}}">
    <scroller class="scroller0" background="#f2f2f2">
      <!-- 滚动内容 -->
    </scroller>
    <scroller class="scroller1" background="#f2f2f2">
      <!-- 滚动内容 -->
    </scroller>
  </nav-pannel>
</view>
```

```js [index.js]
Page({
  data: {
    active: 0,
    animation: false,
  },
})
```

:::

## 配置

| 参数      | 说明                       | 类型      | 默认值  | 版本  |
| --------- | -------------------------- | --------- | ------- | ----- |
| active    | 设置第几个 scroller 显示   | _Number_  | `0`     | 3.2.7 |
| animation | 设置切换时是否使用过渡动画 | _Boolean_ | `false` | 3.2.7 |

## 插槽

| 名称    | 说明           | 配合组件 |
| ------- | -------------- | -------- |
| default | 自定义下拉插槽 | scroller |
