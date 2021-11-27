Component({
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked() {}
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    activeColor: {
      type: String,
      value: '#d13435'
    },
    active: {
      type: Number,
      value: 0,
      observer: function (newVal) {
        this.setData({
          toView: 'item' + (newVal - 1)
        })
        // console.log(this);
        this._change(newVal)
      }
    }
  },
  data: {
    toView: 'item0',
    navWidth: 0,
    scroll: false,
    index: 0
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let that = this
      wx.createSelectorQuery().in(this).select('.wx-coolui-nav').boundingClientRect().exec(function (res) {
        that.setData({
          navWidth: res[0].width
        })
      })
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    _changeNav(e) {
      this.setData({
        active: e.currentTarget.dataset.index
      })
    },
    _change(index) {
      this.triggerEvent('change', {
        id: this.data.list[index].id
      })
    },
    _catchTouchMove() {
      return false;
    }
  }
})