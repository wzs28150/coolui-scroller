# parallax 下拉视差组件

## 简介

置于下拉刷新组件的插槽中，配合下拉刷新组件使用。实现上下左右的位移视差效果。

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "parallax": "coolui-scroller/parallax/index"
}
```

## 代码演示

具体实现请查看[下拉组件](./refresh.md#视差效果)

```html
<scroller class="my-scroller">
  <refresh slot="refresh" type="default" config="">
    <parallax
      parallax-class="parallax-item parallax-item1"
      slot="parallax"
      direction="to top"
      parallax="{{35}}"
    >
      从下往上
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item2"
      slot="parallax"
      direction="to bottom"
      parallax="{{35}}"
    >
      从上往下
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item4"
      slot="parallax"
      direction="to right"
      parallax="{{50}}"
    >
      从左往右
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item3"
      slot="parallax"
      direction="to left"
      parallax="{{50}}"
    >
      从右往左
    </parallax>
  </refresh>
</scroller>
```

## 配置

| 参数      | 说明                                                                                                                                                                                                 | 类型     | 默认值 | 版本  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ----- |
| direction | 设置移动方向，可设置`to top`、`to bottom`、`to right`、`to left`。如设置`to top`则该组件由下往上移动、`to bottom`则该组件由上往下移动、`to right`则该组件由左往右移动、`to left`则该组件由右往左移动 | _String_ | 无     | 3.0.0 |
| parallax  | 设置移动偏移量百分比。如设置了值为`10`则该组件实际移动距离为：下拉高度`height`的`10%`                                                                                                                | _Number_ | 无     | 3.0.0 |

## 外部样式

在组件外部修改组件里的元素样式，可做局部调整。

| 名称           | 说明         | 类型     | 版本  |
| -------------- | ------------ | -------- | ----- |
| parallax-class | 设置组件样式 | _String_ | 3.0.0 |
