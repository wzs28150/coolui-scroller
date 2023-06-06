Component({
  options: {
    addGlobalClass: true,
  },
  relations: {
    "../scroller/index": {
      type: "parent"
    },
  },
  properties: {
    noMoreTextStyle: {
      type: String,
      value: "",
    },
    status: {
      type: String,
      value: "more",
    },
    loading: {
      type: Object,
      value: {
        text: "\u52A0\u8F7D\u4E2D",
        color: "#999999"
      }
    },
    more: {
      type: Object,
      value: {
        text: "\u67E5\u770B\u66F4\u591A",
        color: "#333333"
      }
    },
    noMore: {
      type: Object,
      value: {
        text: "\u6CA1\u6709\u66F4\u591A",
        color: "#999999"
      },
    },
    color: {
      type: String,
      value: "#999999",
    },
    shake: {
      type: Boolean,
      value: false,
    },
  }
});
