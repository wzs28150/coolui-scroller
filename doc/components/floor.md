# second-floor 下拉二楼组件

## 注意

该组件为 v3.2.3 之后添加的！！！

## 介绍

很多 app 首页都带有下拉二楼的功能，拖拽屏幕向下松手刷新页面，但是继续向下拉动就会完整的拉下来一屏的内容,如下图：

<img src="https://test.wzs.pub/pic/tb_sf.gif" style="width: 33.3%" alt="示例图" />

second-floor 组件可搭配 second-floor-refresh 来实现下拉二楼的效果

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "second-floor": "coolui-scroller/second-floor/index",
  "second-floor-refresh": "coolui-scroller/second-floor-refresh/index",
}
```

## 代码演示

<nav class="table-of-contents">
  <ul>
    <li> 
      <a aria-current="page" href="#_1-基础使用" class="router-link-active router-link-exact-active">基础使用</a> 
    </li>
    <li> 
      <a aria-current="page" href="#_2-可搭配-page-container" class="router-link-active router-link-exact-active">可搭配 page-container</a> 
    </li>
    <li> 
      <a aria-current="page" href="#_3-可设置下拉二楼的位置" class="router-link-active router-link-exact-active">可设置下拉二楼的位置</a> 
    </li>
    <li> 
      <a aria-current="page" href="#_4-可设置下拉二楼是否开启缩放动画" class="router-link-active router-link-exact-active">可设置下拉二楼是否开启缩放动画</a> 
    </li>
  </ul>
</nav>

### 1. 基础使用

搭配 second-floor-refresh 组件实现文字提示，同时也提供了插槽位置支持您自定义，自定义 refresh 组件请参考 second-floor-refresh 内部的写法
`setText` 是关键方法
::: code-group

```html [index.wxml]
<second-floor
  bind:refresh="onRefresh"
  bind:secondShow="onSecondShow"
  bind:secondBack="onSecondBack"
  model:threshold="{{val}}"
  class="my-second-floor"
>
  <view slot="second-floor"> 二楼区域 </view>
  <!-- 刷新组件 -->
  <second-floor-refresh slot="second-floor-refresh"></second-floor-refresh>
  <!-- 刷新组件 -->
  <view>页面主内容</view>
</second-floor>
```

```js [index.js]
Page({
  data: {
    val: 0, // 拖拽的进度值
  },
  onRefresh() {
    // 下拉刷新时执行
  },
  onSecondShow() {
    // 下拉二楼展开之后执行
  },
  onSecondBack() {
    // 下拉二楼关闭之后执行
  },
})
```

:::

### 2. 可搭配 page-container

很多 app 的下拉二楼效果是下拉之后打开一个新页，搭配 page-container, 在 onSecondShow 方法中控制 page-container 的 show 可以实现，然后利用组件的 back 事件进行关闭

<img src="https://test.wzs.pub/pic/new_page.gif" style="flex: 1;width: 33.3%" alt="示例图" />

::: code-group

```html [index.wxml]
<second-floor
  bind:refresh="onRefresh"
  bind:secondShow="onSecondShow"
  bind:secondBack="onSecondBack"
  model:threshold="{{val}}"
  class="my-second-floor"
>
  <view slot="second-floor"> 二楼区域 </view>
  <!-- 刷新组件 -->
  <second-floor-refresh slot="second-floor-refresh"></second-floor-refresh>
  <!-- 刷新组件 -->
  <!-- 顶部标签组件 -->
  <nav-bar slot="nav-bar" config="{{navBarConfig}}">下拉二楼</nav-bar>
  <!-- 顶部标签组件 -->
  <view>页面主内容</view>
</second-floor>

<page-container
  show="{{show}}"
  round="{{round}}"
  overlay="{{overlay}}"
  duration="{{duration}}"
  position="{{position}}"
  close-on-slide-down="{{false}}"
  bindbeforeenter="onBeforeEnter"
  bindenter="onEnter"
  bindafterenter="onAfterEnter"
  bindbeforeleave="onBeforeLeave"
  bindleave="onLeave"
  bindafterleave="onAfterLeave"
  bindclickoverlay="onClickOverlay"
  custom-style="{{customStyle}}"
  overlay-style="{{overlayStyle}}"
>
  <view class="detail-page">
    <button type="primary" bindtap="exit">退出</button>
  </view>
</page-container>
```

```js [index.js]
Page({
  data: {
    val: 0, // 拖拽的进度值
    show: false,
    duration: 300,
    position: 'right',
    round: false,
    overlay: true,
    customStyle: '',
    overlayStyle: '',
  },
  onRefresh() {
    // 下拉刷新时执行
  },
  onSecondShow() {
    // 下拉二楼展开之后执行
    setTimeout(() => {
      this.setData({
        show: true,
      })
    }, 500)
  },
  onSecondBack() {
    // 下拉二楼关闭之后执行
  },
  exit() {
    const secondFloor = this.selectComponent('.my-second-floor')
    secondFloor.back().then(() => {
      this.setData({ show: false })
    })
  },
})
```

:::

### 3. 可设置下拉二楼的位置

可设置下拉二楼的位置 top、center、bottom。即展开的时候先展示的是二楼的哪个部位

<div style="display:flex;">
<img src="https://test.wzs.pub/pic/top.gif" style="flex: 1;width: 33.3%" alt="示例图" />
<img src="https://test.wzs.pub/pic/center.gif" style="flex: 1;width: 33.3%" alt="示例图" />
<img src="https://test.wzs.pub/pic/bottom.gif" style="flex: 1;width: 33.3%" alt="示例图" />
</div>

```html
<!-- top -->
<second-floor top></second-floor>
<!-- center -->
<second-floor center></second-floor>
<!-- bottom -->
<second-floor bottom></second-floor>
```

### 4. 可设置下拉二楼是否开启缩放动画

就如同微信首页下拉出来小程序列表一样，二楼展开会有一个缩放的效果

<div style="display:flex;">
<img src="https://test.wzs.pub/pic/top_scale.gif" style="flex: 1;width: 33.3%" alt="示例图" />
<img src="https://test.wzs.pub/pic/center_scale.gif" style="flex: 1;width: 33.3%" alt="示例图" />
<img src="https://test.wzs.pub/pic/bottom_scale.gif" style="flex: 1;width: 33.3%" alt="示例图" />
</div>

```html
<!-- top scale -->
<second-floor top scale></second-floor>
<!-- center scale-->
<second-floor center scale></second-floor>
<!-- bottom scale-->
<second-floor bottom scale></second-floor>
```

### 5. 可搭配 nav-bar 设置顶部标题栏

<div style="display:flex;">
<img src="/images/a.gif" style="width: 33.3%" alt="示例图" />
</div>

::: code-group

```html [index.wxml]
<second-floor>
  <!-- 顶部标签组件 -->
  <nav-bar slot="nav-bar" config="{{navBarConfig}}">下拉二楼</nav-bar>
  <!-- 顶部标签组件 -->
</second-floor>
```

```js [index.js]
Page({
  data: {
    navBarConfig: {
      back: {
        show: true, // 是否显示返回按钮
        click: () => {
          // 返回按钮点击方法
          wx.navigateBack({
            delta: 1,
          })
        },
      },
      background: {
        color: '#d13435', //设置背景颜色
      },
      text: {
        color: '#fff', // 设置文字颜色
      },
    },
  },
})
```

:::

## second-floor 配置

| 参数   | 说明                 | 类型      | 默认值 | 版本  |
| ------ | -------------------- | --------- | ------ | ----- |
| top    | 二楼初始位置         | _Boolean_ | false  | 3.2.3 |
| center | 二楼初始位置         | _Boolean_ | false  | 3.2.3 |
| bottom | 二楼初始位置         | _Boolean_ | true   | 3.2.3 |
| scale  | 二楼是否开启缩放动画 | _Boolean_ | false  | 3.2.3 |

## 插槽

| 名称                 | 说明             | 可用组件               |
| -------------------- | ---------------- | ---------------------- |
| second-floor         | 二楼插槽区域     | -                      |
| second-floor-refresh | 下拉刷新插槽位置 | `second-floor-refresh` |
| nav-bar              | 顶部标题栏       | `nav-bar`              |

## methods 方法

| 名称         | 用法                                                                                                                                  | 说明                                                         | 版本  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----- |
| settriggered | 先获取组件实例：<br/>`const secondFloor = this.selectComponent('.my-second-floor');`, 然后调用方法：<br/>`secondFloor.settriggered()` | 关闭刷新的方法,在 onRefresh 中,数据刷新之后执行,返回 Promise | 3.2.3 |
| back         | 先获取组件实例：<br/>`const secondFloor = this.selectComponent('.my-second-floor');`, 然后调用方法：<br/>`secondFloor.back()`         | 关闭二楼的方法,会触发 onSecondBack, 返回 Promise             | 3.2.3 |

## events 事件

| 名称       | 用法              | 说明                                                        | 版本  |
| ---------- | ----------------- | ----------------------------------------------------------- | ----- |
| refresh    | `bind:refresh`    | 刷新时执行，可执行请求数据,然后执行 `settriggered` 关闭刷新 | 3.2.3 |
| secondShow | `bind:secondShow` | 二楼打开之后执行                                            | 3.2.3 |
| secondBack | `bind:secondBack` | 二楼关闭之后执行                                            | 3.2.3 |

## second-floor-refresh 配置

| 参数          | 说明                                                                          | 类型     | 默认值                                                                                                                                        | 版本  |
| ------------- | ----------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| refreshConfig | second-floor-refresh 组件的设置,详见[refreshConfig](./floor.md#refreshConfig) | _Object_ | `{ downText: "下拉刷新", loadingText: "正在加载", backText: "返回首页", tipText: "松开刷新", moreText: "继续下拉有惊喜~", color: "#ffffff" }` | 3.2.3 |

## refreshConfig

| 参数        | 说明                           | 类型      | 默认值 | 版本  |
| ----------- | ------------------------------ | --------- | ------ | ----- |
| downText    | 开始下拉时的文字               | _Boolean_ | false  | 3.2.3 |
| loadingText | 正在加载时的文字               | _Boolean_ | false  | 3.2.3 |
| backText    | 二楼加载成功之后返回按钮的文字 | _Boolean_ | false  | 3.2.3 |
| tipText     | 松开刷新时的提示文字           | _Boolean_ | false  | 3.2.3 |
| moreText    | 继续下拉的提示文字             | _Boolean_ | false  | 3.2.3 |
| color       | 文字颜色                       | _Boolean_ | false  | 3.2.3 |

<!-- ## 外部样式

在组件外部修改组件里的元素样式，可做局部调整。

| 名称               | 说明             | 类型     | 版本  |
| ------------------ | ---------------- | -------- | ----- |
| second-floor-class | 设置图片的 class | _String_ | 3.0.0 | -->
