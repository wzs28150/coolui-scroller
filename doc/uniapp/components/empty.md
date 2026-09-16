# Empty 空列表组件

`<coolui-scroller-empty>` 提供空数据时的占位内容，放在 `coolui-scroller` 的 `empty` 插槽里，`isEmpty` 为 `true` 时显示。

> 对应原生微信小程序版：[Empty 空列表组件](/native/components/empty)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #empty>
      <coolui-scroller-empty
        class="empty"
        :emptyText="emptySetting.text"
        :emptyImg="emptySetting.img"
      />
    </template>
  </coolui-scroller>
</template>
```

```js
export default {
  data() {
    return {
      isEmpty: false,
      emptySetting: {
        img: '/static/empty.png',
        text: '暂无内容',
      },
    }
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| emptyImg | 空列表图片地址 | _String_ | `''` |
| emptyText | 空列表文字 | _String_ | `'暂无内容'` |

## 与原生版的差异

原生侧用外部样式类 `img-class` / `text-class` 定制图片与文字样式；uni-app 版没有外部样式类，页面里用 `:deep()` 覆盖组件内部类名即可：

```scss
.empty {
  :deep(.empty-img) {
    width: 240rpx;
  }
  :deep(.empty-text) {
    color: #999;
  }
}
```

## 相关

- [Scroller 滚动容器](/uniapp/components/scroller) · [Loadmore 加载更多组件](/uniapp/components/loadmore)
