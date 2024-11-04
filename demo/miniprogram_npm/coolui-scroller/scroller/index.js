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
        this.moveHeight =
          target.data.config.background.height || target.data.config.height
        this.setData({
          type: target.data.type,
          refreshConfig: target.data.config,
          moveHeight: this.moveHeight,
        })
      },
    },
    '../backToTop/index': {
      type: 'child',
      linked: function (target) {
        this.setData({
          isBackBtn: true,
        })
      },
    },
    '../nav-pannel/index': {
      type: 'parent',
      linked: function (target) {
        // console.log(target)
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
    },
    toView: {
      type: String,
      value: '',
    },
    top: {
      type: Number,
      value: 0,
    },
    animation: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    active: false,
    contentHeight: 0,
    triggered: null,
    isLoading: false,
    timeout: null,
    isBackToTopShow: false,
    innerAnimationData: {},
    threshold: 0,
    refreshConfig: {
      shake: false,
      height: 50,
      style: 'black',
    },
    touchy: 0,
    moveHeight: 0,
  },
  ready() {
    // this.setData({
    //   moveHeight: this.moveHeight,
    // })
    this.setWapHeight()
    this.refreshNodes = this.getRelationNodes('../refresh/index')
    this.refreshNode = this.refreshNodes[0] ? this.refreshNodes[0] : null
    console.log(this.refreshNode)

    this.backToTopNodes = this.getRelationNodes('../backToTop/index')

    this.backToTopNode = this.backToTopNodes[0] ? this.backToTopNodes[0] : null
    const animationInner = this.setAnimation(-this.moveHeight, 0)
    this.setData({
      innerAnimationData: animationInner ? animationInner.export() : {},
    })
    console.log(this)
  },
  methods: {
    setWapHeight() {
      const that = this
      const query = that.createSelectorQuery().in(this)
      query
        .select('#content')
        .boundingClientRect(function (res) {
          if (res) {
            that.setData({
              contentHeight: res.height,
            })

            that.triggerEvent('contentHeight', res.height)
          }
        })
        .select('#header')
        .boundingClientRect(function (headerRes) {
          if (headerRes) {
            that.setData({
              contentHeight: that.data.contentHeight - headerRes.height,
            })
            that.triggerEvent(
              'contentHeight',
              that.data.contentHeight - headerRes.height
            )
          }
        })
        .exec()
      console.log(that.data.refreshConfig)
    },
    setAnimation(
      y,
      duration = 400,
      scale = 1,
      opacity = 1,
      timingFunction = 'ease-out'
    ) {
      let transformOrigin = '50% 50% 0'
      if (this.data.top) {
        transformOrigin = '50% 0 0'
      }
      if (this.data.bottom) {
        transformOrigin = '50% 100% 0'
      }
      if (this.data.center) {
        transformOrigin = '50% 50% 0'
      }
      const animation = wx.createAnimation({
        delay: 0,
        duration: duration,
        timingFunction: timingFunction,
        transformOrigin: transformOrigin,
      })
      animation.translateY(y).scale(scale, scale).opacity(opacity)

      animation.step()

      return animation
    },
    async settriggered(flag) {
      const that = this
      console.log(flag)

      if (flag != that.data.triggered) {
        if (that.refreshNode) {
          that.refreshNode.setData({
            triggered: flag,
          })
        }

        that.setData(
          {
            triggered: flag,
          },
          async () => {
            if (!flag) {
              console.log('backToTop')

              await that.backToTop()
            }
            return Promise.resolve()
          }
        )
      } else {
        return Promise.resolve()
      }
    },
    setThreshold(p) {
      const that = this
      return new Promise((resolve) => {
        if (that.refreshNode) {
          // console.log(1)

          that.refreshNode
            .changeThreshold({
              threshold: p,
            })
            .then(() => {
              resolve()
            })
        }
      })
    },
    debounce(fn, wait) {
      const that = this
      that.setData({
        timeout: null,
      })
      return function () {
        if (that.data.timeout !== null) {
          clearTimeout(that.data.timeout)
        }
        const timeout = setTimeout(() => {
          fn()
        }, wait)
        that.setData({
          timeout,
        })
      }
    },
    async touchStart(e) {
      // 正在刷新时不操作触摸
      if (this.data.isLoading) {
        return false
      }
      await this.settriggered(true)
      this.setData({
        touchy: e.changedTouches[0].clientY,
      })
    },
    async touchMove(e) {
      const that = this

      if (!this.data.isLoading) {
        let value = 0
        const slowdownFactor = 0.2
        const distance = Math.round(
          e.changedTouches[0].clientY - this.data.touchy
        )
        // console.log(distance)
        // value = Math.min(
        //   1.1,
        //   Math.max(0, 1 - 1 / (Math.abs(distance * slowdownFactor) + 1))
        // )
        value = (distance / this.moveHeight).toFixed(2)
        if (distance < 0) {
          value = 0 // 如果向上拖拽，数值保持为0
        }
        that.p = value
        let scrollTop = -this.moveHeight
        if (distance > 0 && distance < this.moveHeight) {
          scrollTop = -this.moveHeight + distance
          let animation = this.setAnimation(scrollTop, 0)
          this.setData({
            innerAnimationData: animation ? animation.export() : null,
            threshold: value,
          })
          // console.log(value)

          this.setThreshold(value)
        } else if (distance > this.moveHeight) {
          value = 1
          let animation = this.setAnimation(0, 0)
          this.setData({
            innerAnimationData: animation ? animation.export() : null,
            threshold: 1,
          })
        }
      }
    },
    touchEnd() {
      const that = this
      if (that.p < 0.9) {
        that.settriggered(false)

        return
      }

      // 分两个阶段 回弹刷新阶段 和 回弹结束阶段
      let animation = this.setAnimation(
        -this.moveHeight + this.data.refreshConfig.height,
        200
      )

      that.setData(
        {
          innerAnimationData: animation ? animation.export() : null,
          isLoading: true,
          threshold: 1,
        },
        () => {
          that.refreshNode
            .setLoading({
              isloading: true,
            })
            .then(() => {
              that.onRefresh()
            })
        }
      )
      this.setThreshold(1)
    },
    onRefresh() {
      const that = this
      if (that.data.refreshConfig.shake) {
        wx.vibrateShort()
      }

      if (this.data.isLoading) {
        console.log('refresh')
        wx.showNavigationBarLoading()
        console.log(that.data.refreshConfig)

        if ('isAutoTriggered' in that.data.refreshConfig) {
          if (that.data.refreshConfig.isAutoTriggered) {
            that.triggerEvent('refresh')
            that.debounce(() => {
              setTimeout(() => {
                that.settriggered(false)
              }, 300)
            }, 1000)()
          } else {
            console.log(that.data.triggered)

            if (that.data.triggered) {
              that.triggerEvent('refresh')
            }
          }
        } else {
          console.log('no auto triggered')
          that.triggerEvent('refresh')
          that.debounce(() => {
            setTimeout(() => {
              that.settriggered(false)
            }, 300)
          }, 1000)()
        }
      }
    },
    onRestore() {
      const that = this
      if (that.data.isLoading) {
        console.log('restore')
        wx.hideNavigationBarLoading()
        that.triggerEvent('restore')
        // that.settriggered(false)
        that.debounce(() => {
          that.setThreshold(0).then(() => {
            that.p = 0
            that.refreshNode.setLoading({
              isloading: false,
            })
            that.setData({
              isLoading: false,
              triggered: false,
              threshold: 0,
              innerAnimationData: null,
            })
          })
        }, 100)()
      }
    },
    backToTop() {
      // return
      return new Promise((resolve) => {
        let animation = this.setAnimation(-this.moveHeight, 400)

        this.setData(
          {
            innerAnimationData: animation ? animation.export() : null,
          },
          () => {
            setTimeout(() => {
              this.onRestore()
              resolve()
            }, 500)
          }
        )
      })
    },
    onLoadmore() {
      const that = this
      that.debounce(() => {
        that.triggerEvent('loadmore')
        if (that.data.refreshConfig.shake) {
          wx.vibrateShort()
        }
      }, 500)()
    },
    scroll(e) {
      const that = this
      console.log(that.backToTopNodee)
      if (!that.backToTopNode) {
        return
      }
      if (
        e.detail.scrollTop > that.backToTopNode.data.threshold &&
        this.data.isBackToTopShow == false
      ) {
        this.setData(
          {
            isBackToTopShow: true,
          },
          () => {
            if (that.backToTopNode.data.delay !== 0) {
              that.debounce(() => {
                that.setData({
                  isBackToTopShow: false,
                })
              }, that.backToTopNode.data.delay)()
            }
          }
        )
      } else if (
        e.detail.scrollTop <= that.backToTopNode.data.threshold &&
        this.data.isBackToTopShow == true
      ) {
        this.setData({
          isBackToTopShow: false,
        })
      }
    },
  },
})
