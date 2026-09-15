// index/components/component/index.js
Component({
  properties: {
    pageCur: {
      type: Number,
      value: 0,
    },
  },
  data: {
    list: [
      {
        title: '滚动列表组件',
        path: '/pages/list/index',
      },
      {
        title: '加载更多组件',
        path: '/pages/loadmore/index',
      },
      {
        title: '下拉刷新组件',
        path: '/pages/refresh/index',
      },
      {
        title: '手势提示组件',
        path: '/pages/hand/index',
      },
      {
        title: '空列表组件',
        path: '/pages/empty/index',
      },
      {
        title: '长列表组件',
        path: '/pages/longlist/index',
      },
      {
        title: '搜索组件',
        path: '/pages/search/index',
      },
      {
        title: '分类导航组件',
        path: '/pages/nav/index',
      },
      {
        title: '切换组件',
        path: '/pages/nav-pannel/index',
      },
      {
        title: '筛选及排序组件',
        path: '/pages/sort/index',
      },
      {
        title: '下拉二楼',
        path: '/pages/second-floor/index',
      },
      {
        title: '组合使用',
        path: '/pages/combined/index',
      },
    ],
  },
  methods: {},
})
