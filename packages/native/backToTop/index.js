Component({
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked(target) {
        this.parent = target
      },
    },
  },
  properties: {
    delay: {
      type: Number,
      value: 3000,
    },
    threshold: {
      type: Number,
      value: 100,
    },
  },
  externalClasses: ['my-class'],
  methods: {
    backToTop() {
      // this.triggerEvent("refresh");
      this.parent.setData({
        top: 0,
      })
    },
  },
})
