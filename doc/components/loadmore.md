# loadmore 加载更多组件

## 介绍

该组件为上拉加载时的效果组件。组件分为 3 种状态效果：

1. 等待执行加载时 more 状态
2. 加载中的 loading 状态
3. 加载到最后无数据时的 noMore 状态

<img :src="'/images/loadmore.jpg'" alt="示例图" />

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "loadmore": "coolui-scroller/loadmore/index"
}
```

## 代码演示

::: code-group

```html [index.wxml]
<scroller class="my-scroller">
  <loadmore
    slot="loadmore"
    status="{{loadMoreSetting.status}}"
    loading="{{loadMoreSetting.loading}}"
    noMore="{{loadMoreSetting.noMore}}"
    more="{{loadMoreSetting.more}}"
  />
</scroller>
```

```js [index.js]
Page({
  data: {
    loadMoreSetting: {
      status: 'more',
      more: {
        text: '上拉加载更多',
        color: '#999',
      },
      loading: {
        text: '加载中...',
        color: '#999',
      },
      noMore: {
        text: '-- 到底啦 --',
        color: '#999',
      },
    },
  },
})
```

:::

## 配置

| 参数            | 说明                                                                           | 类型     | 默认值                                      | 版本        |
| --------------- | ------------------------------------------------------------------------------ | -------- | ------------------------------------------- | ----------- |
| status          | 显示状态设置，可设置`more`、`loading`、`noMore`,需根据列表数据加载情况切换状态 | _String_ | `more`                                      | 3.0.0       |
| ~~moreText~~    | 显示状态为`more`时显示的文字                                                   | _String_ | `上拉加载更多`                              | 3.0.0~3.0.9 |
| ~~loadingText~~ | 显示状态为`loading`时显示的文字                                                | _String_ | `加载中...`                                 | 3.0.0~3.0.9 |
| ~~noMoreText~~  | 显示状态为`noMore`时显示的文字                                                 | _String_ | `-- 到底啦 --`                              | 3.0.0~3.0.9 |
| ~~color~~       | 设置文字颜色                                                                   | _String_ | `#999999`                                   | 3.0.0~3.0.9 |
| more            | 显示状态为`more`时显示的文字                                                   | _Object_ | `{ text: '上拉加载更多', color: '#333333'}` | 3.1.0       |
| loading         | 显示状态为`loading`时显示的文字                                                | _Object_ | `{ text: '加载中...', color: '#999999'}`    | 3.1.0       |
| noMore          | 显示状态为`noMore`时显示的文字                                                 | _Object_ | `{ text: '-- 到底啦 --', color: '#999999'}` | 3.1.0       |
