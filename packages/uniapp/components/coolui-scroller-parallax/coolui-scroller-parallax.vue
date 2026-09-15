<template>
  <view class="coolui-scroller-parallax" :style="parallaxStyle">
    <slot></slot>
  </view>
</template>

<script setup>
import { inject, ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  parallax: {
    type: Number,
    default: 0,
  },
  direction: {
    type: String,
    default: 'to bottom', // to top / to bottom / to left / to right
  },
})

const cooluiRefresh = inject('cooluiRefresh', null)
const threshold = ref(0)

const configHeight = computed(() => {
  if (cooluiRefresh && cooluiRefresh.mergedConfig) {
    return cooluiRefresh.mergedConfig.height || 50
  }
  return 50
})

const parallaxStyle = computed(() => {
  const offset = (props.parallax * threshold.value * configHeight.value) / 100
  let x = 0
  let y = 0
  if (props.direction === 'to top') {
    y = -offset
  } else if (props.direction === 'to bottom') {
    y = offset
  } else if (props.direction === 'to left') {
    x = -offset
  } else if (props.direction === 'to right') {
    x = offset
  }
  return {
    transform: `translate3d(${x}px, ${y}px, 0)`,
    '-webkit-transform': `translate3d(${x}px, ${y}px, 0)`,
  }
})

// refresh 的 changeThreshold 会执行 node.threshold = 值，需可写
const parallaxApi = {
  get threshold() {
    return threshold.value
  },
  set threshold(v) {
    threshold.value = v
  },
}

onMounted(() => {
  if (cooluiRefresh && cooluiRefresh.registerParallax) {
    cooluiRefresh.registerParallax(parallaxApi)
  }
})

onBeforeUnmount(() => {
  if (cooluiRefresh && cooluiRefresh.unregisterParallax) {
    cooluiRefresh.unregisterParallax(parallaxApi)
  }
})

defineOptions({
  // 等价原生 externalClasses/parallax-class + addGlobalClass：
  // virtualHost 让父页面传入的 class 落到组件根节点（与 position:absolute 同元素），
  // apply-shared 允许页面 scoped 样式作用到该根节点，否则视差项定位类全部失效、堆在左上角
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

// 父组件 refresh.changeThreshold 会写入 parallaxNode.threshold，需暴露可读写属性
defineExpose({
  get threshold() {
    return threshold.value
  },
  set threshold(v) {
    threshold.value = v
  },
})
</script>

<style lang="scss">
/* 页面定位类（top/left/margin）落在宿主节点上，让宿主也绝对定位，
   使 top/left 与子节点的 position:absolute 处于同一条定位链 */
:host {
  position: absolute;
}

.coolui-scroller-parallax {
  position: absolute;
  /* 页面尺寸类在宿主上，根节点填满宿主，避免宽度收缩为 0 致内部 image 不可见 */
  width: 100%;
  height: 100%;
  /* 宿主宽度可能为 0，nowrap 让文字按实际宽度撑开，避免逐字竖排 */
  white-space: nowrap;
  transform: translate3d(0, 0, 0);
  transition: all 0.01s;
}
</style>
