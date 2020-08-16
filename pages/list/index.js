var listData = new Array();
for (var i = 0; i < 10000; i++) {
  listData.push(i);
}
let that
const createRecycleContext = require('miniprogram-recycle-view')
Page({
  data: {
    scroll: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
    },
    list: [],
    listShow: [],
    topOffset: 0,
    bottomOffset: 0,
    itemHeight: 0,
    topHeight: 0,
    num: 0,
    listPrevd: [],
    listNext: []
  },
  onShow: function () {
    that = this
    this.getData('refresh', 1)
  },
  getData: function (type, page) {
    let that = this
    let list = that.data.list;
    let scroll = that.data.scroll
    scroll.page = page
    setTimeout(() => {
      that.setData({
        list: listData,
        listPrevd: listData.slice(0, 0 + 0),
        listShow: listData.slice(0 + 0, 20),
        listNext: listData.slice(20, listData.length),
        scroll: scroll
      });
      const query = wx.createSelectorQuery()
      query.selectAll('.item').boundingClientRect()
      query.exec(function (res) {
        console.log(res)
        res[0].top // #the-id节点的上边界坐标
        that.setData({
          itemHeight: res[0].height
        })
      })
      // that.recycle()

    }, 300);
  },
  refresh: function () {
    this.getData('refresh', 1)
  },
  loadMore: function () {
    // this.getData('loadMore', this.data.scroll.page + 1)

  },
  recycle: function () {
    // console.log(1)
    let list = that.data.list
    let listShow = list.slice(0 + that.data.num, 20 + that.data.num)
    let listPrevd = list.slice(0, 0 + that.data.num)
    let listNext = list.slice(20 + that.data.num, list.length)
    console.log(that.data.num * that.data.itemHeight + (that.data.num - 1) * 0.9)
    if (that.data.num >= 0) {
      that.setData({
        listShow: listShow,
        listPrevd: listPrevd,
        listNext: listNext,
        // topHeight: (that.data.num * that.data.itemHeight + (that.data.num - 1) * 0.9) * 2
      })
    }

    // setTimeout(() => {
    //   that.setData({
    //     listShow: listShow,
    //     // topHeight: that.data.num * that.data.itemHeight

    //   })

    // }, 300)
  },
  scroll: function (e) {
    if (e) {

      // console.log(parseInt(e.detail.scrollTop / that.data.itemHeight))
      console.log(e.detail.scrollTop)
      let i = parseInt(e.detail.scrollTop / that.data.itemHeight)
      // console.log(i)
      // that.setData({
      //   num: i
      // })
      // that.recycle()


      // let list = that.data.list
      // list.slice(0, i)
      // console.log(list.slice(i + 1, 20))
      // that.setData({
      //   listShow: list.slice(i + 1, list.length),
      //   // topHeight: i * that.data.itemHeight * 2
      // })
      return false
    }

  },
  onReady: function () {
    const query = wx.createSelectorQuery()
    query.select('#scroll-demo1').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      res[0].top // #the-id节点的上边界坐标
      that.setData({
        topOffset: res[0].top,
        bottomOffset: res[0].bottom,
      })
    })
  },
  moveToLeft: function () {},
  moveToRight: function () {},
  moveToTop: function () {
    console.log('上划')
    this.setData({
      num: this.data.num + 1
    })
    that.recycle()
  },
  moveToBottom: function () {
    console.log('下划')
    this.setData({
      num: this.data.num - 1
    })
    that.recycle()
  }
})