Page({
  data: {
    val: 0,
    refreshstate: 'pulldown',
    isLoading: false,
    universeSetting: {
      shake: true, // 是否开启下拉震动
      height: 150,
      isAutoTriggered: false,
      background: {
        color: '#443687',
      },
    },
  },
  onRefresh() {
    setTimeout(() => {
      // 开启第二段动画
      this.setData(
        {
          isLoading: true,
        },
        () => {
          const scroll = this.selectComponent('.universe-scroller')
          setTimeout(() => {
            scroll.settriggered(false)
          }, 2000) // 自定义回弹时间
        }
      )
    }, 1000)
  },
  onShareAppMessage: function () {},
})
