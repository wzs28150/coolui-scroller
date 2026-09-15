<script setup lang="ts">
import type {
  CooluiRefreshConfig,
  CooluiScrollerApi,
  CooluiScrollerNavItem,
} from 'coolui-scroller-uni/types'
import type {
  DemoCaseEntry,
  DemoComponentEntry,
  DemoNavChangeEvent,
  DemoTapEvent,
  DemoTouchEvent,
} from '../../types'

const PageCur = ref(0)
const trans = ref(false)
const touchx = ref(0)
const touchy = ref(0)
const componentList: DemoComponentEntry[] = [
  { title: '滚动列表组件', path: '/pages/list/index' },
  { title: '加载更多组件', path: '/pages/loadmore/index' },
  { title: '下拉刷新组件', path: '/pages/refresh/index' },
  { title: '手势提示组件', path: '/pages/hand/index' },
  { title: '空列表组件', path: '/pages/empty/index' },
  { title: '长列表组件', path: '/pages/longlist/index' },
  { title: '搜索组件', path: '/pages/search/index' },
  { title: '分类导航组件', path: '/pages/nav/index' },
  { title: '切换组件', path: '/pages/nav-pannel/index' },
  { title: '筛选及排序组件', path: '/pages/sort/index' },
  { title: '下拉二楼', path: '/pages/second-floor/index' },
  { title: '组合使用', path: '/pages/combined/index' },
]
const caseNav: CooluiScrollerNavItem[] = [
  { id: 1, title: '下拉动画' },
  { id: 2, title: '下拉组合' },
  { id: 3, title: '下拉二楼' },
]
const caseList: DemoCaseEntry[][] = [
  [
    {
      id: 5,
      title: '冰墩墩',
      img: 'https://test.wzs.pub/pic/bing/bing.jpg',
      page: '/pages/demo/animation/bingdwendwen/index',
    },
    {
      id: 4,
      title: '浩瀚宇宙',
      img: 'https://test.wzs.pub/pic/universe/earth.gif',
      page: '/pages/demo/animation/universe/index',
    },
    {
      id: 3,
      title: '圣诞主题:圣诞老人',
      img: 'https://test.wzs.pub/pic/christmas/merrychristmas.gif',
      page: '/pages/demo/animation/christmas/index',
    },
    {
      id: 2,
      title: '餐饮主题:魔性吃面',
      img: 'https://test.wzs.pub/pic/food_pic.gif',
      page: '/pages/demo/animation/noodles/index',
    },
    {
      id: 1,
      title: '纯css画飞上云霄',
      img: 'https://test.wzs.pub/pic/fly_pic1.gif',
      page: '/pages/demo/animation/fly/index',
    },
  ],
  [
    {
      id: 1,
      title: '图文社交列表',
      img: 'https://test.wzs.pub/pic/pics/pics.jpg',
      page: '/pages/demo/combined/pics/index/index',
    },
  ],
  [
    {
      id: 1,
      title: '淘宝二楼',
      img: 'https://test.wzs.pub/pic/taobao.jpg',
      page: '/pages/demo/second-floor/taobao/index',
    },
  ],
]
const caseConfig: CooluiRefreshConfig = {
  shake: true,
  height: 70,
  text: {
    content: 'coolui-scroller',
    font: 'Lobster variant0',
    size: '50',
    color: '#ccc',
    shadow: 0,
    img: 'https://test.wzs.pub/pic/bg2.jpg',
  },
  background: {
    color: '#f2f2f2',
    height: 120,
  },
}
const active = ref(0)
const caseScroller = ref<CooluiScrollerApi | null>(null)

// 案例子 tab（下拉动画/下拉组合/下拉二楼）切换时重新计算 scroller 高度
watch(active, () => {
  if (caseScroller.value && caseScroller.value.recalculateHeight) {
    caseScroller.value.recalculateHeight()
  }
})

// 底部「组件/案例」主 tab 切换时也要重算：两个 tab 常驻 DOM、靠 transform 横滑，
// 切回案例页后 scroll-view 滚动能力可能失活，必须强制重建（见 coolui-scroller.recalculateHeight）
watch(PageCur, () => {
  if (caseScroller.value && caseScroller.value.recalculateHeight) {
    caseScroller.value.recalculateHeight()
  }
})

const go = (path: string) => uni.navigateTo({ url: path })
const navChange = (e: DemoTapEvent) => {
  // dataset 取到的是字符串，必须转成数字，否则模板里的 === 判断恒不成立、tab 不切换
  PageCur.value = Number(e.currentTarget.dataset.cur)
  trans.value = false
}
const touchStart = (e: DemoTouchEvent) => {
  const t = e.changedTouches[0]
  touchx.value = t.clientX
  touchy.value = t.clientY
  trans.value = true
}
const touchEnd = (e: DemoTouchEvent) => {
  const t = e.changedTouches[0]
  const x = t.clientX
  const y = t.clientY
  let turn = ''
  if (x - touchx.value > 50 && Math.abs(y - touchy.value) < 50) {
    turn = 'right'
  } else if (x - touchx.value < -50 && Math.abs(y - touchy.value) < 50) {
    turn = 'left'
  }
  if (turn === 'right' && PageCur.value === 1) {
    PageCur.value = 0
    setTimeout(() => {
      trans.value = false
    }, 1000)
  }
  if (turn === 'left' && PageCur.value !== 1) {
    PageCur.value = 1
    setTimeout(() => {
      trans.value = false
    }, 1000)
  }
}
const onChange = (e: DemoNavChangeEvent) => {
  active.value = Number(e.id) - 1
}
</script>

<template>
  <view
    class="page"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <view
      class="index-page-swiper"
      :class="{ on: PageCur === 1, trans: trans }"
    >
      <!-- 组件 tab -->
      <view class="index-page">
        <view class="component">
          <!-- 原生 canvas 波浪背景组件（对齐原生 wave-bg-weapp）。
               uni-app 会把组件属性通过 u-p 传给组件实例，原生小程序组件读不到这些属性，
               因此这里不传参，参数走组件默认值（color #d13435 / percent 90 / position top）；
               高度用行内样式确保作用到原生组件的宿主节点上。
               该组件是 wxcomponents 里的原生小程序组件，只在微信端注册（见 pages.json）。 -->
          <!-- #ifdef MP-WEIXIN -->
          <wave-bg
            class="bg"
            style="display: block; position: relative; height: 33vh; overflow: hidden; z-index: 0"
          ></wave-bg>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <!-- 其它端没有该原生组件：用同尺寸、同主色的渐变底替代，保证布局与观感一致 -->
          <view
            class="bg"
            style="
              display: block;
              position: relative;
              height: 33vh;
              overflow: hidden;
              z-index: 0;
              background: linear-gradient(180deg, #d13435 0%, #ef7f80 60%, #f2f2f2 100%);
            "
          ></view>
          <!-- #endif -->
          <view class="logo">coolui-scroller</view>
          <view class="inner">
            <scroll-view scroll-y class="scroll">
              <view class="list">
                <navigator
                  v-for="(item, index) in componentList"
                  :key="item.title"
                  class="item"
                  hover-class="none"
                  :url="item.path"
                >
                  <view>
                    <image
                      class="icon"
                      :src="'/static/img/index-nav-icon' + index + '.png'"
                    ></image>
                    {{ item.title }}
                  </view>
                </navigator>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 案例 tab -->
      <view class="index-page">
        <view class="case">
          <coolui-scroller ref="caseScroller" :isEmpty="false" background="#f2f2f2">
            <template #header>
              <view style="background-color: #fff">
                <coolui-scroller-nav
                  :list="caseNav"
                  navPerView="3"
                  :spaceBetween="20"
                  :active="active"
                  textColor="#333"
                  activeColor="#d13435"
                  @change="onChange"
                ></coolui-scroller-nav>
              </view>
            </template>

            <template #refresh>
              <coolui-scroller-refresh type="logoText" :config="caseConfig" />
            </template>

            <coolui-scroller-item
              v-for="(listItem, i) in caseList[active]"
              :key="listItem.id"
            >
              <navigator :url="listItem.page" class="item">
                <image
                  class="item-image"
                  lazy-load
                  :src="listItem.img"
                ></image>
                <view class="item-title">{{ listItem.id }}.{{ listItem.title }}</view>
              </navigator>
            </coolui-scroller-item>
          </coolui-scroller>
        </view>
      </view>
    </view>

    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action" @tap="navChange" data-cur="0">
        <image
          class="tabbar-icon"
          :src="'/static/img/component' + (PageCur === 0 ? '_cur' : '') + '.png'"
        ></image>
        <view :class="PageCur === 0 ? 'text-red' : 'text-gray'">组件</view>
      </view>
      <view class="action" @tap="navChange" data-cur="1">
        <image
          class="tabbar-icon"
          :src="'/static/img/case' + (PageCur === 1 ? '_cur' : '') + '.png'"
        ></image>
        <view :class="PageCur === 1 ? 'text-red' : 'text-gray'">案例</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 100rpx);
  background-color: #f2f2f2;
  overflow: hidden;
  position: relative;
}

.index-page-swiper {
  width: 200vw;
  height: calc(100vh - 100rpx);
  display: flex;
  &.trans {
    transition: all 1s;
  }
  &.on {
    transform: translateX(-100vw);
    &.trans {
      transition: all 1s;
    }
  }
  .index-page {
    flex: 1;
    width: 100vw;
    height: calc(100vh - 100rpx);
    position: relative;
    overflow: hidden;
  }
}

.cu-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  height: 100rpx;
  min-height: 100rpx;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 -1rpx 6rpx rgba(0, 0, 0, 0.1);
  z-index: 99;

  .action {
    flex: 1;
    text-align: center;
    padding: 0;
    font-size: 22rpx;
    line-height: 1;
    &.text-red {
      color: #d13435;
    }
    &.text-gray {
      color: #aaaaaa;
    }
    .tabbar-icon {
      width: 50rpx;
      height: 50rpx;
      display: block;
      margin: 0 auto;
    }
  }
}

/* ---------- 组件 tab ---------- */
.component {
  position: relative;
  .bg {
    height: 33vh;
    z-index: 0;
    overflow: hidden;
  }
  .logo {
    position: absolute;
    width: 100vw;
    top: 7vh;
    left: 0;
    z-index: 89;
    padding: 30rpx 0;
    text-align: center;
    font-weight: bold;
    font-size: 100rpx;
    color: #fff;
    font-family: 'Lobster variant0';
  }
  .inner {
    padding: 33vh 30rpx 30rpx;
    height: calc(100vh - 100rpx);
    position: absolute;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 89;
    box-sizing: border-box;
    .scroll {
      height: 100%;
      background-color: #fff;
      border-radius: 10rpx;
      margin-top: 0;
    }
    .list {
      padding: 30rpx;
      display: flex;
      flex-wrap: wrap;
      height: calc(100vh - 100rpx - 90rpx - 33vh);
      .item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        width: 33.3333%;
        text-align: center;
        box-sizing: border-box;
        .icon {
          width: 3em;
          height: 3em;
          display: block;
          margin: 0 auto;
        }
        &::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          transform: scale(0.5);
          border-bottom: 1px solid #eee;
          pointer-events: none;
        }
        &::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          transform: scale(0.5);
          border-right: 1px solid #eee;
          pointer-events: none;
        }
        &:nth-child(3n)::before {
          display: none;
        }
        &:nth-child(7)::after,
        &:nth-child(8)::after,
        &:nth-child(9)::after {
          display: none;
        }
      }
    }
  }
}

/* ---------- 案例 tab ---------- */
.case {
  height: 100%;
  .item {
    margin: 16rpx 24rpx;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    display: block;
  }
  .item-image {
    width: 100%;
    height: 320rpx;
    display: block;
  }
  .item-title {
    padding: 20rpx 24rpx;
    font-size: 26rpx;
    color: #333;
  }
}
</style>
