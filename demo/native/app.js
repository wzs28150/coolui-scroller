App({
  globalData: {
    statusBarHeight: 0,
  },
  onLaunch() {
    // 设置顶部自定义状态栏高度
    const { statusBarHeight } = wx.getWindowInfo()
    this.globalData.StatusBar = statusBarHeight
    let capsule = wx.getMenuButtonBoundingClientRect()
    if (capsule) {
      this.globalData.Custom = capsule
      this.globalData.statusBarHeight =
        capsule.bottom + capsule.top - statusBarHeight
    } else {
      this.globalData.statusBarHeight = statusBarHeight + 50
    }
  },
})
