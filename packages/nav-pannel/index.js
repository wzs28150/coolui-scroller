// miniprogram_npm/coolui-scroller/nav-pannel/index.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  relations: {
    '../scroller/index': {
      type: 'child',
      linked: function (target) {
        // console.log(target)
      },
    },
  },
  properties: {
    active: {
      type: Number,
      value: 0,
    },
    animation: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: 'side',
    },
  },
  observers: {
    active: function (val) {
      // console.log(val)
      // this.scrollNodes =
      //   this.scrollNodes ?? this.getRelationNodes('../scroller/index')
      // if (this.scrollNodes[val]) {
      //   console.log(this.scrollNodes[val])
      // }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    width: 0,
    height: 0,
    scrollerLength: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let that = this
      wx.createSelectorQuery()
        .in(this)
        .select('.wx-coolui-nav-pannel')
        .boundingClientRect()
        .exec(function (res) {
          console.log(res)
          if (res.length > 0 && res[0]) {
            that.setData({
              width: res[0].width,
              height: res[0].height,
            })
          }
        })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  ready() {
    this.init()
  },
  methods: {
    init() {
      let that = this
      this.scrollNodes = this.getRelationNodes('../scroller/index')
      console.log(this.scrollNodes)
      that.setData({
        scrollerLength: that.scrollNodes.length,
      })
    },
  },
})
