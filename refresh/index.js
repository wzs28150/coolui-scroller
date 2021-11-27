Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  externalClasses: ['refresh-class'],
  relations: {
    "../scroller/index": {
      type: "parent",
      linked(target) {
      },
    },
    "../parallax/index": {
      type: "child",
      linked(target) {
        // console.log(target);
      },
    },
  },
  properties: {
    type: {
      type: String,
      value: "default",
    },
    threshold: {
      type: Number,
      value: 0
    },
    config: {
      type: Object,
      value: {
        shake: false,
        height: 50,
        text: {
          color: "#000000", // 文字颜色
          shadow: 0, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
        }
      }
    }
  },
  data: {
    // height: 100
    triggered: true,
    scrollOption: {},
  },
  ready() {
    this.parallaxNodes = this.getRelationNodes(
      "../parallax/index"
    );
  },
  methods: {
    changeThreshold({ threshold }, callback) {
      let that = this;
      that.setData(
        {
          threshold: threshold,
        },
        () => {
          if (callback) {
            callback();
          }
          if (that.parallaxNodes.length > 0) {
            that.parallaxNodes.forEach((elem, index) => {
              elem.setData({
                threshold: threshold
              })
            });
          }
        }
      );
    },
  },
});
