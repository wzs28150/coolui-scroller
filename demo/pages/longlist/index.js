// 获取应用实例
const utils = require('coolui-scroller/index.js')

Page({
  data: {
    isEmpty: false,
    list: [],
    defaultSetting: {
      shake: true,
      style: "black", // 设置圆点深色还是浅色
    },
    loadMoreSetting: {
      status: 'more',
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
    },
    emptySetting: {
      img: '/img/empty.png',
      // img: 'http://www.365editor.com/images/nodata.png',
      text: '暂无文章'
    },
  },

  onLoad() {
    // 设置缓存全部数据
    this.wholeList = []
    // 设置当前渲染第几页
    this.currentRenderIndex = 0
    // 设置缓存每一页页面高度
    this.pageHeightArr = []
    // 设置总页数
    this.totalPageNum = 0
    // 设置分页
    this.param = {
      limit: 4,
      page: 0
    }

    this.getList()
  },
  getList() {
    const than = this
    const loadMoreSetting = than.data.loadMoreSetting
    // 判断当前是否为加载状态 防止页面重复添加数据
    if (loadMoreSetting.status !== 'loading') {
      loadMoreSetting.status = 'loading'
      than.setData({
        loadMoreSetting
      })
      const page = this.param.page
      this.currentRenderIndex = page
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        const loadMoreSetting = than.data.loadMoreSetting
        loadMoreSetting.status = 'noMore'
        than.setData({
          loadMoreSetting
        })
      } else {
        //  获取远程数据可换成自己封装的请求方法
        wx.request({
          url: 'https://api.wzs.pub/mock/21/list',
          data: {
            page: page + 1,
            isempty: 0, // 设置为1可测试空数据
            limit: 10,
            pagenum: 10,
            islong: 1
          },
          method: 'get',
          success(res) {
            if (res.data.code === 200) {
              // than.scroller.getData(res.data.data.list)
              // console.log(res.data.data.last)
              // console.log(page)
              than.totalPageNum = res.data.data.last
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting = than.data.loadMoreSetting
                loadMoreSetting.status = 'noMore'
                than.setData({
                  isEmpty: true,
                  loadMoreSetting
                })
              } else {
                than.wholeList[page] = res.data.data.list
                const datas = {}
                datas['list[' + page + ']'] = res.data.data.list
                than.setData(datas, () => {
                  utils.setHeight(than)
                  const loadMoreSetting = than.data.loadMoreSetting
                  loadMoreSetting.status = 'more'
                  than.setData({
                    loadMoreSetting
                  })
                  than.param.page += 1
                })
              }
            }
          }
        })
      }
    }
  },
  refresh() {
    // 初始化缓存数据
    const that = this
    this.wholeList = []
    this.currentRenderIndex = 0
    this.pageHeightArr = []
    this.param = {
      limit: 4,
      page: 0
    }
    that.setData({
      list: [],
    })
    // 重新拉取数据
    that.getList()
  },
  onShareAppMessage: function () {}
})