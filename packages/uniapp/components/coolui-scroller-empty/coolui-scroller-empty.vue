<template>
  <view class="coolui-scroller-empty">
    <view class="coolui-scroller-empty-inner">
      <image
        v-if="emptyImg"
        class="empty-img"
        :src="emptyImg"
        mode="aspectFill"
      ></image>
      <view class="empty-text">{{ emptyText }}</view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  emptyImg: {
    type: String,
    default: '',
  },
  emptyText: {
    type: String,
    default: '暂无内容',
  },
})
</script>

<style lang="scss">
/* 与原生 :host 对齐：撑满宿主高度，保证空列表插槽内可垂直居中 */
:host {
  display: block;
  height: 100%;
}

.coolui-scroller-empty {
  display: block;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .empty-img {
    width: 30vw;
    height: 30vw;
    display: block;
    margin: 0 auto;
  }

  .empty-text {
    text-align: center;
    font-size: 28rpx;
    color: #999;
    margin: 50rpx auto;
  }
}
</style>
