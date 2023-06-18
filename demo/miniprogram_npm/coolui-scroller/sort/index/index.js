// components/coolui-scroller-item/coolui-scroller-item.js
Component({
  relations: {
    "../../coolui-scroller/index": {
      type: "parent", // 关联的目标节点应为子节点
      linked() {},
    },
    "../item/index": {
      type: "child",
      linked: function (target) {},
      linkChanged: function (target) {},
      unlinked: function (target) {},
    },
  },
  properties: {
    overlay: {
      type: Boolean,
      value: true,
    },
    overlayDuration: {
      type: Number,
      value: 500,
    },
    scroll: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    active: null,
    overlayHeight: 0,
    isOverLayShow: false,
    opacityAnimation: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setOverlayHeight() {
      const that = this;
      wx.getSystemInfo({
        success: (sysRes) => {
          const { windowHeight } = sysRes;
          const query = that.createSelectorQuery().in(this);
          query
            .select("#overlay")
            .boundingClientRect(function (res) {
              if (res) {
                that.setData({
                  overlayHeight: windowHeight - res.top,
                });
              }
            })
            .exec();
        },
      });
    },
    toggle(active) {
      const that = this;
      let flag = false;
      flag =
        active === that.data.active && that.data.active !== null
          ? true
          : active == null
          ? true
          : false;
      that.setData({
        active: active,
      });
      this.toggleOverlay(flag);
      this.toggleDropdown();
    },
    toggleOverlay(flag) {
      const that = this;
      var animation = wx.createAnimation({
        duration: that.data.overlayDuration,
        timingFunction: "ease-in",
      });

      if (flag) {
        if (that.data.isOverLayShow === true) {
          // 不显示
          animation.opacity(0).step();
          that.setData(
            {
              opacityAnimation: animation.export(),
            },
            () => {
              setTimeout(() => {
                that.setData({
                  isOverLayShow: false,
                });
              }, that.data.overlayDuration);
            }
          );
        } else {
          // 显示
          animation.opacity(1).step();
          this.setData(
            {
              isOverLayShow: true,
            },
            () => {
              that.setData({
                opacityAnimation: animation.export(),
              });
            }
          );
        }
      } else {
        if (that.data.isOverLayShow !== true) {
          animation.opacity(1).step();
          this.setData(
            {
              isOverLayShow: true,
            },
            () => {
              that.setData({
                opacityAnimation: animation.export(),
              });
            }
          );
        }
      }
      this.setOverlayHeight();
    },
    toggleDropdown() {
      var nodes = this.getRelationNodes("../item/index");
      nodes.forEach((item, index) => {
        item.toggleDropdown(this.data.active);
      });
    },
    close() {
      this.toggle(null);
    },
  },
  ready() {},
});
