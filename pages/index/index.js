/*
 * @Title: 
 * @Descripttion: 
 * @version: 
 * @Author: wzs
 * @Date: 2020-05-01 16:13:05
 * @LastEditors: wzs
 * @LastEditTime: 2020-05-02 14:08:30
 */
let listData = [{
  id: 1,
  status: false
}, {
  id: 2,
  status: false
}, {
  id: 3,
  status: false
}, {
  id: 4,
  status: false
}, {
  id: 5,
  status: false
}, {
  id: 6,
  status: false
}, {
  id: 7,
  status: false
}, {
  id: 8,
  status: false
}, {
  id: 9,
  status: false
}, {
  id: 10,
  status: false
}]
// var wxDraw = require("../../util/wxdraw.min.js").wxDraw;
// var Shape = require("../../util/wxdraw.min.js").Shape;
// var AnimationFrame = require("../../util/wxdraw.min.js").AnimationFrame;
// var wxCanvas = null;
Page({

  data: {
    active: 0,
    limitTop: 0,
    limitBottom: 0,
    canvasShow: false,
    scroll: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
    },
    scrollDiy: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png',
      refreshBackgroundImage: 'http://coolui.coolwl.cn/assets/bg.jpg',
      refreshColor: '#000000'
    },
    scrollTm: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png',
      refreshBackgroundImage: 'http://coolui.coolwl.cn/assets/tm_mui_bike.gif'
    },
    scrollJd: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png',
      p: 0
    },
    scrollCanvas: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png',
      p: 0
    },
    scrollHuojian: {
      page: 1,
      totalPage: 10,
      emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png',
      p: 0
    },
    list: [],
    diyList: [],
    tmList: [],
    jdList: [],
    huojianList: [],
    canvasList: []
  },

  onLoad: function (options) {
    // this.loadCanvas()
  },
  onReady: function () {

  },
  change: function (e) {
    this.setData({
      active: e.detail.index
    })
  },
  onShow: function () {
    this.getData('refresh', 1)
    this.getDiyData('refresh', 1)
    this.getTmData('refresh', 1)
    this.getJdData('refresh', 1)
    this.getHuoJianData('refresh', 1)
    this.getCanvasData('refresh', 1)
  },
  getData: function (type, page) {
    let that = this
    let list = that.data.list;
    if (type == 'refresh') {
      let scroll = that.data.scroll
      scroll.page = page
      setTimeout(() => {
        that.setData({
          list: listData,
          scroll: scroll
        });
        this.scroll()
      }, 300);
    } else {
      let scroll = that.data.scroll
      scroll.page = page
      setTimeout(() => {
        if (that.data.scroll.page <= that.data.scroll.totalPage) {
          that.setData({
            list: list.concat(listData),
            scroll: scroll
          });
          // this.scroll()
        }
      }, 1000);
    }
  },
  scroll: function (e) {
    // let ev = e
    // setTimeout(() => {
    //   let that = this
    //   const query = wx.createSelectorQuery()
    //   query.selectAll('.right-to-left').boundingClientRect()
    //   query.select('.an-demo').boundingClientRect()
    //   query.exec(function (res) {
    //     // console.log(res[0])
    //     // console.log(res[1])
    //     // res[0].top // #the-id节点的上边界坐标
    //     // that.setData({
    //     //   itemHeight: res[0].height
    //     // })
    //     let i = parseInt(e.detail.scrollTop / res[0][0].height)
    //     that.setData({
    //       limitTop: res[1].top - 10,
    //       limitBottom: res[1].bottom

    //     })
    //     let list = that.data.list
    //     console.log(i)
    //     console.log(list)

    //     // res[0].forEach((item, index) => {
    //     //   if (item.top < res[1].bottom - 50 && item.top >= (res[1].top - 10)) {
    //     //     list[index].status = true
    //     //     list[index].top = item.top
    //     //     list[index].scrollTop = ev ? ev.detail.scrollTop : 0
    //     //     list[index].bottom = item.bottom
    //     //   }
    //     // })
    //     console.log(list);

    //     that.setData({
    //       list: list
    //     })
    //   })
    // }, 300);


  },
  refresh: function () {
    this.getData('refresh', 1)
  },
  loadMore: function () {
    this.getData('loadMore', this.data.scroll.page + 1)
  },
  getDiyData: function (type, page) {
    let that = this
    let diyList = that.data.diyList;
    if (type == 'refresh') {
      let scrollDiy = that.data.scrollDiy
      scrollDiy.page = page
      setTimeout(() => {
        that.setData({
          diyList: listData,
          scrollDiy: scrollDiy
        });
      }, 300);
    } else {
      let scrollDiy = that.data.scrollDiy
      scrollDiy.page = page
      setTimeout(() => {
        if (that.data.scrollDiy.page <= that.data.scrollDiy.totalPage) {
          that.setData({
            diyList: diyList.concat(listData),
            scrollDiy: scrollDiy
          });
        }
      }, 1000);
    }
  },
  refreshDiy: function () {
    this.getDiyData('refresh', 1)
  },
  loadMoreDiy: function () {
    this.getDiyData('loadMore', this.data.scrollDiy.page + 1)
  },
  getTmData: function (type, page) {
    let that = this
    let tmList = that.data.tmList;

    if (type == 'refresh') {
      let tmListData = []
      for (let i = 0; i < 10; i++) {
        tmListData.push(i);
      }
      let scrollTm = that.data.scrollTm
      scrollTm.page = page
      setTimeout(() => {
        that.setData({
          tmList: tmListData,
          scrollTm: scrollTm
        });
      }, 300);
    } else {
      let tmListData = []
      for (let i = 0; i < 10; i++) {
        tmListData.push(i);
      }
      setTimeout(() => {
        if (that.data.scrollTm.page < that.data.scrollTm.totalPage) {
          let scrollTm = that.data.scrollTm
          scrollTm.page = page
          that.setData({
            tmList: tmList.concat(tmListData),
            scrollTm: scrollTm
          });
        } else {
          let scrollTm = that.data.scrollTm
          scrollTm.page = page
          that.setData({
            scrollTm: scrollTm
          });
        }
      }, 1000);
    }
  },
  refreshTm: function () {
    this.getTmData('refresh', 1)
  },
  loadMoreTm: function () {
    this.getTmData('loadMore', this.data.scrollTm.page + 1)
  },
  refreshPulling: function (e) {
    let scrollJd = this.data.scrollJd
    scrollJd.p = e.detail.p
    this.setData({
      scrollJd: scrollJd
    });
  },
  getJdData: function (type, page) {
    let that = this
    let jdList = that.data.jdList;

    if (type == 'refresh') {
      let scrollJd = that.data.scrollJd
      scrollJd.page = page
      scrollJd.p = 0
      setTimeout(() => {
        that.setData({
          jdList: listData,
          scrollJd: scrollJd
        });
      }, 300);
    } else {
      setTimeout(() => {
        if (that.data.scrollJd.page < that.data.scrollJd.totalPage) {
          let scrollJd = that.data.scrollJd
          scrollJd.page = page
          that.setData({
            jdList: jdList.concat(listData),
            scrollJd: scrollJd
          });
        } else {
          let scrollJd = that.data.scrollJd
          scrollJd.page = page
          that.setData({
            scrollJd: scrollJd
          });
        }
      }, 1000);
    }
  },
  refreshJd: function () {
    this.getJdData('refresh', 1)
  },
  loadMoreJd: function () {
    this.getJdData('loadMore', this.data.scrollJd.page + 1)
  },
  onPageScroll() {},
  getCanvasData: function (type, page) {
    let that = this
    let canvasList = that.data.canvasList;

    if (type == 'refresh') {
      let scrollCanvas = that.data.scrollCanvas
      scrollCanvas.page = page
      scrollCanvas.p = 0
      setTimeout(() => {
        that.setData({
          canvasList: listData,
          scrollCanvas: scrollCanvas
        });
        if (wxCanvas)
          wxCanvas.clear();

      }, 300);
    } else {
      setTimeout(() => {
        if (that.data.scrollCanvas.page < that.data.scrollCanvas.totalPage) {
          let scrollCanvas = that.data.scrollCanvas
          scrollCanvas.page = page
          that.setData({
            canvasList: canvasList.concat(listData),
            scrollCanvas: scrollCanvas
          });
        } else {
          let scrollCanvas = that.data.scrollCanvas
          scrollCanvas.page = page
          that.setData({
            scrollCanvas: scrollCanvas
          });
        }
      }, 1000);
    }
  },
  bindlongpress: function (e) {
    wxCanvas.longpressDetect(e);
  },
  // loadCanvas: function () {
  //   this.setData({
  //     canvasShow: true
  //   })
  //   var context = wx.createCanvasContext('textA')
  //   wxCanvas = new wxDraw(context, 0, 0, wx.getSystemInfoSync().windowWidth, 60);
  //   console.log(wx.getSystemInfoSync().windowWidth)
  //   let text = new Shape('text', {
  //     text: "G",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#4285f4",
  //     needShadow: true
  //   }, 'fill', false)
  //   let text2 = new Shape('text', {
  //     text: "o",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14 * 2,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#ea4335",
  //     needShadow: true
  //   }, 'fill', false)
  //   let text3 = new Shape('text', {
  //     text: "o",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14 * 3,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#fbbc05",
  //     needShadow: true
  //   }, 'fill', false)
  //   let text4 = new Shape('text', {
  //     text: "g",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14 * 4,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#4285f4",
  //     needShadow: true
  //   }, 'fill', false)
  //   let text5 = new Shape('text', {
  //     text: "l",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14 * 5,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#34a853",
  //     needShadow: true
  //   }, 'fill', false)
  //   let text6 = new Shape('text', {
  //     text: "e",
  //     x: wx.getSystemInfoSync().windowWidth * 0.14 * 6,
  //     y: 40,
  //     fontSize: 25,
  //     fillStyle: "#ea4335",
  //     needShadow: true
  //   }, 'fill', false)
  //   wxCanvas.add(text);
  //   wxCanvas.add(text2);
  //   wxCanvas.add(text3);
  //   wxCanvas.add(text4);
  //   wxCanvas.add(text5);
  //   wxCanvas.add(text6);


  //   setTimeout(function () {
  //     text.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 50);


  //   setTimeout(function () {
  //     text2.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 100);


  //   setTimeout(function () {
  //     text3.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 150);

  //   setTimeout(function () {
  //     text4.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 200);

  //   setTimeout(function () {
  //     text5.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 250);

  //   setTimeout(function () {
  //     text6.animate({
  //       "y": "-=5",
  //       shadow: {
  //         offsetY: 15,
  //         blur: 30
  //       }
  //     }, {
  //       easing: "swingTo",
  //       duration: 1000
  //     }).animate({
  //       "y": "+=5",
  //       shadow: {
  //         offsetY: 5,
  //         blur: 5
  //       }
  //     }, {
  //       easing: "swingFrom",
  //       duration: 1000
  //     }).start(true);
  //   }, 300);
  // },
  refreshCanvas: function () {

    this.getCanvasData('refresh', 1)
  },
  refreshCanvasPulling: function (e) {
    let canvasShow = this.data.canvasShow

    if (!canvasShow) {
      // this.loadCanvas()
      return false
    }

  },
  loadMoreCanvas: function () {
    this.getCanvasData('loadMore', this.data.scrollCanvas.page + 1)
  },
  onUnload: function () {

  },
  getHuoJianData: function (type, page) {
    let that = this
    let huojianList = that.data.huojianList;

    if (type == 'refresh') {
      let scrollHuojian = that.data.scrollHuojian
      scrollHuojian.page = page
      scrollHuojian.p = 0
      setTimeout(() => {
        that.setData({
          huojianList: listData,
          scrollHuojian: scrollHuojian
        });
      }, 300);
    } else {
      setTimeout(() => {
        if (that.data.scrollHuojian.page < that.data.scrollHuojian.totalPage) {
          let scrollHuojian = that.data.scrollHuojian
          scrollHuojian.page = page
          that.setData({
            huojianList: huojianList.concat(listData),
            scrollHuojian: scrollHuojian
          });
        } else {
          let scrollHuojian = that.data.scrollHuojian
          scrollHuojian.page = page
          that.setData({
            scrollHuojian: scroscrollHuojianlCanvas
          });
        }
      }, 1000);
    }
  },
  loadMoreHuojian: function () {
    this.getHuoJianData('loadMore', this.data.scrollHuojian.page + 1)
  },
  refreshHuojian: function () {
    this.getHuoJianData('refresh', 1)
  },
  refreshHuojianPulling: function (e) {
    let scrollHuojian = this.data.scrollHuojian
    scrollHuojian.p = e.detail.p
    this.setData({
      scrollHuojian: scrollHuojian
    });
  },
})