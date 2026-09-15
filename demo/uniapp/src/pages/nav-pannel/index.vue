<script setup>

const logoConfig = {
  shake: true, // 是否开启下拉震动
  height: 70,
  text: {
    content: 'coolui-scroller',
    font: 'Lobster variant0',
    size: '50',
    color: '#ccc', // 文字颜色
    shadow: 0, // 设置0
    img: 'https://test.wzs.pub/pic/bg2.jpg',
  },
  background: {
    color: '#f2f2f2',
    height: 120,
  },
}
const height = ref(0)
const active = ref(0)
const animation = ref(false)

const getHeight = (res) => {
  height.value = res
}
const next = () => {
  active.value = 1
}
const back = () => {
  active.value = 0
}
const setAnimation = () => {
  animation.value = !animation.value
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">切换组件nav-pannel</view>
      <view class="content">
        往往页面中会有多个scroll进行切换,或配合nav组件或干脆就点击某个按钮就切换了列表,在切换的时候往往会使用wx:if或者hidden来判断显示。但是if不会保存列表滚动状态，切换回来列表就重新加载回到顶部了。hidden有没办法判断具体那个列表显示了,从而去计算一些高度数据。所以切换组件就诞生了。。。
      </view>
      <view class="pannel-inner">
        <coolui-scroller-nav-pannel :active="active" :animation="animation">
          <coolui-scroller class="scroller0" background="#f2f2f2" @contentHeight="getHeight">
            <template #refresh>
              <coolui-scroller-refresh type="logoText" :config="logoConfig" />
            </template>
            <view class="nav-pannel" :style="{ height: height + 'px' }">
              <view>
                第一个scroller,可下拉
                <view>
                  <button @tap="next">切换下一个</button>
                  <button @tap="setAnimation">{{ animation ? '关闭' : '开启' }}动画</button>
                </view>
              </view>
            </view>
          </coolui-scroller>
          <coolui-scroller class="scroller1" background="#f2f2f2" @contentHeight="getHeight">
            <template #refresh>
              <coolui-scroller-refresh type="logoText" :config="logoConfig" />
            </template>
            <view class="nav-pannel" :style="{ height: height + 'px' }">
              <view>
                第二个scroller,可下拉
                <button @tap="back">返回上一个</button>
                <button @tap="setAnimation">{{ animation ? '关闭' : '开启' }}动画</button>
              </view>
            </view>
          </coolui-scroller>
        </coolui-scroller-nav-pannel>
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
  flex-direction: column;
}

.pannel {
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  background-color: #fff;
  padding: 0 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  display: flex;
  flex-direction: column;
}

/* 可冲突样式 */
:deep(.pannel-inner .nav-pannel) {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #cec6c6;
}

:deep(.pannel-inner .nav-pannel button) {
  background-color: #d13435;
  color: #fff;
  font-size: 28rpx;
  margin-top: 28rpx;
}

:deep(.pannel-inner .nav-pannel button:last-child) {
  background-color: #fff;
  color: #d13435;
}
</style>