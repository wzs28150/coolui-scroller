# refresh 下拉刷新组件

## 简介

置于下拉刷新插槽中配合滚动组件实现更多的下拉效果。未使用该组件则不开启下拉

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "refresh": "coolui-scroller/refresh/index"
}
```

## 代码演示

<nav class="table-of-contents">
  <ul>
    <li> 
      <a aria-current="page" href="#原生效果" class="router-link-active router-link-exact-active">原生效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#基础效果" class="router-link-active router-link-exact-active">基础效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#gif背景效果" class="router-link-active router-link-exact-active">gif 背景效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#视差效果" class="router-link-active router-link-exact-active">视差效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#京东效果" class="router-link-active router-link-exact-active">京东效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#饿了么效果" class="router-link-active router-link-exact-active">饿了么效果</a> 
    </li>
    <li> 
      <a aria-current="page" href="#非自动回弹" class="router-link-active router-link-exact-active">非自动回弹</a> 
    </li>
  </ul>
</nav>

### 原生效果

将 type 设置为 default，可设置背景颜色及圆点的深浅。

<img :src="'/images/refresh1.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#f5f5f5">
  <refresh slot="refresh" type="default" config="{{defaultSetting}}" />
</scroller>
```

```js [index.js]
Page({
  data: {
    val: 0,
    defaultSetting: {
      shake: true, // 设置是否开启震动
      style: 'black', // 设置圆点申诉还是浅色
    },
  },
})
```

:::

### 基础效果

将 type 设置为 base，可设置背景颜色、背景图片、文字等。

<img :src="'/images/refresh2.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#f5f5f5">
  <refresh slot="refresh" type="base" config="{{baseConfig}}" />
</scroller>
```

```js [index.js]
Page({
  data: {
    baseConfig: {
      shake: true, // 是否开启下拉震动
      height: 70, // 下拉高度
      text: {
        color: '#fff', // 文字颜色
        shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
      },
      background: {
        color: '#000000',
        height: 120, // 设置背景大于下拉高度
        img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
  },
})
```

:::

### gif 背景效果

不设置 text 文字的时候就会只显示背景图，如果将背景图设置成动图 gif，也可以实现一些有趣的效果。

<img :src="'/images/refresh3.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#f5f5f5">
  <refresh slot="refresh" type="base" config="{{gifSetting}}" />
</scroller>
```

```js [index.js]
Page({
  data: {
    gifSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
        img: 'https://test.wzs.pub/pic/tm_mui_bike.gif',
      },
    },
  },
})
```

:::

### 视差效果

将 types 设置为 diy 开启自定义模式，搭配视差组件可实现简单的位移实现一些效果

可设置视差组件的移动方向 direction

<img :src="'/images/refresh4.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#f5f5f5">
  <refresh slot="refresh" type="diy" config="{{parallaxSetting}}">
    <parallax
      parallax-class="parallax-item parallax-item1"
      slot="parallax"
      direction="to top"
      parallax="{{35}}"
    >
      从下往上
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item2"
      slot="parallax"
      direction="to bottom"
      parallax="{{35}}"
    >
      从上往下
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item4"
      slot="parallax"
      direction="to right"
      parallax="{{50}}"
    >
      从左往右
    </parallax>
    <parallax
      parallax-class="parallax-item parallax-item3"
      slot="parallax"
      direction="to left"
      parallax="{{50}}"
    >
      从右往左
    </parallax>
  </refresh>
</scroller>
```

```js [index.js]
Page({
  data: {
    parallaxSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
      },
    },
  },
})
```

:::

可设置视差组件的移动距离 parallax，距离值为移动距离占下拉高度的百分比。如：parallax=10 则 移动距离 = 下拉高度 height \* 10%。

<img :src="'/images/refresh5.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#f5f5f5">
  <refresh slot="refresh" type="diy" config="{{parallaxSetting}}">
    <parallax
      parallax-class="parallax-sitem parallax-item1"
      slot="parallax"
      direction="to top"
      parallax="{{0}}"
    >
      视差2
    </parallax>
    <parallax
      parallax-class="parallax-sitem parallax-item2"
      slot="parallax"
      direction="to top"
      parallax="{{8}}"
    >
      视差3
    </parallax>
    <parallax
      parallax-class="parallax-sitem parallax-item3"
      slot="parallax"
      direction="to top"
      parallax="{{-8}}"
    >
      视差1
    </parallax>
    <parallax
      parallax-class="parallax-sitem parallax-item4"
      slot="parallax"
      direction="to top"
      parallax="{{16}}"
    >
      视差4
    </parallax>
  </refresh>
</scroller>
```

```js [index.js]
Page({
  data: {
    parallaxSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
      },
    },
  },
})
```

:::

将视差组件运用到场景中，多元素视差。 注意元素如果用的太多会出现卡顿。

<img :src="'/images/refresh6.gif'" />

::: code-group

```html [index.wxml]
<scroller background="#ffaf1b">
  <refresh slot="refresh" type="diy" config="{{parallaxDemoSetting}}">
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem1"
      slot="parallax"
      direction="to bottom"
      parallax="{{0}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax0.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem1"
      slot="parallax"
      direction="to bottom"
      parallax="{{7}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax1.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem2"
      slot="parallax"
      direction="to bottom"
      parallax="{{14}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax2.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem3"
      slot="parallax"
      direction="to bottom"
      parallax="{{21}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax3.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem4"
      slot="parallax"
      direction="to bottom"
      parallax="{{28}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax4.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem5"
      slot="parallax"
      direction="to bottom"
      parallax="{{35}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax5.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem6"
      slot="parallax"
      direction="to bottom"
      parallax="{{42}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax6.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem7"
      slot="parallax"
      direction="to bottom"
      parallax="{{49}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax7.png"
      />
    </parallax>
    <parallax
      parallax-class="parallax-demoitem parallax-demoitem8"
      slot="parallax"
      direction="to bottom"
      parallax="{{56}}"
    >
      <image
        class="img"
        mode="scaleToFill"
        src="https://test.wzs.pub/pic/parallax8.png"
      />
    </parallax>
  </refresh>
</scroller>
```

```js [index.js]
Page({
  data: {
    parallaxDemoSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#ffaf1b',
      },
    },
  },
})
```

:::

### 京东效果

type 设置为 diy 开启自定义后。通过 threshold 实时变化自己实现动画效果。

开始看到这个效果时候想要复刻下来，就开始思考如何接箱子？如何接到又开始跑起来的？

小人跑之前，箱子移动小人缩放都是变化的，可根据 threshold 变化来实现动画。

当 threshold 变为 1 时。下拉到最大，小人跑步，可通过背景 step 实现帧动画。

该效果主要展示如何根据 threshold 实时变化实现效果。

<img :src="'/images/refresh7.gif'" />

::: code-group

```html [index.wxml]
<scroller isBackBtn="{{true}}" background="#eeeeee">
  <refresh
    slot="refresh"
    type="diy"
    refresh-class="jd-refresh"
    model:threshold="{{val}}"
    config="{{jdSetting}}"
  >
    <view class="jd-wapper">
      <view class="img" wx:if="{{val == 1}}" />
      <block wx:else>
        <view
          class="moveimg"
          style="transform: scale({{val}}) translateX({{-100 + val * 100}}px);"
        />
        <view
          class="moveimg2"
          style="transform: translateY({{-100 + val * 100}}px);"
        />
      </block>
    </view>
    <view class="text">让购物更便捷</view>
  </refresh>
</scroller>
```

```js [index.js]
Page({
  data: {
    val: 0,
    jdSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      background: {
        color: '#eeeeee',
      },
    },
  },
})
```

```css [index.wxss]
.jd-refresh {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  position: relative;
}

.jd-wapper {
  width: 26px;
  height: 40px;
  margin-right: 20rpx;
  position: relative;
}

.jd-wapper .moveimg {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a2a.png');
  position: absolute;
  left: 0;
  top: 0;
}

.jd-wapper .moveimg2 {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a29.png');
  position: absolute;
  left: 0;
  top: 0;
}

.jd-wapper .img {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a.png');
  animation: play 0.5s steps(3) infinite;
}

@keyframes play {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: -81px 0px;
  }
}
```

:::

### 饿了么效果

很多做小程序、app 的公司都有自己的企业文化、企业 logo、吉祥物等。在下拉时往往会做一些彩蛋动画。该效果主要展示如何判断文字变化。

type 设置为 diy 开启自定义后。通过 refreshstate 实时变化自己实现动画效果。

<img :src="'/images/refresh8.gif'" />

::: code-group

```html [index.wxml]
<scroller isBackBtn="{{true}}" background="#eeeeee">
  <refresh
    slot="refresh"
    refresh-class="elm-refresh"
    type="diy"
    model:refreshstate="{{refreshstate}}"
    config="{{elmSetting}}"
  >
    <view class="elm-wapper">
      <view>
        <view class="text">
          <block wx:if="{{refreshstate == 'pulldown'}}">下拉刷新</block>
          <block wx:elif="{{refreshstate == 'loosen'}}">松手刷新</block>
          <block wx:elif="{{refreshstate == 'loading'}}">刷新中</block>
        </view>
        <view class="exb"></view>
      </view>
    </view>
  </refresh>
</scroller>
```

```js [index.js]
Page({
  data: {
    refreshstate: 'pulldown',
    elmSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      background: {
        color: '#eeeeee',
      },
    },
  },
})
```

```css [index.wxss]
.elm-refresh .elm-wapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.elm-refresh .elm-wapper .text {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 10px;
}

.elm-refresh .exb {
  width: 30px;
  height: 30px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/refresh_icon2.png');
  animation: play2 0.8s steps(4) infinite;
  margin: 0 auto;
}

@keyframes play2 {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: -120px 0px;
  }
}
```

:::

### 非自动回弹

当组件 isAutoTriggered 设置为 false 时，下拉刷新不自动回弹到顶部。需调用方法来设置回弹。

当你得下拉刷新有复杂的动画希望回弹的时间由自己掌握时采用此方法及设置。

```js
  onRefresh(){
    // 获取父级scroller实例
    const scroll = this.selectComponent('.scroller');
    setTimeout(() => {
      // 设置回弹 返回promise
      scroll.settriggered(false).then(()=>{
        wx.showToast({
          title: "执行回弹成功",
          icon: "success",
        });
      })
    }, 2000); // 自定义回弹时间
  },
```

## 配置

| 参数         | 说明                                                                                                                                                                                                                                    | 类型     | 默认值     | 版本  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ----- |
| type         | 设置下拉类型，可设置`default`或`base`或`diy`，如设置`default`则下拉为小程序原生的样式(三个圆点动画)。如设置`base`则下拉为组件提供的基础样式。如设置`diy`则下拉完全开放自定义，可根据下拉变化值或搭配[视差组件](./parallax.md)进行自定义 | _String_ | `default`  | 3.0.0 |
| config       | 一些下拉设置，详见[下拉设置](./refresh.md#下拉设置)                                                                                                                                                                                     | _Obj_    |            | 3.0.0 |
| threshold    | 下拉变化值，数值范围为`0`~`1`，双向绑定 model:threshold。无需主动设置值，自动返回下拉变化值。作用是实时返回下拉变化，可根据变化值做自定义动画效果(如移动、旋转等)                                                                       | _Number_ | `0`        | 3.0.0 |
| refreshstate | 下拉变化状态，有三种状态：`pulldown`(下拉刷新)、`loosen`(松手刷新)、`loading`(刷新中)，双向绑定 model:refreshstate。无需主动设置值，自动返回下拉变化状态。作用是实时返回下拉变化，可根据变化状态做自定义动画效果                        | _String_ | `pulldown` | 3.0.4 |

## 下拉设置

| 参数            | 说明                                                                                                                                                                                                                                                                                                                          | 类型      | 默认值  | 版本  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- | ----- |
| shake           | 设置下拉时是否开启手机震动，可设置`true`或`false`。设置为`true`时开启                                                                                                                                                                                                                                                         | _Boolean_ | `false` | 3.0.0 |
| height          | 设置下拉高度                                                                                                                                                                                                                                                                                                                  | _Number_  | `50`    | 3.0.0 |
| background      | 设置下拉背景，详见[背景设置](./refresh.md#背景设置)                                                                                                                                                                                                                                                                           | _Obj_     |         | 3.0.0 |
| text            | 当 type 为`base`时，可设置下拉文字，详见[文字设置](./refresh.md#文字设置)                                                                                                                                                                                                                                                     | _Obj_     |         | 3.0.0 |
| isAutoTriggered | 下拉刷新是否自动回弹,默认为`true`下拉之后自动回弹，可设置`false`下拉到最大松手之后只执行刷新操作，不自动回弹，获取 scroller 实例之后执行`scroller.settriggered(false)`方法。此设置为复杂动画提供可能，自定义回弹时机( `注意：default模式不支持此方法。如需要实现原生效果且支持此方法，请自行使用该组件写三个圆点闪烁来实现` ) | _Boolean_ | `true`  | 3.0.4 |

## 背景设置

| 参数   | 说明                                                                                                                                                                                                               | 类型     | 默认值    | 版本  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------- | ----- |
| color  | 设置下拉时的背景颜色                                                                                                                                                                                               | _String_ | `#f2f2f2` | 3.0.0 |
| img    | 设置下拉时的背景图片(如：`https://test.wzs.pub/pic/tm_mui_bike.gif`)                                                                                                                                               | _String_ |           | 3.0.0 |
| height | 设置下拉时的背景的高度。因为一般虽然设置了下拉高度，但实际下拉拖拽时，拉动的距离会比设置的高很多，如果设置了背景图片，图片之上还会空很大一块。所以设置一下背景高度，高度高于下拉高度。这样背景就会铺满整个下拉区域 | _Number_ |           | 3.0.0 |

## 文字设置

| 参数   | 说明                                                                                                                                  | 类型     | 默认值    | 版本  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- | ----- |
| color  | 设置下拉文字颜色                                                                                                                      | _String_ | `#000000` | 3.0.0 |
| shadow | 设置下拉文字阴影。往往如果背景颜色过于花里胡哨，下拉文字就会容易看不清。加入阴影可以凸显文字。设置为`0`则不开启。数值越大阴影范围越大 | _Number_ | `0`       | 3.0.0 |

## 插槽

| 名称     | 说明         | 可用组件                    |
| -------- | ------------ | --------------------------- |
| parallax | 视差插槽区域 | [`parallax`](./parallax.md) |
