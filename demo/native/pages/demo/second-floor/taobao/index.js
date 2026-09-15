const app = getApp()
Page({
  data: {
    refreshConfig: {
      downText: '下拉刷新',
      loadingText: '正在加载',
      backText: '返回首页',
      tipText: '松开刷新',
      moreText: '二楼可以访问您添加的频道哦~\n请下拉访问',
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
        color: '#ffffff',
      },
      text: {
        color: '#d13435',
      },
    },
    pic: {
      tb: 'https://test.wzs.pub/pic/second-floor-bg.jpeg',
      elm: 'https://test.wzs.pub/pic/2lou/elm.jpg',
    },
    val: 0,
    show: false,
    isSecond: false,
    statusBarHeight: 0,
    key: '',
    button: {
      hide: true,
    },
    placeholder: '搜索',
    list: [
      {
        icon: 'https://test.wzs.pub/pic/xian.jpg',
        name: '闲鱼',
      },
      {
        icon: 'https://test.wzs.pub/pic/cai.jpg',
        name: '菜鸟',
      },
      {
        icon: 'https://test.wzs.pub/pic/xian.jpg',
        name: '闲鱼',
      },
      {
        icon: 'https://test.wzs.pub/pic/cai.jpg',
        name: '菜鸟',
      },
      {
        icon: 'https://test.wzs.pub/pic/xian.jpg',
        name: '闲鱼',
      },
      {
        icon: 'https://test.wzs.pub/pic/cai.jpg',
        name: '菜鸟',
      },
      {
        icon: 'https://test.wzs.pub/pic/xian.jpg',
        name: '闲鱼',
      },
      {
        icon: 'https://test.wzs.pub/pic/cai.jpg',
        name: '菜鸟',
      },
      {
        icon: 'https://test.wzs.pub/pic/xian.jpg',
        name: '闲鱼',
      },
      {
        icon: 'https://test.wzs.pub/pic/cai.jpg',
        name: '菜鸟',
      },
    ],
  },
  onLoad: function () {
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
    })
    this.setData({
      isSecond: true,
    })
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.setData({
      isSecond: false,
    })
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
})
