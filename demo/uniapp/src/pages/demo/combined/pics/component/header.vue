<script setup lang="ts">

/** 分享瞬间：选中的图片临时路径（uni.chooseImage 返回 string | string[]） */
const tempFilePaths = ref<string | string[] | null>(null)

/** 分享瞬间列表项 */
interface HeaderItem {
  id: number
  photo: string
  name: string
}

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
    <!-- #ifdef MP-WEIXIN -->
    :enhanced="true"
    :show-scrollbar="false"
    <!-- #endif -->
    scroll-x
    enable-flex
  >
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
  </scroll-view>
</template>

<style lang="scss" scoped>
.header {
  height: 168rpx;
  display: flex;
  width: 100vw;
  border-bottom: 1px solid #efefef;

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