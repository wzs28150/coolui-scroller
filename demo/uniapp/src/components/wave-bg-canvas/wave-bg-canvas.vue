<script setup lang="ts">
/**
 * 跨端 canvas 波浪背景
 *
 * 原生版（`src/wxcomponents/wave-bg`）是微信小程序原生组件，只有微信端能注册使用；
 * 本组件用 uni-app 的画布接口重写同一套算法（同一份 noise），H5 / App / 各小程序端通用。
 *
 * 两个跨端要点：
 * 1. 用的是旧版画布接口 `uni.createCanvasContext`（各端都支持），该接口没有
 *    `canvas.requestAnimationFrame`，所以用定时器逐帧重绘；
 * 2. 画布尺寸不依赖 `:host` / `height:100%` 这类宿主样式（H5、App 没有宿主节点，
 *    这类写法不生效），而是先量出根节点实际尺寸，再把 px 尺寸写到画布行内样式上，
 *    因此各端渲染结果一致。
 */
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSelectorQuery } from 'coolui-scroller-uni/utils/platform.js'
import { makeNoise2D } from './noise'

const props = withDefaults(
  defineProps<{
    /** 填充色 */
    color?: string
    /** 波浪线高度百分比（与原生组件默认值一致） */
    percent?: number
    /** 填充位置：top 向上填满，其它值向下 */
    position?: string
    /** 振幅 */
    amp?: number
    /** 帧间隔(ms) */
    interval?: number
  }>(),
  {
    color: '#d13435',
    percent: 90,
    position: 'top',
    amp: 20,
    interval: 28,
  }
)

const CANVAS_ID = 'cooluiWaveBg'
const vm = getCurrentInstance()
const noise2D = makeNoise2D(Date.now())

/** 根节点实际尺寸（px），同时作为画布尺寸 */
const box = ref({ width: 0, height: 0 })
/** 采样点数量（与原生一致：每 5px 一个点） */
let points = 0
let timer: ReturnType<typeof setInterval> | null = null
let speedX = 0
let speedY = 0

/** 量取根节点尺寸（复用库里的 getSelectorQuery：内部按平台取 $scope 并做了兜底） */
const measure = () =>
  new Promise<void>((resolve) => {
    getSelectorQuery(vm?.proxy)
      .select('.coolui-wave-bg')
      .boundingClientRect((rect: unknown) => {
        const r = rect as { width?: number; height?: number } | null
        if (r && r.width && r.height) {
          box.value = { width: r.width, height: r.height }
          points = Math.max(1, Math.floor(r.width / 5))
        }
        resolve()
      })
      .exec()
  })

/** 首帧布局可能还没就绪（尤其 H5 / App），量不到尺寸就重试几次 */
const measureWithRetry = async () => {
  for (let i = 0; i < 3 && !box.value.width; i++) {
    await measure()
    if (!box.value.width) {
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  }
}

/** 画一帧：按噪声采样一条波浪线，再闭合到另一侧填色 */
const renderFrame = () => {
  const { width, height } = box.value
  if (!width || !height || !points) {
    return
  }
  const ctx = uni.createCanvasContext(CANVAS_ID, vm?.proxy)
  const baseHeight = (height * props.percent) / 100
  const edge = props.position === 'top' ? -height : height

  ctx.clearRect(0, 0, width, height)
  speedX = 0
  speedY += 0.003
  ctx.beginPath()
  for (let i = 0; i <= points; i++) {
    speedX += 0.05
    const x = i * (width / points)
    const y = baseHeight + noise2D(speedX, speedY) * props.amp
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.lineTo(width, edge)
  ctx.lineTo(0, edge)
  ctx.closePath()
  ctx.setFillStyle(props.color)
  ctx.fill()
  ctx.draw()
}

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(async () => {
  await measureWithRetry()
  renderFrame()
  stop()
  timer = setInterval(renderFrame, props.interval)
})

onBeforeUnmount(stop)
</script>

<template>
  <view class="coolui-wave-bg">
    <canvas
      :id="CANVAS_ID"
      :canvas-id="CANVAS_ID"
      class="coolui-wave-bg__canvas"
      :style="{ width: box.width + 'px', height: box.height + 'px' }"
    ></canvas>
  </view>
</template>

<style>
/* 小程序端有宿主节点：宿主撑满父级（父级用行内样式给了高度） */
:host {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

/* H5 / App 没有宿主节点：这个 view 就是组件根节点，
   父级传入的 class / 行内样式（position:relative; height:33vh）直接落在它身上 */
.coolui-wave-bg {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 画布绝对定位铺在根节点上方，宽高由测量结果写成行内 px（见模板），
   因此不依赖各端对 :host / height:100% 的处理差异 */
.coolui-wave-bg__canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  z-index: 0;
}
</style>
