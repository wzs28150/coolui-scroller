# nav 分类导航软件

## 介绍

该组件为列表头部插槽中的可选组件。组件提供了简单的分类导航效果用于切换分类。导航个数以 4 为分界数。分类小于等于 4 个时平均分配宽度。大于 4 个时显示 4.5 个。active 为选中的 index 值,支持双向绑定,可在页面添加 touch 事件左右侧滑切换改变 active。来切换分类导航

<img :src="'/images/nav.jpg'" alt="示例图" />

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "nav": "coolui-scroller/nav/index"
}
```

## 代码演示

<CodeGroup>
  <CodeGroupItem title="wxml">

```html
<view bind:touchstart="TouchStart" bind:touchend="TouchEnd">
  <scroller class="my-scroller">
    <view slot="header">
      <nav
        list="{{nav}}"
        bind:change="onChange"
        model:active="{{active}}"
        active-color="#d13435"
      />
    </view>
  </scroller>
</view>
```

</CodeGroupItem>
  <CodeGroupItem title="JavaScript">

```js
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

  </CodeGroupItem>
</CodeGroup>

## 配置

| 参数         | 说明                                                             | 类型     | 默认值    | 版本  |
| ------------ | ---------------------------------------------------------------- | -------- | --------- | ----- |
| list         | 导航列表数组项需设置标题`title`和`id`如`[{id:1,title:'分类 1'}]` | _Obj[]_  | 无        | 3.0.0 |
| active       | 当前选中的导航 index,注意不是 id 值,支持双向绑定(model:active)   | _Number_ | `0`       | 3.0.0 |
| active-color | 选中导航的颜色                                                   | _String_ | `#d13435` | 3.0.0 |

## 事件

| 名称   | 用法                        | 说明               | 返回参数 |
| ------ | --------------------------- | ------------------ | -------- |
| change | `bindchange`或`bind:change` | 导航切换时触发执行 | 无       |
