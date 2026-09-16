// 获取应用实例
const utils = require('coolui-scroller/index.js')

Page({
  data: {
    isEmpty: false,
    list: [],
    // 窗口化长列表：只渲染 visiblePages 这些页，其余高度由上下两个占位块撑起
    visiblePages: [],
    topHeight: 0,
    bottomHeight: 0,
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
    // 设置总页数
    this.totalPageNum = 0
    // 设置分页
    this.param = {
      limit: 4,
      page: 0
    }
    // 每页真实高度缓存（下标 = 页码）
    this.pageHeights = []
    // 当前滚动距离与可视区高度
    this.scrollTop = 0
    this.windowHeight = (wx.getWindowInfo && wx.getWindowInfo().windowHeight) || 0

    this.getList()
  },

  /** 滚动时重算渲染窗口 */
  onScroll(e) {
    this.scrollTop = (e.detail && e.detail.scrollTop) || 0
    this.updateWindow()
  },

  /** 计算窗口：只渲染窗口内的页，窗口外折叠成上下两个占位块 */
  updateWindow() {
    const count = this.data.list.length
    const heights = this.pageHeights || []

    // 未测量页的估算高度：用已测量页的平均值（都没有时按 300px 兜底）
    let sum = 0
    let num = 0
    for (let i = 0; i < heights.length; i++) {
      if (heights[i] > 0) {
        sum += heights[i]
        num += 1
      }
    }
    const estimate = num > 0 ? sum / num : 300

    const state = utils.computeLonglistWindow({
      heights: heights,
      count: count,
      scrollTop: this.scrollTop || 0,
      viewportHeight: this.windowHeight || 0,
      overscan: 1,
      estimate: estimate,
    })

    const visiblePages = []
    for (let i = state.start; i <= state.end; i++) {
      visiblePages.push(i)
    }

    this.setData({
      visiblePages: visiblePages,
      topHeight: state.topHeight,
      bottomHeight: state.bottomHeight,
    }, () => {
      this.measureVisible(visiblePages)
    })
  },

  /** 测量窗口内各页真实高度并回填缓存 */
  measureVisible(indexes) {
    if (!indexes || !indexes.length) {
      return
    }
    const query = wx.createSelectorQuery().in(this)
    indexes.forEach((pageIndex) => {
      query.select('#wrp_' + pageIndex).boundingClientRect()
    })
    query.exec((res) => {
      let changed = false
      indexes.forEach((pageIndex, idx) => {
        const rect = res && res[idx]
        const h = rect && rect.height
        if (h && Math.abs((this.pageHeights[pageIndex] || 0) - h) > 0.5) {
          this.pageHeights[pageIndex] = h
          changed = true
        }
      })
      // 高度变化会改变窗口位置，需要再算一次（测量稳定后自然收敛）
      if (changed) {
        this.updateWindow()
      }
    })
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
              than.totalPageNum = res.data.data.last
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting = than.data.loadMoreSetting
                loadMoreSetting.status = 'noMore'
                than.setData({
                  isEmpty: true,
                  loadMoreSetting
                })
              } else {
                // 追加一页数据即可：页高测量与渲染窗口由 updateWindow 内部处理
                const datas = {}
                datas['list[' + page + ']'] = res.data.data.list
                than.setData(datas, () => {
                  than.updateWindow()
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
    this.pageHeights = []
    this.scrollTop = 0
    this.param = {
      limit: 4,
      page: 0
    }
    that.setData({
      list: [],
      visiblePages: [],
      topHeight: 0,
      bottomHeight: 0,
    })
    // 重新拉取数据
    that.getList()
  },
  onShareAppMessage: function () {}
})
