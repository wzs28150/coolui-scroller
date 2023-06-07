# item 列表项组件

## 介绍

包裹列表循环项的结构组件

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "item": "coolui-scroller/item/index"
}
```

## 代码演示

```html
<scroller>
  <item
    ripple
    wx:for="{{ list }}"
    wx:for-index="index"
    wx:for-item="listItem"
    wx:key="index"
  >
    <view class="item">
      <view class="title">{{index}}.{{listItem.title}}</view>
    </view>
  </item>
</scroller>
```

## 配置

| 参数   | 说明                                                                | 类型      | 默认值  | 版本  |
| ------ | ------------------------------------------------------------------- | --------- | ------- | ----- |
| ripple | 设置点击是否显示波纹效果，可设置`true`或`false`。设置为`true`时开启 | _Boolean_ | `false` | 3.0.4 |
