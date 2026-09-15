<script setup lang="ts">
import type { CooluiRefreshConfig, CooluiScrollerApi } from 'coolui-scroller-uni/types'
import type { DemoRefreshState } from '../../../../types'

const val = ref(0)
const refreshstate = ref<DemoRefreshState>('pulldown')
const isLoading = ref(false)
const giffoodSetting: CooluiRefreshConfig = {
  shake: true, // 是否开启下拉震动
  height: 150,
  isAutoTriggered: false,
  background: {
    color: '#3ac6f4',
  },
}
const christmasScroller = ref<CooluiScrollerApi | null>(null)

const onThreshold = (v: number) => {
  val.value = v
}
const onRefreshstate = (v: string) => {
  refreshstate.value = v
}
const onRefresh = () => {
  // 手动置 loading：本项目 uniapp 构建下 refresh 组件的 update:refreshstate 事件未回传到页面，
  // 原 onRefreshstate 无法驱动 .loading 类，必须由页面手动赋值兜底（原生由组件内部状态机驱动）
  refreshstate.value = 'loading'
  setTimeout(() => {
    // 开启第二段动画
    isLoading.value = true
    setTimeout(() => {
      // 触发回弹。await settriggered(false) 的 Promise：其内部 backToTop(400ms) + 500ms 后才 onRestore，
      // 完成后再把 refreshstate 复位为 pulldown，避免回弹瞬间动画被打断（容器还可见时应保持 .loading/.loading2）
      const scroller = christmasScroller.value
      const done = () => {
        refreshstate.value = 'pulldown'
      }
      if (scroller && typeof scroller.settriggered === 'function') {
        Promise.resolve(scroller.settriggered(false)).then(done)
      } else {
        done()
      }
    }, 2000) // 自定义回弹时间
  }, 1000)
}
</script>

<template>
  <view class="demopage">
    <view class="pannel-inner">
      <coolui-scroller
        ref="christmasScroller"
        :is-back-btn="true"
        @refresh="onRefresh"
      >
        <template #refresh>
          <coolui-scroller-refresh
            type="diy"
            :threshold="val"
            :refreshstate="refreshstate"
            :config="giffoodSetting"
            @update:threshold="onThreshold"
            @update:refreshstate="onRefreshstate"
          >
            <view
              class="christmas-wapper"
              :class="[refreshstate, isLoading ? 'loading2' : '']"
            >
              <view
                class="santa-claus"
                :style="{ top: -190 + 190 * val + 'rpx' }"
              ></view>
              <view
                class="snow"
                :style="{
                  backgroundPosition: '0px ' + (-150 + 150 * val) + 'px',
                }"
              ></view>
              <view
                class="chimney"
                :style="{ transform: 'scale(' + (3 - 2 * val) + ')' }"
              >
                <view class="chimney-head"></view>
                <view class="chimney-main"></view>
              </view>
            </view>
          </coolui-scroller-refresh>
        </template>

        <view class="scroller-pannel">
          <view>
            <view class="title">圣诞主题：圣诞老人</view>
            <view class="des">开启非自动回弹</view>
            <view class="des">增加动画状态，自定义回弹时间</view>
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

    .christmas-wapper {
      background-color: #3ac6f4;
      width: calc(100vw - 60rpx);
      height: 150px;
      position: relative;
      overflow: hidden;

      .snow {
        width: calc(100vw - 60rpx);
        height: 150px;
        background-image: url('https://test.wzs.pub/pic/christmas/snow.png');
        background-size: calc(100vw - 60rpx) 150px;
        background-position: 0px 0px;
      }

      .santa-claus {
        width: 124rpx;
        height: 190rpx;
        background-size: 1860rpx 190rpx;
        background-image: url('https://test.wzs.pub/pic/christmas/sdlr.png');
        position: absolute;
        left: 50%;
        top: -190rpx;
        transform: translateX(-50%);
        background-position: 0 0px;
        opacity: 1;
        z-index: 2;
      }

      .chimney {
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -55rpx;
        transform: scale(1);

        .chimney-head {
          background-color: #4a6b84;
          height: 26rpx;
          width: 110rpx;
          border-radius: 6rpx;
        }

        .chimney-main {
          height: 52rpx;
          width: 86rpx;
          background-image: url('https://test.wzs.pub/pic/christmas/chimney.jpg');
          background-size: 86rpx 52rpx;
          background-position: 0px 0px;
          margin: 0 auto;
        }
      }

      &.loading {
        .santa-claus {
          background-position: -992rpx 0px;
          animation: santa-play 0.8s steps(8);
          opacity: 0.8;
        }

        .chimney .chimney-main {
          height: 150px;
          transition: height 2s linear;
        }
      }

      &.loading.loading2 {
        .santa-claus {
          animation: santa-play2 0.8s steps(7) infinite;
        }

        .snow {
          animation: snow-play 0.9s linear infinite;
        }

        .chimney .chimney-main {
          animation: chimney-play 0.3s linear infinite;
        }
      }

      &.loosen {
        .chimney {
          transform: scale(3);
        }
      }
    }
  }
}

@keyframes santa-play {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: -992rpx 0px;
  }
}

@keyframes santa-play2 {
  from {
    background-position: -992rpx 0px;
  }
  to {
    background-position: -1860rpx 0px;
  }
}

@keyframes chimney-play {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: 0px -52rpx;
  }
}

@keyframes snow-play {
  from {
    background-position: 0px 0px;
  }
  to {
    background-position: 0px -150px;
  }
}
</style>