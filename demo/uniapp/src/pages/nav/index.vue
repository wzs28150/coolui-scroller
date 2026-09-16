<script setup lang="ts">
import type { CooluiScrollerNavItem } from 'coolui-scroller-uni/types'
import type {
  DemoNavChangeEvent,
  DemoNavColorConfig,
  DemoTapEvent,
  DemoTouchEvent,
} from '../../types'

const nav: CooluiScrollerNavItem[] = [
  { id: 1, title: '分类1分类1分类1分类1' },
  { id: 2, title: '分类2' },
  { id: 3, title: '分类3' },
  { id: 4, title: '分类4' },
  { id: 5, title: '分类5' },
  { id: 6, title: '分类6' },
  { id: 7, title: '分类7' },
]
const active = ref(0)
const type = ref('line')
const border = ref(true)
const navPerView = ref<number | string>(3.5)
const spaceBetween = ref(0)
const touchx = ref(0)
const touchy = ref(0)
const textLine: DemoNavColorConfig = { color: '#333', activeColor: '#d13435' }
const backgroundLine: DemoNavColorConfig = { color: '#333', activeColor: '#d13435' }
const textPlain: DemoNavColorConfig = { color: '#ccc', activeColor: '#d13435' }
const backgroundPlain: DemoNavColorConfig = { color: '#ccc', activeColor: '#d13435' }
const text: DemoNavColorConfig = { color: '#333', activeColor: '#fff' }
const background: DemoNavColorConfig = { color: '#ccc', activeColor: '#d13435' }

const test = () => {}
const onChange = (e: DemoNavChangeEvent) => {
  uni.showToast({
    title: 'change方法返回id:' + e.id,
    icon: 'none',
    duration: 2000,
  })
}
const TouchStart = (e: DemoTouchEvent) => {
  touchx.value = e.changedTouches[0].clientX
  touchy.value = e.changedTouches[0].clientY
}
const TouchEnd = (e: DemoTouchEvent) => {
  const x = e.changedTouches[0].clientX
  const y = e.changedTouches[0].clientY
  let turn = ''
  if (x - touchx.value > 50 && Math.abs(y - touchy.value) < 50) {
    //右滑
    turn = 'right'
  } else if (x - touchx.value < -50 && Math.abs(y - touchy.value) < 50) {
    //左滑
    turn = 'left'
  }
  //根据方向进行操作
  if (turn == 'right') {
    //从左往右
    if (active.value != 0) {
      active.value = active.value - 1
    }
  }
  if (turn == 'left') {
    //从右往左
    if (active.value < nav.length - 1) {
      active.value = active.value + 1
    }
  }
}
const changeType = (e: DemoTapEvent) => {
  const t = e.currentTarget.dataset.type
  type.value = t
  navPerView.value = t !== 'line' ? 'auto' : navPerView.value
  spaceBetween.value = t !== 'line' ? 20 : spaceBetween.value
}
const changeNavPerView = (e: DemoTapEvent) => {
  const t = e.currentTarget.dataset.type
  navPerView.value = t === 'auto' ? 'auto' : Number(t)
}
const changeSpaceBetween = (e: DemoTapEvent) => {
  spaceBetween.value = Number(e.currentTarget.dataset.type)
}
const borderChange = () => {
  border.value = !border.value
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title+" @tap="test">分类组件</view>
      <!-- 基础使用 -->
      <view class="content" style="padding-bottom: 0">
        置于滚动组件头部插槽中,用于切换分类。active为选中的index值,可设置间距、显示类型、显示个数等，可添加touch事件左右侧滑切换改变active。来切换分类导航
      </view>
      <view class="pannel-inner" @touchstart="TouchStart" @touchend="TouchEnd">
        <coolui-scroller-nav
          :navPerView="navPerView"
          :spaceBetween="spaceBetween"
          :type="type"
          :border="border"
          :list="nav"
          v-model:active="active"
          :text="type === 'line' ? textLine : (type === 'plain' ? textPlain : text)"
          :background="type === 'line' ? backgroundLine : (type === 'plain' ? backgroundPlain : background)"
          @change="onChange"
        />
        <view class="nav-pannel">
          <view>
            <view>当前分类: {{ nav[active].id }}</view>
            <view class="btn">
              切换类型:
              <button :class="type === 'line' ? 'on' : ''" @tap="changeType" data-type="line">
                line
              </button>
              <button :class="type === 'round' ? 'on' : ''" @tap="changeType" data-type="round">
                round，
              </button>
              <button :class="type === 'plain' ? 'on' : ''" @tap="changeType" data-type="plain">
                plain
              </button>
            </view>
            <view class="btn">
              显示底边:
              <switch class="switch" color="#d13435" :checked="border" @change="borderChange" />
            </view>
            <view class="btn">
              显示个数:
              <button :class="navPerView === 'auto' ? 'on' : ''" @tap="changeNavPerView" data-type="auto">
                auto
              </button>
              <button :class="navPerView === 3.5 ? 'on' : ''" @tap="changeNavPerView" :data-type="3.5">
                3.5
              </button>
            </view>
            <view class="btn">
              设置间距:
              <button :class="spaceBetween === 0 ? 'on' : ''" @tap="changeSpaceBetween" :data-type="0">
                0
              </button>
              <button :class="spaceBetween === 20 ? 'on' : ''" @tap="changeSpaceBetween" :data-type="20">
                20
              </button>
            </view>
          </view>
        </view>
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
   这里只改最小高度：内容更高时页面仍可正常滚动，内容不满一屏时则不会出现滚动条。 */
.page {
  min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */

.pannel {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background-color: #fff;
  padding: 0 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pannel .title {
  font-size: 32rpx;
  line-height: 32rpx;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0 20rpx 30rpx;
  position: relative;
}

.pannel .title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #d13435;
  width: 8rpx;
  height: 32rpx;
  border-radius: 8rpx;
}

.pannel .content {
  font-size: 28rpx;
  color: #666;
  padding: 30rpx 0;
}

.pannel .pannel-inner {
  flex: 1;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
}

.pannel .pannel-inner .nav-pannel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.pannel .pannel-inner .nav-pannel .btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.pannel .pannel-inner .nav-pannel .btn button {
  background-color: #fff;
  color: #d13435;
  border-color: #d13435;
  font-size: 28rpx;
  display: inline-block;
  margin-right: 10px;
  margin-left: 0;
}

.pannel .pannel-inner .nav-pannel .btn button:first-child {
  margin-left: 5px;
}

.pannel .pannel-inner .nav-pannel .btn button.on {
  background-color: #d13435;
  color: #fff;
}

.pannel .pannel-inner .nav-pannel .btn .switch {
  margin-left: 5px;
}
</style>