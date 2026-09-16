# Loadmore 加载更多组件

`<coolui-scroller-loadmore>` 展示上拉加载的状态与文案，放在 `coolui-scroller` 的 `loadmore` 插槽里。

> 对应原生微信小程序版：[Loadmore 加载更多组件](/native/components/loadmore)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <coolui-scroller-item v-for="(item, index) in list" :key="index">
      <view class="item">{{ item.title }}</view>
    </coolui-scroller-item>

    <template #loadmore>
      <coolui-scroller-loadmore
        :status="loadMoreSetting.status"
        :loading="loadMoreSetting.loading"
        :more="loadMoreSetting.more"
        :noMore="loadMoreSetting.noMore"
      />
    </template>
  </coolui-scroller>
</template>
```

```js
export default {
  data() {
    return {
      loadMoreSetting: {
        status: 'more', // more | loading | noMore
        loading: { text: '加载中', color: '#999999' },
        more: { text: '查看更多', color: '#333333' },
        noMore: { text: '没有更多', color: '#999999' },
      },
    }
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| status | 当前状态：`more` / `loading` / `noMore` | _String_ | `'more'` |
| loading | 加载中状态的文字与颜色 | _Object_ | `{ text: '加载中', color: '#999999' }` |
| more | 可上拉状态的文字与颜色 | _Object_ | `{ text: '查看更多', color: '#333333' }` |
| noMore | 没有更多状态的文字与颜色 | _Object_ | `{ text: '没有更多', color: '#999999' }` |
| color | 兼容字段 | _String_ | `'#999999'` |
| shake | 兼容字段 | _Boolean_ | `false` |

## 与原生版的差异

- 原生还有一个 `noMoreTextStyle` 属性，**uni-app 版已移除**，直接用 `noMore.text` / `noMore.color` 即可；
- 其余属性完全一致。

## 相关

- [Scroller 滚动容器](/uniapp/components/scroller) · [Empty 空列表组件](/uniapp/components/empty)
