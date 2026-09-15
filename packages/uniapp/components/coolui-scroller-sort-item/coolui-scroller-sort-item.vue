<template>
  <view class="coolui-scroller-sort-item">
    <view class="coolui-scroller-nav-item" @tap="toggle">
      <view class="item-title" :class="titleClass" :style="{ color: isDropdownShow ? activeColor : color }">
        <view class="item-title-inner">{{ displayTitle }}</view>
      </view>
    </view>
    <view class="dropdown-menu" :class="isDropdownShow ? 'on' : ''">
      <view class="dropdown-menu-inner" :class="isDropdownShow ? 'on' : ''">
        <view class="dropdown-menu-inner-scroll">
          <template v-if="options && options.length > 0">
            <template v-if="multiple">
              <view
                v-for="(item, index) in options"
                :key="index"
                class="option-item"
                :class="inArray(index, selectArray) !== false ? 'on' : ''"
                @tap="onSelect(index)"
              >
                {{ item.title }}
              </view>
            </template>
            <template v-else>
              <view
                v-for="(item, index) in options"
                :key="index"
                class="option-item"
                :class="index === select ? 'on' : ''"
                @tap="onSelect(index)"
              >
                {{ item.title }}
              </view>
            </template>
          </template>
          <slot></slot>
        </view>
        <view class="action-bar" v-if="actionBar">
          <button type="default" class="action-bar-btn" @tap="clear">清空</button>
          <button
            type="primary"
            class="action-bar-btn"
            :style="{ background: activeColor }"
            @tap="confirm"
          >
            确定
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: '#333',
  },
  activeColor: {
    type: String,
    default: '#d13435',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  actionBar: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:value', 'change'])

const cooluiSort = inject('cooluiSort', null)

const isDropdownShow = ref(false)
const select = ref(null)
const selectArray = ref([])
const valueInner = ref(props.value)

// 标题展示：sort 类型显示当前选项标题；未选择（null/''/0）时显示第一个选项，
// 与原生一致（原生 String 属性下 null 会转成 ''，且 '' == 0 成立，故显示 options[0]）
const displayTitle = computed(() => {
  if (props.type !== 'sort') {
    return props.title
  }
  const v = valueInner.value
  if (v === null || v === undefined || v === '') {
    return props.options[0] ? props.options[0].title : ''
  }
  const item = props.options[v]
  return item ? item.title : ''
})

const titleClass = computed(() => {
  const cls = []
  if (props.type === 'sort') {
    cls.push('sort')
  }
  if (isDropdownShow.value) {
    cls.push('on')
  }
  cls.push(valueInner.value == 1 && props.type === 'sort' ? 'up' : 'down')
  return cls
})

watch(
  () => props.value,
  (val) => {
    valueInner.value = val
  }
)

let itemApi = null
onMounted(() => {
  // sort 组件会调用 item.toggleDropdown()，需以普通对象暴露方法
  itemApi = { toggleDropdown, confirm }
  if (cooluiSort && cooluiSort.registerItem) {
    cooluiSort.registerItem(itemApi)
  }
})
onBeforeUnmount(() => {
  if (cooluiSort && cooluiSort.unregisterItem) {
    cooluiSort.unregisterItem(itemApi)
  }
})

const toggle = () => {
  if (cooluiSort) {
    cooluiSort.toggle(props.name)
  }
}
const toggleDropdown = (active) => {
  if (active === props.name) {
    if (isDropdownShow.value === false) {
      if (props.multiple) {
        selectArray.value = valueInner.value
          ? String(valueInner.value).split(',')
          : []
      } else {
        const parsed = parseInt(valueInner.value)
        select.value = isNaN(parsed) ? null : parsed
      }
      isDropdownShow.value = true
    } else {
      isDropdownShow.value = false
    }
  } else {
    isDropdownShow.value = false
  }
}
// 原函数 select 与原 data.select 同名（Options 合并时方法覆盖 data 导致高亮失效），
// 这里把方法改名 onSelect，保留 select 作为选中态 ref 供模板对比高亮
const onSelect = (id) => {
  if (props.multiple) {
    const isIn = inArray(id, selectArray.value)
    if (isIn === false) {
      selectArray.value.push(id)
    } else {
      selectArray.value.splice(isIn, 1)
    }
    selectArray.value = [...selectArray.value].sort()
  } else {
    const next = id != select.value ? id : null
    select.value = next
    if (!props.actionBar) {
      valueInner.value = next
      emit('update:value', next)
      emit('change', {
        name: props.name,
        value: next,
      })
      setTimeout(() => {
        if (cooluiSort) {
          cooluiSort.toggle(null)
        }
      }, 600)
    }
  }
}
const inArray = (search, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == search) {
      return i
    }
  }
  return false
}
const clear = () => {
  valueInner.value = ''
  selectArray.value = []
  select.value = null
  emit('update:value', '')
  emit('change', {
    name: props.name,
    value: '',
  })
}
const confirm = () => {
  const value = props.multiple ? selectArray.value.join(',') : select.value
  valueInner.value = value
  emit('update:value', value)
  emit('change', {
    name: props.name,
    value,
  })
  setTimeout(() => {
    if (cooluiSort) {
      cooluiSort.toggle(null)
    }
  }, 500)
}

// 供父组件通过 ref 调用（排序 confirm）以及 sort 组件遍历调用（toggleDropdown）
defineExpose({
  confirm,
  toggleDropdown,
})
</script>

<style>
/* 宽度必须设在组件宿主节点上（与原生 :host 一致）：
   设在内部根节点时，28.5% 会相对宿主自身宽度解析，导致每个 item 被挤成极窄 */
/* :host {
  display: inline-block;
  width: 28.5%;
} */

.coolui-scroller-sort-item {
  display: block;
  width: 100%;
}

@font-face {
  font-weight : normal;
  font-family : 'cool-icon';
  font-style  : normal;
  font-display: auto;
  src         : url('data:application/octet-stream;base64,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') format('truetype');
}

.coolui-scroller-nav-item {
  width: 100%;
  position: relative;
  z-index: 55;
}

.item-title {
  text-align: center;
  font-size: 28rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
}

.item-title-inner {
  position: relative;
  padding-right: 12px;
  max-width: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title-inner::after {
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: 4px solid;
  border-color: #dcdee0 transparent transparent;
  right: 0px;
  top: 50%;
}

.item-title.sort .item-title-inner::after {
  margin-top: 7rpx;
}

.item-title.sort .item-title-inner::before {
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: 4px solid;
  border-color: transparent transparent #dcdee0;
  right: 0px;
  bottom: 50%;
  margin-bottom: -2rpx;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.dropdown-menu.on {
  pointer-events: auto;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  width: 100%;
  height: 1rpx;
  box-shadow: 0 0px 10px rgb(100 101 102);
  z-index: 5;
}

.dropdown-menu.on::before {
  display: block;
}

.dropdown-menu-inner {
  background-color: #fff;
  transform: translateY(-100%);
  transition: transform 0.4s;
}

.dropdown-menu-inner.on {
  transform: translateY(0);
}

.dropdown-menu-inner-scroll {
  max-height: 450rpx;
  overflow-y: scroll;
}

.option-item {
  line-height: 90rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.option-item.on {
  color: #d13435;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-item.on::after {
  font-family: 'cool-icon';
  content: '\e728';
}

.action-bar {
  display: flex;
  font-size: 28rpx;
}

.action-bar .action-bar-btn {
  flex: 1;
  border-radius: 0;
}

.action-bar .action-bar-btn::after {
  border-radius: 0;
}
</style>
