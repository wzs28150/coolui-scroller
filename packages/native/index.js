/**
 * coolui-scroller组件的api使用
 * 提供wx.createScrollContext进行管理功能
 */
function observePage(pageIndex, that) {
  const { windowHeight } = wx.getWindowInfo()
  // this.windowHeight = windowHeight
  const observerObj = wx.createIntersectionObserver(that).relativeToViewport({
    top: 2 * windowHeight,
    bottom: 2 * windowHeight,
  })
  observerObj.observe(`#wrp_${pageIndex}`, (res) => {
    if (res.intersectionRatio <= 0) {
      try {
        that.setData({
          ['list[' + pageIndex + ']']: [
            {
              height: that.pageHeightArr[pageIndex],
            },
          ],
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        that.setData({
          ['list[' + pageIndex + ']']: that.wholeList[pageIndex],
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}

function setHeight(that) {
  const page = that.param.page
  this.query = wx.createSelectorQuery()
  this.query.select(`#wrp_${page}`).boundingClientRect()
  this.query.exec(function (res) {
    that.pageHeightArr[page] = res[0] && res[0].height
  })
  observePage(page, that)
}

/**
 * 长列表窗口计算（纯函数，与 uniapp 版 utils/longlist.js 的 computeLonglistWindow 保持同一套逻辑）
 *
 * 旧方案（scroll-page 每页一个组件 + setHeight 的 IntersectionObserver）会随页数线性增长实例/observer
 * 数量，页数多时滚动卡顿。改为：只真实渲染窗口内的页，窗口外折叠成上下两个占位块，
 * 节点数与总页数无关（O(窗口) 而非 O(N)），并且不再使用 IntersectionObserver。
 *
 * @param {Object} options
 * @param {number[]} options.heights 已测量的每页高度（未测量项用 estimate 代替）
 * @param {number} options.count 总页数
 * @param {number} options.scrollTop 当前滚动距离
 * @param {number} options.viewportHeight 可视区高度
 * @param {number} [options.overscan=1] 前后各多渲染几页
 * @param {number} [options.estimate=0] 未测量页的估算高度
 * @returns {{ start:number, end:number, topHeight:number, bottomHeight:number }}
 */
function computeLonglistWindow(options) {
  const opts = options || {}
  const count = opts.count || 0
  const overscan = opts.overscan == null ? 1 : opts.overscan
  const estimate = opts.estimate || 0
  const heights = opts.heights || []

  if (count <= 0) {
    return {
      start: 0,
      end: -1,
      topHeight: 0,
      bottomHeight: 0
    }
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
    start: start,
    end: end,
    topHeight: prefix[start],
    bottomHeight: total - prefix[end + 1]
  }
}

module.exports.setHeight = setHeight
module.exports.computeLonglistWindow = computeLonglistWindow
