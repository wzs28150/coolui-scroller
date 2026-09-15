<script setup>

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