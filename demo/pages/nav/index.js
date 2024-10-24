Page({
  data: {
    nav: [
      {
        id: 1,
        title: '分类1分类1分类1分类1',
      },
      {
        id: 2,
        title: '分类2',
      },
      {
        id: 3,
        title: '分类3',
      },
      {
        id: 4,
        title: '分类4',
      },
      {
        id: 5,
        title: '分类5',
      },
      {
        id: 6,
        title: '分类6',
      },
      {
        id: 7,
        title: '分类7',
      },
    ],
    active: 0,
    type: 'line',
    border: true,
    navPerView: 3.5,
    spaceBetween: 0,
    textLine: { color: '#333', activeColor: '#d13435' },
    backgroundLine: { color: '#333', activeColor: '#d13435' },
    textPlain: { color: '#ccc', activeColor: '#d13435' },
    backgroundPlain: { color: '#ccc', activeColor: '#d13435' },
    text: { color: '#333', activeColor: '#fff' },
    background: { color: '#ccc', activeColor: '#d13435' },
  },
  onChange: function (e) {
    wx.showToast({
      title: 'change方法返回id:' + e.detail.id,
      icon: 'none',
      duration: 2000,
    })
  },
  TouchStart(e) {
    let that = this
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY,
    })
  },
  TouchEnd(e) {
    // console.log(e)
    let that = this
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    let turn = ''
    if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
      //右滑
      // console.log(r);
      turn = 'right'
    } else if (
      x - that.data.touchx < -50 &&
      Math.abs(y - that.data.touchy) < 50
    ) {
      //左滑
      // console.log(l);
      turn = 'left'
    }
    //根据方向进行操作
    if (turn == 'right') {
      //从左往右
      if (that.data.active != 0) {
        that.setData({
          active: that.data.active - 1,
        })
      }
    }
    if (turn == 'left') {
      //从右往左
      if (that.data.active < that.data.nav.length - 1) {
        that.setData({
          active: that.data.active + 1,
        })
      }
    }
  },
  changeType(e) {
    // console.log(e.currentTarget.dataset.type)
    const type = e.currentTarget.dataset.type
    this.setData({
      type: type,
      navPerView: type !== 'line' ? 'auto' : this.data.navPerView,
      spaceBetween: type !== 'line' ? 20 : this.data.spaceBetween,
    })
  },
  changeNavPerView(e) {
    // console.log(e.currentTarget.dataset.type)
    this.setData({
      navPerView: e.currentTarget.dataset.type,
    })
  },
  changeSpaceBetween(e) {
    // console.log(e.currentTarget.dataset.type)
    this.setData({ spaceBetween: e.currentTarget.dataset.type })
  },
  borderChange() {
    this.setData({ border: !this.data.border })
  },
  onShareAppMessage: function () {},
})
