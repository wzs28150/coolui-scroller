Page({
  data: {
    val: 0,
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点申诉还是浅色
      background: {
        color: '#eeeeee',
      },
    },
    baseConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        color: '#fff', // 文字颜色
        shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
      },
      background: {
        color: '#000000',
        height: 120,
        img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
    logoConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        content: 'coolui-scroller',
        font: 'Lobster variant0',
        size: '50',
        color: '#ccc', // 文字颜色
        shadow: 0, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
        img: 'https://test.wzs.pub/pic/bg2.jpg',
      },
      background: {
        color: '#fff',
        height: 120,
        // img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
    gifSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
        img: 'https://test.wzs.pub/pic/tm_mui_bike.gif',
      },
    },
    parallaxSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
      },
    },
    parallaxDemoSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#ffaf1b',
      },
    },
    jdSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      background: {
        color: '#eeeeee',
      },
    },
    elmSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      isAutoTriggered: false,
      background: {
        color: '#eeeeee',
      },
    },
    refreshstate: 'pulldown',
    isLoading: false,
    triggered: false,
  },
  onLoad: function () {},
  onRefresh: function () {
    wx.showToast({
      title: '执行页面刷新数据',
      icon: 'success',
    })
  },
  diyRefresh() {
    const that = this
    const scroll = this.selectComponent('.elm-scroller')
    setTimeout(() => {
      scroll.settriggered(false).then(() => {
        wx.showToast({
          title: '执行回弹成功',
          icon: 'success',
        })
      })
    }, 2000) // 自定义回弹时间
  },
  onShareAppMessage: function () {},
})
