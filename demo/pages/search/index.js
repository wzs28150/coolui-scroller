Page({
  data: {
    searchBtnShow: {
      button: {
        show: true
      }
    },
    searchBtnHide: {
      button: {
        hide: true
      }
    },
    searchBtnText: {
      button: {
        text: "搜一下"
      }
    },
    key1: "",
    key2: "",
    key3: "",
    key4: "",
    key5: "",
    key6: "",
    key7: "",
    key8: ""
  },
  onBtnClick({
    detail
  }) {
    wx.showToast({
      title: '来自右侧按钮点击:' + detail.key,
      icon: 'none',
      duration: 4000
    })
  },
  confirm({
    detail
  }) {
    wx.showToast({
      title: '来自完成按钮触发:' + detail.key,
      icon: 'none',
      duration: 4000
    })
  },
  test() {
    this.setData({
      key: "aaaaa"
    })
  },
  onShareAppMessage: function () {}
})