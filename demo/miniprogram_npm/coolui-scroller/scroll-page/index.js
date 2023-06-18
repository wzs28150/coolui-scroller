Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked() {}
    }
  },
  properties: {
    pageList: {
      type: Array,
      value: []
    }
  }
})
