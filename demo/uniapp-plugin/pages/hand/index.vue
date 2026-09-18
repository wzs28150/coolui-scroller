<script setup lang="ts">

const reset = () => {
  console.log(1)
  try {
    uni.removeStorageSync('hand2')
    uni.navigateBack({
      delta: 1,
      success: () => {
        uni.navigateTo({
          url: '/pages/hand/index',
        })
      },
    })
  } catch (e) {
    // Do something when catch error
  }
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">手势提示组件</view>
      <view class="content">
        手势组件默认设定为第一次加载页面时显示。所以显示状态存入了Storage。
      </view>
      <button class="btn" plain @tap="reset">重置组件</button>
    </view>
    <coolui-scroller-handtip
      top="下拉刷新"
      bottom="上拉加载"
      left="侧滑切换"
      right="侧滑切换"
      :opacity="0.7"
      storageKey="hand2"
    />
  </view>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
}

/* #ifdef H5 */
/* H5 端 uni 会额外渲染内置导航栏（--window-top，44px），100vh 是整个视口高度，
   页面因此比可视区多出这一截 → 出现页面级滚动条。小程序端导航栏由原生提供，不受影响。 */
.page {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
  min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */
.pannel {
  height: calc(100% - 62rpx);
}

button[plain].btn {
  border-color: #d13435;
  color: #d13435;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 32rpx;
  border-radius: 100rpx;
  margin-top: 50rpx;
}
</style>

<style lang="scss">
page {
  height: 100%;
}
</style>