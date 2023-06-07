// pages/demo/fly/index.js
Page({
  data: {
    flySetting: {
      shake: true, // 是否开启下拉震动
      height: 80,
      // isAutoTriggered: false,
      background: {
        color: "#d4ebf1",
      },
      // isAutoTriggered: false
    },
    refreshstate: "pulldown",
    val: 0
  },
  onShareAppMessage: function () {},
});
