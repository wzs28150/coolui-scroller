# Search 搜索组件

`<coolui-scroller-search>` 是搜索框，支持输入、清空、右侧按钮与自定义左侧插槽，常放在 `coolui-scroller` 的 `header` 插槽里。

> 对应原生微信小程序版：[Search 搜索组件](/native/components/search)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller-search
    v-model:keyword="keyword"
    placeholder="请输入要搜索的内容"
    :button="{ show: true, text: '搜索' }"
    round
    clearable
    @confirm="onConfirm"
    @btnClick="onBtnClick"
  />
</template>
```

```js
export default {
  data() {
    return { keyword: '' }
  },
  methods: {
    onConfirm({ key }) {
      // 回车/确认搜索
    },
    onBtnClick({ key }) {
      // 点击右侧按钮
    },
  },
}
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 占位文字 | _String_ | `'请输入要搜索的内容'` |
| button | 右侧按钮配置 `{ show, text }` | _Object_ | `{ show: false, text: '搜索' }` |
| round | 是否圆角 | _Boolean_ | `false` |
| clearable | 是否显示清空按钮 | _Boolean_ | `false` |
| keyword | 搜索内容，支持 `v-model:keyword` | _String_ | `''` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:keyword | 输入内容变化（配 `v-model:keyword`） | `keyword: string` |
| input | 输入中 | `keyword: string` |
| focus / blur | 聚焦 / 失焦 | — |
| btnClick | 点击右侧按钮 | `{ key }` |
| confirm | 键盘确认 | `{ key }` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| leftout | 搜索框左侧自定义内容 |

## 与原生版的差异

- **属性改名**：原生是 `key`，而 `key` 在 Vue 中是保留字，uni-app 版改为 **`keyword`**，配合 `@update:keyword`（可写 `v-model:keyword`）；
- 原生 `externalClasses`（`search-btn-class` / `search-inner-class` / `search-placeholder-class`）已移除，改用 CSS 变量定制主题：

| CSS 变量 | 作用 |
| --- | --- |
| `--color` | 文字颜色 |
| `--placeholder-color` | 占位文字颜色 |
| `--input-bg-color` | 输入框背景色 |

- 新增 `update:keyword` / `input` / `focus` / `blur` 事件；`btnClick`、`confirm` 参数与原生一致（`{ key }`）。

## 相关

- [Nav 分类导航组件](/uniapp/components/nav) · [Sort 排序及分类筛选组件](/uniapp/components/sort)
