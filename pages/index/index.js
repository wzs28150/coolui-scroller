/*
 * @Title: 
 * @Descripttion: 
 * @version: 
 * @Author: wzs
 * @Date: 2020-05-01 16:13:05
 * @LastEditors: wzs
 * @LastEditTime: 2020-05-02 14:08:30
 */
let listData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Page({

  data: {
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
    list: [],
    diyList: [],
    tmList: [],
    jdList: []
  },

  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getData('refresh', 1)
    this.getDiyData('refresh', 1)
    this.getTmData('refresh', 1)
    this.getJdData('refresh', 1)
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
        }
      }, 1000);
    }
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
        console.log(that.data.scrollJd.page , that.data.scrollJd.totalPage)
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
})
