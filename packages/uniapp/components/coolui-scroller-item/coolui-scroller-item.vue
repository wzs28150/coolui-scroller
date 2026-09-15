<template>
  <view class="coolui-scroller-item" @touchstart="itemTap">
    <slot></slot>
    <view class="ripple" :style="rippleStyle"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ripple: {
    type: Boolean,
    default: false,
  },
})

const rippleStyle = ref('')

const itemTap = (e) => {
  if (props.ripple) {
    const touch =
      (e.changedTouches && e.changedTouches[0]) ||
      (e.touches && e.touches[0])
    if (!touch) {
      return
    }
    const x = touch.pageX
    rippleStyle.value = `left:${x}px;animation: coolui-ripple 0.5s linear;`
    setTimeout(() => {
      rippleStyle.value = ''
    }, 500)
  }
}
</script>

<style lang="scss">
.coolui-scroller-item {
  display: block;
  position: relative;
  overflow: hidden;

  .ripple {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 100%;
    height: 10px;
    width: 10px;
    position: absolute;
    transform: scale(0);
    top: 50%;
  }
}

/* 水波纹动画名与按键名保持一致，供 item 的 ripple 元素引用 */
@keyframes coolui-ripple {
  100% {
    transform: scale(80);
    background-color: transparent;
  }
}
</style>
