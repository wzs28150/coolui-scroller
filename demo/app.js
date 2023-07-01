App({
  globalData: {
    statusBarHeight: 0,
  },
  onLaunch() {
    // 设置顶部自定义状态栏高度
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight
        let capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          this.globalData.Custom = capsule
          this.globalData.statusBarHeight =
            capsule.bottom + capsule.top - e.statusBarHeight
        } else {
          this.globalData.statusBarHeight = e.statusBarHeight + 50
        }
      },
    })
  },
})
