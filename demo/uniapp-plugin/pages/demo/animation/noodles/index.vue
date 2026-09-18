<script setup lang="ts">
import type { CooluiRefreshConfig } from '@/uni_modules/coolui-scroller/types'

const giffoodSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 120,
  background: {
    color: '#eeeeee',
    img: 'https://test.wzs.pub/pic/food_pic.gif',
  },
}
</script>

<template>
  <view class="demopage">
    <view class="pannel-inner">
      <coolui-scroller :is-back-btn="true">
        <template #refresh>
          <coolui-scroller-refresh type="diy" :config="giffoodSetting" />
        </template>

        <view class="scroller-pannel">
          <view>
            <view class="title">美食主题：魔性吃面</view>
            <view class="des">
              采用gif动图实现，动画无限循环，十分魔性。下拉不松手可一直查看动画
            </view>
            <view class="downtip">下拉查看效果</view>
            <view class="downicon">
              <view class="line"></view>
              <view class="line"></view>
              <view class="line"></view>
            </view>
          </view>
        </view>
      </coolui-scroller>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.demopage {
  min-height: 100vh;
  height: 100vh;
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .pannel-inner {
    margin: 30rpx 0;
    padding: 0;
    height: calc(100vh - 60rpx);
    background-color: #fff;
    overflow: hidden;

    .scroller-pannel {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 60rpx);
      font-size: 28rpx;
      color: #999;

      .title {
        text-align: center;
        color: #333;
        margin-bottom: 20rpx;
        font-size: 32rpx;
      }

      .des {
        text-align: center;
        max-width: 70vw;
      }

      .downtip {
        text-align: center;
        margin-top: 20rpx;
      }

      .downicon {
        width: 12px;
        height: 12px;
        margin: 20rpx auto;
        position: relative;
      }

      .downicon .line:nth-child(1) {
        display: block;
        width: 2px;
        height: 18px;
        background-color: #999;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 2px;
        opacity: 1;
      }

      .downicon .line:nth-child(2) {
        width: 8px;
        height: 2px;
        background-color: #999;
        display: block;
        position: absolute;
        bottom: -3px;
        left: 50%;
        transform: rotate(-45deg);
        transform-origin: 0 50%;
        border-radius: 2px;
        opacity: 1;
      }

      .downicon .line:nth-child(3) {
        width: 8px;
        height: 2px;
        background-color: #999;
        display: block;
        position: absolute;
        bottom: -3px;
        right: 50%;
        transform: rotate(45deg);
        transform-origin: 100% 50%;
        border-radius: 2px;
        opacity: 1;
      }
    }
  }
}

/* #ifdef H5 */
/* H5 端 uni 会额外渲染内置导航栏（--window-top，44px），100vh 是整个视口高度，
   页面因此比可视区多出这一截 → 出现页面级滚动条。这里外层与内层一起按可视区高度计算，
   避免内层被外层 overflow 裁掉底部。小程序端导航栏由原生提供，不受影响。 */
.demopage {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
  min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));

  .pannel-inner {
    height: calc(100vh - 60rpx - var(--window-top, 0px) - var(--window-bottom, 0px));

    .scroller-pannel {
      height: calc(100vh - 60rpx - var(--window-top, 0px) - var(--window-bottom, 0px));
    }
  }
}
/* #endif */
</style>