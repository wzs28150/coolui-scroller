<script setup lang="ts">
import type { CooluiRefreshConfig, CooluiScrollerApi } from 'coolui-scroller-uni/types'
import type { DemoRefreshState } from '../../../../types'

const flySetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 80,
  // isAutoTriggered: false,
  background: {
    color: '#019ff0',
  },
}
const refreshstate = ref<DemoRefreshState>('pulldown')
const triggered = ref(false)
const val = ref(0)
const flyScroller = ref<CooluiScrollerApi | null>(null)

const onThreshold = (v: number) => {
  val.value = v
}
const onRefreshstate = (v: string) => {
  refreshstate.value = v
}
const onRefresh = () => {
  // 自行驱动 loading 触发飞机飞走动画（不依赖 refresh 组件回传）
  refreshstate.value = 'loading'
  setTimeout(() => {
    // 先收起刷新容器：容器的 translateY 复位后，飞机会被 overflow 裁掉
    flyScroller.value && flyScroller.value.settriggered(false)
    // 等容器收起动画结束再复位 refreshstate，避免飞机在可见区域内倒着飞回
    setTimeout(() => {
      refreshstate.value = 'pulldown'
    }, 500)
  }, 1000)
}
</script>

<template>
  <view class="demopage">
    <view class="pannel-inner">
      <coolui-scroller ref="flyScroller" :is-back-btn="true" :triggered="triggered" @refresh="onRefresh">
        <template #refresh>
          <coolui-scroller-refresh
            type="diy"
            :threshold="val"
            :refreshstate="refreshstate"
            :config="flySetting"
            @update:threshold="onThreshold"
            @update:refreshstate="onRefreshstate"
          >
            <view class="fly-wapper">
              <view
                class="plane"
                :class="{
                  loosen: refreshstate === 'loosen' || refreshstate === 'loading',
                  loading: refreshstate === 'loading',
                }"
              >
                <view class="frame"></view>
                <view class="wrings-left"></view>
                <view class="tail-left"></view>
                <view class="tail-top"></view>
              </view>
              <view class="wind">
                <view class="wind1"></view>
                <view class="wind2"></view>
                <view class="wind3"></view>
              </view>
              <view class="clouds_center" :class="refreshstate">
                <view class="clouds1"></view>
                <view class="clouds2"></view>
                <view class="clouds3"></view>
                <view class="clouds4"></view>
                <view class="clouds5"></view>
                <view class="clouds6"></view>
                <view class="clouds7"></view>
                <view class="clouds8"></view>
                <view class="clouds9"></view>
              </view>
            </view>
          </coolui-scroller-refresh>
        </template>

        <view class="scroller-pannel">
          <view style="text-align: center;">
            <view class="title">飞上云霄</view>
            <view class="des">场景化素材搭配，纯css实现云层、飞机</view>
            <view class="des">使用refreshstate状态控制动画</view>
            <view class="des">refreshstate: <text style="color: #019ff0">{{ refreshstate }}</text></view>
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

    .fly-wapper {
      height: 80px;
      width: 100%;
      position: relative;
      background-color: #019ff0;
      overflow: hidden;

      .plane {
        height: 75rpx;
        width: 122.5rpx;
        position: absolute;
        top: 80px;
        left: 50%;
        z-index: 3;
        margin-left: -61.25rpx;
        transform: rotate(-30deg) translate(0, 20px);
        transition: all 1s;

        &.loosen {
          top: 10px;
          transform: rotate(0);

          &.loading {
            transform: rotate(0deg) translate(250px, -30px);
          }
        }

        .frame {
          z-index: 1;
          height: 10rpx;
          width: 101.25rpx;
          position: absolute;
          top: 25rpx;
          right: 12.5rpx;
          border-radius: 100% 150% 0 300%;
          transform: rotate(-15deg);
          background-color: #fff;

          &::after {
            content: '';
            height: 14rpx;
            width: 100rpx;
            background-color: #fff;
            position: absolute;
            top: -10rpx;
            left: 8.75rpx;
            border-radius: 120% 167% 113% 100%;
            clip: rect(0rpx 102.5rpx 15rpx 92.5rpx);
            transform: rotate(10deg);
          }
        }

        .wrings-left {
          width: 0;
          height: 0;
          border-bottom: 25rpx solid #fff;
          border-right: 10rpx solid transparent;
          background: none;
          transform-origin: left bottom;
          transform: rotate(-15deg) skewX(40deg);
          position: absolute;
          top: 6.25rpx;
          left: 37.5rpx;
        }

        .tail-left {
          width: 0;
          height: 0;
          border-bottom: 10rpx solid #fff;
          border-right: 5rpx solid transparent;
          background: none;
          transform-origin: left bottom;
          transform: rotate(-35deg) skewX(40deg);
          position: absolute;
          top: 30rpx;
          left: 15rpx;
        }

        .tail-top {
          width: 15rpx;
          height: 3.75rpx;
          transform: rotate(30deg) skewX(-40deg);
          border-top-left-radius: 20%;
          border-bottom-left-radius: 20%;
          position: absolute;
          top: 31.25rpx;
          left: 7.5rpx;
          border-bottom: none;
          z-index: 3;
          background-color: #fff;

          &::before {
            content: '';
            width: 15rpx;
            height: 2.5rpx;
            position: absolute;
            top: 2.25rpx;
            left: 0.25rpx;
            transform: rotate(13deg) skewX(13deg);
            background: #fff;
            display: block;
          }
        }
      }

      .wind {
        .wind1 {
          width: 40rpx;
          height: 2rpx;
          background-color: #fff;
          position: absolute;
          top: 30%;
          opacity: 0.6;
          animation: windflow linear 1s infinite;
        }

        .wind2 {
          width: 40rpx;
          height: 2rpx;
          background-color: #fff;
          position: absolute;
          top: 50%;
          opacity: 0.6;
          animation: windflow linear 3s infinite;
        }

        .wind3 {
          width: 40rpx;
          height: 2rpx;
          background-color: #fff;
          position: absolute;
          top: 60%;
          opacity: 0.6;
          animation: windflow linear 2s infinite;
        }
      }

      .clouds_center {
        position: relative;
        height: 100%;
        transition: all 1s;
        transform: translateY(50px) scale(1.2);

        &.loosen,
        &.loading {
          transform: translateY(0) scale(1);
        }

        .clouds1 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: #fff 50rpx -40rpx 0 20rpx, #fff 44rpx -20rpx 0 10rpx, #fff 50rpx -2rpx 0 16rpx, #fff 108rpx -2rpx 0 16rpx, #fff 160rpx 0rpx 0 4rpx;
          position: absolute;
          left: 4vw;
          bottom: -40rpx;
          z-index: 3;
        }

        .clouds2 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #e9f4ff;
          box-shadow: #e9f4ff 70rpx -40rpx 0 20rpx, #e9f4ff 44rpx -20rpx 0 10rpx, #e9f4ff 50rpx -2rpx 0 16rpx, #e9f4ff 108rpx -2rpx 0 16rpx, #e9f4ff 160rpx 0rpx 0 4rpx;
          position: absolute;
          left: 8vw;
          bottom: -40rpx;
          z-index: 2;
        }

        .clouds3 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #c9def3;
          box-shadow: #c9def3 130rpx -30rpx 0 10rpx, #c9def3 44rpx -20rpx 0 10rpx, #c9def3 50rpx -2rpx 0 16rpx, #c9def3 108rpx -2rpx 0 16rpx, #c9def3 180rpx 0rpx 0 10rpx;
          position: absolute;
          left: 10vw;
          bottom: -20rpx;
          z-index: 1;
        }

        .clouds4 {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: #fff 25rpx -20rpx 0 10rpx, #fff 0rpx -10rpx 0 5rpx, #fff 25rpx -1rpx 0 8rpx, #fff 54rpx -1rpx 0 8rpx, #fff 80rpx 0rpx 0 2rpx;
          position: absolute;
          left: 36vw;
          bottom: -20rpx;
          z-index: 3;
        }

        .clouds5 {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background-color: #e9f4ff;
          box-shadow: #e9f4ff 35rpx -20rpx 0 10rpx, #e9f4ff 22rpx -10rpx 0 5rpx, #e9f4ff 25rpx -1rpx 0 8rpx, #e9f4ff 54rpx -1rpx 0 8rpx, #e9f4ff 80rpx 0rpx 0 2rpx;
          position: absolute;
          left: 40vw;
          bottom: -20rpx;
          z-index: 2;
        }

        .clouds6 {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background-color: #c9def3;
          box-shadow: #c9def3 65rpx -20rpx 0 10rpx, #c9def3 22rpx -10rpx 0 5rpx, #c9def3 25rpx -1rpx 0 8rpx, #c9def3 54rpx -1rpx 0 8rpx, #c9def3 100rpx 0rpx 0 5rpx;
          position: absolute;
          left: 42vw;
          bottom: -10rpx;
          z-index: 1;
        }

        .clouds7 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: #fff 50rpx -40rpx 0 20rpx, #fff 0rpx -20rpx 0 10rpx, #fff 50rpx -2rpx 0 16rpx, #fff 108rpx -2rpx 0 16rpx, #fff 160rpx 0rpx 0 4rpx;
          position: absolute;
          left: 55vw;
          bottom: -40rpx;
          z-index: 3;
        }

        .clouds8 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #e9f4ff;
          box-shadow: #e9f4ff 70rpx -40rpx 0 20rpx, #e9f4ff 44rpx -20rpx 0 10rpx, #e9f4ff 50rpx -2rpx 0 16rpx, #e9f4ff 108rpx -2rpx 0 16rpx, #e9f4ff 160rpx 0rpx 0 4rpx;
          position: absolute;
          left: 65vw;
          bottom: -40rpx;
          z-index: 2;
          opacity: 0.5;
        }

        .clouds9 {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: #c9def3;
          box-shadow: #c9def3 100rpx -40rpx 0 20rpx, #c9def3 44rpx -20rpx 0 10rpx, #c9def3 50rpx -2rpx 0 16rpx, #c9def3 108rpx -2rpx 0 16rpx, #c9def3 200rpx 0rpx 0 10rpx;
          position: absolute;
          left: -5vw;
          bottom: -20rpx;
          z-index: 1;
          opacity: 0.6;
        }
      }
    }
  }
}

@keyframes windflow {
  from {
    left: calc(100vw + 40rpx);
  }
  to {
    left: -40rpx;
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