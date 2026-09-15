<script setup>
import { ref, onMounted } from 'vue'
import CooluiScroller from 'coolui-scroller-uni/components/coolui-scroller/coolui-scroller.vue'
import CooluiScrollerItem from 'coolui-scroller-uni/components/coolui-scroller-item/coolui-scroller-item.vue'
import CooluiScrollerRefresh from 'coolui-scroller-uni/components/coolui-scroller-refresh/coolui-scroller-refresh.vue'
import CooluiScrollerLoadmore from 'coolui-scroller-uni/components/coolui-scroller-loadmore/coolui-scroller-loadmore.vue'
import CooluiScrollerEmpty from 'coolui-scroller-uni/components/coolui-scroller-empty/coolui-scroller-empty.vue'

const isEmpty = ref(false)
const list = ref([])
const refreshSetting = {
  type: 'default',
  style: 'black',
  background: {
    color: '#f2f2f2',
  },
  isBackBtn: true,
  shake: false,
}
const loadMoreSetting = ref({
  status: '',
  more: { text: '上拉加载更多', color: '#999' },
  loading: { text: '加载中...', color: '#999' },
  noMore: { text: '-- 到底啦 --', color: '#999' },
})
const emptySetting = {
  img: '/static/img/empty.png',
  // img: 'http://www.365editor.com/images/nodata.png',
  text: '暂无文章',
}
const totalPageNum = ref(0)
const param = ref({ limit: 4, page: 0 })

const refresh = () => {}
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
          limit: 5,
          isempty: 0, // 设置为1可测试空数据
          pagenum: 10,
        },
        method: 'get',
        success: (res) => {
          if (res.data.code === 200) {
            totalPageNum.value = res.data.data.last
            if (res.data.data.list.length === 0 && page === 0) {
              loadMoreSetting.value.status = 'noMore'
              isEmpty.value = true
            } else {
              const datas = list.value.concat(res.data.data.list)
              setTimeout(() => {
                list.value = datas
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

onMounted(() => {
  getList()
})
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">滚动列表组件scroller</view>
      <view class="content">
        scroller组件是基于原生组件scroll-view的再封装.组件有丰富的设置及插槽来满足满足你的列表需求.插槽包括头部扩展、下拉扩展、加载扩展、空列表扩展.各部分的扩展你可以自定义内容.同时我们也提供了丰富的组件与之搭配
      </view>
      <view class="pannel-inner">
        <coolui-scroller
          id="scroller"
          :class="loadMoreSetting.status == 'loading' && list.length == 0 ? 'isloading' : ''"
          :isEmpty="isEmpty"
          background="#f2f2f2"
          @loadmore="getList"
          @refresh="refresh"
        >
          <template #refresh>
            <coolui-scroller-refresh type="default" :config="refreshSetting" />
          </template>
          <template #empty>
            <coolui-scroller-empty
              :emptyImg="emptySetting.img"
              :emptyText="emptySetting.text"
            />
          </template>
          <template #loadmore>
            <coolui-scroller-loadmore
              :status="loadMoreSetting.status"
              :loading="loadMoreSetting.loading"
              :more="loadMoreSetting.more"
              :noMore="loadMoreSetting.noMore"
            />
          </template>

          <coolui-scroller-item
            v-for="(listItem, index) in list"
            :id="'item' + index"
            :key="index"
          >
            <view class="item">
              <image
                class="item-image"
                lazy-load
                :src="listItem.img"
              ></image>
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
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
  display: flex;
}

.pannel {
  flex: 1;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
}

.pannel .pannel-inner {
  flex: 1;
  padding: 0;
}

/* 列表项自定义结构样式 */
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
  padding: 0 30rpx;
}
</style>

<style lang="scss">
page {
  height: 100%;
}
</style>