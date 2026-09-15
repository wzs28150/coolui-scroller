<template>
  <view class="coolui-scroller-page">
    <view
      v-if="pageList.length === 1 && pageList[0].height"
      :style="{ height: pageList[0].height + 'px' }"
    ></view>
    <slot v-else></slot>
  </view>
</template>

<script setup>
defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

const props = defineProps({
  pageList: {
    type: Array,
    default: () => [],
  },
})
</script>

<style>
.coolui-scroller-page {
  display: block;
}
</style>
