// pages/demo/fly/index.js
Page({
  data: {
    flySetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      // isAutoTriggered: false,
      background: {
        color: "#019ff0",
      },
    },
    refreshstate: "pulldown",
    val: 0
  },
  onShareAppMessage: function () {},
});
