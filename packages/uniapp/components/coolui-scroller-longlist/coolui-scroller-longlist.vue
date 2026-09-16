<template>
  <view class="coolui-scroller-longlist">
    <!-- 窗口上方折叠成一块占位，不产生页组件实例 -->
    <view
      v-if="topHeight > 0"
      class="coolui-longlist-spacer"
      :style="{ height: topHeight + 'px' }"
    ></view>

    <!-- 只真实渲染窗口内的页；每页包一层带 id 的 view 用于测量真实高度 -->
    <view
      v-for="pageIndex in visiblePages"
      :key="pageIndex"
      :id="'wrp_' + pageIndex"
      class="coolui-longlist-page"
    >
      <slot name="page" :items="pages[pageIndex] || []" :page-index="pageIndex"></slot>
    </view>

    <!-- 窗口下方折叠成一块占位 -->
    <view
      v-if="bottomHeight > 0"
      class="coolui-longlist-spacer"
      :style="{ height: bottomHeight + 'px' }"
    ></view>
  </view>
</template>

<script setup lang="ts">
/**
 * 长列表窗口化容器
 *
 * 旧方案（coolui-scroller-page + utils/longlist.js 的 setHeight）为每一页都保留一个组件实例，
 * 页数多时实例与 observer 数量随页数线性增长，滚动会卡。
 * 本组件只渲染窗口内的页，窗口外折叠成上下两个占位块：
 *   - 节点/实例数与总页数无关（O(窗口) 而非 O(N)）
 *   - 不再使用 IntersectionObserver，位置由 scrollTop + 页高前缀和二分算出
 * 用法：
 *   <coolui-scroller @scroll="onScroll">
 *     <coolui-scroller-longlist :pages="list" :scroll-top="scrollTop">
 *       <template #page="{ items, pageIndex }"> ...item 模板... </template>
 *     </coolui-scroller-longlist>
 *   </coolui-scroller>
 */
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { computeLonglistWindow } from '../../utils/longlist.js'
import { getWindowInfo } from '../../utils/platform.js'

defineOptions({
  virtualHost: true,
  styleIsolation: 'apply-shared',
})

/** 唯一插槽 #page：items 为该页的 item 数组，pageIndex 为页码 */
defineSlots<{
  page(props: { items: any[]; pageIndex: number }): unknown
}>()

const props = defineProps({
  /** 分页数据：pages[pageIndex] 即该页的 item 数组 */
  pages: {
    type: Array as PropType<unknown[][]>,
    default: (): unknown[][] => [],
  },
  /** 初始页高缓存（可选，一般由组件自己测量后维护） */
  heights: {
    type: Array as PropType<number[]>,
    default: (): number[] => [],
  },
  /** 当前滚动距离：由页面从 scroller 的 @scroll 事件透传 */
  scrollTop: {
    type: Number,
    default: 0,
  },
  /** 前后各多渲染几页 */
  overscan: {
    type: Number,
    default: 1,
  },
  /** 未测量页的估算高度；不传则用已测量页的平均值（都没有时按 300px 兜底） */
  estimateHeight: {
    type: Number,
    default: 0,
  },
})

const instance = getCurrentInstance()

/** 每页真实高度缓存（下标 = 页码），非响应式，用 measuredTick 触发重算 */
let heights: number[] = []
const measuredTick = ref(0)
const windowHeight = ref(0)

/** 未测量页的估算高度：优先用 prop，其次用已测量页平均值 */
const estimate = computed(() => {
  if (props.estimateHeight > 0) {
    return props.estimateHeight
  }
  let sum = 0
  let num = 0
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i]
    if (h > 0) {
      sum += h
      num += 1
    }
  }
  return num > 0 ? sum / num : 300
})

const windowState = computed(() => {
  // 显式依赖：页数变化 / 重新测量 / 滚动
  measuredTick.value
  return computeLonglistWindow({
    heights: heights.slice(),
    count: props.pages.length,
    scrollTop: props.scrollTop,
    viewportHeight: windowHeight.value,
    overscan: props.overscan,
    estimate: estimate.value,
  })
})

const visiblePages = computed(() => {
  const { start, end } = windowState.value
  const arr: number[] = []
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }
  return arr
})

const topHeight = computed(() => windowState.value.topHeight)
const bottomHeight = computed(() => windowState.value.bottomHeight)

/** 测量窗口内各页的真实高度并回填缓存 */
const measureVisible = () => {
  nextTick(() => {
    const indexes = visiblePages.value
    if (!indexes.length) {
      return
    }
    try {
      const query = uni.createSelectorQuery().in(instance as never)
      indexes.forEach((pageIndex) => {
        query.select('#wrp_' + pageIndex).boundingClientRect()
      })
      query.exec((res: Array<{ height?: number } | null>) => {
        let changed = false
        indexes.forEach((pageIndex, idx) => {
          const item = res && res[idx]
          const h = item && item.height
          if (h && Math.abs((heights[pageIndex] || 0) - h) > 0.5) {
            heights[pageIndex] = h
            changed = true
          }
        })
        if (changed) {
          measuredTick.value += 1
        }
      })
    } catch (e) {
      // ignore
    }
  })
}

// 窗口内的页集合变化时重新测量（用字符串签名，避免数组引用变化导致重复查询）
watch(
  () => visiblePages.value.join(','),
  () => measureVisible()
)
// 新加载一页后也要测量
watch(
  () => props.pages.length,
  () => measureVisible(),
  { immediate: true }
)

onMounted(() => {
  if (props.heights.length) {
    heights = props.heights.slice()
    measuredTick.value += 1
  }
  try {
    const info = getWindowInfo ? getWindowInfo() : null
    windowHeight.value = (info && info.windowHeight) || 0
  } catch (e) {
    windowHeight.value = 0
  }
  measureVisible()
})
</script>

<style lang="scss">
.coolui-scroller-longlist {
  display: block;
}

.coolui-longlist-spacer {
  display: block;
  width: 100%;
}

.coolui-longlist-page {
  display: block;
  width: 100%;
}
</style>
