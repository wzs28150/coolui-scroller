// 获取应用实例
const utils = require("coolui-scroller/index.js");

Page({
  data: {
    isEmpty: false,
    list: [],
    baseConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        color: "#fff", // 文字颜色
        shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
      },
      background: {
        color: "#000000",
        height: 120,
        img: "https://test.wzs.pub/pic/bg.jpg",
      },
    },
    loadMoreSetting: {
      status: "more",
      more: {
        text: '上拉加载更多',
        color: '#999',
      },
      loading: {
        text: '加载中...',
        color: '#999',
      },
      noMore: {
        text: '-- 到底啦 --',
        color: '#999',
      },
      color: "#999",
    },
    emptySetting: {
      img: "/img/empty.png",
      // img: 'http://www.365editor.com/images/nodata.png',
      text: "暂无文章",
    },
    nav: [
      {
        id: 1,
        title: "分类1",
      },
      {
        id: 2,
        title: "分类2",
      },
      {
        id: 3,
        title: "分类3",
      },
      {
        id: 4,
        title: "分类4",
      },
      {
        id: 5,
        title: "分类5",
      },
      {
        id: 6,
        title: "分类6",
      },
      {
        id: 7,
        title: "分类7",
      },
    ],
    active: 0,
    key: "",
  },

  onLoad() {
    // 设置缓存全部数据
    this.wholeList = [];
    // 设置当前渲染第几页
    this.currentRenderIndex = 0;
    // 设置缓存每一页页面高度
    this.pageHeightArr = [];
    // 设置总页数
    this.totalPageNum = 0;
    // 设置分页
    this.param = {
      limit: 4,
      page: 0,
    };

    this.getList();
  },
  getList() {
    const than = this;
    const loadMoreSetting = than.data.loadMoreSetting;
    // 判断当前是否为加载状态 防止页面重复添加数据
    if (loadMoreSetting.status !== "loading") {
      loadMoreSetting.status = "loading";
      than.setData({
        loadMoreSetting,
      });
      const page = this.param.page;
      this.currentRenderIndex = page;
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        const loadMoreSetting = than.data.loadMoreSetting;
        loadMoreSetting.status = "noMore";
        than.setData({
          loadMoreSetting,
        });
      } else {
        //  获取远程数据可换成自己封装的请求方法
        wx.request({
          url: "https://api.wzs.pub/mock/21/list",
          data: {
            page: page + 1,
            limit: 5,
            isempty: 0, // 设置为1可测试空数据
            pagenum: 10,
          },
          method: "get",
          success(res) {
            if (res.data.code === 200) {
              // than.scroller.getData(res.data.data.list)
              // console.log(res.data.data.last)
              // console.log(page)
              than.totalPageNum = res.data.data.last;
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting = than.data.loadMoreSetting;
                loadMoreSetting.status = "noMore";
                than.setData({
                  isEmpty: true,
                  loadMoreSetting,
                });
              } else {
                than.wholeList[page] = res.data.data.list;
                const datas = {};
                datas["list[" + page + "]"] = res.data.data.list;
                setTimeout(() => {
                  than.setData(datas, () => {
                    utils.setHeight(than);
                    const loadMoreSetting = than.data.loadMoreSetting;
                    loadMoreSetting.status = "more";
                    than.setData({
                      loadMoreSetting,
                    });
                    than.param.page += 1;
                  });
                }, 500);
              }
            }
          },
        });
      }
    }
  },
  refresh() {
    // 初始化缓存数据
    const that = this;
    this.wholeList = [];
    this.currentRenderIndex = 0;
    this.pageHeightArr = [];
    this.param = {
      limit: 4,
      page: 0,
    };
    that.setData({
      list: [],
    });
    // 重新拉取数据
    that.getList();
  },
  onBtnClick({ detail }) {
    this.refresh();
  },
  confirm({ detail }) {
    this.refresh();
  },
  onChange: function (e) {
    this.refresh();
  },
  TouchStart(e) {
    let that = this;
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY,
    });
  },
  TouchEnd(e) {
    // console.log(e)
    let that = this;
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let turn = "";
    if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
      //右滑
      // console.log(r);
      turn = "right";
    } else if (
      x - that.data.touchx < -50 &&
      Math.abs(y - that.data.touchy) < 50
    ) {
      //左滑
      // console.log(l);
      turn = "left";
    }
    //根据方向进行操作
    if (turn == "right") {
      //从左往右
      if (that.data.active != 0) {
        that.setData({
          active: that.data.active - 1,
        });
      }
    }
    if (turn == "left") {
      //从右往左
      if (that.data.active < that.data.nav.length - 1) {
        that.setData({
          active: that.data.active + 1,
        });
      }
    }
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
});
