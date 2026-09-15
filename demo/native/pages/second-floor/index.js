const app = getApp()
Page({
  data: {
    refreshConfig: {
      downText: '下拉刷新',
      loadingText: '正在加载',
      backText: '返回首页',
      tipText: '松开刷新',
      moreText: '继续下拉有惊喜~',
    },
    navBarConfig: {
      back: {
        show: true,
        click: () => {
          wx.navigateBack({
            delta: 1,
          })
        },
      },
      background: {
        color: '#d13435',
      },
      text: {
        color: '#fff',
      },
    },
    pic: {
      tb: 'https://test.wzs.pub/pic/second-floor-bg.jpeg',
      elm: 'https://test.wzs.pub/pic/2lou/elm.jpg',
    },
    val: 0,
    type: 'bottom',
    types: [
      { value: 'top', name: 'top' },
      { value: 'center', name: 'center' },
      { value: 'bottom', name: 'bottom' },
      // { value: "scale", name: "scale" },
    ],
    newPage: false,
    scale: false,
    show: false,
    duration: 300,
    position: 'right',
    round: false,
    overlay: true,
    customStyle: '',
    overlayStyle: '',
    statusBarHeight: 0,
    tip: {
      show: false,
      height: 200,
      times: 1,
      duration: 2000,
    },
    offset: false,
  },
  onLoad: function () {
    const type = wx.getStorageSync('type')
    const that = this
    if (type) {
      this.setData({
        type,
      })
    }

    const newPage = wx.getStorageSync('newPage')
    if (newPage) {
      this.setData({
        newPage,
      })
    }

    const scale = wx.getStorageSync('scale')
    if (scale) {
      this.setData({
        scale,
      })
    }

    const offset = wx.getStorageSync('offset')
    if (offset) {
      this.setData({
        offset,
      })
    }

    const tip = wx.getStorageSync('offset')
    if (tip) {
      this.setData({
        tip: {
          show: tip,
          height: 200,
          times: 1,
          duration: 2000,
        },
      })
    }

    wx.getSystemInfoAsync({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
        })
      },
    })
  },
  onShareAppMessage: function () {},
  onRefresh() {
    // 模拟请求延时
    setTimeout(() => {
      // 设置回弹
      const secondFloor = this.selectComponent('.my-second-floor')
      secondFloor.settriggered().then(() => {
        wx.showToast({
          title: '执行回弹成功',
          icon: 'success',
        })
      })
    }, 2000)
  },
  onSecondShow() {
    console.log('二楼已加载')
    // 如果设置了弹出新页 则控制show
    if (this.data.newPage) {
      setTimeout(() => {
        this.setData({
          show: true,
        })
      }, 500)
    }
  },
  onSecondBack() {
    console.log('二楼已关闭')
  },
  radioChange(e) {
    this.setData({
      type: e.detail.value,
    })
    wx.setStorageSync('type', e.detail.value)
  },
  exit() {
    const secondFloor = this.selectComponent('.my-second-floor')
    secondFloor.back().then(() => {
      this.setData({ show: false })
    })
  },
  switchChange(e) {
    this.setData({
      newPage: e.detail.value,
    })
    wx.setStorageSync('newPage', e.detail.value)
  },
  scaleChange(e) {
    this.setData({
      scale: e.detail.value,
    })
    wx.setStorageSync('scale', e.detail.value)
  },
  offsetChange(e) {
    this.setData(
      {
        offset: e.detail.value,
      },
      () => {
        const secondFloor = this.selectComponent('.my-second-floor')
        secondFloor.init()
      }
    )
    wx.setStorageSync('offset', e.detail.value)
  },
  tipChange(e) {
    this.setData(
      {
        tip: {
          show: e.detail.value,
          height: 200,
          times: 1,
          duration: 2000,
        },
      },
      () => {
        const secondFloor = this.selectComponent('.my-second-floor')
        secondFloor.init()
      }
    )
    wx.setStorageSync('offset', e.detail.value)
  },
})
