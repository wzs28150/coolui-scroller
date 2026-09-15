<script setup lang="ts">
import type { DemoEmptySetting } from '../../types'

const emptySetting: DemoEmptySetting = {
  img: '/static/img/empty.png',
  // img: 'http://www.365editor.com/images/nodata.png',
  text: '暂无文章',
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">空列表组件</view>
      <view class="content">
        当请求数据接口返回列表为空时显示的内容,该组件可设置背景图及提示文字
      </view>
      <view class="pannel-inner">
        <coolui-scroller-empty
          class="empty"
          :emptyText="emptySetting.text"
          :emptyImg="emptySetting.img"
        />
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

.pannel-inner {
  flex: 1;
}
</style>

<style lang="scss">
page {
  height: 100%;
}
</style>