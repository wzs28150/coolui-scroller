# search 搜索组件

## 介绍

用于搜索场景的输入框组件。可置于头部插槽中。

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "search": "coolui-scroller/search/index"
}
```

## 代码演示

基础使用

<img src="/images/search_base.gif"  />

::: code-group

```html [index.wxml]
<scroller>
  <view slot="header">
    <search
      search-btn="search-btn"
      model:key="{{key}}"
      bind:confirm="confirm"
      bind:btnClick="onBtnClick"
    />
  </view>
</scroller>
```

```js [index.js]
Page({
  data: {
    key: '',
  },
  onBtnClick({ detail }) {
    wx.showToast({
      title: '来自右侧按钮点击:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
  confirm({ detail }) {
    wx.showToast({
      title: '来自完成按钮触发:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
})
```

:::

圆角

<img src="/images/search_yj.jpg" />

::: code-group

```html [index.wxml]
<scroller>
  <view slot="header">
    <search
      round
      search-btn="search-btn"
      model:key="{{key}}"
      bind:confirm="confirm"
      bind:btnClick="onBtnClick"
    />
  </view>
</scroller>
```

```js [index.js]
Page({
  data: {
    key: '',
  },
  onBtnClick({ detail }) {
    wx.showToast({
      title: '来自右侧按钮点击:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
  confirm({ detail }) {
    wx.showToast({
      title: '来自完成按钮触发:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
})
```

:::

可清除

<img src="/images/search_clearable.gif" />

::: code-group

```html [index.wxml]
<scroller>
  <view slot="header">
    <search
      clearable
      search-btn="search-btn"
      model:key="{{key}}"
      bind:confirm="confirm"
      bind:btnClick="onBtnClick"
    />
  </view>
</scroller>
```

```js [index.js]
Page({
  data: {
    key: '',
  },
  onBtnClick({ detail }) {
    wx.showToast({
      title: '来自右侧按钮点击:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
  confirm({ detail }) {
    wx.showToast({
      title: '来自完成按钮触发:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
})
```

:::

可清除

<img src="/images/search_clearable.gif" />

::: code-group

```html [index.wxml]
<scroller>
  <view slot="header">
    <search
      clearable
      search-btn="search-btn"
      model:key="{{key}}"
      bind:confirm="confirm"
      bind:btnClick="onBtnClick"
    />
  </view>
</scroller>
```

```js [index.js]
Page({
  data: {
    key: '',
  },
  onBtnClick({ detail }) {
    wx.showToast({
      title: '来自右侧按钮点击:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
  confirm({ detail }) {
    wx.showToast({
      title: '来自完成按钮触发:' + detail.key,
      icon: 'none',
      duration: 4000,
    })
  },
})
```

:::

可设置按钮

<img src="/images/search.jpg" />

## 配置

| 参数      | 说明                                                                              | 类型      | 默认值  | 版本  |
| --------- | --------------------------------------------------------------------------------- | --------- | ------- | ----- |
| round     | 圆角设置，可设置`true`或`false`，设置为 true 时搜索框为胶囊样式                   | _Boolean_ | `false` | 3.0.0 |
| clearable | 清除按钮设置，可设置`true`或`false`，设置为 true 时开启清除按钮，可清除输入框内容 | _Boolean_ | `false` | 3.0.0 |
| button    | 可对右侧按钮进行设置,详见<a href="#按钮配置">按钮配置</a>                         | _Obj_     |         | 3.0.0 |
| key       | 搜索的关键字，输入框里输入的内容。支持双向绑定 model:key                          | _String_  |         | 3.0.0 |

## 按钮配置

| 参数 | 说明                                                                                                               | 类型      | 默认值  | 版本  |
| ---- | ------------------------------------------------------------------------------------------------------------------ | --------- | ------- | ----- |
| show | 设置按钮是否一直显示，可设置`true`或`false`。设为`true`时按钮一直显示，设为`false`时按钮只有在输入框获取焦点时显示 | _Boolean_ | `false` | 3.0.0 |
| hide | 设置按钮是否一直隐藏，可设置`true`或`false`。设为`true`时按钮一直隐藏，设为`false`时按钮只有在输入框获取焦点时显示 | _Boolean_ | `false` | 3.0.0 |
| text | 设置按钮显示文字                                                                                                   | _String_  | `搜索`  | 3.0.0 |

## 外部样式

在组件外部修改组件里的元素样式，可做局部调整。

| 名称       | 说明                     | 类型     | 版本  |
| ---------- | ------------------------ | -------- | ----- |
| search-btn | 设置右侧搜索按钮的 class | _String_ | 3.0.0 |
