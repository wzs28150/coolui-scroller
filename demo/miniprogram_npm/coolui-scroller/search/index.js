Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  relations: {
    './coolui-scroller': {
      type: 'parent',
      linked() {}
    }
  },
  externalClasses: ['search-btn'],
  properties: {
    placeholder: {
      type: String,
      value: "请输入要搜索的内容"
    },
    button: {
      type: Object,
      value: {
        show: false,
        text: "搜索"
      }
    },
    round: {
      type: Boolean,
      value: false
    },
    clearable: {
      type: Boolean,
      value: false
    },
    key: String
  },
  data: {
    // height: 100
    isBtnShow: false,
    btnWidth: 0,
    isFocus: false,
  },
  pageLifetimes: {
    show: function () {
      let that = this
      wx.createSelectorQuery().in(this).select('.button').boundingClientRect().exec(function (res) {
        that.setData({
          btnWidth: res[0].width
        })
      })
    }
  },
  methods: {
    heightChange() {},
    focus() {
      this.setData({
        isBtnShow: true
      })
    },
    blur() {
      if (this.data.key.length == 0) {
        this.setData({
          isBtnShow: false,
          isFocus: false
        })
      }
    },
    input({
      detail
    }) {
      this.setData({
        key: detail.value
      })
    },
    btnClick() {
      if (this.data.key) {
        this.triggerEvent('btnClick', {
          key: this.data.key
        })
      }
    },
    clear() {
      this.setData({
        key: '',
        isFocus: true
      })
    },
    confirm() {
      if (this.data.key) {
        this.triggerEvent('confirm', {
          key: this.data.key
        })
      }
    }
  }
})