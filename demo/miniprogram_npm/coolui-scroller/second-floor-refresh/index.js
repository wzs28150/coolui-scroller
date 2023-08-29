// pages/second-floor/circle/index.js
Component({
  externalClasses: ['second-floor-refresh-class', 'second-floor-refresh-back'],
  relations: {
    '../second-floor/index': {
      type: 'parent',
      linked(target) {
        this.setData({
          target,
        })
      },
    },
  },
  properties: {
    refreshConfig: {
      type: Object,
      value: {
        loadingText: '正在加载',
        backText: '返回首页',
        downText: '下拉刷新',
        tipText: '松开刷新,继续下拉有惊喜~',
        moreText: '继续下拉有惊喜~',
        color: '#ffffff',
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '',
    isLoading: false,
    isFloorShow: false,
    p: 0,
    scroll_height: 0,
    target: null,
    status: 'down',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setText(p) {
      if (p > 0 && p <= this.data.scroll_height / 6) {
        if (this.data.text !== this.data.refreshConfig.downText) {
          this.setData({
            text: this.data.refreshConfig.downText,
            status: 'down',
          })
        }
      } else if (
        p > this.data.scroll_height / 6 &&
        p <= this.data.scroll_height / 3
      ) {
        if (this.data.text !== this.data.refreshConfig.tipText) {
          this.setData({
            text: this.data.refreshConfig.tipText,
            status: 'tip',
          })
        }
      } else {
        if (this.data.text !== this.data.refreshConfig.moreText) {
          this.setData({
            text: this.data.refreshConfig.moreText,
            status: 'more',
          })
        }
      }
      this.setData({
        p,
      })
    },
    setLoading(flag) {
      this.setData({
        isLoading: flag,
        status: 'loading',
        text: this.data.refreshConfig.loadingText,
      })
    },
    setShow(flag) {
      const text = flag ? this.data.refreshConfig.backText : ''
      this.setData({
        isFloorShow: flag,
        text,
        status: 'back',
      })
    },
    back() {
      if (this.data.isFloorShow) {
        this.data.target.back()
      }
    },
  },
  ready() {
    const defaultConfig = {
      loadingText: '正在加载',
      backText: '返回首页',
      downText: '下拉刷新',
      tipText: '松开刷新,继续下拉有惊喜~',
      moreText: '继续下拉有惊喜~',
      color: '#ffffff',
    }
    this.setData({
      refreshConfig: { ...defaultConfig, ...this.data.refreshConfig },
    })
  },
})
