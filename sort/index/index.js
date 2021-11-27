// components/coolui-scroller-item/coolui-scroller-item.js
Component({
  relations: {
    '../../coolui-scroller/index': {
      type: 'parent', // 关联的目标节点应为子节点
      linked() {

      }
    },
    '../item/index': {
      type: 'child',
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        // console.log('[nav] a child is linked: ', target)
        // console.log(this);
        // const len =  this.navItemCache ?  Object.keys(this.navItemCache).length : 0
        // navItemCache[target.data.value] = len;
        // console.log(target.data.value);
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    overlay: {
      type: Boolean,
      value: true
    },
    overlayDuration: {
      type: Number,
      value: 500
    }
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
      const that = this
      wx.getSystemInfo({
        success: (sysRes) => {
          const {
            windowHeight
          } = sysRes
          const query = that.createSelectorQuery().in(this)
          query.select('#overlay').boundingClientRect(function (res) {
            if (res) {
              that.setData({
                overlayHeight: windowHeight - res.top
              })
            }

          }).exec()
        }
      })
    },
    toggle(active) {
      const that = this
      let flag = false;
      flag = (active === that.data.active && that.data.active !== null) ? true : false;
      that.setData({
        active: active
      })
      this.toggleOverlay(flag)
      this.toggleDropdown();
    },
    toggleOverlay(flag) {
      const that = this
      var animation = wx.createAnimation({
        duration: that.data.overlayDuration,
        timingFunction: 'ease-in'
      })

      if (flag) {
        if (that.data.isOverLayShow === true) {
          // 不显示
          animation.opacity(0).step();
          that.setData({
            opacityAnimation: animation.export()
          }, () => {
            setTimeout(() => {
              that.setData({
                isOverLayShow: false,
              })
            }, that.data.overlayDuration);
          })
        } else {
          // 显示
          animation.opacity(1).step();
          this.setData({
            isOverLayShow: true,
          }, () => {
            that.setData({
              opacityAnimation: animation.export()
            })
          })
        }
      } else {
        if (that.data.isOverLayShow !== true) {
          animation.opacity(1).step();
          this.setData({
            isOverLayShow: true,
          }, () => {
            that.setData({
              opacityAnimation: animation.export()
            })
          })
        }
      }
      this.setOverlayHeight()
    },
    toggleDropdown() {
      var nodes = this.getRelationNodes('../item/index')
      nodes.forEach((item,index) => {
        item.toggleDropdown(this.data.active)
      });
    }
  },
  ready() {

  }
})