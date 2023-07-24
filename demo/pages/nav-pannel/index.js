Page({
  data: {
    logoConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        content: 'coolui-scroller',
        font: 'Lobster variant0',
        size: '50',
        color: '#ccc', // 文字颜色
        shadow: 0, // 设置0
        img: 'https://test.wzs.pub/pic/bg2.jpg',
      },
      background: {
        color: '#f2f2f2',
        height: 120,
        // img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
    height: 0,
    active: 0,
  },
  getHeight: function (res) {
    this.setData({
      height: res.detail,
    })
  },
  next: function () {
    this.setData({
      active: 1,
    })
  },
  back: function () {
    this.setData({
      active: 0,
    })
  },
  onShareAppMessage: function () {},
})
