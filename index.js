/**
 * coolui-scroller组件的api使用
 * 提供wx.createScrollContext进行管理功能
 */
function observePage(pageIndex, that) {
  wx.getSystemInfo({
    success: (res) => {
      const {
        windowHeight
      } = res
      // this.windowHeight = windowHeight
      const observerObj = wx.createIntersectionObserver(that).relativeToViewport({
        top: 2 * windowHeight,
        bottom: 2 * windowHeight
      })
      observerObj.observe(`#wrp_${pageIndex}`, (res) => {
        if (res.intersectionRatio <= 0) {
          try {
            that.setData({
              ['list[' + pageIndex + ']']: [
                {
                  height: that.pageHeightArr[pageIndex]
                }
              ],
            })
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            that.setData({
              ['list[' + pageIndex + ']']: that.wholeList[pageIndex],
            })
          } catch (error) {
            console.log(error);
          }
        }
      })
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

module.exports.setHeight = setHeight