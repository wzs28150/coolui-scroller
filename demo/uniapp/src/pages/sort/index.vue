<script setup>
import { ref, computed } from 'vue'
import CooluiScrollerSort from 'coolui-scroller-uni/components/coolui-scroller-sort/coolui-scroller-sort.vue'
import CooluiScrollerSortItem from 'coolui-scroller-uni/components/coolui-scroller-sort-item/coolui-scroller-sort-item.vue'

const options = [
  { id: 1, title: '综合排序' },
  { id: 2, title: '距离最近' },
  { id: 3, title: '好评优先' },
  { id: 4, title: '价格由低到高' },
  { id: 5, title: '价格由高到低' },
  { id: 6, title: '其他' },
]
const options2 = [
  { id: 1, title: '手机' },
  { id: 2, title: '电视' },
  { id: 3, title: '冰箱' },
]
const options3 = [
  { id: 1, title: '华为' },
  { id: 2, title: '小米' },
  { id: 3, title: '一加' },
  { id: 4, title: '苹果' },
  { id: 5, title: 'OPPO' },
]
const value1 = ref(null)
const value2 = ref(null)
const value3 = ref(null)
const sort4 = ref(null)

const value3Titles = computed(() => {
  if (!value3.value) {
    return []
  }
  return String(value3.value)
    .split(',')
    .map((i) => {
      const idx = Number(i)
      return (options3[idx] && options3[idx].title) || ''
    })
})

const close = () => {
  const node = sort4.value
  if (node) {
    node.confirm()
  }
}
</script>

<template>
  <view class="page">
    <view class="pannel">
      <view class="title">分类筛选及排序组件</view>
      <view class="content" style="padding-bottom: 0">
        置于滚动组件头部插槽中,用于分类筛选及排序。可设置分类筛选单选或多选。也可设置排序选择。也可自定义下拉的内容。
      </view>
      <view class="pannel-inner">
        <coolui-scroller-sort>
          <coolui-scroller-sort-item
            title="排序"
            name="sort"
            type="sort"
            v-model:value="value1"
            :options="options"
            active-color="#d13435"
          />
          <coolui-scroller-sort-item
            title="分类"
            name="sort2"
            type="classify"
            v-model:value="value2"
            :options="options2"
            active-color="#d13435"
          />
          <coolui-scroller-sort-item
            title="品牌"
            name="sort3"
            type="classify"
            v-model:value="value3"
            :options="options3"
            active-color="#d13435"
            multiple
            action-bar
          />
          <coolui-scroller-sort-item
            ref="sort4"
            title="设置"
            name="sort4"
            type="diy"
            v-model:value="value2"
            active-color="#d13435"
          >
            <view class="diy" @tap="close">
              自定义区域
            </view>
          </coolui-scroller-sort-item>
        </coolui-scroller-sort>
        <view class="nav-pannel">
          <view>
            <view>排序:{{ options[value1] ? options[value1].title : '综合排序' }}</view>
            <view>分类:{{ options2[value2] ? options2[value2].title : '无' }}</view>
            <view>
              品牌:
              <block v-if="value3 && value3.length > 0">
                <text v-for="item in value3Titles" :key="item">{{ item }},</text>
              </block>
              <block v-else>无</block>
            </view>
          </view>
        </view>
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
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
}

.pannel .pannel-inner .nav-pannel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

/* sort-item diy 插槽自定义区域 */
:deep(.diy) {
  border: 1px dashed #f2f2f2;
  height: 300rpx;
  margin: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>