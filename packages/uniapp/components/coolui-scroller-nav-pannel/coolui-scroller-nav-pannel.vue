<template>
  <view class="wx-coolui-nav-pannel">
    <view
      class="wx-coolui-nav-pannel-inner"
      :class="type"
      :style="innerStyle"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, provide, onMounted, nextTick, getCurrentInstance } from 'vue'
import { getSelectorQuery } from '../../utils/platform.js'

const props = defineProps({
  active: {
    type: Number,
    default: 0,
  },
  animation: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'side', // 可选 side,fade
  },
})

const width = ref(0)
const scrollerLength = ref(0)
const vm = getCurrentInstance()

// 与原生一致：内层宽度 = 单个 scroller 宽度 × scroller 数量；
// 切换位移 = 单个宽度 × active（而非整体 100%）
const innerStyle = computed(() => {
  const len = scrollerLength.value || 1
  const w = props.type === 'side' ? width.value * len : width.value
  const style = {
    width: w + 'px',
  }
  if (props.type === 'side') {
    style.transform = 'translateX(' + -width.value * props.active + 'px)'
    style.transition = props.animation ? 'transform 0.4s' : 'none'
  }
  return style
})

const registerScroller = () => {
  scrollerLength.value += 1
}

provide('cooluiNavPannel', { registerScroller })
defineExpose({ registerScroller })

defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

onMounted(() => {
  nextTick(() => {
    getSelectorQuery(vm)
      .select('.wx-coolui-nav-pannel')
      .boundingClientRect()
      .exec((res) => {
        if (res && res.length > 0 && res[0]) {
          width.value = res[0].width
        }
        // 兜底：若子组件通过注入注册失败，用小程序选择器统计子 scroller 数量
        try {
          const scope = vm.$scope
          if (!scrollerLength.value && scope && scope.selectAllComponents) {
            const list = scope.selectAllComponents('.coolui-scroller')
            if (list && list.length) {
              scrollerLength.value = list.length
            }
          }
        } catch (e) {
          // ignore
        }
      })
  })
})
</script>

<style>
/* 关键：让组件宿主节点撑满父级。
   根节点若失去宿主高度，height:100% 会解析为 0（flex:1 也会失效），
   整条高度链塌陷导致内容不可见。与 scroller 组件保持一致 */
/* :host {
  display: block;
  width: 100%;
  height: 100%;
  flex: 1;
} */

.wx-coolui-nav-pannel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* flex 父容器（如页面 .pannel-inner）里用 flex:1 取高，
     避免父级高度由 flex 推导时 height:100% 无法解析导致整条高度链塌成 0 */
  flex: 1;
  overflow: hidden;
}

.wx-coolui-nav-pannel-inner {
  flex: 1;
  min-height: 0;
}

.wx-coolui-nav-pannel-inner.side {
  display: flex;
}

.wx-coolui-nav-pannel-inner.side .coolui-scroller {
  flex: 1;
}

.wx-coolui-nav-pannel-inner.fade {
  position: relative;
}

.wx-coolui-nav-pannel-inner.fade .coolui-scroller {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
}

.wx-coolui-nav-pannel-inner.fade .coolui-scroller:first-child {
  position: relative;
  z-index: 1;
}
</style>
