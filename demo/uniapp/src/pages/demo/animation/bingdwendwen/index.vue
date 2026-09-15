<script setup lang="ts">
import type { CooluiRefreshConfig, CooluiScrollerApi } from 'coolui-scroller-uni/types'
import type { DemoRefreshState } from '../../../../types'

const flySetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 80,
  // isAutoTriggered: false,
  background: {
    color: '#d4ebf1',
  },
}
const refreshstate = ref<DemoRefreshState>('pulldown')
const triggered = ref(false)
const val = ref(0)
const bingdwendwenScroller = ref<CooluiScrollerApi | null>(null)

const onThreshold = (v: number) => {
  val.value = v
}
const onRefreshstate = (v: string) => {
  refreshstate.value = v
}
const onRefresh = () => {
  // 自行驱动 loading 触发角色位移 / 气球出现（不依赖 refresh 组件回传）
  refreshstate.value = 'loading'
  setTimeout(() => {
    // 先收起刷新容器：容器复位后角色被 overflow 裁掉，再复位 refreshstate 不会在可见区回弹
    bingdwendwenScroller.value && bingdwendwenScroller.value.settriggered(false)
    setTimeout(() => {
      refreshstate.value = 'pulldown'
    }, 500)
  }, 1000)
}
</script>

<template>
  <view class="demopage">
    <view class="pannel-inner">
      <coolui-scroller ref="bingdwendwenScroller" :is-back-btn="true" :triggered="triggered" @refresh="onRefresh">
        <template #refresh>
          <coolui-scroller-refresh
            type="diy"
            :threshold="val"
            :refreshstate="refreshstate"
            :config="flySetting"
            @update:threshold="onThreshold"
            @update:refreshstate="onRefreshstate"
          >
            <view class="bingdwendwen-wapper" :class="refreshstate">
              <view class="bingdwendwen">
                <view class="ear1"></view>
                <view class="ear2"></view>
                <view class="leg1"></view>
                <view class="leg2"></view>
                <view class="arm1"></view>
                <view class="arm2"></view>
                <view class="body"></view>
                <view class="face face1"></view>
                <view class="face face2"></view>
                <view class="face face3"></view>
                <view class="face face4"></view>
                <view class="face face5"></view>
                <view class="nose"></view>
                <view class="mouse"></view>
                <view class="eye1"></view>
                <view class="eye2"></view>
                <view class="balloon">Hi</view>
              </view>
            </view>
          </coolui-scroller-refresh>
        </template>

        <view class="scroller-pannel">
          <view style="text-align: center;">
            <view class="title">冰墩墩</view>
            <view class="des">谁能拒绝可爱的冰墩墩</view>
            <view class="des">使用refreshstate状态控制动画</view>
            <view class="des">
              refreshstate:
              <text style="color: #019ff0">{{ refreshstate }}</text>
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

    .bingdwendwen-wapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;

      .bingdwendwen {
        position: relative;
        height: 50px;
        width: 44px;
        transition: all 0.4s;

        .body {
          width: 44px;
          height: 50px;
          border: #393939 2px solid;
          border-radius: 88% 88% 62% 68% / 82% 82% 95% 84%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
        }

        .ear1,
        .ear2 {
          background: #393939;
          width: 9.72px;
          height: 13.8px;
          border-radius: 50%;
          position: absolute;
          z-index: 0;
          top: -4px;
        }

        .ear1 {
          left: 4.92px;
        }

        .ear2 {
          left: 30.3px;
        }

        .leg1,
        .leg2 {
          background: #333;
          position: absolute;
          width: 9.96px;
          height: 9.6px;
          border-radius: 0 0 3.6px 3.6px;
          z-index: 0;
          bottom: -10px;

          &::after {
            content: '';
            width: 5.16px;
            height: 3.6px;
            position: absolute;
            background: #333;
            border-radius: 3.6px;
          }
        }

        .leg1 {
          left: 9.84px;

          &::after {
            bottom: 0;
            right: -1px;
          }
        }

        .leg2 {
          left: 26.76px;

          &::after {
            bottom: 0;
            left: -1px;
          }
        }

        .arm1,
        .arm2 {
          background: #333;
          position: absolute;
          z-index: 0;
        }

        .arm1 {
          width: 9px;
          height: 14.16px;
          left: -7px;
          top: 26px;
          transform: rotate(45deg);
          border-radius: 24% 69% 68% 76% / 53% 95% 40% 52%;
        }

        .arm2 {
          width: 9px;
          height: 14.16px;
          right: -7px;
          top: 26px;
          transform-style: preserve-3d;
          transform: rotate(-45deg);
          border-radius: 24% 69% 68% 76% / 53% 95% 40% 52%;
          transition: all 0.4s;
        }

        .face {
          position: absolute;
          border-radius: 48% 48% 44% 49% / 53% 54% 45% 47%;
          border: #6bcdf3 1px solid;

          &.face1 {
            border-color: #6bcdf3;
            width: 33.6px;
            height: 26.88px;
            left: 50%;
            top: 20px;
            transform: translate(-50%, -50%);
          }

          &.face2 {
            border-color: #af2350;
            width: 34.6px;
            height: 27.88px;
            left: 50%;
            top: 20px;
            transform: translate(-50%, -50%);
          }

          &.face3 {
            border-color: #5d75b3;
            width: 35.6px;
            height: 28.88px;
            left: 50%;
            top: 20px;
            transform: translate(-50%, -50%);
          }

          &.face4 {
            border-color: #ffc346;
            width: 36.6px;
            height: 29.88px;
            left: 50%;
            top: 20px;
            transform: translate(-50%, -50%);
          }

          &.face5 {
            border-color: #7fcb58;
            width: 37.6px;
            height: 30.88px;
            left: 50%;
            top: 20px;
            transform: translate(-50%, -50%);
          }
        }

        .nose {
          background-color: #333333;
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .nose,
        .nose:before,
        .nose:after {
          width: 3.36px;
          height: 2.16px;
          border-radius: 5.04px 5.04px 7.2px 7.32px / 3.6px 3.6px 6px 5.52px;
        }

        .mouse {
          position: absolute;
          left: 50%;
          top: 22px;
          width: 8.16px;
          height: 3px;
          border-radius: 48%;
          border: #393939 1px solid;
          border-top: none;
          border-left: 0;
          border-right: 0;
          transform: translate(-50%, 0);
        }

        .eye1,
        .eye2 {
          background: #393939;
          width: 9.96px;
          height: 13.8px;
          border-radius: 50%;
          position: absolute;
          top: 10px;

          &::before {
            content: '';
            width: 4.8px;
            height: 4.8px;
            border: #fff 1px solid;
            border-radius: 100%;
            position: absolute;
          }

          &::after {
            content: '';
            width: 1px;
            height: 1px;
            background: #9b9b9b;
            border-radius: 100%;
            position: absolute;
          }
        }

        .eye1 {
          transform: rotate(45deg);
          left: 9.6px;

          &::before {
            right: 1.2px;
            top: 2.64px;
          }

          &::after {
            right: 4.5px;
            top: 5.28px;
          }
        }

        .eye2 {
          transform: rotate(-45deg);
          left: 25px;

          &::before {
            left: 1.2px;
            top: 2.64px;
          }

          &::after {
            left: 4.92px;
            top: 5.28px;
          }
        }
      }

      .balloon {
        width: 45px;
        height: 12px;
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        position: relative;
        font-size: 12px;
        text-align: center;
        transform: translateY(-50%);
        margin-left: 20px;
        opacity: 0;
        visibility: hidden;
        position: absolute;
        left: 90%;
        transition: all 0.4s;

        &::after {
          content: '';
          width: 0;
          height: 0;
          position: absolute;
          left: -10px;
          top: 10px;
          border: solid 5px;
          border-color: transparent #fff transparent transparent;
        }
      }

      &.loading {
        .bingdwendwen {
          transform: translateX(-70%);

          .arm2 {
            width: 9px;
            height: 17.76px;
            right: -8px;
            top: 17px;
            transform-style: preserve-3d;
            transform: rotate(37deg);
            border-radius: 56% 62% 98% 6% / 40% 46% 80% 58%;
          }
        }

        .balloon {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
}
</style>