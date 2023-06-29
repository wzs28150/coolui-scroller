let interstitialAd = null
Page({
  data: {
    PageCur: 0,
    trans: false,
    touchx: 0,
    touchy: 0,
    titleArr: ['coolui-scroller', '有趣的下拉效果案例'],
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onload() {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-a30683890d51c7b7',
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
  },
  onShow() {
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      trans: false,
    })
  },
  TouchStart(e) {
    let that = this
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY,
      trans: true,
    })
  },
  TouchEnd(e) {
    // // console.log(e)
    let that = this
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    let turn = ''
    if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
      //右滑
      // // console.log(r);
      turn = 'right'
    } else if (
      x - that.data.touchx < -50 &&
      Math.abs(y - that.data.touchy) < 50
    ) {
      //左滑
      // // console.log(l);
      turn = 'left'
    }
    //根据方向进行操作
    if (turn == 'right') {
      //从左往右
      if (that.data.PageCur == 1) {
        that.setData({
          PageCur: 0,
        })
        setTimeout(() => {
          that.setData({
            trans: false,
          })
        }, 1000)
      }
    }
    if (turn == 'left') {
      //从右往左
      if (that.data.PageCur != 1) {
        that.setData({
          PageCur: 1,
        })
        setTimeout(() => {
          that.setData({
            trans: false,
          })
        }, 1000)
      }
    }
    // that.changeTitle()
  },
  changeTitle() {
    let that = this
    wx.setNavigationBarTitle({
      title: that.data.titleArr[that.data.PageCur],
    })
  },
})
