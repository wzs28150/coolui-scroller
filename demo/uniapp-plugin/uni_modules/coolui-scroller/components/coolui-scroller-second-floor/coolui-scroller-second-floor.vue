<template>
  <view
    class="wx-coolui-scroller-second-floor"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <view class="second-floor-wapper" :style="wapperStyle">
      <view class="second-floor-inner">
        <view class="second-floor-content" :style="innerStyle">
          <slot name="second-floor"></slot>
        </view>
        <view class="second-floor-text">
          <slot name="second-floor-refresh"></slot>
        </view>
      </view>
      <view class="first-floor">
        <view :style="{ height: statusBarHeight + 'px' }">
          <slot name="nav-bar"></slot>
        </view>
        <view :style="{ height: scrollHeight - statusBarHeight + 'px' }">
          <slot></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  provide,
  onMounted,
  nextTick,
  getCurrentInstance,
  type PropType,
} from 'vue'
import { getWindowInfo } from '../../utils/platform.js'
import type {
  CooluiNavBarApi,
  CooluiSecondFloorApi,
  CooluiSecondFloorRefreshApi,
  CooluiSecondFloorTip,
} from '../../types'

const props = defineProps({
  threshold: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  center: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Boolean,
    default: true,
  },
  top: {
    type: Boolean,
    default: false,
  },
  scale: {
    type: Boolean,
    default: false,
  },
  tip: {
    type: Object as PropType<CooluiSecondFloorTip>,
    default: () => ({
      show: false,
      height: 100,
      times: 1,
      duration: 2000,
    }),
  },
})

const emit = defineEmits<{
  /** 二楼展开之后触发 */
  (e: 'secondShow'): void
  /** 下拉刷新时触发 */
  (e: 'refresh'): void
  /** 二楼关闭之后触发 */
  (e: 'secondBack'): void
}>()

const vm = getCurrentInstance()

const scrollHeight = ref(getWindowInfo().windowHeight || 0)
const touchy = ref(0)
const isLoading = ref(false)
const isFloorShow = ref(false)
const statusBarHeight = ref(0)
const thresholdInner = ref(0)
const tipInner = ref({
  show: false,
  height: 100,
  times: 1,
  duration: 2000,
})
const wapper = ref({ y: 0, duration: 0, timing: 'ease-out' })
const inner = ref({ y: 0, duration: 0, scale: 1, opacity: 1 })

let refreshNode: CooluiSecondFloorRefreshApi | null = null
let navBarNode: CooluiNavBarApi | null = null

const transformOrigin = computed(() => {
  if (props.top) {
    return '50% 0 0'
  }
  if (props.bottom) {
    return '50% 100% 0'
  }
  return '50% 50% 0'
})
const wapperStyle = computed(() => ({
  transform: 'translateY(' + wapper.value.y + 'px)',
  transition:
    wapper.value.duration > 0
      ? 'transform ' + wapper.value.duration + 'ms ' + wapper.value.timing
      : 'none',
}))
const innerStyle = computed(() => ({
  transform: 'translateY(' + inner.value.y + 'px) scale(' + inner.value.scale + ')',
  opacity: inner.value.opacity,
  transformOrigin: transformOrigin.value,
  transition:
    inner.value.duration > 0
      ? 'transform ' +
        inner.value.duration +
        'ms ease-out, opacity ' +
        inner.value.duration +
        'ms ease-out'
      : 'none',
}))

watch(() => props.center, () => init())
watch(() => props.bottom, () => init())
watch(() => props.top, () => init())
watch(() => props.scale, () => init())
watch(
  () => props.tip,
  (val) => {
    tipInner.value = { ...tipInner.value, ...val }
  },
  { deep: true, immediate: true }
)

/* ---------------- 子组件注册（替代原生 relations） ---------------- */
const registerRefresh = (node: CooluiSecondFloorRefreshApi) => {
  refreshNode = node
}
const registerNavBar = (node: CooluiNavBarApi) => {
  navBarNode = node
}

/* ---------------- 动画辅助 ---------------- */
const setWapper = (y: number, duration = 0, timing = 'ease-out') => {
  wapper.value = { y, duration, timing }
}
const setInner = (y: number, duration = 0, scale = 1, opacity = 1) => {
  inner.value = { y, duration, scale, opacity }
}
const innerInitY = () => {
  if (props.top) {
    return scrollHeight.value
  }
  if (props.center) {
    return scrollHeight.value / 2
  }
  return 0
}

/**
 * 初始化：根据设置初始化动画、初始化参数、初始化子组件
 */
const init = (callback: (() => void) | null = null) => {
  if (refreshNode) {
    refreshNode.setScrollHeight(scrollHeight.value)
    refreshNode.setDown()
  }
  const scaleXy = props.scale ? 0.1 : 1
  setWapper(-scrollHeight.value + props.offset, 0)
  setInner(innerInitY(), 0, scaleXy, scaleXy)
  thresholdInner.value = props.threshold
  nextTick(() => {
    if (callback) {
      callback()
    }
    if (tipInner.value.show) {
      tipShow()
    }
  })
}
const tipShow = (duration?: number, wait?: number, times?: number) => {
  duration = duration === undefined ? tipInner.value.duration : duration
  wait = wait === undefined ? tipInner.value.duration : wait
  times = times === undefined ? tipInner.value.times : times
  const offset = -scrollHeight.value + props.offset
  setWapper(offset, duration, 'ease-in')
  thresholdInner.value = 0
  if (refreshNode) {
    refreshNode.setText(scrollHeight.value / 2)
  }
  if (tipInner.value.show) {
    setTimeout(() => {
      setWapper(
        -scrollHeight.value + tipInner.value.height,
        duration,
        'ease-out'
      )
      thresholdInner.value = tipInner.value.height
      if (refreshNode) {
        refreshNode.setText(scrollHeight.value / 2)
      }
      if (times > 1) {
        setTimeout(() => {
          tipShow(duration, wait, times - 1)
        }, wait)
      } else {
        setTimeout(() => {
          tipInner.value = { ...tipInner.value, show: false }
          tipShow(duration, wait, times - 1)
        }, wait)
      }
    }, duration)
  }
}

/**
 * 触摸拖拽开始：记录初始触摸位置
 */
const touchStart = (e: TouchEvent) => {
  if (tipInner.value.show) {
    return false
  }
  if (isLoading.value) {
    return false
  }
  touchy.value = e.changedTouches[0].clientY
}
/**
 * 拖动时执行：修改页面动画，传递触摸动态参数给 refresh 组件
 */
const touchMove = (e: TouchEvent) => {
  if (tipInner.value.show) {
    return false
  }
  // 正在刷新时不进行操作，二楼已加载时不进行操作
  if (!isFloorShow.value && !isLoading.value) {
    const distance = Math.round(e.changedTouches[0].clientY - touchy.value)
    let scaleXy = 1
    if (props.scale) {
      scaleXy = 0.1 + distance / 200
      scaleXy = scaleXy >= 1 ? 1 : scaleXy
    }
    if (distance > 0) {
      setWapper(-scrollHeight.value + distance + props.offset, 0)
      if (props.top) {
        setInner(scrollHeight.value - distance, 0, scaleXy, scaleXy)
      } else if (props.bottom) {
        setInner(0, 0, scaleXy, scaleXy)
      } else if (props.center) {
        setInner((scrollHeight.value - distance) / 2, 0, scaleXy, scaleXy)
      }
      thresholdInner.value = distance
      if (refreshNode) {
        refreshNode.setText(distance)
      }
    }
  }
}
/**
 * 松手后执行：
 * 大于屏幕三分之一直接拉到二楼；
 * 大于六分之一小于三分之一回到六分之一并开启刷新；
 * 小于六分之一直接回弹
 */
const touchEnd = () => {
  if (tipInner.value.show) {
    return false
  }
  if (!isFloorShow.value && thresholdInner.value > 0 && !isLoading.value) {
    if (thresholdInner.value > scrollHeight.value / 3) {
      // 大于三分之一 直接拉到二楼
      setWapper(0, 400)
      if (props.top || props.center) {
        setInner(0, 400, 1, 1)
      } else if (props.bottom) {
        setInner(0, 0, 1, 1)
      }
      setTimeout(() => {
        if (refreshNode) {
          refreshNode.setSecondShow(true)
        }
        isFloorShow.value = true
        emit('secondShow')
      }, 400)
    } else if (thresholdInner.value > scrollHeight.value / 6) {
      // 大于六分之一，小于三分之一，回到六分之一停顿开始刷新
      setWapper(-scrollHeight.value + scrollHeight.value / 6, 400)
      if (props.top) {
        setInner(scrollHeight.value - scrollHeight.value / 6, 400, 1, 1)
      } else if (props.bottom) {
        setInner(0, 0, 1, 1)
      } else if (props.center) {
        setInner((scrollHeight.value - scrollHeight.value / 6) / 2, 400, 1, 1)
      }
      emit('refresh')
      isLoading.value = true
      if (refreshNode) {
        refreshNode.setLoading(true)
      }
    } else {
      // 小于六分之一 直接回顶部
      back(false)
    }
  }
}
/**
 * 回弹及二楼关闭：拖动小于六分之一直接回顶部或外部自定义调用关闭二楼
 */
const back = (callback = true) =>
  new Promise<void>((resolve) => {
    setWapper(-scrollHeight.value + props.offset, 800)
    if (props.top) {
      setInner(scrollHeight.value, 800, 1, props.scale ? 0 : 1)
    } else if (props.bottom) {
      setInner(0, 0, 1, props.scale ? 0 : 1)
    } else if (props.center) {
      setInner(scrollHeight.value / 2, 800, 1, props.scale ? 0 : 1)
    }
    setTimeout(() => {
      if (refreshNode) {
        refreshNode.setDown()
      }
      isFloorShow.value = false
      thresholdInner.value = 0
      if (callback) {
        emit('secondBack')
      }
      resolve()
    }, 800)
  })
/**
 * 刷新后的回弹：请求完数据之后执行
 */
const settriggered = () =>
  new Promise<void>((resolve) => {
    setWapper(-scrollHeight.value + props.offset, 800)
    if (props.top) {
      setInner(scrollHeight.value, 800, 1, props.scale ? 0 : 1)
    } else if (props.bottom) {
      setInner(0, 0, 1, props.scale ? 0 : 1)
    } else if (props.center) {
      setInner(scrollHeight.value / 2, 800, 1, props.scale ? 0 : 1)
    }
    isLoading.value = false
    setTimeout(() => {
      if (refreshNode) {
        refreshNode.setDown()
      }
      thresholdInner.value = 0
      resolve()
    }, 400)
  })

onMounted(() => {
  nextTick(() => {
    init(() => {
      if (navBarNode) {
        statusBarHeight.value = navBarNode.statusBarHeight
      }
    })
  })
})

// 不能传 vm.proxy：<script setup> 公共实例代理不含内部绑定，需以普通对象暴露方法
provide<CooluiSecondFloorApi>('cooluiSecondFloor', {
  registerRefresh,
  registerNavBar,
  back,
})
defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})
// 供子组件 second-floor-refresh / nav-bar 跨组件调用
defineExpose({
  registerRefresh,
  registerNavBar,
  back,
  settriggered,
  init,
})
</script>

<style lang="scss">
.wx-coolui-scroller-second-floor {
  overflow: hidden;
  height: 100vh !important;

  /* 承载 200vh 的滑动层，向上偏移 50vh 后正好露出第一屏 */
  .second-floor-wapper {
    transform: translateY(-50%) scale(1, 1);
    height: 200vh;

    .second-floor-inner {
      height: 100vh;

      .second-floor-text {
        width: 100%;
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
      }
    }

    .first-floor {
      height: 100vh;
      overflow: hidden;
    }
  }

  .second-floor-inner {
    position: relative;
    overflow: hidden;
  }

  .second-floor-content {
    height: 100vh;
  }
}
</style>
