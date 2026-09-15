Page({
  data: {
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
      }
    },
    loadMoreSetting1: {
      status: 'loading',
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
      }
    },
    loadMoreSetting2: {
      status: 'noMore',
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
      }
    },
    refreshSetting: {
      type: 'default',
      style: 'black',
      background: {
        color: "#f2f2f2"
      },
      isBackBtn: true,
      shake: false
    },
    loadMoreSetting3: {
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
    list: [],
  },
  onLoad: function (options) {
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
    const loadMoreSetting3 = than.data.loadMoreSetting3
    // 判断当前是否为加载状态 防止页面重复添加数据
    if (loadMoreSetting3.status !== 'loading') {
      loadMoreSetting3.status = 'loading'
      than.setData({
        loadMoreSetting3
      })
      const page = this.param.page
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        const loadMoreSetting3 = than.data.loadMoreSetting3
        loadMoreSetting3.status = 'noMore'
        than.setData({
          loadMoreSetting3
        })
      } else {
        //  获取远程数据可换成自己封装的请求方法
        wx.request({
          url: 'https://api.wzs.pub/mock/21/list',
          data: {
            page: page + 1,
            isempty: 0, // 设置为1可测试空数据
            limit: 5,
            pagenum: 10,
          },
          method: 'get',
          success(res) {
            if (res.data.code === 200) {
              than.totalPageNum = res.data.data.last
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting3 = than.data.loadMoreSetting3
                loadMoreSetting3.status = 'noMore'
                than.setData({
                  isEmpty: true,
                  loadMoreSetting3
                })
              } else {
                let datas = than.data.list;
                datas = datas.concat(res.data.data.list)
                setTimeout(() => {
                  than.setData({
                    list: datas
                  }, () => {
                    const loadMoreSetting3 = than.data.loadMoreSetting3
                    loadMoreSetting3.status = 'more'
                    than.setData({
                      loadMoreSetting3
                    })
                    than.param.page += 1
                  })
                }, 500)
              }
            }
          }
        })
      }
    }
  },
  onShareAppMessage: function () {}
})