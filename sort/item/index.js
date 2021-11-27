// components/coolui-scroller-nav/item/index.js
Component({
  relations: {
    '../index/index': {
      type: 'parent',
      linked: function (target) {
        // console.log(target);
      },
    }
  },
  properties: {
    title: {
      type: String
    },
    value: {
      type: String
    },
    options: {
      type: Array
    },
    color: {
      type: String
    },
    activeColor: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isDropdownShow: false,
    overlayDuration: 0,
    dropAnimation: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle() {
      var nodes = this.getRelationNodes('../index/index')
      this.setData({
        overlayDuration: nodes[0].data.overlayDuration
      })
      // console.log(this.data.value);
      nodes[0].toggle(this.data.value)
    },
    toggleDropdown(active) {
      const that = this
      if (active === this.data.value) {
        if (this.data.isDropdownShow === false) {
          this.setData({
            isDropdownShow: true,
          })
        } else {
          this.setData({
            isDropdownShow: false,
          })
        }
      } else {
        this.setData({
          isDropdownShow: false,
        })
      }
    }

  },
  ready() {
    console.log(this.data.activeColor);
  }
})