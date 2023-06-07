// index/components/case/index.js
Component({
  properties: {},
  data: {
    nav: [
      {
        id: 1,
        title: "下拉动画",
      },
      {
        id: 2,
        title: "下拉组合",
      },
      {
        id: 3,
        title: "下拉二楼",
      }
    ],
    list: [
      [
        {
          id: 5,
          title: "冰墩墩",
          img: "https://test.wzs.pub/pic/bing/bing.jpg",
          page: "/pages/demo/bingdwendwen/index"
        },
        {
          id: 4,
          title: "浩瀚宇宙",
          img: "https://test.wzs.pub/pic/universe/earth.gif",
          page: "/pages/demo/universe/index"
        },
        {
          id: 3,
          title: "圣诞主题:圣诞老人",
          img: "https://test.wzs.pub/pic/christmas/merrychristmas.gif",
          page: "/pages/demo/christmas/index"
        },
        {
          id: 2,
          title: "餐饮主题:魔性吃面",
          img: "https://test.wzs.pub/pic/food_pic.gif",
          page: "/pages/demo/noodles/index"
        },
        {
          id: 1,
          title: "纯css画飞上云霄",
          img: "https://test.wzs.pub/pic/fly_pic1.gif",
          page: "/pages/demo/fly/index"
        },
      ],
      [],
      []
    ],
    baseConfig: {
      shake: false, // 是否开启下拉震动
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
    active: 0,
  },
  methods: {
    onChange: function (e) {
     console.log(e.detail.id);
     this.setData({
      active: e.detail.id - 1
     })
    },
  },
});
