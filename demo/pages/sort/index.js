// pages/sort/index.js
Page({
  data: {
    options: [
      {
        id: 1,
        title: "综合排序",
      },
      {
        id: 2,
        title: "距离最近",
      },
      {
        id: 3,
        title: "好评优先",
      },
      {
        id: 4,
        title: "价格由低到高",
      },
      {
        id: 5,
        title: "价格由高到低",
      },
      {
        id: 6,
        title: "其他",
      },
    ],
    options2: [
      {
        id: 1,
        title: "手机",
      },
      {
        id: 2,
        title: "电视",
      },
      {
        id: 3,
        title: "冰箱",
      },
    ],
    options3: [
      {
        id: 1,
        title: "华为",
      },
      {
        id: 2,
        title: "小米",
      },
      {
        id: 3,
        title: "一加",
      },
      {
        id: 4,
        title: "苹果",
      },
      {
        id: 5,
        title: "OPPO",
      },
    ],
    value1: null,
    value2: null,
    value3: null,
  },
  close(){
    this.sort4 = this.selectComponent('#sort4');
    this.sort4.confirm()
  }
});
