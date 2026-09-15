<script setup>

const isEmpty = ref(false)
const list = ref([])
const baseConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  text: {
    color: '#fff', // 文字颜色
    shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
  },
  background: {
    color: '#000000',
    height: 120,
    img: 'https://test.wzs.pub/pic/bg.jpg',
  },
}
const loadMoreSetting = ref({
  status: 'more',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
  color: '#999',
})
const emptySetting = {
  img: '/static/img/empty.png',
  // img: 'http://www.365editor.com/images/nodata.png',
  text: '暂无文章',
}
const nav = [
  { id: 1, title: '分类1' },
  { id: 2, title: '分类2' },
  { id: 3, title: '分类3' },
  { id: 4, title: '分类4' },
  { id: 5, title: '分类5' },
  { id: 6, title: '分类6' },
  { id: 7, title: '分类7' },
]
const active = ref(0)
const key = ref('')

let wholeList = []
let currentRenderIndex = 0
let pageHeightArr = []
let touchx = 0
let touchy = 0
const totalPageNum = ref(0)
const param = ref({ limit: 4, page: 0 })

const getList = () => {
  // 判断当前是否为加载状态 防止页面重复添加数据
  if (loadMoreSetting.value.status !== 'loading') {
    loadMoreSetting.value.status = 'loading'
    const page = param.value.page
    currentRenderIndex = page
    if (totalPageNum.value > 0 && page === totalPageNum.value) {
      loadMoreSetting.value.status = 'noMore'
    } else {
      // 获取远程数据可使用自己封装的请求方法
      uni.request({
        url: 'https://api.wzs.pub/mock/21/list',
        data: {
          page: page + 1,
          limit: 5,
          isempty: 0, // 设置为1可测试空数据
          pagenum: 10,
        },
        method: 'GET',
        success: (res) => {
          if (res.data.code === 200) {
            totalPageNum.value = res.data.data.last
            if (res.data.data.list.length === 0 && page === 0) {
              loadMoreSetting.value.status = 'noMore'
              isEmpty.value = true
            } else {
              wholeList[page] = res.data.data.list
              setTimeout(() => {
                // Vue3 数组索引赋值即响应式（替代原 Vue2 的 $set）
                list.value[page] = res.data.data.list
                loadMoreSetting.value.status = 'more'
                param.value.page += 1
              }, 500)
            }
          }
        },
      })
    }
  }
}
const refresh = () => {
  // 初始化缓存数据
  wholeList = []
  currentRenderIndex = 0
  pageHeightArr = []
  param.value = { limit: 4, page: 0 }
  list.value = []
  // 重新拉取数据
  getList()
}
const onBtnClick = () => refresh()
const confirm = () => refresh()
const onChange = () => refresh()
const TouchStart = (e) => {
  touchx = e.changedTouches[0].clientX
  touchy = e.changedTouches[0].clientY
}
const TouchEnd = (e) => {
  const x = e.changedTouches[0].clientX
  const y = e.changedTouches[0].clientY
  let turn = ''
  if (x - touchx > 50 && Math.abs(y - touchy) < 50) {
    // 右滑
    turn = 'right'
  } else if (x - touchx < -50 && Math.abs(y - touchy) < 50) {
    // 左滑
    turn = 'left'
  }
  // 根据方向进行操作
  if (turn === 'right') {
    // 从左往右
    if (active.value !== 0) {
      active.value -= 1
    }
  }
  if (turn === 'left') {
    // 从右往左
    if (active.value < nav.length - 1) {
      active.value += 1
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<template>
  <view class="page" @touchstart="TouchStart" @touchend="TouchEnd">
    <coolui-scroller
      class="scroller"
      :class="(loadMoreSetting.status === 'loading' && list.length === 0) ? 'isloading' : ''"
      :isEmpty="isEmpty"
      isBackBtn
      background="#f2f2f2"
      @loadmore="getList"
      @refresh="refresh"
    >
      <!-- 下拉刷新组件 -->
      <template #refresh>
        <coolui-scroller-refresh type="base" :config="baseConfig" />
      </template>
      <!-- 下拉刷新组件 -->

      <!-- 头部区域 -->
      <template #header>
        <view class="header">
          <view class="search">
            <coolui-scroller-search
              :keyword="key"
              clearable
              @confirm="confirm"
              @btnClick="onBtnClick"
              @update:keyword="key = $event"
            ></coolui-scroller-search>
          </view>
          <coolui-scroller-nav
            :list="nav"
            :active="active"
            :text="{ color: '#333333', activeColor: '#d13435' }"
            :background="{ color: '#333333', activeColor: '#d13435' }"
            @change="onChange"
            @update:active="active = $event"
          ></coolui-scroller-nav>
        </view>
      </template>
      <!-- 头部区域 -->

      <!-- 列表 -->
      <!-- page组件循环页 -->
      <coolui-scroller-page
        v-for="(listSingleItem, pageIndex) in list"
        :key="pageIndex"
        :pageList="listSingleItem"
      >
        <!-- item组件循环项 -->
        <coolui-scroller-item
          ripple
          v-for="(listItem, index) in listSingleItem"
          :key="index"
        >
          <view class="item">
            <image class="item-image" lazy-load :src="listItem.img"></image>
            <view class="item-title">{{ (pageIndex * 3) + listItem.id }}.{{ listItem.title }}</view>
          </view>
        </coolui-scroller-item>
        <!-- item组件循环项 -->
      </coolui-scroller-page>
      <!-- page组件循环页 -->
      <!-- 列表 -->

      <!-- 加载更多组件 -->
      <template #loadmore>
        <coolui-scroller-loadmore
          :status="loadMoreSetting.status"
          :loading="loadMoreSetting.loading"
          :noMore="loadMoreSetting.noMore"
          :more="loadMoreSetting.more"
        />
      </template>
      <!-- 加载更多组件 -->

      <!-- 空列表组件 -->
      <template #empty>
        <coolui-scroller-empty
          v-if="isEmpty"
          :emptyText="emptySetting.text"
          :emptyImg="emptySetting.img"
          style="background-color: #fff;"
        />
      </template>
      <!-- 空列表组件 -->

      <template #backToTop>
        <coolui-scroller-back-to-top :delay="3000" />
      </template>
    </coolui-scroller>

    <coolui-scroller-handtip
      top="下拉刷新"
      bottom="上拉加载"
      left="滑动切换分类"
      right="滑动切换分类"
      :opacity="0.7"
      storageKey="hand1"
    />
  </view>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f2f2f2;
  overflow: hidden;
  display: flex;
}

.item {
  padding: 30rpx 0 0;
  margin: 0 30rpx;
  width: calc(100vw - 60rpx);
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
  padding: 0 30rpx;
}

.header {
  background-color: #fff;
  /* box-shadow: 0 0 5px #ccc; */
}

.search {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #eee;

  :deep(.search-btn) {
    color: #fff;
    background-color: #d13435;

    &::after {
      border-color: #d13435;
    }
  }
}

/* empty组件可冲突样式 */
:deep(.coolui-scroller-empty .empty-img) {
  width: 40vw !important;
}

:deep(.coolui-scroller-empty .empty-text) {
  color: #666 !important;
}

/* backToTop组件可冲突样式 */
:deep(.coolui-backToTop) {
  background-color: #d13435 !important;
}
</style>