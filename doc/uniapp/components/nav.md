# Nav 分类导航组件

`<coolui-scroller-nav>` 是分类导航（横向滚动 + 选中态），常放在 `coolui-scroller` 的 `header` 插槽里，与 [`nav-pannel`](/uniapp/components/navPannel) 联动切换内容。

> 对应原生微信小程序版：[Nav 分类导航组件](/native/components/nav)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
    <template #header>
      <coolui-scroller-nav
        :list="navList"
        :type="type"
        :navPerView="navPerView"
        :spaceBetween="spaceBetween"
        :border="border"
        :text="textStyle"
        :background="backgroundStyle"
        v-model:active="active"
        @change="onChange"
      />
    </template>

    <view class="item" v-for="(item, index) in list" :key="index">{{ item.title }}</view>
  </coolui-scroller>
</template>
```

```js
export default {
  data() {
    return {
      navList: [
        { id: 1, title: '分类一' },
        { id: 2, title: '分类二' },
      ],
      type: 'line',          // line | round | plain
      navPerView: 4.5,       // 也可传 'auto'
      spaceBetween: 0,
      border: true,
      active: 0,
      textStyle: { color: '#333333', activeColor: '#d13435' },
      backgroundStyle: { color: '#333333', activeColor: '#d13435' },
    }
  },
  methods: {
    onChange({ id, index }) {
      // 切换分类后同步内容
    },
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 导航数据，每项 `{ id, title }` | _Array_ | `[]` |
| border | 是否显示下边框 | _Boolean_ | `true` |
| text | 文字颜色配置 `{ color, activeColor }` | _Object_ | `{ color: '#333333', activeColor: '#d13435' }` |
| background | 背景配置 `{ color, activeColor }` | _Object_ | `{ color: '#333333', activeColor: '#d13435' }` |
| navPerView | 一屏显示几个（可传 `'auto'` 由内容撑开） | _Number_ / _String_ | `4.5` |
| spaceBetween | 相邻项间距 | _Number_ | `0` |
| type | 展示类型：`line` / `round` / `plain` | _String_ | `'line'` |
| active | 当前选中索引，支持 `v-model:active` | _Number_ | `0` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| change | 选中项变化 | `{ id, index }` |
| update:active | 选中索引变化（配 `v-model:active`） | `index: number` |

## 与原生版的差异

- 属性一致；
- `change` 事件原生只返回 `{ id }`，uni-app 版返回 `{ id, index }`；
- 新增 `update:active`，可直接 `v-model:active` 受控。

## 相关

- [NavPannel 切换组件](/uniapp/components/navPannel) · [示例：下拉组合](/case/case2)
