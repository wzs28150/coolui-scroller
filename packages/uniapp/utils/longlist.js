/**
 * 长列表分页工具
 * 与原生版 coolui-scroller/index.js 的 setHeight 能力对齐：
 * 配合 coolui-scroller-page 组件，将长列表按页缓存，
 * 滚出视口的页用占位高度替换，降低渲染压力。
 *
 * 页面中使用：
 *   import { setHeight } from 'coolui-scroller-uni/utils/longlist.js'
 *   // 页面实例上需维护：
 *   //   wholeList: 每一页的完整数据数组
 *   //   pageHeightArr: 每一页渲染后的高度缓存
 *   //   param: { page } 当前页码
 *   //   list: 渲染中的分页数组
 *   // 每次向 list 追加一页数据并渲染完成后调用：
 *   setHeight(this)
 */
import { getWindowInfo, createIntersectionObserver } from './platform.js'

function observePage(pageIndex, that) {
  const { windowHeight } = getWindowInfo()
  const observerObj = createIntersectionObserver(that, {})
  if (!observerObj) {
    return
  }
  observerObj.relativeToViewport({
    top: 2 * windowHeight,
    bottom: 2 * windowHeight,
  })
  observerObj.observe(`#wrp_${pageIndex}`, (res) => {
    if (res.intersectionRatio <= 0) {
    try {
      // 占位必须用数组 [{height}]，coolui-scroller-page 的占位分支按 pageList.length===1 && pageList[0].height 判断
      that.$set
        ? that.$set(that.list, pageIndex, [
            { height: that.pageHeightArr[pageIndex] },
          ])
        : (that.list[pageIndex] = [
            { height: that.pageHeightArr[pageIndex] },
          ])
    } catch (error) {
      // ignore
    }
    } else {
      try {
        that.$set
          ? that.$set(that.list, pageIndex, that.wholeList[pageIndex])
          : (that.list[pageIndex] = that.wholeList[pageIndex])
      } catch (error) {
        // ignore
      }
    }
  })
}

export function setHeight(that) {
  const page = that.param.page
  uni
    .createSelectorQuery()
    .select(`#wrp_${page}`)
    .boundingClientRect()
    .exec(function (res) {
      that.pageHeightArr[page] = res[0] && res[0].height
      observePage(page, that)
    })
}

/**
 * 长列表窗口计算（纯函数，无副作用）
 *
 * 解决「页数足够多时，page 结构本身造成卡顿」的问题：
 * 不再为每一页都保留一个组件实例，而是只真实渲染窗口内的页，
 * 窗口外统一折叠成上下两个占位块 —— 节点数/实例数与总页数无关（O(窗口) 而非 O(N)）。
 *
 * @param {Object} options
 * @param {number[]} options.heights  已测量的每页高度（未测量项用 estimate 代替）
 * @param {number}   options.count    总页数
 * @param {number}   options.scrollTop 当前滚动距离
 * @param {number}   options.viewportHeight 可视区高度
 * @param {number}   [options.overscan=1] 前后各多渲染几页
 * @param {number}   [options.estimate=0] 未测量页的估算高度
 * @returns {{ start:number, end:number, topHeight:number, bottomHeight:number }}
 */
export function computeLonglistWindow(options) {
  const opts = options || {}
  const count = opts.count || 0
  const overscan = opts.overscan == null ? 1 : opts.overscan
  const estimate = opts.estimate || 0
  const heights = opts.heights || []

  if (count <= 0) {
    return { start: 0, end: -1, topHeight: 0, bottomHeight: 0 }
  }

  // 前缀和：prefix[i] 为前 i 页的高度之和（未测量页用估算高度）
  const prefix = new Array(count + 1)
  prefix[0] = 0
  for (let i = 0; i < count; i++) {
    const h = heights[i] > 0 ? heights[i] : estimate
    prefix[i + 1] = prefix[i] + h
  }
  const total = prefix[count]

  const scrollTop = opts.scrollTop || 0
  const viewportHeight = opts.viewportHeight || 0
  const visibleTop = scrollTop
  const visibleBottom = scrollTop + viewportHeight

  // 二分：第一个「底部 > visibleTop」的页
  let start = 0
  let lo = 0
  let hi = count - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (prefix[mid + 1] > visibleTop) {
      start = mid
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }

  // 二分：最后一个「顶部 < visibleBottom」的页
  let end = start
  lo = start
  hi = count - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (prefix[mid] < visibleBottom) {
      end = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  start = Math.max(0, start - overscan)
  end = Math.min(count - 1, end + overscan)

  return {
    start,
    end,
    topHeight: prefix[start],
    bottomHeight: total - prefix[end + 1],
  }
}

export default {
  setHeight,
  computeLonglistWindow,
}
