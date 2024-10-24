Page({
  data: {
    val: 0,
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点申诉还是浅色
      background: {
        color: '#eeeeee',
      },
    },
    baseConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        color: '#fff', // 文字颜色
        shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
      },
      background: {
        color: '#000000',
        height: 120,
        img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
    logoConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        content: 'coolui-scroller',
        font: 'Lobster variant0',
        size: '50',
        color: '#ccc', // 文字颜色
        shadow: 0, // 设置0
        img: 'https://test.wzs.pub/pic/bg2.jpg',
      },
      background: {
        color: '#f2f2f2',
        height: 120,
        // img: 'https://test.wzs.pub/pic/bg.jpg',
      },
    },
    gifSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
        img: 'https://test.wzs.pub/pic/tm_mui_bike.gif',
      },
    },
    parallaxSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#eeeeee',
      },
    },
    parallaxDemoSetting: {
      shake: true, // 是否开启下拉震动
      height: 70,
      background: {
        color: '#ffaf1b',
      },
    },
    jdSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      background: {
        color: '#eeeeee',
      },
    },
    elmSetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      isAutoTriggered: false,
      background: {
        color: '#eeeeee',
      },
    },
    refreshstate: 'pulldown',
    isLoading: false,
    triggered: false,
    nav: [
      {
        id: 1,
        title: '原生效果',
        description: '不使用组件',
      },
      {
        id: 2,
        title: '基础效果',
        description: '使用组件',
      },
      {
        id: 3,
        title: 'logo文字效果',
        description: '使用组件',
      },
      {
        id: 4,
        title: 'gif背景效果',
        description: '隐藏文字将背景设为动图',
      },
      {
        id: 5,
        title: '视差效果1',
        description: '搭配视差子组件实现',
      },
      {
        id: 6,
        title: '视差效果2',
        description: '搭配视差子组件实现',
      },
      {
        id: 7,
        title: '视差效果3',
        description: '搭配视差子组件实现',
      },
      {
        id: 8,
        title: '京东效果',
      },
      {
        id: 9,
        title: '饿了么效果',
      },
    ],
    titleList: [],
    text: { color: '#666', activeColor: '#fff' },
    background: { color: '#ccc', activeColor: '#d13435' },
    active: 0, // 当前选中的Index值
  },
  onLoad: function () {},
  onRefresh: function () {
    wx.showToast({
      title: '执行页面刷新数据',
      icon: 'success',
    })
  },
  diyRefresh() {
    const that = this
    const scroll = this.selectComponent('.elm-scroller')
    setTimeout(() => {
      scroll.settriggered(false).then(() => {
        wx.showToast({
          title: '执行回弹成功',
          icon: 'success',
        })
      })
    }, 2000) // 自定义回弹时间
  },
  onShareAppMessage: function () {},
})
