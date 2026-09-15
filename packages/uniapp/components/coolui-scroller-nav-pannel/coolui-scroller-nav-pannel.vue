<template>
  <view class="wx-coolui-nav-pannel">
    <view
      class="wx-coolui-nav-pannel-inner"
      :class="type"
      :style="innerStyle"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { computed, provide } from 'vue'

const props = defineProps({
  active: {
    type: Number,
    default: 0,
  },
  animation: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'side', // 可选 side,fade
  },
})

// side 模式：每个 scroller 的宿主节点占满一屏（见样式 flex: 0 0 100%），
// 切换时按内层自身宽度（100%）位移即可，无需统计子组件数量。
// 说明：插槽里的 scroller 在 Vue 实例树上并非 nav-pannel 的子级，
// provide/inject 不可靠，原先依赖子组件注册来算宽度会失败，故改为纯 CSS 布局。
const innerStyle = computed(() => {
  if (props.type !== 'side') {
    return {}
  }
  return {
    transform: 'translateX(' + -100 * props.active + '%)',
    transition: props.animation ? 'transform 0.4s' : 'none',
  }
})

// 保留注册接口：scroller 挂载时会调用，这里不再需要计数
const registerScroller = () => {}
provide('cooluiNavPannel', { registerScroller })
</script>

<style lang="scss">
/* 关键：让组件宿主节点撑满父级。
   根节点若失去宿主高度，height:100% 会解析为 0（flex:1 也会失效），
   整条高度链塌陷导致内容不可见。与 scroller 组件保持一致 */
:host {
  display: block;
  width: 100%;
  height: 100%;
}

.wx-coolui-nav-pannel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* flex 父容器（如页面 .pannel-inner）里用 flex:1 取高，
     避免父级高度由 flex 推导时 height:100% 无法解析导致整条高度链塌成 0 */
  flex: 1;
  overflow: hidden;
}

.wx-coolui-nav-pannel-inner {
  flex: 1;
  min-height: 0;

  /* side：横向并排，每个 scroller 占满一屏，超出部分由外层 overflow 裁掉。
     注意必须用「组件标签选择器」命中真正的 flex 子项 —— scroller 的宿主节点；
     .coolui-scroller 类位于 scroller 内部根节点（受样式隔离、且不是 flex 子项），
     命中不到，会导致多个列表被挤在一屏内同时显示 */
  &.side {
    display: flex;
    width: 100%;

    coolui-scroller {
      flex: 0 0 100%;
    }
  }

  /* fade：叠层切换，非首个 scroller 绝对定位铺满，首个作为基准层 */
  &.fade {
    position: relative;

    coolui-scroller {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 0;

      &:first-child {
        position: relative;
        z-index: 1;
      }
    }
  }
}
</style>
