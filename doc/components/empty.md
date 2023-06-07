# Empty 空列表组件

## 介绍

当列表请求后台返回数据为空时，列表没有内容就会空白，使用该组件。可提示用户列表内容为空，增加用户体验。

组件可设置一张图标图片与提示文字：

<img src="/images/empty.jpg" alt="示例图" />

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "empty": "coolui-scroller/empty/index"
}
```

## 代码演示

```html
<scroller class="my-scroller">
  <empty
    slot="empty"
    img-class="empty-img"
    text-class="empty-text"
    emptyText="暂无文章"
    emptyImg="https://test.wzs.pub/pic/empty.png"
  />
</scroller>
```

## 配置

| 参数      | 说明     | 类型     | 默认值     | 版本  |
| --------- | -------- | -------- | ---------- | ----- |
| emptyText | 提示文字 | _String_ | `暂无内容` | 3.0.0 |
| emptyImg  | 提示图片 | _String_ | 无         | 3.0.0 |

## 外部样式

在组件外部修改组件里的元素样式，可做局部调整。

| 名称       | 说明             | 类型     | 版本  |
| ---------- | ---------------- | -------- | ----- |
| img-class  | 设置图片的 class | _String_ | 3.0.0 |
| text-class | 设置文字的 class | _String_ | 3.0.0 |
