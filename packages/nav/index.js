Component({
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked() {},
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    border: {
      type: Boolean,
      value: true,
    },
    text: {
      type: Object,
      value: {
        color: '#333333',
        activeColor: '#d13435',
      },
    },
    background: {
      type: Object,
      value: {
        color: '#333333',
        activeColor: '#d13435',
      },
    },
    navPerView: {
      type: [Number, String],
      value: 4.5,
      observer: function (newVal) {
        this._changeNavPerView(newVal)
      },
    },
    spaceBetween: {
      type: Number,
      value: 0,
    },
    type: {
      type: String,
      value: 'line', //可选 line,round，plain
    },
    active: {
      type: Number,
      value: 0,
      observer: function (newVal) {
        this.setData({
          toView: 'item' + (newVal - 1),
        })
        // console.log(this);
        this._change(newVal)
      },
    },
  },
  data: {
    toView: 'item0',
    navWidth: 0,
    scroll: false,
    index: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let that = this
      that._changeNavPerView(that.data.navPerView)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    _changeNav(e) {
      this.setData({
        active: e.currentTarget.dataset.index,
      })
    },
    _change(index) {
      this.triggerEvent('change', {
        id: this.data.list[index].id,
      })
    },
    _catchTouchMove() {
      return false
    },
    _changeNavPerView(navPerView) {
      let that = this
      wx.createSelectorQuery()
        .in(this)
        .select('.wx-coolui-nav')
        .boundingClientRect()
        .exec(function (res) {
          // console.log(res)
          if (res.length > 0 && res[0]) {
            // console.log(that.data.navPerView)
            that.setData({
              navWidth:
                navPerView === 'auto'
                  ? 'auto'
                  : res[0].width / navPerView - that.data.spaceBetween + 'px',
            })
          }
        })
    },
  },
})
