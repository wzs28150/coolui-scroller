<script setup lang="ts">
import { ref } from 'vue'
import type { CooluiScrollerSearchButton } from '@/uni_modules/coolui-scroller/types'
import type { DemoSearchPayload } from '../../types'

const searchBtnShow: { button: CooluiScrollerSearchButton } = { button: { show: true } }
const searchBtnHide: { button: CooluiScrollerSearchButton } = { button: { hide: true } }
const searchBtnText: { button: CooluiScrollerSearchButton } = { button: { text: '搜一下' } }
const key = ref('')
const key1 = ref('')
const key2 = ref('')
const key3 = ref('')
const key4 = ref('')
const key5 = ref('')
const key6 = ref('')
const key7 = ref('')
const key8 = ref('')

const onBtnClick = (e: DemoSearchPayload) => {
  uni.showToast({
    title: '来自右侧按钮点击:' + e.key,
    icon: 'none',
    duration: 4000,
  })
}
const confirm = (e: DemoSearchPayload) => {
  uni.showToast({
    title: '来自完成按钮触发:' + e.key,
    icon: 'none',
    duration: 4000,
  })
}
const test = () => {
  key.value = 'aaaaa'
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title" @tap="test">搜索组件</view>
      <!-- 基础使用 -->
      <view class="content" style="padding-bottom: 0">基础使用</view>
      <view class="pannel-inner">
        <coolui-scroller-search v-model:keyword="key1" @confirm="confirm" @btnClick="onBtnClick" />
      </view>
      <!-- 圆角 -->
      <view class="content" style="padding-bottom: 0">圆角</view>
      <view class="pannel-inner">
        <coolui-scroller-search round v-model:keyword="key2" @confirm="confirm" @btnClick="onBtnClick" />
      </view>
      <!-- 可清除 -->
      <view class="content" style="padding-bottom: 0">可清除</view>
      <view class="pannel-inner">
        <coolui-scroller-search clearable v-model:keyword="key3" @confirm="confirm" @btnClick="onBtnClick" />
      </view>
      <!-- 自定义右侧按钮文字 -->
      <view class="content" style="padding-bottom: 0">自定义右侧按钮文字</view>
      <view class="pannel-inner">
        <coolui-scroller-search
          :button="searchBtnText.button"
          v-model:keyword="key4"
          @confirm="confirm"
          @btnClick="onBtnClick"
        />
      </view>
      <!-- 设置按钮一直显示 -->
      <view class="content" style="padding-bottom: 0">设置按钮一直显示</view>
      <view class="pannel-inner">
        <coolui-scroller-search
          :button="searchBtnShow.button"
          v-model:keyword="key5"
          @confirm="confirm"
          @btnClick="onBtnClick"
        />
      </view>
      <!-- 设置按钮一直隐藏 -->
      <view class="content" style="padding-bottom: 0">设置按钮一直隐藏,需要点击键盘确定提交</view>
      <view class="pannel-inner">
        <coolui-scroller-search
          :button="searchBtnHide.button"
          v-model:keyword="key6"
          @confirm="confirm"
          @btnClick="onBtnClick"
        />
      </view>
      <!-- 自定义按钮样式 -->
      <view class="content" style="padding-bottom: 0">自定义按钮样式</view>
      <view class="pannel-inner">
        <coolui-scroller-search
          :button="searchBtnShow.button"
          v-model:keyword="key7"
          @confirm="confirm"
          @btnClick="onBtnClick"
        />
      </view>
      <view class="pannel-inner">
        <coolui-scroller-search
          :button="searchBtnShow.button"
          v-model:keyword="key8"
          @confirm="confirm"
          @btnClick="onBtnClick"
        />
      </view>
      <!-- 自定义按钮样式 -->
      <view class="content" style="padding-bottom: 0">利用css变量修改颜色</view>
      <view class="pannel-inner">
        <coolui-scroller-search
          round
          clearable
          :style="{
            '--color': '#fff',
            '--placeholder-color': 'rgba(255,255,255, 0.7)',
            '--input-bg-color': '#7d6f93',
          }"
          :button="searchBtnHide.button"
          v-model:keyword="key"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 0 30rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* #ifdef H5 */
/* H5 端 uni 会额外渲染内置导航栏（--window-top，44px），100vh 没扣掉这一截会多出页面级滚动条。
   这里只改最小高度：本页内容本身就高于一屏，仍保持正常滚动。 */
.page {
  min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */

.pannel {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background-color: #fff;
  padding: 0 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pannel .title {
  font-size: 32rpx;
  line-height: 32rpx;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0 20rpx 30rpx;
  position: relative;
}

.pannel .title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #d13435;
  width: 8rpx;
  height: 32rpx;
  border-radius: 8rpx;
}

.pannel .content {
  font-size: 28rpx;
  color: #666;
  padding: 30rpx 0;
}

.pannel .pannel-inner {
  flex: 1;
  padding: 20rpx 0;
}

/* 右侧按钮统一样式：红字 + 红边框（与 native 一致，不做多实例变体） */
:deep(.search-btn) {
  color: #d13435;
  &::after {
    border-color: #d13435;
  }
}
</style>