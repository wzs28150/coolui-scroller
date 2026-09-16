<script setup lang="ts">
import type {
  DemoArticle,
  DemoEmptySetting,
  DemoListResponse,
  DemoLoadmoreSetting,
  DemoPageParam,
  DemoRefreshConfig,
} from '../../types'

const isEmpty = ref(false)
const list = ref<DemoArticle[][]>([])
const defaultSetting: DemoRefreshConfig = {
  shake: true,
  style: 'black', // 设置圆点深色还是浅色
  // 与「下拉刷新 - 原生效果」保持一致：下拉高度大于 refresh 自身高度，
  // 松手先回落显示加载动画、刷新完成再整体回弹（弹性效果的关键）
  height: 50,
  background: { color: '#f2f2f2', height: 120 },
}
const loadMoreSetting = ref<DemoLoadmoreSetting>({
  status: 'more',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
})
const emptySetting: DemoEmptySetting = { img: '/img/empty.png', text: '暂无文章' }

const totalPageNum = ref(0)
const param = ref<DemoPageParam>({ limit: 4, page: 0 })
/** 当前滚动距离：透传给窗口化长列表组件，用于计算渲染窗口 */
const scrollTop = ref(0)

const getList = () => {
  // 判断当前是否为加载状态 防止页面重复添加数据
  if (loadMoreSetting.value.status !== 'loading') {
    loadMoreSetting.value.status = 'loading'
    const page = param.value.page
    if (totalPageNum.value > 0 && page == totalPageNum.value) {
      loadMoreSetting.value.status = 'noMore'
    } else {
      //  获取远程数据可换成自己封装的请求方法
      uni.request({
        url: 'https://api.wzs.pub/mock/21/list',
        data: {
          page: page + 1,
          isempty: 0, // 设置为1可测试空数据
          limit: 10,
          pagenum: 10,
          islong: 1,
        },
        method: 'GET',
        success: (res) => {
          const data = res.data as unknown as DemoListResponse<DemoArticle>
          if (data.code === 200) {
            totalPageNum.value = data.data.last
            if (data.data.list.length === 0 && page === 0) {
              isEmpty.value = true
              loadMoreSetting.value.status = 'noMore'
            } else {
              // 追加一页数据即可：页高测量与渲染窗口由 coolui-scroller-longlist 内部处理
              list.value[page] = data.data.list
              loadMoreSetting.value.status = 'more'
              param.value.page += 1
            }
          }
        },
      })
    }
  }
}
const refresh = () => {
  // 初始化缓存数据
  param.value = { limit: 4, page: 0 }
  list.value = []
  scrollTop.value = 0
  // 重新拉取数据
  getList()
}
/** scroller 的滚动事件：把 scrollTop 透传给窗口化长列表组件 */
const onScroll = (e: { detail: { scrollTop: number } }) => {
  scrollTop.value = e.detail.scrollTop
}

onMounted(() => {
  getList()
})
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">长列表</view>
      <view class="content">
        当滚动加载的数据越来越多时,页面渲染就会很慢.会出现卡顿状况.长列表实现实际上将数据做成分页处理,不在可视区的分页,将里面的item删掉用空结构占位处理。在scroller中使用scroller-page搭配scroller-item使用
      </view>
      <view class="pannel-inner">
        <coolui-scroller
          id="scroller"
          :class="loadMoreSetting.status == 'loading' && list.length == 0 ? 'isloading' : ''"
          :isEmpty="isEmpty"
          background="#f2f2f2"
          @loadmore="getList"
          @refresh="refresh"
          @scroll="onScroll"
        >
          <template #refresh>
            <coolui-scroller-refresh type="default" :config="defaultSetting" />
          </template>
          <!-- 列表：窗口化长列表（只渲染窗口内的页，窗口外折叠为上下两个占位块） -->
          <coolui-scroller-longlist :pages="list" :scroll-top="scrollTop">
            <template #page="{ items, pageIndex }">
              <!-- item组件循环项 -->
              <coolui-scroller-item v-for="(listItem, index) in items" :key="index">
                <view class="item">
                  <image class="item-image" :src="listItem.img"></image>
                  <view class="item-title">
                    {{ (pageIndex * 3) + listItem.id }}.{{ listItem.title }}
                  </view>
                </view>
              </coolui-scroller-item>
              <!-- item组件循环项 -->
            </template>
          </coolui-scroller-longlist>
          <!-- 列表 -->
          <!-- 加载更多组件 -->
          <template #loadmore>
            <coolui-scroller-loadmore
              :status="loadMoreSetting.status"
              :loading="loadMoreSetting.loading"
              :no-more="loadMoreSetting.noMore"
              :more="loadMoreSetting.more"
            />
          </template>
          <!-- 加载更多组件 -->
        </coolui-scroller>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
  display: flex;
}

/* #ifdef H5 */
/* H5 端 uni 会额外渲染内置导航栏（高度即 CSS 变量 --window-top），而 100vh 是整个视口高度，
   页面因此比可视区多出导航栏这一截，出现页面级滚动条（小程序端导航栏由原生提供，所以一直正常）。 */
.page {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */

/* 卡片外观与空列表页保持一致：白底 / 上边距 / 左右内边距 / overflow 都由全局 .pannel 提供，
   这里只补布局相关的三条，避免重复声明导致各页观感不一致 */
.pannel {
  flex: 1;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
}

.pannel .title {
  font-size: 32rpx;
  line-height: 32rpx;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0 20rpx 30rpx;
  position: relative;
}

.pannel .title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #d13435;
  width: 8rpx;
  height: 32rpx;
  border-radius: 8rpx;
}

.pannel .content {
  font-size: 28rpx;
  color: #666;
  padding: 30rpx 0;
}

/* 与空列表页一致：不重置内边距，沿用全局 .pannel .pannel-inner 的 20rpx */
.pannel .pannel-inner {
  flex: 1;
}

/* 列表项自定义结构样式
   `.item` 是插槽内容、属于本页作用域，直接写类名即可；
   不要写成 `.coolui-scroller .item` —— `.coolui-scroller` 是子组件内部的根节点，
   页面样式无法穿过组件边界，整条规则会失效（表现为各 item 之间没有间距） */
.item {
  padding: 30rpx 0 0;
}

.item-image {
  display: block;
  width: 100%;
  height: 300rpx;
}

.item-title {
  font-size: 32rpx;
  line-height: 3em;
  background-color: #fff;
}

.header {
  background-color: #fff;
}

/* empty组件可冲突样式 */
:deep(.empty-img) {
  width: 40vw !important;
}

:deep(.empty-text) {
  color: #666 !important;
}
</style>