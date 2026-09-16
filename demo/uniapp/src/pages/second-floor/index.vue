<script setup lang="ts">
import type {
  CooluiNavBarConfig,
  CooluiSecondFloorInstance,
  CooluiSecondFloorRefreshConfig,
  CooluiSecondFloorTip,
} from 'coolui-scroller-uni/types'
import type { DemoChangeEvent, DemoSecondFloorType } from '../../types'

const refreshConfig: CooluiSecondFloorRefreshConfig = {
  downText: '下拉刷新',
  loadingText: '正在加载',
  backText: '返回首页',
  tipText: '松开刷新',
  moreText: '继续下拉有惊喜~',
}
const navBarConfig: CooluiNavBarConfig = {
  back: {
    show: true,
    click: () => {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
  background: {
    color: '#d13435',
  },
  text: {
    color: '#fff',
  },
}
const pic: { tb: string; elm: string } = {
  tb: 'https://test.wzs.pub/pic/second-floor-bg.jpeg',
  elm: 'https://test.wzs.pub/pic/2lou/elm.jpg',
}
const val = ref(0)
const type = ref<DemoSecondFloorType>('bottom')
const types: { value: DemoSecondFloorType; name: string }[] = [
  { value: 'top', name: 'top' },
  { value: 'center', name: 'center' },
  { value: 'bottom', name: 'bottom' },
  // { value: "scale", name: "scale" },
]
const newPage = ref(false)
const scale = ref(false)
const show = ref(false)
const duration = ref(300)
const position = ref('right')
const round = ref(false)
const overlay = ref(true)
const customStyle = ref('')
const overlayStyle = ref('')
const statusBarHeight = ref(0)
const tip = ref<CooluiSecondFloorTip>({
  show: false,
  height: 200,
  times: 1,
  duration: 2000,
})
const offset = ref(false)

const mySecondFloor = ref<CooluiSecondFloorInstance | null>(null)

onLoad(() => {
  const t = uni.getStorageSync('type')
  if (t) {
    type.value = t
  }
  const np = uni.getStorageSync('newPage')
  if (np) {
    newPage.value = np
  }
  const sc = uni.getStorageSync('scale')
  if (sc) {
    scale.value = sc
  }
  const of = uni.getStorageSync('offset')
  if (of) {
    offset.value = of
  }
  const tp = uni.getStorageSync('offset')
  if (tp) {
    tip.value = {
      show: tp,
      height: 200,
      times: 1,
      duration: 2000,
    }
  }
  // 取得状态栏高度（自定义导航栏）；getWindowInfo 不会触发弃用告警
  const info = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync()
  statusBarHeight.value = info.statusBarHeight || 0
})

const onRefresh = () => {
  // 模拟请求延时
  setTimeout(() => {
    // 设置回弹
    mySecondFloor.value.settriggered().then(() => {
      uni.showToast({
        title: '执行回弹成功',
        icon: 'success',
      })
    })
  }, 2000)
}
const onSecondShow = () => {
  console.log('二楼已加载')
  // 如果设置了弹出新页 则控制show
  if (newPage.value) {
    setTimeout(() => {
      show.value = true
    }, 500)
  }
}
const onSecondBack = () => {
  console.log('二楼已关闭')
}
const radioChange = (e: DemoChangeEvent<DemoSecondFloorType>) => {
  type.value = e.detail.value
  uni.setStorageSync('type', e.detail.value)
}
const exit = () => {
  mySecondFloor.value.back().then(() => {
    show.value = false
  })
}
/**
 * switch 的 change 事件取值
 * `<switch>` 与 SVG 的 switch 同名，模板上按 DOM 的 Event 校验，故这里断言成小程序事件对象
 */
const switchValue = (e: Event) => (e as unknown as DemoChangeEvent<boolean>).detail.value

const switchChange = (e: Event) => {
  const value = switchValue(e)
  newPage.value = value
  uni.setStorageSync('newPage', value)
}
const scaleChange = (e: Event) => {
  const value = switchValue(e)
  scale.value = value
  uni.setStorageSync('scale', value)
}
const offsetChange = (e: Event) => {
  const value = switchValue(e)
  offset.value = value
  nextTick(() => {
    mySecondFloor.value.init()
  })
  uni.setStorageSync('offset', value)
}
const tipChange = (e: Event) => {
  const value = switchValue(e)
  tip.value = {
    show: value,
    height: 200,
    times: 1,
    duration: 2000,
  }
  nextTick(() => {
    mySecondFloor.value.init()
  })
  uni.setStorageSync('offset', value)
}
</script>

<template>
  <view class="second-floor-page">
    <coolui-scroller-second-floor
      ref="mySecondFloor"
      class="my-second-floor"
      :threshold="val"
      :offset="offset ? 100 : 0"
      :center="type === 'center'"
      :bottom="type === 'bottom'"
      :top="type === 'top'"
      :scale="scale"
      :tip="tip"
      @refresh="onRefresh"
      @secondShow="onSecondShow"
      @secondBack="onSecondBack"
    >
      <template #second-floor>
        <view class="second-floor" style="background: rgba(0, 0, 0, 0.5);">
          <view>我是二楼顶部</view>
          <view>我是二楼中部</view>
          <view>我是二楼底部</view>
        </view>
      </template>

      <template #second-floor-refresh>
        <coolui-scroller-second-floor-refresh :refreshConfig="refreshConfig" />
      </template>

      <template #nav-bar>
        <coolui-scroller-nav-bar :config="navBarConfig">下拉二楼</coolui-scroller-nav-bar>
      </template>

      <view class="demopage">
        <view class="pannel-inner">
          <view class="scroller-pannel">
            <view>
              <view class="title">下拉二楼效果</view>
              <view class="des">轻滑下拉松手刷新，滑动到超过一定距离，下拉二楼展开，可写入活动页面等有趣的内容</view>
              <view class="des">二楼位置设置:</view>
              <radio-group @change="radioChange">
                <label
                  v-for="item in types"
                  :key="item.value"
                  class="weui-cell weui-check__label"
                >
                  <view class="weui-cell__hd">
                    <radio color="#d13435" :value="item.value" :checked="item.value === type" />
                  </view>
                  <view class="weui-cell__bd">{{ item.name }}</view>
                </label>
              </radio-group>
              <view class="des">是否开启缩放:</view>
              <switch color="#d13435" :checked="scale" @change="scaleChange" />
              <view class="des">是否弹出新页面:</view>
              <switch color="#d13435" :checked="newPage" @change="switchChange" />
              <view class="des">是否开启自动下拉提示:</view>
              <switch color="#d13435" :checked="tip.show" @change="tipChange" />
              <view class="des">设置offset 100:</view>
              <switch color="#d13435" :checked="offset" @change="offsetChange" />
              <view class="downtip">下拉查看效果</view>
              <view class="downicon">
                <view class="line"></view>
                <view class="line"></view>
                <view class="line"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </coolui-scroller-second-floor>

    <!-- page-container 是微信内置组件，只在微信端渲染 -->
    <!-- #ifdef MP-WEIXIN -->
    <page-container
      :show="show"
      :round="round"
      :overlay="overlay"
      :duration="duration"
      :position="position"
      :close-on-slide-down="false"
      :custom-style="customStyle"
      :overlay-style="overlayStyle"
    >
      <view class="detail-page">
        <button :type="'primary' as any" @tap="exit">退出</button>
      </view>
    </page-container>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <!-- 其它端用固定定位浮层等价替代（按 position 对齐、点击遮罩关闭） -->
    <view
      v-if="show"
      class="detail-overlay"
      :class="'detail-overlay--' + position"
      :style="overlayStyle"
      @tap="exit"
    >
      <view class="detail-page" :style="customStyle" @tap.stop>
        <button :type="'primary' as any" @tap="exit">退出</button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<style lang="scss" scoped>
/* #ifndef MP-WEIXIN */
/* page-container 的等价替代：固定浮层 + 按 position 对齐的面板 */
.detail-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  background: rgba(0, 0, 0, 0.4);

  &.detail-overlay--right {
    justify-content: flex-end;
  }

  &.detail-overlay--left {
    justify-content: flex-start;
  }

  &.detail-overlay--top {
    align-items: flex-start;
  }

  &.detail-overlay--bottom {
    align-items: flex-end;
  }

  &.detail-overlay--center {
    align-items: center;
    justify-content: center;
  }

  .detail-page {
    box-sizing: border-box;
    width: 70vw;
    height: 100vh;
    padding: 30rpx;
    background: #ffffff;
  }
}
/* #endif */

.second-floor-page {
  height: 100vh;
}

.second-floor {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;

  view {
    padding: 80rpx;
  }
}

.weui-cell.weui-check__label {
  display: flex;
  align-items: center;
}

.demopage {
  min-height: 100% !important;

  .pannel-inner {
    .scroller-pannel {
      .des {
        text-align: left;
        margin-bottom: 20rpx;
      }
    }
  }
}

radio-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

switch {
  margin-bottom: 20rpx;
}

.detail-page {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
page {
  background-color: #d13435;
}
</style>