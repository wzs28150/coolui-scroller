<script setup lang="ts">
import { ref } from 'vue'

/** 分享瞬间：选中的图片临时路径（uni.chooseImage 返回 string | string[]） */
const tempFilePaths = ref<string | string[] | null>(null)

/** 分享瞬间列表项 */
interface HeaderItem {
  id: number
  photo: string
  name: string
}

/* 注意：条件编译注释不能写在标签属性中间——H5 / App 端解析后 scroll-x 属性会丢失，
   scroll-view 就不再是横向滚动，头像条会竖向堆叠（小程序端恰好能编译过去，所以只有 App/H5 出问题）。
   这两个增强属性只有微信端需要，放在脚本里按平台赋值、模板上显式绑定
   （不能用 v-bind="对象"：小程序 WXML 不支持动态属性展开，会直接编译失败）。 */
let enhanced = false
let showScrollbar = false
// #ifdef MP-WEIXIN
enhanced = true
showScrollbar = false
// #endif

const list: HeaderItem[] = [
  {
    id: 1,
    photo: 'https://test.wzs.pub/pic/pics/1.jpg',
    name: '苏雨瑶',
  },
  {
    id: 2,
    photo: 'https://test.wzs.pub/pic/pics/2.jpg',
    name: '苏雨瑶',
  },
  {
    id: 3,
    photo: 'https://test.wzs.pub/pic/pics/3.jpg',
    name: '苏雨瑶',
  },
  {
    id: 4,
    photo: 'https://test.wzs.pub/pic/pics/1.jpg',
    name: '苏雨瑶',
  },
  {
    id: 5,
    photo: 'https://test.wzs.pub/pic/pics/2.jpg',
    name: '苏雨瑶',
  },
  {
    id: 6,
    photo: 'https://test.wzs.pub/pic/pics/3.jpg',
    name: '苏雨瑶',
  },
]

const chooseimage = () => {
  uni.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: (res) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      tempFilePaths.value = res.tempFilePaths
    },
  })
}
</script>

<template>
  <scroll-view
    class="header"
    scroll-x
    enable-flex
    :enhanced="enhanced"
    :show-scrollbar="showScrollbar"
  >
    <view class="list">
      <view class="item add" @tap="chooseimage">
        <view class="photo">
          <image
            class="photo-img"
            mode="aspectFill"
            src="https://test.wzs.pub/pic/pics/4.jpg"
          />
          <view class="icon">
            <view class="line"></view>
            <view class="line"></view>
          </view>
        </view>
        <view class="name">分享瞬间</view>
      </view>
      <view class="item" v-for="item in list" :key="item.id">
        <view class="photo">
          <image class="photo-img" mode="aspectFill" :src="item.photo" />
        </view>
        <view class="name">{{ item.name }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.header {
  height: 168rpx;
  width: 100%;
  border-bottom: 1px solid #efefef;
  /* 横向排列统一交给内部的 .list（inline-flex），
     不依赖小程序独有的 enable-flex 行为，App / H5 表现一致 */
  white-space: nowrap;

  .list {
    display: inline-flex;
  }

  .item {
    padding: 20rpx;

    .photo {
      border: 6rpx solid #ffb0a6;
      padding: 6rpx;
      border-radius: 100%;
      position: relative;

      .photo-img {
        width: 80rpx;
        height: 80rpx;
        border: 1rpx solid #999;
        border-radius: 100%;
        display: block;
      }
    }

    .name {
      font-size: 24rpx;
      text-align: center;
    }

    &.add {
      .icon {
        width: 30rpx;
        height: 30rpx;
        border-radius: 100%;
        background-color: #d81e06;
        position: absolute;
        bottom: 0;
        right: 0;
        border: 6rpx solid #fff;

        .line {
          background-color: #fff;
          width: 20rpx;
          height: 5rpx;
          border-radius: 5rpx;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          &:first-child {
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      }

      .photo {
        border-color: #fff;
      }
    }
  }
}
</style>