Component({
  properties: {
    top: {
      type: String,
      value: 0
    },
    bottom: {
      type: String,
      value: 0
    },
    left: {
      type: String,
      value: 0
    },
    right: {
      type: String,
      value: 0
    },
    key: {
      type: String,
      value: 'isTipShow'
    },
    opacity: {
      type: Number,
      value: 0.5
    }
  },
  data: {
    isTipShow: true
  },
  methods: {
    close: function () {
      try {
        wx.setStorageSync(this.data.key, 'true')
        this.setData({
          isTipShow: true
        })
      } catch (e) {

      }
    }
  },
  ready() {
    try {
      var isKey = wx.getStorageSync(this.data.key)
      if (!isKey) {
        this.setData({
          isTipShow: false
        })
      }
    } catch (e) {
      console.log(1);
    }
  }
})