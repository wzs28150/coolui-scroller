<template>
  <view
    class="nav-bar"
    :style="{
      height: statusBarHeight + 'px',
      backgroundColor: mergedConfig.background.color,
    }"
  >
    <view
      class="nav-bar-inner"
      :style="{
        height: statusBarHeight + 'px',
        paddingTop: StatusBar + 'px',
        backgroundImage: mergedConfig.background.img
          ? 'url(' + mergedConfig.background.img + ')'
          : 'none',
      }"
    >
      <template v-if="type === 'default'">
        <view class="action" v-if="mergedConfig.back" @tap="backPage">
          <view
            class="line"
            :style="{ backgroundColor: mergedConfig.text.color }"
          ></view>
          <view
            class="line"
            :style="{ backgroundColor: mergedConfig.text.color }"
          ></view>
        </view>
        <view
          class="content"
          :style="{ top: StatusBar + 'px', color: mergedConfig.text.color }"
        >
          <slot></slot>
        </view>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import {
  getWindowInfo,
  getMenuButtonBoundingClientRect,
  navigateBack,
  deepMerge,
} from '../../utils/platform.js'

const defaultConfig = {
  back: {
    show: true,
  },
  background: {
    color: '#ffffff',
  },
  text: {
    color: '#000000',
    shadow: 0,
  },
}

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  config: {
    type: Object,
    default: () => ({}),
  },
})

const cooluiSecondFloor = inject('cooluiSecondFloor', null)

const StatusBar = ref(0)
const statusBarHeight = ref(0)
const mergedConfig = computed(() => deepMerge(defaultConfig, props.config))

onMounted(() => {
  const info = getWindowInfo()
  StatusBar.value = info.statusBarHeight || 0
  const capsule = getMenuButtonBoundingClientRect()
  if (capsule) {
    statusBarHeight.value =
      capsule.bottom + capsule.top - (info.statusBarHeight || 0)
  } else {
    statusBarHeight.value = (info.statusBarHeight || 0) + 50
  }
  if (cooluiSecondFloor && cooluiSecondFloor.registerNavBar) {
    // second-floor 会读取 statusBarHeight，需以普通对象暴露
    cooluiSecondFloor.registerNavBar({
      get statusBarHeight() {
        return statusBarHeight.value
      },
    })
  }
})

const backPage = () => {
  if (typeof mergedConfig.value.back.click === 'function') {
    mergedConfig.value.back.click()
  } else {
    navigateBack(1)
  }
}
</script>

<style>
.nav-bar {
  position: relative;
}

.nav-bar .nav-bar-inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.nav-bar .action {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  margin-left: 24rpx;
}

.nav-bar .action .line {
  width: 24rpx;
  height: 4rpx;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0 center;
  margin-top: 0rpx;
  transform: translate(-40%, -50%) rotate(45deg);
}

.nav-bar .action .line + .line {
  margin-top: 0.5rpx;
  transform: translate(-40%, -50%) rotate(-45deg);
}

.nav-bar .content {
  text-align: center;
  width: 100%;
  font-size: 34rpx;
}
</style>
