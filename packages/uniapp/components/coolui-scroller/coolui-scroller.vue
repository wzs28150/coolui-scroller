<template>
  <!-- 与原生 scroller 保持一致：原生 properties.background 仅为 API 占位，wxml 中并未使用，
       因此这里同样不渲染背景，避免列表区域出现原生没有的灰色底 -->
  <view class="coolui-scroller wrap">
    <view class="slot-header" id="header">
      <slot name="header"></slot>
    </view>
    <view
      class="scroll-view"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <view class="scroll-view-inner" :style="innerStyle">
        <view
          v-if="hasRefresh"
          class="refresh-container"
          :style="{
            height: refreshBgHeight + 'px',
            backgroundColor: refreshBgColor,
          }"
        >
          <slot name="refresh"></slot>
        </view>
        <scroll-view
          class="coolui-scroll-view"
          :scroll-y="scrollEnabled && threshold === 0"
          :enable-flex="enableFlex"
          :lower-threshold="100"
          :scroll-top="topInner"
          :scroll-with-animation="animation"
          :scroll-into-view="toView"
          :style="{ height: contentHeight + 'px' }"
          @scrolltolower="onLoadmore"
          @scrolltoupper="scrollTopStart"
          @scroll="scroll"
        >
          <view class="inner" :style="{ minHeight: contentHeight + 'px' }">
            <slot></slot>
            <view
              v-if="isEmpty"
              class="slot-empty"
              :style="{ height: contentHeight + 'px' }"
            >
              <slot name="empty"></slot>
            </view>
            <view v-if="!isEmpty" class="slot-loadmore">
              <slot name="loadmore"></slot>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view v-if="isBackToTopShow" class="slot-backToTop">
      <slot name="backToTop"></slot>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  nextTick,
  getCurrentInstance,
  useSlots,
} from 'vue'
import {
  getSelectorQuery,
  vibrateShort,
  showNavigationBarLoading,
  hideNavigationBarLoading,
  createDebouncer,
} from '../../utils/platform.js'

const props = defineProps({
  isEmpty: {
    type: Boolean,
    default: false,
  },
  // 与原生一致：仅保留 API 兼容，组件内部不使用该值
  background: {
    type: String,
    default: '#f2f2f2',
  },
  // 保留以兼容旧版 API，实际显隐由 backToTop 组件注册情况决定
  isBackBtn: {
    type: Boolean,
    default: false,
  },
  enableFlex: {
    type: Boolean,
    default: false,
  },
  toView: {
    type: String,
    default: '',
  },
  top: {
    type: Number,
    default: 0,
  },
  animation: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'refresh',
  'loadmore',
  'restore',
  'contentHeight',
  'update:top',
])

const cooluiNavPannel = inject('cooluiNavPannel', null)
const vm = getCurrentInstance()
const slots = useSlots()

const hasRefresh = ref(false)
const type = ref('default')
const refreshConfig = ref({ shake: false, height: 50, style: 'black' })
const moveHeight = ref(0)
const contentHeight = ref(0)
const triggered = ref(null)
const isLoading = ref(false)
const isBackToTopShow = ref(false)
const threshold = ref(0)
// 强制重建 scroll-view 滚动能力用：切换 tab / transform 动画后微信常让 scroll-view 失活，
// 关→开一次 scroll-y 可使其重新初始化。见 recalculateHeight。
const scrollEnabled = ref(true)
const moveY = ref(0)
const transitionEnabled = ref(false)
const transitionDuration = ref(400)
const refreshFlag = ref(true)
const topInner = ref(null)

// 非响应式实例字段
let refreshNode = null
let backToTopNode = null
let p = 0
let touchy = 0
const debounce = createDebouncer(vm)
let backToTopHideTimer = null

const refreshBgHeight = computed(() => {
  const cfg = refreshConfig.value || {}
  return (cfg.background && cfg.background.height) || cfg.height || 50
})
const refreshBgColor = computed(() => {
  const cfg = refreshConfig.value || {}
  return (cfg.background && cfg.background.color) || 'transparent'
})
const innerStyle = computed(() => ({
  transform: `translateY(${moveY.value}px)`,
  '-webkit-transform': `translateY(${moveY.value}px)`,
  transition: transitionEnabled.value
    ? `transform ${transitionDuration.value}ms ease-out`
    : 'none',
  '-webkit-transition': transitionEnabled.value
    ? `transform ${transitionDuration.value}ms ease-out`
    : 'none',
}))

watch(
  () => props.top,
  (val) => {
    topInner.value = val
  }
)

// 兜底：uni-app 跨插槽的 provide/inject 可能失效，导致 refresh 子组件注册不上。
// 直接通过 refresh 插槽 vnode 的组件实例（defineExpose 结果）或 props 建立联系，
// 保证无注入时下拉刷新依旧可用
// uni-app mp 下 useSlots() 返回的插槽可能是函数，也可能是 vnode 数组，统一兼容
const resolveSlotNodes = (slot) => {
  if (typeof slot === 'function') {
    return slot()
  }
  if (Array.isArray(slot)) {
    return slot
  }
  return slot ? [slot] : []
}

const linkRefreshSlot = () => {
  // 1) 插槽 vnode 的组件实例（defineExpose 结果）
  const nodes = resolveSlotNodes(slots && slots.refresh)
  const vnode = nodes && nodes.length ? nodes[0] : null
  const inst = vnode && vnode.component
  if (inst && inst.exposed && typeof inst.exposed.setTriggered === 'function') {
    refreshNode = inst.exposed
    syncRefreshConfig()
    return
  }
  if (refreshNode) {
    return
  }
  // 2) 兜底：用小程序选择器直接找 refresh 组件实例
  try {
    const scope = vm.$scope
    if (scope && scope.selectComponent) {
      const comp = scope.selectComponent('.coolui-scroller-refresh')
      const exposed = comp && (comp.exposed || (comp.$vm && comp.$vm.exposed))
      if (exposed && typeof exposed.setTriggered === 'function') {
        refreshNode = exposed
        syncRefreshConfig()
        return
      }
    }
  } catch (e) {
    // ignore
  }
  // 3) 最后兜底：用插槽 vnode 的 props 建立最基本的下拉能力
  if (vnode) {
    const cfg = (vnode.props && vnode.props.config) || {}
    hasRefresh.value = true
    type.value = (vnode.props && vnode.props.type) || 'default'
    refreshConfig.value = cfg
    moveHeight.value = (cfg.background && cfg.background.height) || cfg.height || 50
  }
}

onMounted(() => {
  if (cooluiNavPannel && cooluiNavPannel.registerScroller) {
    cooluiNavPannel.registerScroller()
  }
  nextTick(() => {
    linkRefreshSlot()
    setWapHeight()
    moveY.value = -moveHeight.value
  })
})

/* ---------------- 子组件注册（替代原生 relations） ---------------- */
const registerRefresh = (node) => {
  refreshNode = node
  syncRefreshConfig()
}
const unregisterRefresh = () => {
  refreshNode = null
  hasRefresh.value = false
}
const syncRefreshConfig = () => {
  if (!refreshNode) {
    return
  }
  hasRefresh.value = true
  type.value = refreshNode.type
  refreshConfig.value = refreshNode.mergedConfig
  const height =
    (refreshNode.mergedConfig.background && refreshNode.mergedConfig.background.height) ||
    refreshNode.mergedConfig.height ||
    50
  const isFirst = moveHeight.value === 0
  moveHeight.value = height
  if (isFirst) {
    moveY.value = -height
  }
}
const registerBackToTop = (node) => {
  backToTopNode = node
}
const unregisterBackToTop = () => {
  backToTopNode = null
  isBackToTopShow.value = false
}

/* ---------------- 尺寸测量 ---------------- */
const setWapHeight = () => {
  const query = getSelectorQuery(vm)
  query
    .select('#header')
    .boundingClientRect()
    .select('.wrap')
    .boundingClientRect()
    .exec((res) => {
      const headerRect = res && res[0]
      const wrapRect = res && res[1]
      // eslint-disable-next-line no-console
      console.log('[coolui-scroller] setWapHeight res=', JSON.stringify(res))
      if (wrapRect) {
        let height = wrapRect.height
        if (headerRect) {
          height -= headerRect.height
        }
        contentHeight.value = height
        emit('contentHeight', height)
      }
    })
}

/* ---------------- 动画 ---------------- */
const animateTo = (y, duration = 400) => {
  if (duration > 0) {
    transitionDuration.value = duration
    transitionEnabled.value = true
  } else {
    transitionEnabled.value = false
  }
  moveY.value = y
}

/* ---------------- 下拉刷新流程 ---------------- */
const settriggered = (flag) =>
  new Promise((resolve) => {
    if (flag !== triggered.value) {
      if (refreshNode && refreshNode.setTriggered) {
        refreshNode.setTriggered(flag)
      }
      triggered.value = flag
      if (!flag) {
        backToTop().then(() => {
          resolve()
        })
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
const setThreshold = (val) =>
  new Promise((resolve) => {
    if (refreshNode && refreshNode.changeThreshold) {
      refreshNode.changeThreshold(val).then(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })
// 模板 @scrolltoupper 绑定，占位空实现
const scrollTopStart = () => {}
const touchStart = (e) => {
  if (isLoading.value && !refreshFlag.value) {
    return false
  }
  if (!hasRefresh.value) {
    return
  }
  settriggered(true)
  touchy =
    e.changedTouches[0].clientY !== undefined
      ? e.changedTouches[0].clientY
      : e.touches[0].clientY
}
const touchMove = (e) => {
  if (!hasRefresh.value) {
    return
  }
  if (!isLoading.value && refreshFlag.value) {
    let value = 0
    const slowdownFactor = 0.5
    const clientY =
      e.changedTouches[0].clientY !== undefined
        ? e.changedTouches[0].clientY
        : e.touches[0].clientY
    const distance = Math.round(clientY - touchy)
    value = Number(((distance * slowdownFactor) / moveHeight.value).toFixed(2))
    if (distance < 0) {
      value = 0
    }
    p = value
    if (distance > 0 && distance * slowdownFactor < moveHeight.value) {
      transitionEnabled.value = false
      moveY.value = -moveHeight.value + distance * slowdownFactor
      threshold.value = value
      setThreshold(value)
    } else if (distance * slowdownFactor >= moveHeight.value) {
      transitionEnabled.value = false
      moveY.value = 0
      threshold.value = 1
      setThreshold(1)
    }
  }
}
const touchEnd = () => {
  if (!hasRefresh.value) {
    return
  }
  if (p < 0.9) {
    // 部分下拉未达阈值：主动把阈值归零，否则 threshold 卡在 >0 会让 scroll-y 永久为 false（滚动失效）
    threshold.value = 0
    setThreshold(0)
    settriggered(false)
    return
  }
  // 回弹到刷新位置，开始刷新
  animateTo(-moveHeight.value + (refreshConfig.value.height || 50), 400)
  isLoading.value = true
  threshold.value = 1
  const start = () => {
    onRefresh()
  }
  if (refreshNode && refreshNode.setLoading) {
    refreshNode.setLoading(true).then(start)
  } else {
    start()
  }
  setThreshold(1)
}
const onRefresh = () => {
  if (refreshConfig.value.shake) {
    vibrateShort()
  }
  if (isLoading.value) {
    showNavigationBarLoading()
    if ('isAutoTriggered' in refreshConfig.value) {
      if (refreshConfig.value.isAutoTriggered) {
        emit('refresh')
        debounce(() => {
          setTimeout(() => {
            settriggered(false)
          }, 300)
        }, 1000)
      } else if (triggered.value) {
        emit('refresh')
      }
    } else {
      emit('refresh')
      debounce(() => {
        setTimeout(() => {
          settriggered(false)
        }, 300)
      }, 1000)
    }
  }
}
const onRestore = () => {
  if (isLoading.value) {
    hideNavigationBarLoading()
    emit('restore')
    debounce(() => {
      setThreshold(0).then(() => {
        p = 0
        if (refreshNode && refreshNode.setLoading) {
          refreshNode.setLoading(false)
        }
        isLoading.value = false
        triggered.value = false
        threshold.value = 0
      })
    }, 100)
  }
}
const backToTop = () =>
  new Promise((resolve) => {
    animateTo(-moveHeight.value, 400)
    setTimeout(() => {
      onRestore()
      resolve()
    }, 500)
  })

/* ---------------- 上拉加载 ---------------- */
const onLoadmore = () => {
  debounce(() => {
    emit('loadmore')
    if (refreshConfig.value.shake) {
      vibrateShort()
    }
  }, 500)
}

/* ---------------- 滚动 & 回到顶部 ---------------- */
const scroll = (e) => {
  const scrollTop = e.detail.scrollTop
  if (backToTopNode) {
    const t = backToTopNode.threshold
    const delay = backToTopNode.delay
    if (scrollTop > t && !isBackToTopShow.value) {
      isBackToTopShow.value = true
      if (delay !== 0) {
        if (backToTopHideTimer) {
          clearTimeout(backToTopHideTimer)
        }
        backToTopHideTimer = setTimeout(() => {
          isBackToTopShow.value = false
        }, delay)
      }
    } else if (scrollTop <= t && isBackToTopShow.value) {
      isBackToTopShow.value = false
    }
  }
  emit('scroll', e)
}
/** 供 backToTop 组件调用，滚动回顶部 */
const scrollToTop = () => {
  // scroll-top 需要值变化才会生效，先置空再设 0
  topInner.value = null
  nextTick(() => {
    topInner.value = 0
  })
}

/** 重新计算内容高度（当插槽内容动态变化后调用，如 tab 切换导致列表长度变化）
 *  同时重置下拉阈值并强制关闭→重开 scroll-y，修复两类「滚动失效」：
 *  1) 切换 tab / transform 动画后微信 scroll-view 滚动能力失活
 *  2) 之前部分下拉未触发刷新导致 threshold 卡在 >0（scroll-y 被置 false） */
const recalculateHeight = () => {
  threshold.value = 0
  setThreshold(0)
  scrollEnabled.value = false
  nextTick(() => {
    setWapHeight()
    nextTick(() => {
      scrollEnabled.value = true
    })
  })
}

// 不能传 vm.proxy：<script setup> 公共实例代理不含内部绑定，需以普通对象暴露方法
provide('cooluiScroller', {
  registerRefresh,
  unregisterRefresh,
  syncRefreshConfig,
  registerBackToTop,
  unregisterBackToTop,
  scrollToTop,
  settriggered,
  recalculateHeight,
})
defineOptions({
  // 等价原生 addGlobalClass：允许页面 scoped 样式作用到组件；virtualHost 让页面传入的 class 落到根节点
  virtualHost: true,
  styleIsolation: 'apply-shared',
})
// 供子组件 refresh / back-to-top 跨组件调用
defineExpose({
  registerRefresh,
  unregisterRefresh,
  syncRefreshConfig,
  registerBackToTop,
  unregisterBackToTop,
  scrollToTop,
  settriggered,
  recalculateHeight,
})
</script>

<style lang="scss">
/* 宿主节点样式：uni-app 编译到原生小程序时组件外层存在宿主 wrapper 节点，
   需在宿主上撑满宽高，否则内部 height:100% / flex 均会失效（与原生 :host 一致） */
:host {
  display: block;
  width: 100%;
  height: 100%;
}

.coolui-scroller {
  /* 根节点的 .wrap 由模板条件添加，代表"容器已就绪"态 */
  &.wrap {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .slot-header {
    position: relative;
    z-index: 5;
  }

  .scroll-view {
    .refresh-container {
      width: 100%;
    }

    .inner .slot-empty {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
