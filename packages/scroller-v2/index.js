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
    triggered: false,
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
  },
  ready() {
    this.setWapHeight()
    this.refreshNodes = this.getRelationNodes('../refresh/index')
    this.refreshNode = this.refreshNodes[0] ? this.refreshNodes[0] : null
    console.log(this.refreshNode)

    this.backToTopNodes = this.getRelationNodes('../backToTop/index')

    this.backToTopNode = this.backToTopNodes[0] ? this.backToTopNodes[0] : null
    const animationInner = this.setAnimation(-this.data.refreshConfig.height, 0)
    this.setData({
      innerAnimationData: animationInner ? animationInner.export() : {},
    })
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
    touchStart(e) {
      // 正在刷新时不操作触摸
      if (this.data.isLoading) {
        return false
      }
      this.setData({
        touchy: e.changedTouches[0].clientY,
      })
    },
    touchMove(e) {
      // 正在刷新时不进行操作, 二楼已加载是不进行操作
      if (!this.data.isLoading) {
        const distance = Math.round(
          e.changedTouches[0].clientY - this.data.touchy
        )
        let value = 0
        const slowdownFactor = 0.2

        // 根据拖拽距离（纵向）和系数计算数值，使其增长得更慢
        // 使用Math.max确保值不会小于0，Math.min确保值不会超过1
        value = Math.min(
          1.1,
          Math.max(0, 1 - 1 / (Math.abs(distance * slowdownFactor) + 1))
        )
        if (distance < 0) {
          value = 0 // 如果向上拖拽，数值保持为0
        }
        // console.log(value)
        let scrollTop = -this.data.refreshConfig.height
        if (distance > 0) {
          // -height +  (height + offset) * (0~1) = 100
          scrollTop = -this.data.refreshConfig.height + distance * value

          let animation = this.setAnimation(scrollTop, 0)
          // console.log(animationInner);
          this.setData({
            innerAnimationData: animation ? animation.export() : null,
            threshold: value,
          })
          // console.log(this.refreshNode)

          this.setThreshold(value)
        }
      }
    },
    touchEnd() {
      let animation = this.setAnimation(-this.data.refreshConfig.height, 0)
      this.setData({
        innerAnimationData: animation ? animation.export() : null,
        threshold: 0,
      })
      this.setThreshold(0)
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
  },
})
