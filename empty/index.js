Component({
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked() {}
    }
  },
  externalClasses: ['img-class', 'text-class'],
  properties: {
    emptyImg: {
      type: String,
      value: ''
    },
    emptyText: {
      type: String,
      value: '暂无内容'
    }
  }
})