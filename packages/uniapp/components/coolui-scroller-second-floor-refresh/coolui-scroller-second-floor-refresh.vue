<template>
  <view
    class="second-floor-refresh"
    :class="'second-floor-refresh-' + status"
    :style="rootStyle"
    @tap="back"
  >
    <view
      v-if="p < scrollHeight / 3"
      class="circle"
      :class="isLoading ? 'loading' : ''"
      :style="{ borderColor: mergedConfig.color }"
    >
      <view class="left">
        <view
          class="leftcircle"
          :style="{
            transform: 'rotate(' + leftDeg + 'deg)',
            borderColor: mergedConfig.color,
          }"
        ></view>
      </view>
      <view class="right">
        <view
          class="rightcircle"
          :style="{
            transform: 'rotate(' + rightDeg + 'deg)',
            borderColor: mergedConfig.color,
          }"
        ></view>
      </view>
      <view
        class="downicon"
        :class="p < scrollHeight / 3 && p > scrollHeight / 6 ? 'up' : ''"
      >
        <view class="line"></view>
        <view class="line"></view>
        <view class="line"></view>
      </view>
    </view>
    <text class="refresh-text">{{ text }}</text>
  </view>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { deepMerge } from '../../utils/platform.js'

const defaultConfig = {
  loadingText: '正在加载',
  backText: '返回首页',
  downText: '下拉刷新',
  tipText: '松开刷新,继续下拉有惊喜~',
  moreText: '继续下拉有惊喜~',
  color: '#ffffff',
}

const props = defineProps({
  refreshConfig: {
    type: Object,
    default: () => ({}),
  },
  // 返回首页（back）状态的背景色，仅传入的页面（如淘宝）才带背景；不传则无背景
  backBgColor: {
    type: String,
    default: '',
  },
})

const cooluiSecondFloor = inject('cooluiSecondFloor', null)

const text = ref('')
const isLoading = ref(false)
const isFloorShow = ref(false)
const p = ref(0)
const scrollHeight = ref(0)
const status = ref('down')

const mergedConfig = computed(() => deepMerge(defaultConfig, props.refreshConfig))
const rootStyle = computed(() => {
  const style = { color: mergedConfig.value.color }
  // 仅在返回首页（back）状态且页面传入了底色时，才给背景色（满宽由 :host 撑满）
  if (status.value === 'back' && props.backBgColor) {
    style.backgroundColor = props.backBgColor
  }
  return style
})
const leftDeg = computed(() => (p.value < 50 ? 45 - p.value * 3.6 : -135))
const rightDeg = computed(() => {
  if (p.value >= 50 && p.value <= 100) {
    return 45 - (p.value - 50) * 3.6
  }
  return p.value > 100 ? -135 : 45
})

onMounted(() => {
  if (cooluiSecondFloor && cooluiSecondFloor.registerRefresh) {
    // second-floor 会调用这些方法，需以普通对象注册（vm.proxy 不含内部绑定）
    cooluiSecondFloor.registerRefresh({
      setScrollHeight,
      setText,
      setLoading,
      setDown,
      setSecondShow,
    })
  }
  text.value = mergedConfig.value.downText
})

const setScrollHeight = (height) => {
  scrollHeight.value = height
}
const setText = (val) => {
  if (val > 0 && val <= scrollHeight.value / 6) {
    if (text.value !== mergedConfig.value.downText) {
      text.value = mergedConfig.value.downText
      status.value = 'down'
    }
  } else if (val > scrollHeight.value / 6 && val <= scrollHeight.value / 3) {
    if (text.value !== mergedConfig.value.tipText) {
      text.value = mergedConfig.value.tipText
      status.value = 'tip'
    }
  } else {
    if (text.value !== mergedConfig.value.moreText) {
      text.value = mergedConfig.value.moreText
      status.value = 'more'
    }
  }
  p.value = val
}
const setLoading = (flag) => {
  isLoading.value = flag
  status.value = 'loading'
  text.value = mergedConfig.value.loadingText
}
const setDown = () => {
  isLoading.value = false
  text.value = mergedConfig.value.downText
  p.value = 0
  status.value = 'down'
}
const setSecondShow = (flag) => {
  isFloorShow.value = flag
  text.value = flag ? mergedConfig.value.backText : ''
  status.value = 'back'
}
const back = () => {
  if (isFloorShow.value && cooluiSecondFloor) {
    cooluiSecondFloor.back()
  }
}

// 供 second-floor 组件跨组件调用
defineExpose({
  setScrollHeight,
  setText,
  setLoading,
  setDown,
  setSecondShow,
})
</script>

<style>
/* 撑满宿主节点（与原生 :host 一致），否则被父级 .second-floor-text 的 flex 居中塌缩成内容宽 */
:host {
  display: block;
  width: 100%;
  font-size: 28rpx;
}

.second-floor-refresh {
  display: block;
  width: 100%;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  line-height: 1em;
}

.second-floor-refresh .circle {
  display: flex;
  width: 48rpx;
  height: 48rpx;
  margin-right: 20rpx;
  position: relative;
  border: none;
}

.second-floor-refresh .circle.loading {
  border: 1px dashed;
  border-radius: 100%;
  animation: secondFloorLoading 1s infinite linear;
}

@keyframes secondFloorLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.second-floor-refresh .left {
  width: 12px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.second-floor-refresh .leftcircle {
  width: 22px;
  height: 22px;
  border: 1px solid;
  position: absolute;
  border-radius: 50%;
  left: 0rpx;
  top: 0rpx;
  border-bottom: 1px solid transparent !important;
  border-left: 1px solid transparent !important;
  transform: rotate(45deg);
}

.second-floor-refresh .right {
  width: 12px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.second-floor-refresh .rightcircle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid;
  position: absolute;
  border-top: 1px solid transparent !important;
  border-right: 1px solid transparent !important;
  right: 0rpx;
  top: 0rpx;
  transform: rotate(45deg);
}

.second-floor-refresh .circle.loading .leftcircle,
.second-floor-refresh .circle.loading .rightcircle {
  border: none;
}

.second-floor-refresh .downicon {
  width: 12rpx;
  height: 12rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.second-floor-refresh .downicon .line:nth-child(1) {
  display: block;
  width: 1px;
  height: 22rpx;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2rpx;
  opacity: 1;
}

.second-floor-refresh .downicon .line:nth-child(2) {
  width: 15rpx;
  height: 1px;
  background-color: #fff;
  display: block;
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: rotate(-45deg);
  transform-origin: 0 50%;
  border-radius: 2rpx;
  opacity: 1;
}

.second-floor-refresh .downicon .line:nth-child(3) {
  width: 15rpx;
  height: 1px;
  background-color: #fff;
  display: block;
  position: absolute;
  bottom: -3px;
  right: 50%;
  transform: rotate(45deg);
  transform-origin: 100% 50%;
  border-radius: 2rpx;
  opacity: 1;
}

.second-floor-refresh .circle.loading .downicon {
  display: none;
}

.second-floor-refresh .refresh-text {
  display: block;
  text-align: center;
  line-height: 1.5em;
}

/* 返回首页（back）状态：背景色由 back-bg-color prop 动态控制（只有淘宝页传值），组件本身不写死 */
.second-floor-refresh.second-floor-refresh-back {
  text-align: center;
}
</style>
