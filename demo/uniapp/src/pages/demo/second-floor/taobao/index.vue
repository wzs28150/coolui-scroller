<script setup>

const refreshConfig = {
  downText: '下拉刷新',
  loadingText: '正在加载',
  backText: '返回首页',
  tipText: '松开刷新',
  moreText: '二楼可以访问您添加的频道哦~\n请下拉访问',
}
const navBarConfig = {
  back: {
    show: true,
    click: () => {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
  background: {
    color: '#ffffff',
  },
  text: {
    color: '#d13435',
  },
}
const pic = {
  tb: 'https://test.wzs.pub/pic/second-floor-bg.jpeg',
  elm: 'https://test.wzs.pub/pic/2lou/elm.jpg',
}
const list = [
  { icon: 'https://test.wzs.pub/pic/xian.jpg', name: '闲鱼' },
  { icon: 'https://test.wzs.pub/pic/cai.jpg', name: '菜鸟' },
  { icon: 'https://test.wzs.pub/pic/xian.jpg', name: '闲鱼' },
  { icon: 'https://test.wzs.pub/pic/cai.jpg', name: '菜鸟' },
  { icon: 'https://test.wzs.pub/pic/xian.jpg', name: '闲鱼' },
  { icon: 'https://test.wzs.pub/pic/cai.jpg', name: '菜鸟' },
  { icon: 'https://test.wzs.pub/pic/xian.jpg', name: '闲鱼' },
  { icon: 'https://test.wzs.pub/pic/cai.jpg', name: '菜鸟' },
  { icon: 'https://test.wzs.pub/pic/xian.jpg', name: '闲鱼' },
  { icon: 'https://test.wzs.pub/pic/cai.jpg', name: '菜鸟' },
]

const val = ref(0)
const show = ref(false)
const isSecond = ref(false)
const statusBarHeight = ref(0)
const key = ref('')
const newPage = ref(false)
const button = ref({
  hide: true,
})
const placeholder = ref('搜索')
const mySecondFloor = ref(null)

onLoad(() => {
  // getWindowInfo 返回 statusBarHeight，且不会触发 wx.getSystemInfo 弃用告警
  const info = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync()
  statusBarHeight.value = info.statusBarHeight || 0
})

const onRefresh = () => {
  // 模拟请求延时
  setTimeout(() => {
    // 设置回弹
    mySecondFloor.value.settriggered().then(() => {
      uni.showToast({
        title: '执行回弹成功',
        icon: 'success',
      })
    })
  }, 2000)
}
const onSecondShow = () => {
  uni.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#000000',
  })
  isSecond.value = true
  // 如果设置了弹出新页 则控制show
  if (newPage.value) {
    setTimeout(() => {
      show.value = true
    }, 500)
  }
}
const onSecondBack = () => {
  uni.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#ffffff',
  })
  isSecond.value = false
}
</script>

<template>
  <view class="taobao-page">
    <coolui-scroller-second-floor
      ref="mySecondFloor"
      :threshold="val"
      bottom
      @refresh="onRefresh"
      @secondShow="onSecondShow"
      @secondBack="onSecondBack"
    >
      <template #second-floor>
        <view class="second-floor" :class="isSecond ? 'show' : ''">
          <block v-if="isSecond">
            <view class="second-search">
              <coolui-scroller-search
                :round="true"
                :keyword="key"
                :button="button"
                :placeholder="placeholder"
                :clearable="true"
                @update:keyword="(v) => (key = v)"
                style="--color:#fff;--placeholder-color:rgba(255,255,255,0.7);--input-bg-color:#7d6f93;"
              ></coolui-scroller-search>
            </view>
            <view class="recently-used">
              <view class="title">最近使用</view>
              <view class="list">
                <view
                  class="item"
                  v-for="(item, i) in list"
                  :key="'r' + i"
                >
                  <view
                    class="icon"
                    :style="{ backgroundImage: 'url(' + item.icon + ')' }"
                  ></view>
                  <view class="name">{{ item.name }}</view>
                </view>
              </view>
            </view>
            <view class="recently-used my-used">
              <view class="title">
                我的频道
                <view>更多></view>
              </view>
              <view class="list">
                <view
                  class="item"
                  v-for="(item, i) in list"
                  :key="'m' + i"
                >
                  <view
                    class="icon"
                    :style="{ backgroundImage: 'url(' + item.icon + ')' }"
                  ></view>
                  <view class="name">{{ item.name }}</view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </template>

      <template #second-floor-refresh>
        <coolui-scroller-second-floor-refresh
          :refresh-config="refreshConfig"
          back-bg-color="#7d6f93"
        ></coolui-scroller-second-floor-refresh>
      </template>

      <template #nav-bar>
        <coolui-scroller-nav-bar :config="navBarConfig">
          仿淘宝下拉二楼
        </coolui-scroller-nav-bar>
      </template>

      <view class="demopage">
        <view class="pannel-inner">
          <view class="scroller-pannel">
            <view>
              <view class="title">下拉二楼效果</view>
              <view class="downtip">下拉查看效果</view>
              <view class="downicon">
                <view class="line"></view>
                <view class="line"></view>
                <view class="line"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </coolui-scroller-second-floor>
  </view>
</template>

<style lang="scss" scoped>
.taobao-page {
  background-color: #fff;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .second-floor {
    color: #fff;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    background-size: cover;
    background-position: bottom center;
    height: 100%;
    width: 100%;
    background-image: url('https://test.wzs.pub/pic/taobao.png');

    &.show {
      background-position: top center;
      background-size: auto 150%;
    }

    .second-search {
      padding: 10vh 50rpx 30rpx;
    }

    .recently-used {
      color: #fff;
      padding: 0 50rpx;
      margin-bottom: 50rpx;

      .title {
        font-weight: bold;
        font-size: 32rpx;
        margin-bottom: 30rpx;
        display: flex;
        justify-content: space-between;

        > view {
          font-weight: normal;
          font-size: 24rpx;
          align-items: center;
        }
      }

      .list {
        display: flex;
        flex-wrap: wrap;

        .item {
          text-align: center;
          font-size: 28rpx;
          width: 20%;

          .icon {
            width: 3em;
            height: 3em;
            background-color: #ccc;
            border-radius: 100%;
            margin: 0 auto;
            background-position: center;
            background-size: cover;
          }

          .name {
            margin: 20rpx 0;
          }
        }
      }
    }

    .my-used {
      .list {
        border: 1px dashed #7d6f93;
        border-radius: 20rpx;
        padding-top: 20rpx;
        background-color: rgba(58, 25, 56, 0.3);
      }
    }
  }

  .demopage {
    height: 100%;
    background-color: #f2f2f2;
    padding: 0 30rpx;
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
}

::v-deep .second-floor .search-inner {
  background-color: #7d6f93 !important;
}
</style>