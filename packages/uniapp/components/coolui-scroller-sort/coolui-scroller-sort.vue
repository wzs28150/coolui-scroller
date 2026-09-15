<template>
  <view class="coolui-scroller-sort">
    <view class="coolui-scroller-nav" :class="scroll ? 'scroll' : 'flex'">
      <slot></slot>
    </view>
    <view
      v-if="overlay"
      id="overlay"
      class="overlay"
      :style="overlayStyle"
      @tap="close"
    ></view>
  </view>
</template>

<script setup>
import { ref, computed, provide, watch, nextTick, getCurrentInstance } from 'vue'
import { getSelectorQuery, getWindowInfo } from '../../utils/platform.js'

const props = defineProps({
  overlay: {
    type: Boolean,
    default: true,
  },
  overlayDuration: {
    type: Number,
    default: 500,
  },
  scroll: {
    type: Boolean,
    default: false,
  },
})

const vm = getCurrentInstance()

const active = ref(null)
const overlayHeight = ref(0)
const isOverLayShow = ref(false)
const overlayOpacity = ref(0)
const items = []
let overlayTimer = null

const overlayStyle = computed(() => ({
  height: overlayHeight.value + 'px',
  opacity: overlayOpacity.value,
  transition: 'opacity ' + props.overlayDuration + 'ms ease-in',
  pointerEvents: isOverLayShow.value ? 'auto' : 'none',
}))

const registerItem = (node) => {
  items.push(node)
}
const unregisterItem = (node) => {
  const index = items.indexOf(node)
  if (index > -1) {
    items.splice(index, 1)
  }
}
const setOverlayHeight = () => {
  const info = getWindowInfo()
  const windowHeight = info.windowHeight
  const query = getSelectorQuery(vm)
  query
    .select('#overlay')
    .boundingClientRect()
    .exec((res) => {
      if (res && res[0]) {
        overlayHeight.value = windowHeight - res[0].top
      }
    })
}
const toggle = (activeVal) => {
  const flag =
    activeVal === active.value && active.value !== null
      ? true
      : activeVal == null
      ? true
      : false
  active.value = activeVal
  toggleOverlay(flag)
  toggleDropdown()
}
const toggleOverlay = (flag) => {
  if (flag) {
    if (isOverLayShow.value === true) {
      // 不显示
      overlayOpacity.value = 0
      if (overlayTimer) {
        clearTimeout(overlayTimer)
      }
      overlayTimer = setTimeout(() => {
        isOverLayShow.value = false
      }, props.overlayDuration)
    }
  } else {
    if (isOverLayShow.value !== true) {
      // 显示
      isOverLayShow.value = true
      nextTick(() => {
        overlayOpacity.value = 1
      })
    }
  }
  setOverlayHeight()
}
const toggleDropdown = () => {
  items.forEach((item) => {
    item.toggleDropdown(active.value)
  })
}
const close = () => {
  toggle(null)
}

// 不能传 vm.proxy：<script setup> 公共实例代理不含内部绑定，需以普通对象暴露方法
provide('cooluiSort', { registerItem, unregisterItem, toggle })
defineExpose({
  registerItem,
  unregisterItem,
  toggle,
  get active() {
    return active.value
  },
})
</script>

<style lang="scss">
/* 与原生 :host 对齐：撑满宿主节点，避免被放入 flex 居中容器时塌缩 */
:host {
  display: block;
  width: 100%;
}

.coolui-scroller-sort {
  display: block;
  width: 100%;
  box-shadow: 0 2px 12px rgb(100 101 102 / 12%);
  position: relative;

  /* 下拉遮罩：紧贴 100rpx 的导航条下方铺满一屏 */
  .overlay {
    position: absolute;
    top: 100rpx;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0;
  }
}

/* 排序条内部复用了分类导航的样式，flex / scroll 为两种布局模式 */
.coolui-scroller-nav {
  width: 100%;
  height: 100rpx;

  &.flex {
    display: flex;
  }

  &.scroll {
    white-space: nowrap;
    overflow-x: scroll;
    scroll-behavior: smooth;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.coolui-scroller-nav-scroll {
  white-space: nowrap;
  overflow: visible;
}
</style>
