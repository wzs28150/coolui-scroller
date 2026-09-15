<template>
  <view
    class="coolui-scroller-refresh"
    :class="type === 'diy' ? 'coolui-scroller-refresh-diy' : ''"
    :style="{
      height: mergedConfig.height + 'px',
      backgroundImage: mergedConfig.background && mergedConfig.background.img
        ? 'url(' + mergedConfig.background.img + ')'
        : 'none',
      paddingTop:
        (mergedConfig.background && mergedConfig.background.height
          ? mergedConfig.background.height - mergedConfig.height
          : 0) + 'px',
    }"
  >
    <!-- 内置原生风格三点效果（跨端实现） -->
    <view class="refresh-inner" v-if="type === 'default'">
      <view class="cool-loading-dots" :class="mergedConfig.style === 'white' ? 'white' : 'black'">
        <view class="dot"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>
    <!-- 基础效果 -->
    <view
      class="refresh-inner"
      v-if="type === 'base'"
      :style="{
        height: mergedConfig.height + 'px',
        color: textColor,
        textShadow:
          mergedConfig.text && mergedConfig.text.shadow
            ? '0 0 ' + mergedConfig.text.shadow + 'rpx ' + textColor
            : 'none',
      }"
    >
      <view
        class="down"
        :class="triggered && isloading ? 'loading' : ''"
        :style="{ transform: 'rotate(' + thresholdInner * 180 + 'deg)' }"
      >
        <view
          class="line"
          :style="{
            borderColor: textColor + ' transparent transparent',
            backgroundColor:
              triggered && isloading ? 'transparent' : textColor,
          }"
        ></view>
        <view
          class="line"
          :style="{
            borderColor: textColor + ' transparent transparent',
            backgroundColor:
              triggered && isloading ? 'transparent' : textColor,
          }"
        ></view>
        <view
          class="line"
          :style="{
            borderColor: textColor + ' transparent transparent',
            backgroundColor:
              triggered && isloading ? 'transparent' : textColor,
          }"
        ></view>
      </view>
      <text v-if="refreshstate === 'pulldown'">下拉刷新</text>
      <text v-else-if="refreshstate === 'loosen'">松手刷新</text>
      <text v-else-if="refreshstate === 'loading'">刷新中...</text>
    </view>
    <!-- LOGO 文字效果 -->
    <view
      class="refresh-inner"
      v-if="type === 'logoText'"
      :style="{ height: mergedConfig.height + 'px' }"
    >
      <text
        class="logo-text"
        :class="[
          mergedConfig.text && mergedConfig.text.img ? 'has-bg' : '',
          triggered && isloading ? 'loading' : '',
        ]"
        :style="{
          fontSize: (mergedConfig.text && mergedConfig.text.size || 50) + 'rpx',
          lineHeight: (mergedConfig.text && mergedConfig.text.size || 50) + 'rpx',
          color: textColor,
          backgroundImage:
            mergedConfig.text && mergedConfig.text.img
              ? 'url(' + mergedConfig.text.img + ')'
              : 'none',
          backgroundPosition:
            -textWidth + thresholdInner * textWidth + 'px center',
          textShadow:
            mergedConfig.text && mergedConfig.text.shadow
              ? '0 0 ' + mergedConfig.text.shadow + 'rpx ' + textColor
              : 'none',
          fontFamily: (mergedConfig.text && mergedConfig.text.font) || 'inherit',
        }"
      >
        {{ (mergedConfig.text && mergedConfig.text.content) || '' }}
      </text>
    </view>
    <!-- diy 自定义：视差插槽 + 默认插槽 -->
    <slot name="parallax"></slot>
    <slot></slot>
  </view>
</template>

<script setup>
import { ref, computed, watch, provide, inject, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'
import { getSelectorQuery, deepMerge } from '../../utils/platform.js'

const defaultConfig = {
  shake: false,
  height: 50,
  isAutoTriggered: true,
  style: 'black',
  text: {
    color: '#000000',
    shadow: 0,
  },
  background: {},
}

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  threshold: {
    type: Number,
    default: 0,
  },
  isloading: {
    type: Boolean,
    default: false,
  },
  refreshstate: {
    type: String,
    default: 'pulldown', // pulldown loosen loading
  },
  config: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'thresholdChange',
  'refreshstateChange',
  'update:threshold',
  'update:refreshstate',
])

const cooluiScroller = inject('cooluiScroller', null)
const vm = getCurrentInstance()

const triggered = ref(false)
const textWidth = ref(0)
const thresholdInner = ref(props.threshold)
const isloading = ref(props.isloading)
const refreshstate = ref(props.refreshstate)
const parallaxNodes = []

const mergedConfig = computed(() => deepMerge(defaultConfig, props.config))
const textColor = computed(
  () => (mergedConfig.value.text && mergedConfig.value.text.color) || '#000000'
)

watch(
  () => props.config,
  () => {
    if (cooluiScroller && cooluiScroller.syncRefreshConfig) {
      cooluiScroller.syncRefreshConfig()
    }
  },
  { deep: true }
)
watch(
  () => props.type,
  () => {
    if (cooluiScroller && cooluiScroller.syncRefreshConfig) {
      cooluiScroller.syncRefreshConfig()
    }
  }
)
watch(
  () => props.threshold,
  (val) => {
    thresholdInner.value = val
  }
)

onMounted(() => {
  if (cooluiScroller && cooluiScroller.registerRefresh) {
    // scroller 会调用这些成员，需以普通对象注册（vm.proxy 不含内部绑定）
    cooluiScroller.registerRefresh({
      get type() {
        return props.type
      },
      get mergedConfig() {
        return mergedConfig.value
      },
      setTriggered,
      changeThreshold,
      setLoading,
      setRefreshstate,
    })
  }
  if (props.type === 'logoText') {
    nextTick(() => {
      getSelectorQuery(vm)
        .select('.has-bg')
        .boundingClientRect()
        .exec((res) => {
          if (res && res[0]) {
            textWidth.value = res[0].width
          }
        })
    })
  }
})
onBeforeUnmount(() => {
  if (cooluiScroller && cooluiScroller.unregisterRefresh) {
    cooluiScroller.unregisterRefresh()
  }
})

/* 供视差组件注册 */
const registerParallax = (node) => {
  parallaxNodes.push(node)
}
const unregisterParallax = (node) => {
  const idx = parallaxNodes.indexOf(node)
  if (idx > -1) {
    parallaxNodes.splice(idx, 1)
  }
}
/* 供 scroller 调用 */
const changeThreshold = (t) =>
  new Promise((resolve) => {
    let rs = 'pulldown'
    if (triggered.value && !isloading.value && t > 0.5) {
      rs = 'loosen'
    }
    thresholdInner.value = t
    setRefreshstate(rs)
    emit('thresholdChange', t)
    emit('update:threshold', t)
    parallaxNodes.forEach((elem) => {
      elem.threshold = t
    })
    resolve()
  })
const setLoading = (flag) =>
  new Promise((resolve) => {
    isloading.value = flag
    setRefreshstate(flag ? 'loading' : 'pulldown')
    resolve()
  })
const setTriggered = (flag) => {
  triggered.value = flag
}
const setRefreshstate = (rs) => {
  if (refreshstate.value !== rs) {
    refreshstate.value = rs
    emit('refreshstateChange', rs)
    emit('update:refreshstate', rs)
  }
}

// 不能传 vm.proxy：<script setup> 公共实例代理不含内部绑定，需以普通对象暴露
provide('cooluiRefresh', {
  get type() {
    return props.type
  },
  get mergedConfig() {
    return mergedConfig.value
  },
  registerParallax,
  unregisterParallax,
  changeThreshold,
  setLoading,
  setTriggered,
  setRefreshstate,
})
defineOptions({
  // 等价原生 externalClasses/refresh-class + addGlobalClass：
  // 让页面传入的 class（如 jd-refresh/elm-refresh）落到组件根节点，并允许页面 scoped 样式生效
  virtualHost: true,
  styleIsolation: 'apply-shared',
})
// scroller 读 refreshNode.type / mergedConfig；parallax 读 mergedConfig；均需暴露
defineExpose({
  get type() {
    return props.type
  },
  get mergedConfig() {
    return mergedConfig.value
  },
  registerParallax,
  unregisterParallax,
  changeThreshold,
  setLoading,
  setTriggered,
  setRefreshstate,
})
</script>

<style>
.coolui-scroller-refresh {
  width: 100%;
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

/* diy 类型（京东/饿了么等自定义内容）默认水平+垂直居中，
   等价页面通过 refresh-class 给根节点加 display:flex 的效果 */
.coolui-scroller-refresh-diy {
  display: flex;
  align-items: center;
  justify-content: center;
}

.coolui-scroller-refresh .refresh-inner {
  position: absolute;
  /* 不写 top：保持与原生一致，靠"静态位置"落在根的 padding-top 之后 */
  text-align: center;
  width: 100%;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 内置三点效果 */
.coolui-scroller-refresh .cool-loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
}

.coolui-scroller-refresh .cool-loading-dots .dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin: 0 8rpx;
  animation: coolui-dot-fade 1s linear infinite;
}

.coolui-scroller-refresh .cool-loading-dots.black .dot {
  background-color: rgba(0, 0, 0, 0.6);
}

.coolui-scroller-refresh .cool-loading-dots.white .dot {
  background-color: rgba(255, 255, 255, 0.9);
}

.coolui-scroller-refresh .cool-loading-dots .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.coolui-scroller-refresh .cool-loading-dots .dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes coolui-dot-fade {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}

/* 基础效果箭头 */
.coolui-scroller-refresh .refresh-inner .down {
  width: 12px;
  height: 12px;
  margin-right: 20rpx;
  position: relative;
}

.coolui-scroller-refresh .refresh-inner .down .line:nth-child(1) {
  display: block;
  width: 2px;
  height: 18px;
  background-color: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
  opacity: 1;
}

.coolui-scroller-refresh .refresh-inner .down .line:nth-child(2) {
  width: 8px;
  height: 2px;
  background-color: #000;
  display: block;
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: rotate(-45deg);
  transform-origin: 0 50%;
  border-radius: 2px;
  opacity: 1;
}

.coolui-scroller-refresh .refresh-inner .down .line:nth-child(3) {
  width: 8px;
  height: 2px;
  background-color: #000;
  display: block;
  position: absolute;
  bottom: -3px;
  right: 50%;
  transform: rotate(45deg);
  transform-origin: 100% 50%;
  border-radius: 2px;
  opacity: 1;
}

.coolui-scroller-refresh .refresh-inner .down.loading {
  display: inline-block;
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.coolui-scroller-refresh .refresh-inner .down.loading .line {
  box-sizing: border-box;
  display: block;
  position: absolute;
  margin: -18rpx 2px 2px -18rpx;
  border-width: 2px;
  border-style: solid;
  border-color: #6190e8 transparent transparent;
  border-radius: 50%;
  animation: coolui-refresh-circle 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  width: 36rpx;
  height: 36rpx;
  left: 50%;
  top: 50%;
  transform-origin: 50% 50%;
  background-color: transparent;
  transform: translate(-50%, -50%);
}

.coolui-scroller-refresh .refresh-inner .down.loading .line:nth-child(1) {
  animation-delay: -0.45s;
}

.coolui-scroller-refresh .refresh-inner .down.loading .line:nth-child(2) {
  animation-delay: -0.3s;
}

.coolui-scroller-refresh .refresh-inner .down.loading .line:nth-child(3) {
  animation-delay: -0.15s;
}

.coolui-scroller-refresh .refresh-inner .has-bg {
  font-weight: bold;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent !important;
  background-size: 100% auto;
  background-position: -100% -100%;
  background-repeat: no-repeat;
}

.coolui-scroller-refresh .refresh-inner .has-bg.loading {
  animation: coolui-refresh-play 0.5s linear infinite;
}

@keyframes coolui-refresh-circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes coolui-refresh-play {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}
</style>
