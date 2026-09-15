<template>
  <view
    v-if="!isTipShow"
    class="hand"
    :style="{ backgroundColor: 'rgba(0, 0, 0, ' + opacity + ')' }"
  >
    <image
      src="./icons/close.png"
      mode="aspectFill"
      class="close"
      @tap="close"
    ></image>
    <view class="top" v-if="top">
      <view>{{ top }}</view>
      <view>
        <image src="./icons/tap3.png" mode="aspectFill" class="tap"></image>
      </view>
      <view class="arrow_down">
        <image
          src="./icons/arrow_down.png"
          mode="aspectFill"
          class="arrow"
        ></image>
      </view>
    </view>
    <view class="bottom" v-if="bottom">
      <view class="arrow_top">
        <image
          src="./icons/arrow_top.png"
          mode="aspectFill"
          class="arrow"
        ></image>
      </view>
      <view>
        <image src="./icons/tap.png" mode="aspectFill" class="tap"></image>
      </view>
      <view>{{ bottom }}</view>
    </view>
    <view class="left" v-if="left">
      <view>
        <image
          src="./icons/arrow_right.png"
          mode="aspectFill"
          class="arrow"
        ></image>
      </view>
      <view>
        <image src="./icons/tap.png" mode="aspectFill" class="tap"></image>
      </view>
      <view>{{ left }}</view>
    </view>
    <view class="right" v-if="right">
      <view>
        <image
          src="./icons/arrow_left.png"
          mode="aspectFill"
          class="arrow"
        ></image>
      </view>
      <view>
        <image src="./icons/tap2.png" mode="aspectFill" class="tap"></image>
      </view>
      <view>{{ right }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setStorageSync, getStorageSync } from '../../utils/platform.js'

const props = defineProps({
  top: {
    type: String,
    default: '',
  },
  bottom: {
    type: String,
    default: '',
  },
  left: {
    type: String,
    default: '',
  },
  right: {
    type: String,
    default: '',
  },
  storageKey: {
    type: String,
    default: 'isTipShow',
  },
  opacity: {
    type: Number,
    default: 0.5,
  },
})

const emit = defineEmits<{
  /** 关闭手势提示时触发 */
  (e: 'close'): void
}>()
const isTipShow = ref(true)

onMounted(() => {
  const isKey = getStorageSync(props.storageKey)
  if (!isKey) {
    isTipShow.value = false
  }
})

const close = () => {
  setStorageSync(props.storageKey, 'true')
  isTipShow.value = true
  emit('close')
}
</script>

<style>
.hand {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 28rpx;
}

.hand .close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 80rpx;
  height: 80rpx;
}

.hand .tap {
  width: 90rpx;
  height: 131rpx;
}

.hand .top {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  text-align: center;
}

.hand .top .arrow {
  width: 22rpx;
  height: 50rpx;
  transform: translateX(50rpx);
}

.hand .top .tap {
  animation: movetop 3s infinite;
}

.hand .bottom {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  text-align: center;
}

.hand .bottom .arrow {
  width: 22rpx;
  height: 50rpx;
  transform: translateX(-50rpx);
}

.hand .bottom .tap {
  animation: movebottom 3s infinite;
}

.hand .left {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  text-align: left;
}

.hand .left .arrow {
  width: 50rpx;
  height: 22rpx;
  display: block;
}

.hand .left .tap {
  animation: moveleft 3s infinite;
}

.hand .right {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  text-align: right;
}

.hand .right .arrow {
  width: 50rpx;
  height: 22rpx;
}

.hand .right .tap {
  animation: moveright 3s infinite;
}

@keyframes moveleft {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(80rpx);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes moveright {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-80rpx);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes movetop {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80rpx);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes movebottom {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-80rpx);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
