# BackToTop 回到顶部组件

## 介绍

当列表滚动到设置的阈值位置时，显示该组件，点击该组件列表回到顶部,
配合 scroller 组件写在 backToTop 插槽中

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "backtotop": "coolui-scroller/backToTop/index"
}
```

## 代码演示

```html
<scroller class="my-scroller">
  <backtotop
    slot="backToTop"
    my-class="backToTop"
    delay="{{3000}}"
    threshold="{{100}}"
  />
</scroller>
```

## 配置

| 参数      | 说明                                               | 类型     | 默认值 | 版本  |
| --------- | -------------------------------------------------- | -------- | ------ | ----- |
| delay     | 设置滚动停止后多久隐藏，设置为 0 时不隐藏          | _String_ | `3000` | 3.3.4 |
| threshold | 阈值，当滚动距离超出这个值时显示，低于这个值时隐藏 | _String_ | `100`  | 3.3.4 |

## 外部样式

在组件外部修改组件里的元素样式，可做局部调整。

| 名称     | 说明                                        | 类型     | 版本  |
| -------- | ------------------------------------------- | -------- | ----- |
| my-class | 设置按钮的 class，样式需要 important 冲突掉 | _String_ | 3.3.4 |
