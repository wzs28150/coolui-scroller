<template>
  <view class="coolui-scroller-loadmore">
    <text v-if="status === 'more'" :style="{ color: more.color }">
      {{ more.text }}
    </text>
    <block v-else-if="status === 'loading'">
      <view class="cool-indicator cool-indicator--isopened">
        <view class="cool-indicator__body">
          <view class="cool-loading">
            <view
              class="cool-loading__ring"
              :style="{ borderColor: loading.color + ' transparent transparent' }"
            ></view>
            <view
              class="cool-loading__ring"
              :style="{ borderColor: loading.color + ' transparent transparent' }"
            ></view>
            <view
              class="cool-loading__ring"
              :style="{ borderColor: loading.color + ' transparent transparent' }"
            ></view>
          </view>
        </view>
      </view>
      <text class="at-indicator__content" :style="{ color: loading.color }">
        {{ loading.text }}
      </text>
    </block>
    <text v-else-if="status === 'noMore'" :style="{ color: noMore.color }">
      {{ noMore.text }}
    </text>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { CooluiLoadmoreState } from '../../types'

defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

const props = defineProps({
  status: {
    type: String as PropType<'more' | 'loading' | 'noMore' | (string & {})>,
    default: 'more', // more loading noMore
  },
  loading: {
    type: Object as PropType<CooluiLoadmoreState>,
    default: () => ({
      text: '加载中',
      color: '#999999',
    }),
  },
  more: {
    type: Object as PropType<CooluiLoadmoreState>,
    default: () => ({
      text: '查看更多',
      color: '#333333',
    }),
  },
  noMore: {
    type: Object as PropType<CooluiLoadmoreState>,
    default: () => ({
      text: '没有更多',
      color: '#999999',
    }),
  },
  color: {
    type: String,
    default: '#999999',
  },
  shake: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
/* 与原生 :host 对齐：撑满宿主节点，避免被放入 flex 居中容器时塌缩 */
:host {
  display: block;
}

.coolui-scroller-loadmore {
  display: block;
  width: 100%;
  height: 100rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .cool-indicator {
    display: flex;
    line-height: 1;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);

    /* 展开态：与 --isopened 同时控制可见性与透明度 */
    &.cool-indicator--isopened {
      opacity: 1;
      visibility: visible;
    }
  }

  .cool-indicator__body,
  .cool-indicator__content {
    flex: 0 0 auto;
  }

  .at-indicator__content {
    align-self: center;
    margin-left: 24rpx;
    color: #999;
    font-size: 28rpx;
  }

  .cool-loading,
  .cool-loading__ring {
    display: inline-block;
    position: relative;
    width: 36rpx;
    height: 36rpx;
  }

  /* 三个环叠放，靠 animation-delay 错开形成转圈 */
  .cool-loading__ring {
    box-sizing: border-box;
    display: block;
    position: absolute;
    margin: 2px;
    border-width: 2px;
    border-style: solid;
    border-color: #6190e8 transparent transparent;
    border-radius: 50%;
    animation: coolui-loadmore-loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &:nth-child(1) {
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
    }

    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
}

@keyframes coolui-loadmore-loading {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
