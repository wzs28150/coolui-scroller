Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  externalClasses: ['refresh-class'],
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked(target) {},
    },
    '../parallax/index': {
      type: 'child',
      linked(target) {
        // console.log(target);
      },
    },
  },
  properties: {
    type: {
      type: String,
      value: 'default',
    },
    threshold: {
      type: Number,
      value: 0,
    },
    isloading: {
      type: Boolean,
      value: false,
    },
    refreshstate: {
      type: String,
      value: 'pulldown', // pulldown loosen loading
    },
    config: {
      type: Object,
      value: {
        shake: false,
        height: 50,
        isAutoTriggered: true,
        text: {
          color: '#000000', // 文字颜色
          shadow: 0, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
        },
      },
    },
  },
  data: {
    triggered: false,
    textWidth: null,
    scrollOption: {},
  },
  ready() {
    this.parallaxNodes = this.getRelationNodes('../parallax/index')
    let that = this
    wx.createSelectorQuery()
      .in(this)
      .select('.has-bg')
      .boundingClientRect()
      .exec(function (res) {
        if (res.length > 0 && res[0]) {
          that.setData({
            textWidth: res[0].width,
          })
        }
      })
  },
  methods: {
    changeThreshold({ threshold }) {
      const that = this
      return new Promise((resolve) => {
        let refreshstate = 'pulldown'
        if (that.data.triggered && !that.data.isloading) {
          refreshstate = 'loosen'
        }
        that.setData(
          {
            threshold: threshold,
            refreshstate: refreshstate,
          },
          () => {
            resolve()
            if (that.parallaxNodes.length > 0) {
              that.parallaxNodes.forEach((elem, index) => {
                elem.setData({
                  threshold: threshold,
                })
              })
            }
          }
        )
      })
    },
    setLoading({ isloading }) {
      const that = this
      return new Promise((resolve) => {
        that.setData(
          {
            isloading: isloading,
            refreshstate: isloading ? 'loading' : 'pulldown',
          },
          () => {
            resolve()
          }
        )
      })
    },
  },
})
