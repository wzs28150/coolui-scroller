# Scroller 滚动组件

## 介绍

Scroller 为 coolui-scroller 的地基。所以要使用 coolui-scroller 必须引入该组件。该组件将列表页面查分成如下各个区域:

<!-- 该组件默认配置下为官方原版下拉效果(三个圆点动画) -->
<div class="vp-code-group">
  <div class="tabs">
    <input
      type="radio"
      name="group-PB9XS"
      id="tab-a0"
      :checked="active === 0"
    />
    <label @click="active = 0" for="tab-a0">示例图一</label
      >
    <input
      type="radio"
      name="group-PB9XS"
      id="tab-a1"
      :checked="active === 1"
    />
    <label @click="active = 1" for="tab-a1">示例图二</label
      >
    <input
      type="radio"
      name="group-PB9XS"
      id="tab-a2"
      :checked="active === 2"
    />
    <label @click="active = 2" for="tab-a2">示例图三</label
      >
  </div>
  <div class="blocks">
    <div :class="'pic-container language-html ' + (active === 0 ? 'active' : '')" style="padding: 20px;" >
      <img src="/images/scroller2.jpg"  alt="示例图一" />
    </div>
    <div :class="'pic-container language-html ' + (active === 1 ? 'active' : '')" style="padding: 20px;" >
      <img src="/images/scroller1.jpg" alt="示例图二" />
    </div>
    <div :class="'pic-container language-html ' + (active === 2 ? 'active' : '')" style="padding: 20px;" >
      <img src="/images/scroller3.jpg" alt="示例图三" />
    </div>
  </div>
</div>

<script setup>
import { ref } from 'vue'

const active = ref(0)
</script>

每个区域都提供了相应的组件或支持自定义。
如开启回到顶部按钮。该按钮默认执行 refresh 下拉的方法。

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "scroller": "coolui-scroller/scroller/index"
}
```

## 代码演示

::: code-group

```html [index.wxml]
<scroller
  background="{{background}}"
  isBackBtn="{{isBackBtn}}"
  isEmpty="{{isEmpty}}"
  bind:loadmore="loadmore"
  bind:refresh="refresh"
>
  <view slot="header">
    <!-- 头部区域，可增加搜索，分类切换等功能 -->
  </view>
  <!-- 下拉刷新组件，如果调用则开启下拉，不调用则不开启下拉，下拉配置详见下拉组件 -->
  <refresh slot="refresh" type="base" config="" />

  <!-- 中间列表内容区域，可使用长列表分页组件、列表项组件或自定义 -->
  <item wx:for="{{list}}">
    <!-- 我是列表项 -->
  </item>
  <view slot="loadmore">
    <!-- 加载更多区域，可使用加载更多组件或自定义 -->
  </view>
  <view slot="empty">
    <!-- 空列表区域，数据为空，将isEmpty设置为true时显示，可使用空组件或自定义 -->
  </view>
</scroller>
```

```js [index.js]
Page({
  data: {
    background: '#f2f2f2',
    isBackBtn: true, // 设置是否显示回到顶部按钮
    isEmpty: false, // 设置是否为空数据
    list: [], // 列表数据
  },
  loadmore() {
    // 上拉到底部，加载更多时执行，请实现分页+1，新数据加载的操作
  },
  refresh() {
    // 下拉到顶部，下拉刷新时执行，请实现清除列表数据，还原分页为初始值的操作
  },
})
```

:::

> 如果不想使用里面子组件，像自定义里面内容可使用`contentHeight`来获取高度

::: code-group

```html [index.wxml]
<scroller
  background="{{background}}"
  isBackBtn="{{isBackBtn}}"
  isEmpty="{{isEmpty}}"
  bind:contentHeight="getHeight"
>
  <view slot="header">
    <!-- 头部区域，可增加搜索，分类切换等功能 -->
  </view>
  <!-- 下拉刷新组件，如果调用则开启下拉，不调用则不开启下拉，下拉配置详见下拉组件 -->
  <refresh slot="refresh" type="base" config="" />
  <view style="height: {{height}}px">
    <!-- 自定义的内容, 设置高度是方便里面flex布局等高度撑开计算等 -->
  </view
</scroller>
```

```js [index.js]
Page({
  data: {
    height: 0,
    background: '#f2f2f2',
    isBackBtn: true, // 设置是否显示回到顶部按钮
  },
  getHeight: function (res) {
    this.setData({
      height: res.detail,
    })
  },
})
```

:::

## 配置

| 参数           | 说明                                                                                                                                                                                  | 类型      | 默认值    | 版本        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | ----------- |
| type           | 下拉样式类型,默认样式或插槽自定义，可设置 `default` 、`base`、 `diy`。`default`为小程序原版下拉样式。`base`为组件提供的基础样式。`diy`为开启完全自定义                                | _String_  | `default` | 3.0.0       |
| ~~background~~ | 自定义下拉背景颜色(如：`#f2f2f2`)，该设置本应该在下拉刷新组件中设置，但是小程序 scroll-view 动态设置 refresher-background 会出现下拉区域下沉 bug 所以在这里设置背景颜色。(3.1.0 废弃) | _String_  | `#f2f2f2` | 3.0.0~3.0.9 |
| ~~isBackBtn~~  | 设置是否显示返回到顶部按钮，可设置`true`或`false`， `true`为开启                                                                                                                      | _Boolean_ | `false`   | 3.0.0~3.3.3 |
| isEmpty        | 设置是否显示空数据内容，可设置`true`或`false`， `true`为开启。如在空列表插槽中设置了内容则会显示出来                                                                                  | _Boolean_ | `false`   | 3.0.0       |
| enableFlex     | 设置是否开启 scroll-view 的 flex 模式，可设置`true`或`false`， `true`为开启。                                                                                                         | _Boolean_ | `false`   | 3.0.9       |
| top            | 设置滚动到指定位置                                                                                                                                                                    | _Number_  | `0`       | 3.2.8       |
| animation      | 在设置滚动条位置时使用动画过渡 （同 scroll-with-animation）                                                                                                                           | _Boolean_ | `true`    | 3.3.0       |

## 插槽

| 名称      | 说明                                      | 可用组件                | 版本  |
| --------- | ----------------------------------------- | ----------------------- | ----- |
| header    | 头部插槽区域                              | `nav`、`search`、`sort` | 3.x   |
| refresh   | 下拉刷新插槽位置，使用 refresh 组件时开启 | `refresh`               | 3.x   |
| loadmore  | 加载更多插槽位置                          | `loadmore`              |
| empty     | 空列表插槽位置，isEmpty 为 true 时显示    | `empty`                 | 3.x   |
| backToTop | 回到顶部插槽                              | `backToTop`             | 3.3.4 |

## 事件

| 名称          | 用法                                      | 说明                                                                                                  | 返回参数                                   | 版本  |
| ------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----- |
| loadmore      | `bindloadmore`或`bind:loadmore`           | 执行加载更多后触发，可执行更新列表                                                                    | 无                                         | 3.x   |
| refresh       | `bindrefresh`或`bind:refresh`             | 执行下拉刷新后触发，可执行更新列表                                                                    | 无                                         | 3.x   |
| contentHeight | `bindcontentHeight`或`bind:contentHeight` | 获取 scroller 中间内容区高度，不包括 header 部分,方便不使用 page、item 等组件需要自定义内容的时候使用 | 返回 res,可用 res.detail 获取高度，单位 px | 3.2.7 |

## 方法

| 名称         | 用法                                                                                                                              | 说明                                                                                                                                       | 返回参数 | 版本  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----- |
| settriggered | 先获取组件实例：<br/>`const scroller = this.selectComponent('.elm-scroller');`, 然后调用方法：<br/>`scroller.settriggered(false)` | 在 refresh 方法中执行，当刷新组件设置不自动回弹时，设置手动回弹，可增加 setTimeout 设置回弹时机。详见[非自动回弹](./refresh.md#非自动回弹) | promise  | 3.0.4 |
