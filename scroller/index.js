Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  relations: {
    '../scroll-page/index': {
      type: 'child',
      linked: function (target) {},
    },
    '../nav/index': {
      type: 'child',
      linked: function (target) {},
    },
    '../empty/index': {
      type: 'child',
      linked: function (target) {},
    },
    '../refresh/index': {
      type: 'child',
      linked: function (target) {
        this.setData({
          type: target.data.type,
          refreshConfig: target.data.config
        })
      },
    },
  },
  properties: {
    isEmpty: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: "#f2f2f2"
    },
    isBackBtn: {
      type: Boolean,
      value: false
    }
  },
  data: {
    contentHeight: 0,
    triggered: true,
    timeout: null,
    isBackToTopShow: false,
    threshold: 0,
    refreshConfig:{
      shake: false,
      height: 50,
      style: 'black'
    }
  },
  ready() {
    this.setWapHeight()
    this.refreshNodes = this.getRelationNodes('../refresh/index')
    this.refreshNode = this.refreshNodes[0] ? this.refreshNodes[0] : null;
  },
  methods: {
    setWapHeight() {
      const that = this
      const query = that.createSelectorQuery().in(this)
      query.select('#content').boundingClientRect(function (res) {
        that.setData({
          contentHeight: res.height
        })
      }).select('#header').boundingClientRect(function (headerRes) {
        that.setData({
          contentHeight: that.data.contentHeight - headerRes.height
        })
      }).exec()
    },
    debounce(fn, wait) {
      const that = this
      that.setData({
        timeout: null
      })
      return function () {
        if (that.data.timeout !== null) {
          clearTimeout(that.data.timeout)
        }
        const timeout = setTimeout(() => {
          fn()
        }, wait)
        that.setData({
          timeout
        })
      }
    },
    onLoadmore() {
      const that = this
      this.debounce(function () {
        that.triggerEvent('loadmore')
        if (that.data.refreshConfig.shake) {
          wx.vibrateShort();
        }
      }, 500)()
    },
    onRefresh() {
      const that = this
      if (that.data.refreshConfig.shake) {
        wx.vibrateShort();
      }
      wx.showNavigationBarLoading()
      this.settriggered(false,()=>{
        this.triggerEvent('refresh')
      })
    },
    onPulling(evt) {
      if (this.data.triggered == false) {
        this.settriggered(true)
      }
      setTimeout(() => {
        var p = Math.min(evt.detail.dy / this.data.refreshConfig.height, 1);
        this.setThreshold(p)
      }, 300);//增加延时以防前半段动画为拉下来而看不见
    },
    settriggered(flag, callback = null) {
      if (callback) {
        callback()
      }
      if (this.refreshNode) {
        this.refreshNode.setData({
          triggered: flag
        });
      }
      setTimeout(() => {
        this.setData({
          triggered: flag
        }, () => {
          
        })
      }, 1000)
    },
    setThreshold(p, callback = null) {
      if (this.refreshNode && this.refreshNode.data.threshold != 1) {
        this.refreshNode.changeThreshold({
          threshold: p
        }, () => {
          if (callback) {
            callback()
          }
        });
      } else if (this.refreshNode && p == 0) {
        // console.log(2);
        this.refreshNode.changeThreshold({
          threshold: 0
        }, () => {
          if (callback) {
            callback()
          }
        });
      }

    },
    onRestore() {
      wx.hideNavigationBarLoading();
      this.triggerEvent('restore')
      setTimeout(() => {
          this.setThreshold(0);
        }, 300);
    },
    scroll(e) {
      if (e.detail.scrollTop > 100 && this.data.isBackToTopShow == false) {
        this.setData({
          isBackToTopShow: true
        })
      } else if (e.detail.scrollTop <= 100 && this.data.isBackToTopShow == true) {
        this.setData({
          isBackToTopShow: false
        })
      }
    },
    backToTop() {
      this.triggerEvent('refresh')
    }
  }
})