<template>
  <view class="coolui-scroller-page">
    <view
      v-if="pageList.length === 1 && pageList[0].height"
      :style="{ height: pageList[0].height + 'px' }"
    ></view>
    <slot v-else></slot>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { CooluiPageListItem } from '../../types'

defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

const props = defineProps({
  pageList: {
    type: Array as PropType<CooluiPageListItem[]>,
    default: (): CooluiPageListItem[] => [],
  },
})
</script>

<style lang="scss">
.coolui-scroller-page {
  display: block;
}
</style>
