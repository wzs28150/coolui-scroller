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

export default {
  setHeight,
}
