<script setup lang="ts">
import type {
  CooluiRefreshConfig,
  CooluiScrollerApi,
  CooluiScrollerNavItem,
} from 'coolui-scroller-uni/types'
import type {
  DemoNavChangeEvent,
  DemoNavColorConfig,
  DemoRefreshState,
} from '../../types'

const val = ref(0)
const refreshstate = ref<DemoRefreshState>('pulldown')
const active = ref(1) // 当前选中的Index值

const defaultSetting: CooluiRefreshConfig = {
  shake: true,
  style: 'black', // 设置圆点深色还是浅色
  // 关键：下拉高度(background.height) 大于 refresh 自身高度(height)，
  // 松手后先回落到 refresh 高度显示加载动画，刷新完成再整体回弹（与"基础效果"同一机制）
  height: 50,
  background: { color: '#eeeeee', height: 120 },
}
const baseConfig: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  text: {
    color: '#fff', // 文字颜色
    shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
  },
  background: {
    color: '#000000',
    height: 120,
    img: 'https://test.wzs.pub/pic/bg.jpg',
  },
}
const logoConfig: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  text: {
    content: 'coolui-scroller',
    font: 'Lobster variant0',
    size: '50',
    color: '#ccc', // 文字颜色
    shadow: 0, // 设置0
    img: 'https://test.wzs.pub/pic/bg2.jpg',
  },
  background: {
    color: '#f2f2f2',
    height: 120,
    // img: 'https://test.wzs.pub/pic/bg.jpg',
  },
}
const gifSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  background: {
    color: '#eeeeee',
    img: 'https://test.wzs.pub/pic/tm_mui_bike.gif',
  },
}
const parallaxSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  background: { color: '#eeeeee' },
}
const parallaxDemoSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  background: { color: '#ffaf1b' },
}
const jdSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 80,
  background: { color: '#eeeeee' },
}
const elmSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 80,
  isAutoTriggered: false,
  background: { color: '#eeeeee' },
}
const nav: CooluiScrollerNavItem[] = [
  { id: 1, title: '原生效果', description: '不使用组件' },
  { id: 2, title: '基础效果', description: '使用组件' },
  { id: 3, title: 'logo文字效果', description: '使用组件' },
  { id: 4, title: 'gif背景效果', description: '隐藏文字将背景设为动图' },
  { id: 5, title: '视差效果1', description: '搭配视差子组件实现' },
  { id: 6, title: '视差效果2', description: '搭配视差子组件实现' },
  { id: 7, title: '视差效果3', description: '搭配视差子组件实现' },
  { id: 8, title: '京东效果' },
  { id: 9, title: '饿了么效果' },
]
const text: DemoNavColorConfig = { color: '#666', activeColor: '#fff' }
const background: DemoNavColorConfig = { color: '#ccc', activeColor: '#d13435' }

const elmScroller = ref<CooluiScrollerApi | null>(null)

const test = () => {}
const onChange = (e: DemoNavChangeEvent) => {
  active.value = e.index
}
const onRefresh = () => {
  uni.showToast({
    title: '执行页面刷新数据',
    icon: 'success',
  })
}
const diyRefresh = () => {
  console.log('执行自定义下拉刷新')
  setTimeout(() => {
    elmScroller.value.settriggered(false).then(() => {
      uni.showToast({
        title: '执行回弹成功',
        icon: 'success',
      })
    })
  }, 2000) // 自定义回弹时间
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title" @tap="test">下拉刷新组件</view>
      <coolui-scroller-nav
        :border="false"
        :spaceBetween="20"
        :list="nav"
        :text="text"
        :background="background"
        navPerView="auto"
        type="round"
        :active="active"
        @change="onChange"
      />
      <!-- 基础使用 -->
      <view class="content" style="padding-bottom: 0">
        {{ nav[active].title }}
        <view class="tip">
          {{ nav[active].description }}
          {{ active == 7 ? 'threshold：' + val : '' }}
          {{ active == 8 ? 'refreshstate：' + refreshstate : '' }}
        </view>
      </view>
      <view class="pannel-inner" v-if="active == 0">
        <coolui-scroller is-back-btn background="#f2f2f2">
          <template #refresh>
            <coolui-scroller-refresh type="default" :config="defaultSetting" />
          </template>
          <view class="scroller-pannel">下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 1">
        <coolui-scroller is-back-btn background="#f2f2f2">
          <template #refresh>
            <coolui-scroller-refresh type="base" :config="baseConfig" />
          </template>
          <view class="scroller-pannel">下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 2">
        <coolui-scroller is-back-btn background="#f2f2f2">
          <template #refresh>
            <coolui-scroller-refresh type="logoText" :config="logoConfig" />
          </template>
          <view class="scroller-pannel">下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 3">
        <coolui-scroller is-back-btn>
          <template #refresh>
            <coolui-scroller-refresh :config="gifSetting" type="diy" />
          </template>
          <view class="scroller-pannel">天猫动图,下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 4">
        <coolui-scroller is-back-btn>
          <template #refresh>
            <coolui-scroller-refresh type="diy" :config="parallaxSetting">
              <template #parallax>
                <coolui-scroller-parallax
                  class="parallax-item parallax-item1"
                  direction="to top"
                  :parallax="35"
                >从下往上</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-item parallax-item2"
                  direction="to bottom"
                  :parallax="35"
                >从上往下</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-item parallax-item4"
                  direction="to right"
                  :parallax="50"
                >从左往右</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-item parallax-item3"
                  direction="to left"
                  :parallax="50"
                >从右往左</coolui-scroller-parallax>
              </template>
            </coolui-scroller-refresh>
          </template>
          <view class="scroller-pannel">不同方向,下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 5">
        <coolui-scroller is-back-btn>
          <template #refresh>
            <coolui-scroller-refresh type="diy" :config="parallaxSetting">
              <template #parallax>
                <coolui-scroller-parallax
                  class="parallax-sitem parallax-item1"
                  direction="to top"
                  :parallax="0"
                >视差2</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-sitem parallax-item2"
                  direction="to top"
                  :parallax="8"
                >视差3</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-sitem parallax-item3"
                  direction="to top"
                  :parallax="-8"
                >视差1</coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-sitem parallax-item4"
                  direction="to top"
                  :parallax="16"
                >视差4</coolui-scroller-parallax>
              </template>
            </coolui-scroller-refresh>
          </template>
          <view class="scroller-pannel">同方向不同位移数值,下拉查看效果</view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 6">
        <coolui-scroller>
          <template #refresh>
            <coolui-scroller-refresh type="diy" :config="parallaxDemoSetting">
              <template #parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem1"
                  direction="to bottom"
                  :parallax="0"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax0.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem1"
                  direction="to bottom"
                  :parallax="7"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax1.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem2"
                  direction="to bottom"
                  :parallax="14"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax2.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem3"
                  direction="to bottom"
                  :parallax="21"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax3.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem4"
                  direction="to bottom"
                  :parallax="28"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax4.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem5"
                  direction="to bottom"
                  :parallax="35"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax5.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem6"
                  direction="to bottom"
                  :parallax="42"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax6.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem7"
                  direction="to bottom"
                  :parallax="49"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax7.png"
                  />
                </coolui-scroller-parallax>
                <coolui-scroller-parallax
                  class="parallax-demoitem parallax-demoitem8"
                  direction="to bottom"
                  :parallax="56"
                >
                  <image
                    class="img"
                    mode="scaleToFill"
                    src="https://test.wzs.pub/pic/parallax8.png"
                  />
                </coolui-scroller-parallax>
              </template>
            </coolui-scroller-refresh>
          </template>
          <view class="scroller-pannel">
            <view style="text-align: center;">
              <view>多元素位移实现场景</view>
              <view>下拉查看效果</view>
            </view>
          </view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 7">
        <coolui-scroller is-back-btn>
          <template #refresh>
            <coolui-scroller-refresh
              type="diy"
              class="jd-refresh"
              v-model:threshold="val"
              :config="jdSetting"
            >
              <view class="jd-wapper">
                <view class="img" v-if="val == 1" />
                <block v-else>
                  <view
                    class="moveimg"
                    :style="'transform: scale(' + val + ') translateX(' + (-100 + val * 90) + 'px);'"
                  />
                  <view
                    class="moveimg2"
                    :style="'transform: translateY(' + (-100 + val * 100) + 'px);'"
                  />
                </block>
              </view>
              <view class="text">让购物更便捷</view>
            </coolui-scroller-refresh>
          </template>
          <view class="scroller-pannel">
            <view style="text-align: center;">
              <view>自定义描述场景贴合应用内容</view>
              <view>使用threshold数值变化控制动画</view>
              <view>下拉查看效果</view>
            </view>
          </view>
        </coolui-scroller>
      </view>
      <view class="pannel-inner" v-if="active == 8">
        <coolui-scroller
          is-back-btn
          ref="elmScroller"
          class="elm-scroller"
          @refresh="diyRefresh"
        >
          <template #refresh>
            <coolui-scroller-refresh
              type="diy"
              class="elm-refresh"
              v-model:threshold="val"
              v-model:refreshstate="refreshstate"
              :config="elmSetting"
            >
              <view class="elm-wapper">
                <view>
                  <view class="text">
                    <block v-if="refreshstate == 'pulldown'">下拉刷新</block>
                    <block v-else-if="refreshstate == 'loosen'">松手刷新</block>
                    <block v-else-if="refreshstate == 'loading'">刷新中</block>
                  </view>
                  <view class="exb"></view>
                </view>
              </view>
            </coolui-scroller-refresh>
          </template>
          <view class="scroller-pannel">
            <view style="text-align: center;">
              <view>自定义使用吉祥物增加乐趣</view>
              <view>使用refreshstate状态控制动画</view>
              <view>设置非自动回弹，可查看源码是如何操作的</view>
              <view>下拉查看效果</view>
            </view>
          </view>
        </coolui-scroller>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* #ifdef H5 */
/* H5 端 uni 会额外渲染内置导航栏（--window-top，44px），100vh 没扣掉这一截会多出页面级滚动条。
   本页内容是固定组合，所以直接固定成可视区高度，配合 .page 的 overflow:hidden
   把内层手算常量的零点几 px 误差吃掉，不产生滚动条、也不影响内容区高度。 */
.page {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
  min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */
.page .pannel {
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.page .pannel .tip {
  float: right;
  color: #999;
  font-size: 24rpx;
}
.page .pannel .pannel-inner {
  margin: 20rpx 0;
  padding: 0;
  height: calc(100vh - 60rpx - 74rpx - 66rpx - 40rpx - 2px - 84rpx);
  border: 1px solid #eee;
  overflow: hidden;
}
.page .pannel .pannel-inner .scroller-pannel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60rpx - 74rpx - 66rpx - 40rpx - 2px - 84rpx);
  font-size: 28rpx;
  color: #999;
  flex: 1;
}

/* #ifdef H5 */
/* 内层高度是 calc(100vh - 常量) 手算的：H5 的 .page 比 100vh 少了导航栏那一截，
   内层不跟着扣掉就会比滚动区高 44px，scroller 内部出现滚动条。
   这里外层、内层同减导航栏高度，保证两边相等（仍保持确定高度，scroller 的高度测量不受影响）。 */
.page .pannel .pannel-inner,
.page .pannel .pannel-inner .scroller-pannel {
  height: calc(
    100vh - 60rpx - 74rpx - 66rpx - 40rpx - 2px - 84rpx - var(--window-top, 0px) -
      var(--window-bottom, 0px)
  );
}
/* #endif */
.page .pannel .pannel-inner .scroller-pannel .logoText {
  font-size: 50rpx;
  font-weight: bold;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: cover;
  background-image: url(https://test.wzs.pub/pic/bg2.jpg);
  animation: play2 3s infinite linear;
  text-shadow: 0 0 1rpx #000 outset;
}
.page .pannel .pannel-inner .parallax-item {
  color: #000;
  font-size: 28rpx;
  height: 1em;
  line-height: 1em;
}
.page .pannel .pannel-inner .parallax-item.parallax-item1 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: -2em;
}
.page .pannel .pannel-inner .parallax-item.parallax-item2 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: -2em;
}
.page .pannel .pannel-inner .parallax-item.parallax-item3 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: -4em;
}
.page .pannel .pannel-inner .parallax-item.parallax-item4 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
}
.page .pannel .pannel-inner .parallax-sitem {
  color: #000;
  font-size: 28rpx;
  height: 1em;
  line-height: 1em;
}
.page .pannel .pannel-inner .parallax-sitem.parallax-item1 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: -3em;
}
.page .pannel .pannel-inner .parallax-sitem.parallax-item2 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: 0em;
}
.page .pannel .pannel-inner .parallax-sitem.parallax-item3 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: -6em;
}
.page .pannel .pannel-inner .parallax-sitem.parallax-item4 {
  top: 50%;
  left: 50%;
  margin-top: -0.5em;
  margin-left: 3em;
}
.page .pannel .pannel-inner .parallax-demoitem {
  width: 100%;
  height: 70px;
  top: 0;
  left: 0;
}
.page .pannel .pannel-inner .parallax-demoitem .img {
  width: 100%;
  height: 70px;
}
.page .pannel .pannel-inner .jd-refresh {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  position: relative;
}
.page .pannel .pannel-inner .jd-wapper {
  width: 26px;
  height: 40px;
  margin-right: 20rpx;
  position: relative;
}
.page .pannel .pannel-inner .jd-wapper .moveimg {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a2a.png');
  position: absolute;
  left: 0;
  top: 0;
}
.page .pannel .pannel-inner .jd-wapper .moveimg2 {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a29.png');
  position: absolute;
  left: 0;
  top: 0;
}
.page .pannel .pannel-inner .jd-wapper .img {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a.png');
  animation: move 0.5s steps(3) infinite;
}
.page .pannel .pannel-inner .elm-refresh .elm-wapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}
.page .pannel .pannel-inner .elm-refresh .elm-wapper .text {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 10px;
}
.page .pannel .pannel-inner .elm-refresh .exb {
  width: 30px;
  height: 30px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/refresh_icon2.png');
  animation: play2 0.8s steps(4) infinite;
  margin: 0 auto;
}

.text-img {
  width: 26px;
  height: 40px;
  background-size: cover;
  background-image: url('https://test.wzs.pub/pic/a.png');
  animation: move 0.5s steps(3) infinite;
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
@keyframes move {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: -81px 0px;
  }
}
</style>

<style lang="scss">
page {
  height: 100%;
}
</style>