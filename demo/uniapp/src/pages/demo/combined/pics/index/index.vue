<script setup>
import CooluiScroller from 'coolui-scroller-uni/components/coolui-scroller/coolui-scroller.vue'
import CooluiScrollerItem from 'coolui-scroller-uni/components/coolui-scroller-item/coolui-scroller-item.vue'
import CooluiScrollerRefresh from 'coolui-scroller-uni/components/coolui-scroller-refresh/coolui-scroller-refresh.vue'
import PicsHeader from '../component/header.vue'
import PicsItem from '../component/picsItem.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const isEmpty = ref(false)
const list = ref([])
const loadMoreSetting = ref({
  status: 'more',
  more: {
    text: '上拉加载更多',
    color: '#999',
  },
  loading: {
    text: '加载中...',
    color: '#999',
  },
  noMore: {
    text: '-- 到底啦 --',
    color: '#999',
  },
})
const baseConfig = {
  shake: false, // 是否开启下拉震动
  height: 70,
  text: {
    color: '#fff', // 文字颜色
    // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
    shadow: 5,
  },
  background: {
    color: '#ffffff',
    height: 50,
  },
}
const totalPageNum = ref(0)
const param = ref({
  limit: 4,
  page: 0,
})

onLoad(() => {
  totalPageNum.value = 0
  param.value = {
    limit: 4,
    page: 0,
  }
  getList()
})

const getList = () => {
  const setting = loadMoreSetting.value
  // 判断当前是否为加载状态 防止页面重复添加数据
  if (setting.status !== 'loading') {
    setting.status = 'loading'
    loadMoreSetting.value = { ...setting }
    const page = param.value.page
    if (totalPageNum.value > 0 && page === totalPageNum.value) {
      const s = loadMoreSetting.value
      s.status = 'noMore'
      loadMoreSetting.value = { ...s }
    } else {
      // return
      //  获取远程数据可换成自己封装的请求方法
      uni.request({
        url: 'https://api.wzs.pub/mock/21/list_pic',
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
              const s = loadMoreSetting.value
              s.status = 'noMore'
              isEmpty.value = true
              loadMoreSetting.value = { ...s }
            } else {
              const datas = list.value.concat(res.data.data.list)
              setTimeout(() => {
                list.value = datas
                const s = loadMoreSetting.value
                s.status = 'more'
                loadMoreSetting.value = { ...s }
                param.value.page += 1
              }, 500)
            }
          }
        },
      })
    }
  }
}
const refresh = () => {}
</script>

<template>
  <view
    class="case"
    :class="loadMoreSetting.status === 'loading' && list.length === 0 ? 'isloading' : ''"
  >
    <coolui-scroller
      id="scroller"
      :isEmpty="isEmpty"
      :is-back-btn="true"
      :enable-flex="true"
      background="#ffffff"
      @loadmore="getList"
      @refresh="refresh"
    >
      <template #header>
        <view style="background-color: #fff;">
          <pics-header />
        </view>
      </template>

      <template #refresh>
        <coolui-scroller-refresh type="diy" :config="baseConfig">
          <view class="refresh-icon photo-icon"></view>
        </coolui-scroller-refresh>
      </template>

      <coolui-scroller-item
        v-for="(listItem, index) in list"
        :key="index"
      >
        <pics-item :item="listItem" />
        <ad
          v-if="index === 1"
          unit-id="adunit-198f4227c7c8674c"
          ad-type="video"
          ad-theme="white"
        ></ad>
      </coolui-scroller-item>

      <template #loadmore>
        <view class="coolui-scroller-loadmore">
          <view class="loadmore-icon photo-icon"></view>
        </view>
      </template>
    </coolui-scroller>
  </view>
</template>

<style lang="scss" scoped>
.case {
  height: 100vh;
  background-color: #fff;

  .photo-icon {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjg3NjA4MjgxMDU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxMDYxIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik00MTkuMjg1MzMzIDkyOC41NTQ2NjdMNjEwLjU2IDU5Ny4zMzMzMzNsMTUwLjY5ODY2NyAyNjAuOTkyQTQyNC43NDY2NjcgNDI0Ljc0NjY2NyAwIDAgMSA1MTIgOTM4LjY2NjY2N2MtMzEuODI5MzMzIDAtNjIuODQ4LTMuNDk4NjY3LTkyLjcxNDY2Ny0xMC4xMTJ6TTMzNi42NCA5MDEuMTJBNDI3Ljg2MTMzMyA0MjcuODYxMzMzIDAgMCAxIDEwNC44NzQ2NjcgNjQwaDM4Mi41MDY2NjZMMzM2LjY0IDkwMS4wNzczMzN6TTg3LjQ2NjY2NyA1NTQuNjY2NjY3YTQyNS4xMzA2NjcgNDI1LjEzMDY2NyAwIDAgMSAxMTAuMjA4LTMzMS4xMzZMMzg4Ljc3ODY2NyA1NTQuNjY2NjY3SDg3LjQ2NjY2N3ogbTE3NS4zMTczMzMtMzg4Ljk5MkE0MjQuNzQ2NjY3IDQyNC43NDY2NjcgMCAwIDEgNTEyIDg1LjMzMzMzM2MzMS44MjkzMzMgMCA2Mi44NDggMy40OTg2NjcgOTIuNzE0NjY3IDEwLjExMkw0MTMuNDQgNDI2LjY2NjY2NyAyNjIuNzg0IDE2NS42NzQ2Njd6TTY4Ny4zNiAxMjIuODhBNDI3Ljg2MTMzMyA0MjcuODYxMzMzIDAgMCAxIDkxOS4xMjUzMzMgMzg0aC0zODIuNTA2NjY2bDE1MC43NDEzMzMtMjYxLjA3NzMzM3pNOTM2LjUzMzMzMyA0NjkuMzMzMzMzYTQyNS4xMzA2NjcgNDI1LjEzMDY2NyAwIDAgMS0xMTAuMjA4IDMzMS4xMzZMNjM1LjIyMTMzMyA0NjkuMzMzMzMzaDMwMS4zOTczMzR6IiBwLWlkPSIyMTA2MiIgZmlsbD0iI2Q4MWUwNiI+PC9wYXRoPjwvc3ZnPg==");
    background-position: center;
    background-size: cover;
    animation: rotate 3s infinite linear;
  }

  .refresh-icon {
    width: 60rpx;
    height: 60rpx;
  }
}

.coolui-scroller-loadmore {
  .loadmore-icon {
    width: 60rpx;
    height: 60rpx;
    margin: 30rpx auto;
    background-position: center;
    background-size: cover;
    animation: rotate 3s infinite linear;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjg3NjA4MjgxMDU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxMDYxIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik00MTkuMjg1MzMzIDkyOC41NTQ2NjdMNjEwLjU2IDU5Ny4zMzMzMzNsMTUwLjY5ODY2NyAyNjAuOTkyQTQyNC43NDY2NjcgNDI0Ljc0NjY2NyAwIDAgMSA1MTIgOTM4LjY2NjY2N2MtMzEuODI5MzMzIDAtNjIuODQ4LTMuNDk4NjY3LTkyLjcxNDY2Ny0xMC4xMTJ6TTMzNi42NCA5MDEuMTJBNDI3Ljg2MTMzMyA0MjcuODYxMzMzIDAgMCAxIDEwNC44NzQ2NjcgNjQwaDM4Mi41MDY2NjZMMzM2LjY0IDkwMS4wNzczMzN6TTg3LjQ2NjY2NyA1NTQuNjY2NjY3YTQyNS4xMzA2NjcgNDI1LjEzMDY2NyAwIDAgMSAxMTAuMjA4LTMzMS4xMzZMMzg4Ljc3ODY2NyA1NTQuNjY2NjY3SDg3LjQ2NjY2N3ogbTE3NS4zMTczMzMtMzg4Ljk5MkE0MjQuNzQ2NjY3IDQyNC43NDY2NjcgMCAwIDEgNTEyIDg1LjMzMzMzM2MzMS44MjkzMzMgMCA2Mi44NDggMy40OTg2NjcgOTIuNzE0NjY3IDEwLjExMkw0MTMuNDQgNDI2LjY2NjY2NyAyNjIuNzg0IDE2NS42NzQ2Njd6TTY4Ny4zNiAxMjIuODhBNDI3Ljg2MTMzMyA0MjcuODYxMzMzIDAgMCAxIDkxOS4xMjUzMzMgMzg0aC0zODIuNTA2NjY2bDE1MC43NDEzMzMtMjYxLjA3NzMzM3pNOTM2LjUzMzMzMyA0NjkuMzMzMzMzYTQyNS4xMzA2NjcgNDI1LjEzMDY2NyAwIDAgMS0xMTAuMjA4IDMzMS4xMzZMNjM1LjIyMTMzMyA0NjkuMzMzMzMzaDMwMS4zOTczMzR6IiBwLWlkPSIyMTA2MiIgZmlsbD0iI2Q4MWUwNiI+PC9wYXRoPjwvc3ZnPg==");
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}

/* 与原生 app.wxss 对齐：列表为空且 loading 时，让内容区 flex 居中显示加载图标 */
:deep(.isloading .coolui-scroll-view .inner) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>