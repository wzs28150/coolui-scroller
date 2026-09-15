<script setup>
import { ref, onMounted } from 'vue'
import CooluiScroller from 'coolui-scroller-uni/components/coolui-scroller/coolui-scroller.vue'
import CooluiScrollerItem from 'coolui-scroller-uni/components/coolui-scroller-item/coolui-scroller-item.vue'
import CooluiScrollerRefresh from 'coolui-scroller-uni/components/coolui-scroller-refresh/coolui-scroller-refresh.vue'
import CooluiScrollerLoadmore from 'coolui-scroller-uni/components/coolui-scroller-loadmore/coolui-scroller-loadmore.vue'

// 静态配置（不会被修改，普通常量即可）
const loadMoreSetting = {
  status: 'more',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
}
const loadMoreSetting1 = {
  status: 'loading',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
}
const loadMoreSetting2 = {
  status: 'noMore',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
}
const refreshSetting = {
  type: 'default',
  style: 'black',
  background: { color: '#f2f2f2' },
  isBackBtn: true,
  shake: false,
}

const loadMoreSetting3 = ref({
  status: 'more',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
})
const list = ref([])
const totalPageNum = ref(0)
const param = ref({ limit: 4, page: 0 })
const isEmpty = ref(false)

const refresh = () => {}
const getList = () => {
  // 判断当前是否为加载状态 防止页面重复添加数据
  if (loadMoreSetting3.value.status !== 'loading') {
    loadMoreSetting3.value.status = 'loading'
    const page = param.value.page
    if (totalPageNum.value > 0 && page == totalPageNum.value) {
      loadMoreSetting3.value.status = 'noMore'
    } else {
      //  获取远程数据可换成自己封装的请求方法
      uni.request({
        url: 'https://api.wzs.pub/mock/21/list',
        data: {
          page: page + 1,
          isempty: 0, // 设置为1可测试空数据
          limit: 8,
          pagenum: 10,
        },
        method: 'get',
        success: (res) => {
          if (res.data.code === 200) {
            totalPageNum.value = res.data.data.last
            if (res.data.data.list.length === 0 && page === 0) {
              loadMoreSetting3.value.status = 'noMore'
              isEmpty.value = true
            } else {
              const datas = list.value.concat(res.data.data.list)
              setTimeout(() => {
                list.value = datas
                loadMoreSetting3.value.status = 'more'
                param.value.page += 1
              }, 500)
            }
          }
        },
      })
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">加载更多组件</view>
      <view class="content" style="padding-bottom: 0">基础使用</view>
      <view class="pannel-inner">
        <coolui-scroller-loadmore
          :status="loadMoreSetting.status"
          :loading="loadMoreSetting.loading"
          :noMore="loadMoreSetting.noMore"
          :more="loadMoreSetting.more"
        />
      </view>
      <view class="content" style="padding-bottom: 0">加载中</view>
      <view class="pannel-inner">
        <coolui-scroller-loadmore
          :status="loadMoreSetting1.status"
          :loading="loadMoreSetting1.loading"
          :noMore="loadMoreSetting1.noMore"
          :more="loadMoreSetting1.more"
        />
      </view>
      <view class="content" style="padding-bottom: 0">数据加载完</view>
      <view class="pannel-inner">
        <coolui-scroller-loadmore
          :status="loadMoreSetting2.status"
          :loading="loadMoreSetting2.loading"
          :noMore="loadMoreSetting2.noMore"
          :more="loadMoreSetting2.more"
        />
      </view>
    </view>
    <view class="pannel demo">
      <view class="title">与列表结合</view>
      <view class="list">
        <coolui-scroller
          id="scroller"
          :class="loadMoreSetting3.status == 'loading' && list.length == 0 ? 'isloading' : ''"
          background="#f2f2f2"
          @loadmore="getList"
          @refresh="refresh"
        >
          <template #refresh>
            <coolui-scroller-refresh type="default" :config="refreshSetting" />
          </template>
          <template #loadmore>
            <coolui-scroller-loadmore
              :status="loadMoreSetting3.status"
              :loading="loadMoreSetting3.loading"
              :noMore="loadMoreSetting3.noMore"
              :more="loadMoreSetting3.more"
            />
          </template>

          <coolui-scroller-item v-for="(listItem, index) in list" :key="index">
            <view class="item">
              <view class="item-title">{{ index }}.{{ listItem.title }}</view>
            </view>
          </coolui-scroller-item>
        </coolui-scroller>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  padding: 0 30rpx;
  background-color: #f2f2f2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pannel.demo {
  flex: 1;
  margin-bottom: 30rpx;
}
.pannel .list {
  padding: 20rpx 0;
  height: calc(100% - 122rpx);
}
.pannel .list .item {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
}
</style>

<style lang="scss">
page {
  height: 100%;
}
</style>