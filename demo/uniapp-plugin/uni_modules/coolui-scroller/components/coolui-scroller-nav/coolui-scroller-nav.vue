<template>
  <view class="wx-coolui-nav" :class="border ? 'border' : ''">
    <scroll-view
      class="nav-inner"
      scroll-x
      scroll-with-animation
      :show-scrollbar="false"
      :scroll-into-view="toView"
    >
      <view
        v-for="(item, index) in list"
        :key="item.id !== undefined ? item.id : index"
        :id="'item' + index"
        class="item"
        :class="[type, activeInner === index ? 'on' : '']"
        :style="itemStyle(index)"
        @tap="changeNav(index)"
      >
        <view class="text">
          <view class="text-inner">{{ item.title }}</view>
          <view class="line" :style="lineStyle(index)"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  nextTick,
  getCurrentInstance,
  type PropType,
} from 'vue'
import { getSelectorQuery } from '../../utils/platform.js'
import type { CooluiScrollerNavItem } from '../../types'

const props = defineProps({
  list: {
    type: Array as PropType<CooluiScrollerNavItem[]>,
    default: (): CooluiScrollerNavItem[] => [],
  },
  border: {
    type: Boolean,
    default: true,
  },
  text: {
    type: Object as PropType<{ color?: string; activeColor?: string }>,
    default: () => ({
      color: '#333333',
      activeColor: '#d13435',
    }),
  },
  background: {
    type: Object as PropType<{ color?: string; activeColor?: string }>,
    default: () => ({
      color: '#333333',
      activeColor: '#d13435',
    }),
  },
  navPerView: {
    type: [Number, String],
    default: 4.5,
  },
  spaceBetween: {
    type: Number,
    default: 0,
  },
  type: {
    type: String as PropType<'line' | 'round' | 'plain' | (string & {})>,
    default: 'line', // 可选 line,round,plain
  },
  active: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  /** 选中项变化 */
  (e: 'change', payload: { id?: string | number; index: number }): void
  /** 选中下标变化（配合 v-model:active） */
  (e: 'update:active', index: number): void
}>()
const vm = getCurrentInstance()

const toView = ref('item0')
const navWidth = ref('')
const activeInner = ref(props.active)
let _lastChangeIndex = -1

watch(
  () => props.active,
  (newVal) => {
    activeInner.value = newVal
    toView.value = 'item' + (newVal - 1)
    // 与原生 active observer 对齐：active 变化（父组件受控修改）时统一触发 change
    change(newVal)
  }
)
watch(
  () => props.navPerView,
  (newVal) => {
    changeNavPerView(newVal)
  }
)

onMounted(() => {
  nextTick(() => {
    changeNavPerView(props.navPerView)
  })
})

const itemStyle = (index: number) => {
  const isActive = activeInner.value === index
  return {
    width: navWidth.value,
    marginRight:
      index === props.list.length - 1 ? '0px' : props.spaceBetween + 'px',
    color: isActive ? props.text.activeColor : props.text.color,
  }
}
const lineStyle = (index: number) => {
  const isActive = activeInner.value === index
  const style: Record<string, string> = {
    backgroundColor: isActive
      ? props.background.activeColor
      : props.type === 'line'
      ? 'transparent'
      : props.background.color,
  }
  if (props.type === 'plain') {
    style.borderColor = isActive
      ? props.background.activeColor
      : props.background.color
  }
  return style
}
const changeNav = (index: number) => {
  activeInner.value = index
  toView.value = 'item' + (index - 1)
  emit('update:active', index)
  change(index)
}
const change = (index: number) => {
  // 去重：changeNav 与 active watcher 都可能触发，避免同一 index 重复 emit
  // （受控模式下点击会先 change 再经 update:active 回流触发 watcher，需去重）
  if (index === _lastChangeIndex) {
    return
  }
  _lastChangeIndex = index
  const item = props.list[index] || {}
  emit('change', {
    id: item.id,
    index,
  })
}
const changeNavPerView = (navPerView: number | string) => {
  const query = getSelectorQuery(vm)
  query
    .select('.wx-coolui-nav')
    .boundingClientRect()
    .exec((res) => {
      if (res && res.length > 0 && res[0]) {
        // 'auto' 时宽度交给 CSS，其余按每屏个数均分可用宽度
        const perView = Number(navPerView)
        navWidth.value =
          navPerView === 'auto'
            ? 'auto'
            : (res[0].width - props.spaceBetween * (perView - 1)) / perView +
              'px'
      }
    })
}
</script>

<style>
/* 与原生 :host 对齐：撑满宿主节点（nav 靠测量自身宽度算各项宽，宿主塌缩会算错） */
:host {
  display: block;
  width: 100%;
  font-size: 28rpx;
}

.wx-coolui-nav {
  border-bottom: 1px solid transparent;
  height: 83rpx;
}

.wx-coolui-nav.border {
  border-bottom: 1px solid #eee;
}

.wx-coolui-nav .nav-inner {
  white-space: nowrap;
}

.wx-coolui-nav .nav-inner .item {
  display: inline-block;
  text-align: center;
  height: 84rpx;
  font-size: 0;
  line-height: 0;
  color: #333;
  transition: color 0.4s;
}

.wx-coolui-nav .nav-inner .item .text {
  position: relative;
  display: inline-block;
  line-height: 84rpx;
  font-size: 28rpx;
  width: 100%;
}

.wx-coolui-nav .nav-inner .item .text > .text-inner {
  position: relative;
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wx-coolui-nav .nav-inner .item.round .text {
  padding: 0 20px;
  width: calc(100% - 40px);
}

.wx-coolui-nav .nav-inner .item.round .line {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  bottom: 50%;
  width: 100%;
  height: 60%;
  background-color: #ccc;
  transition: width 0.4s;
  border-radius: 50px;
  z-index: 0;
}

.wx-coolui-nav .nav-inner .item.plain .text {
  padding: 0 20px;
  width: calc(100% - 40px);
}

.wx-coolui-nav .nav-inner .item.plain .line {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  bottom: 50%;
  width: calc(100% - 2px);
  height: 60%;
  background-color: transparent !important;
  border: 1px solid #ccc;
  transition: width 0.4s;
  border-radius: 50px;
  z-index: 0;
}

.wx-coolui-nav .nav-inner .item.line .text .line {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 0;
  height: 4rpx;
  background-color: transparent;
  transition: width 0.4s;
}

.wx-coolui-nav .nav-inner .item.line.on {
  color: #0cba70;
}

.wx-coolui-nav .nav-inner .item.line.on .text .line {
  width: 100%;
}
/* #ifdef H5 || APP-PLUS */
/* H5 / App 下组件没有宿主节点，上面的 :host 不生效，宿主样式改为落到根节点上 */
.wx-coolui-nav {
  display: block;
  width: 100%;
  font-size: 28rpx;
}
/* #endif */
</style>
