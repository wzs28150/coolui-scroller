Page({
  data: {
    isEmpty: false,
    list: [],
    refreshSetting: {
      type: 'default',
      style: 'black',
      background: {
        color: '#f2f2f2',
      },
      isBackBtn: true,
      shake: false,
    },
    loadMoreSetting: {
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
      text: '暂无文章',
    },
  },
  onLoad: function (options) {
    // 设置总页数
    this.totalPageNum = 0
    // 设置分页
    this.param = {
      limit: 4,
      page: 0,
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
        loadMoreSetting,
      })
      const page = this.param.page
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        const loadMoreSetting = than.data.loadMoreSetting
        loadMoreSetting.status = 'noMore'
        than.setData({
          loadMoreSetting,
        })
      } else {
        //  获取远程数据可换成自己封装的请求方法
        wx.request({
          url: 'https://api.wzs.pub/mock/21/list',
          data: {
            page: page + 1,
            limit: 5,
            isempty: 0, // 设置为1可测试空数据
            pagenum: 10,
          },
          method: 'get',
          success(res) {
            if (res.data.code === 200) {
              than.totalPageNum = res.data.data.last
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting = than.data.loadMoreSetting
                loadMoreSetting.status = 'noMore'
                than.setData({
                  isEmpty: true,
                  loadMoreSetting,
                })
              } else {
                let datas = than.data.list
                datas = datas.concat(res.data.data.list)
                setTimeout(() => {
                  than.setData(
                    {
                      list: datas,
                    },
                    () => {
                      const loadMoreSetting = than.data.loadMoreSetting
                      loadMoreSetting.status = 'more'
                      than.setData({
                        loadMoreSetting,
                      })
                      than.param.page += 1
                    }
                  )
                }, 500)
              }
            }
          },
        })
      }
    }
  },
  onShareAppMessage: function () {},
})
