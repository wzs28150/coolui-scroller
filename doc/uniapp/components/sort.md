# Sort 排序及分类筛选组件

`<coolui-scroller-sort>` 是排序 / 筛选的容器，具体筛选项由 `<coolui-scroller-sort-item>` 提供，支持排序、多选分类、自定义面板三种类型。

> 对应原生微信小程序版：[Sort 排序及分类筛选组件](/native/components/sort)

## 代码演示

```vue [index.vue]
<template>
  <coolui-scroller-sort>
    <coolui-scroller-sort-item
      title="排序"
      name="sort"
      type="sort"
      v-model:value="value1"
      :options="options"
      active-color="#d13435"
    />

    <coolui-scroller-sort-item
      title="品牌"
      name="sort3"
      type="classify"
      v-model:value="value3"
      :options="options3"
      active-color="#d13435"
      multiple
      action-bar
    />

    <coolui-scroller-sort-item
      title="设置"
      name="sort4"
      type="diy"
      v-model:value="value2"
      active-color="#d13435"
    >
      <view class="diy">自定义区域</view>
    </coolui-scroller-sort-item>
  </coolui-scroller-sort>
</template>
```

```js
export default {
  data() {
    return {
      value1: '',
      value3: '',
      value2: '',
      // options 每项 { id, title }
      options: [
        { id: 1, title: '综合' },
        { id: 2, title: '销量' },
      ],
      options3: [
        { id: 1, title: '品牌一' },
        { id: 2, title: '品牌二' },
      ],
    }
  },
}
```

## Sort 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| overlay | 是否显示遮罩 | _Boolean_ | `true` |
| overlayDuration | 遮罩动画时长（ms） | _Number_ | `500` |
| scroll | 面板内容是否可滚动 | _Boolean_ | `false` |

## SortItem 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题文字 | _String_ | `''` |
| name | 标识，`change` 事件里回传 | _String_ | `''` |
| type | 类型：`sort` / `classify` / `diy` | _String_ | `''` |
| value | 选中值，支持 `v-model:value`（多选时为数组） | _String_ / _Number_ / _Array_ | `''` |
| options | 选项列表，每项 `{ id, title }` | _Array_ | `[]` |
| color | 未选中文字颜色 | _String_ | `'#333'` |
| activeColor | 选中文字颜色 | _String_ | `'#d13435'` |
| multiple | 是否多选 | _Boolean_ | `false` |
| actionBar | 是否显示底部操作条（重置 / 确定） | _Boolean_ | `false` |

## 事件（SortItem）

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:value | 选中值变化（配 `v-model:value`） | `value` |
| change | 选项变化 | `{ name, value }` |

## 插槽（SortItem）

| 插槽 | 说明 |
| --- | --- |
| 默认 | `type="diy"` 时的自定义面板内容 |

## 与原生版的差异

- `sort` 三个属性与原生一致；
- `sort-item` 的 `value` 原生只支持 String，uni-app 版放宽为 **String / Number（多选 Array）**；
- 新增 `update:value` 与 `change` 事件（原生没有），可以直接 `v-model:value` 受控；
- 动画实现上原生用 `wx.createAnimation`，uni-app 版用 CSS transition。

## 相关

- [Nav 分类导航组件](/uniapp/components/nav) · [示例：下拉组合](/case/case2)
