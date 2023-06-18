Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  externalClasses: ['parallax-class'],
  relations: {
    '../refresh/index': {
      type: 'parent',
      linked(target) {
        this.setData({
          ...target.data
        })
      }
    }
  },
  properties: {
    parallax: {
      type: Number,
      value: 0
    },
    direction: {
      type: String,
      value: 'to bottom'
    }
  },
  data: {
    threshold: 0,
    triggered: true,
    config: {}
  }
})