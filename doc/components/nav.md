# nav 分类导航软件

## 介绍

该组件为列表头部插槽中的可选组件。组件提供了简单的分类导航效果用于切换分类。active 为选中的 index 值,支持双向绑定,可设置间距、显示类型、显示个数等，可在页面添加 touch 事件左右侧滑切换改变 active。来切换分类导航

<img src="/images/nav.jpg" alt="示例图" />

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "nav": "coolui-scroller/nav/index"
}
```

## 代码演示

### 1. 设置不同的展示类型 type (v3.2.9 新增)

line(默认类型)
<img src="/images/nav5.jpg" alt="示例图" style="max-width:347px" />

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        type="line"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

round
<img src="/images/nav4.jpg" alt="示例图" style="max-width:347px" />

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        type="round"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

plain
<img src="/images/nav3.jpg" alt="示例图" style="max-width:347px" />

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        type="plain"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

### 2. 设置可视区显示个数 navPerView (v3.2.9 新增)

可设置指定的显示个数(如：3、3.5)计算宽度平均分配,里面的文字过多会溢出隐藏； 也可设置 auto 则不限制宽度，宽度由文字内容的多少决定。

<div style="display: flex;">
<img src="/images/nav1.jpg" alt="示例图" style="max-width:347px" />
<img src="/images/nav5.jpg" alt="示例图" style="max-width:347px" />
</div>

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        navPerView="auto"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

### 3. 设置间距 spaceBetween (v3.2.9 新增)

可设置分类之间的间距(如：20)。

<div style="display: flex;">
<img src="/images/nav1.jpg" alt="示例图" style="max-width:347px" />
<img src="/images/nav2.jpg" alt="示例图" style="max-width:347px" />
</div>

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        spaceBetween="{{20}}"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

### 4. 设置底边分割线是否显示 border (v3.2.9 新增)

<div style="display: flex; margin-top: 15px">
<img src="/images/nav6.jpg" alt="示例图" style="max-width:347px" />
<img src="/images/nav2.jpg" alt="示例图" style="max-width:347px" />
</div>

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        border="{{false}}"
        spaceBetween="{{20}}"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

### 4. 设置文字颜色及背景颜色 text background (active-color v3.2.9 之后废弃)

在 v3.2.9 之前由于展示类型之一 line 这一种所以选择变化颜色比较单一，所以只有一个 active-color 设置选中颜色

```html
<nav
  list="{{nav}}"
  bind:change="onChange"
  model:active="{{active}}"
  active-color="#d13435"
/>
```

        activeColor: '#d13435',

在 v3.2.9 之后可设置

1. 文字颜色 text.color
2. 文字选中颜色 text.activeColor
3. 背景颜色 background.color( 如果是 line 则设置无效默认不选中的没颜色, plain 则是边框颜色 )
4. 背景选中颜色 background.activeColor( 如果是 line 则是底部线的颜色, plain 则是边框颜色 )

::: code-group

```html [index.wxml]
<view>
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        border="{{false}}"
        spaceBetween="{{20}}"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
})
```

:::

### 5. 可在页面添加 touch 事件左右侧滑切换改变 active。来切换分类导航

::: code-group

```html [index.wxml]
<view bind:touchstart="TouchStart" bind:touchend="TouchEnd">
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        type="line"
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        text="{{text}}"
        background="{{background}}"
      />
    </view>
  </scroller>
</view>
```

```js [index.js]
Page({
  data: {
    // 设置导航数组
    nav: [
      {
        id: 1,
        title: '分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    text: { color: '#333', activeColor: '#d13435' },
    background: { color: '#333', activeColor: '#d13435' },
    active: 3, // 当前选中的Index值
  },
  onChange: function (e) {
    // 导航切换变化后执行
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
  TouchStart(e) {
    let that = this
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY,
    })
  },
  TouchEnd(e) {
    let that = this
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    let turn = ''
    if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
      //右滑
      turn = 'right'
    } else if (
      x - that.data.touchx < -50 &&
      Math.abs(y - that.data.touchy) < 50
    ) {
      //左滑
      turn = 'left'
    }
    //根据方向进行操作
    if (turn == 'right') {
      //从左往右
      if (that.data.active != 0) {
        that.setData({
          active: that.data.active - 1,
        })
      }
    }
    if (turn == 'left') {
      //从右往左
      if (that.data.active < that.data.nav.length - 1) {
        that.setData({
          active: that.data.active + 1,
        })
      }
    }
  },
})
```

:::

## 配置

| 参数         | 说明                                                             | 类型                      | 默认值                                      | 版本          |
| ------------ | ---------------------------------------------------------------- | ------------------------- | ------------------------------------------- | ------------- |
| list         | 导航列表数组项需设置标题`title`和`id`如`[{id:1,title:'分类 1'}]` | _Obj[]_                   | 无                                          | 3.0.0         |
| active       | 当前选中的导航 index,注意不是 id 值,支持双向绑定(model:active)   | _Number_                  | `0`                                         | 3.0.0         |
| active-color | 选中导航的颜色                                                   | _String_                  | `#d13435`                                   | 3.0.0 ~ 3.2.8 |
| type         | 设置类型                                                         | _line_、_round_ 、_plain_ | `line`                                      | 3.2.9         |
| border       | 设置底边线是否显示                                               | _Boolean_                 | `true`                                      | 3.2.9         |
| navPerView   | 设置可视区显示个数                                               | _Number_                  | `4.5`                                       | 3.2.9         |
| spaceBetween | 设置分类间距                                                     | _Number_                  | `0`                                         | 3.2.9         |
| text         | 设置文字颜色 `color` 为默认颜色 `activeColor` 为选中颜色         | _Object_                  | `{color: '#333333',activeColor: '#d13435'}` | 3.2.9         |
| background   | 设置背景颜色 `color` 为默认颜色 `activeColor` 为选中颜色         | _Object_                  | `{color: '#333333',activeColor: '#d13435'}` | 3.2.9         |

## 事件

| 名称   | 用法                        | 说明               | 返回参数 |
| ------ | --------------------------- | ------------------ | -------- |
| change | `bindchange`或`bind:change` | 导航切换时触发执行 | 无       |
