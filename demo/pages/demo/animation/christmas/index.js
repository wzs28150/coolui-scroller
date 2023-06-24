Page({
  data: {
    val: 0,
    refreshstate: "pulldown",
    isLoading: false,
    giffoodSetting: {
      shake: true, // 是否开启下拉震动
      height: 150,
      isAutoTriggered: false,
      background: {
        color: "#3ac6f4",
      },
    },
  },
  onRefresh() {
    console.log(1);
    setTimeout(() => {
      // 开启第二段动画
      this.setData(
        {
          isLoading: true,
        },
        () => {
          const scroll = this.selectComponent(".christmas-scroller");
          setTimeout(() => {
            scroll.settriggered(false)
          }, 2000); // 自定义回弹时间
        }
      );
    }, 1000);
  },
  onShareAppMessage: function () {},
});
