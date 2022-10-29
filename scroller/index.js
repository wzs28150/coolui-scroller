Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
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
          refreshConfig: target.data.config,
        });
      },
    },
  },
  properties: {
    isEmpty: {
      type: Boolean,
      value: false,
    },
    background: {
      type: String,
      value: '#f2f2f2',
    },
    isBackBtn: {
      type: Boolean,
      value: false,
    },
    enableFlex: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    contentHeight: 0,
    triggered: false,
    isLoading: false,
    timeout: null,
    isBackToTopShow: false,
    threshold: 0,
    refreshConfig: {
      shake: false,
      height: 50,
      style: 'black',
    },
    top: 0,
  },
  ready() {
    this.setWapHeight();
    this.refreshNodes = this.getRelationNodes('../refresh/index');
    this.refreshNode = this.refreshNodes[0] ? this.refreshNodes[0] : null;
  },
  methods: {
    setWapHeight() {
      const that = this;
      const query = that.createSelectorQuery().in(this);
      query
        .select('#content')
        .boundingClientRect(function (res) {
          that.setData({
            contentHeight: res.height,
          });
        })
        .select('#header')
        .boundingClientRect(function (headerRes) {
          that.setData({
            contentHeight: that.data.contentHeight - headerRes.height,
          });
        })
        .exec();
    },
    debounce(fn, wait) {
      const that = this;
      that.setData({
        timeout: null,
      });
      return function () {
        if (that.data.timeout !== null) {
          clearTimeout(that.data.timeout);
        }
        const timeout = setTimeout(() => {
          fn();
        }, wait);
        that.setData({
          timeout,
        });
      };
    },
    onLoadmore() {
      const that = this;
      that.debounce(() => {
        that.triggerEvent('loadmore');
        if (that.data.refreshConfig.shake) {
          wx.vibrateShort();
        }
      }, 500)();
    },
    onDefaultRefresh() {
      const that = this;
      if (that.data.type == 'default') {
        that.triggerEvent('refresh');
        that.debounce(() => {
          that.settriggered(false);
        }, 1000)();
      }
    },
    onRefresh() {
      const that = this;
      if (that.data.refreshConfig.shake) {
        wx.vibrateShort();
      }
      if (this.data.isLoading) {
        console.log('refresh');
        wx.showNavigationBarLoading();
        if ('isAutoTriggered' in that.data.refreshConfig) {
          if (that.data.refreshConfig.isAutoTriggered) {
            that.triggerEvent('refresh');
            that.debounce(() => {
              that.settriggered(false);
              setTimeout(() => {
                that.onRestore();
              }, 300);
            }, 1000)();
          } else {
            if (that.data.triggered) {
              that.triggerEvent('refresh');
            }
          }
        } else {
          that.triggerEvent('refresh');
          that.debounce(() => {
            that.settriggered(false);
            setTimeout(() => {
              that.onRestore();
            }, 300);
          }, 1000)();
        }
      }
    },
    onPulling(evt) {
      console.log('pull');
      const that = this;
      that.settriggered(true).then(() => {
        // console.log(evt.detail.dy, that.data.refreshConfig.height);
        let p = Math.min(
          evt.detail.dy / (that.data.refreshConfig.height + 20),
          1
        );
        that.p = p ? p : 0;
        that.setThreshold(that.p);
      });
    },
    settriggered(flag) {
      const that = this;
      return new Promise((resolve) => {
        if (flag != that.data.triggered) {
          if (that.refreshNode) {
            that.refreshNode.setData({
              triggered: flag,
            });
          }
          that.setData(
            {
              triggered: flag,
            },
            () => {
              resolve();
            }
          );
        } else {
          resolve();
        }
      });
    },
    setThreshold(p) {
      const that = this;
      return new Promise((resolve) => {
        if (that.refreshNode) {
          that.refreshNode
            .changeThreshold({
              threshold: p,
            })
            .then(() => {
              resolve();
            });
        }
      });
    },
    onRestore() {
      const that = this;
      if (that.data.isLoading) {
        console.log('restore');
        wx.hideNavigationBarLoading();
        that.triggerEvent('restore');
        that.debounce(() => {
          that.setThreshold(0).then(() => {
            that.p = 0;
            that.refreshNode.setLoading({
              isloading: false,
            });
            that.setData({
              isLoading: false,
              triggered: false,
            });
          });
        }, 100)();
      }
    },
    scroll(e) {
      if (e.detail.scrollTop > 100 && this.data.isBackToTopShow == false) {
        this.setData({
          isBackToTopShow: true,
        });
      } else if (
        e.detail.scrollTop <= 100 &&
        this.data.isBackToTopShow == true
      ) {
        this.setData({
          isBackToTopShow: false,
        });
      }
    },
    dragend() {
      if (this.data.type != 'default') {
        if (this.p > 0.6 && this.data.isLoading == false) {
          this.setData(
            {
              isLoading: true,
            },
            () => {
              this.refreshNode
                .setLoading({
                  isloading: true,
                })
                .then(() => {
                  this.onRefresh();
                });
            }
          );
        } else {
          this.settriggered(false);
        }
      }
    },
    backToTop() {
      // this.triggerEvent("refresh");
      this.setData({
        top: 0,
      });
    },
  },
});
