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
    loadingText: {
      type: String,
      value: "\u52A0\u8F7D\u4E2D",
    },
    moreText: {
      type: String,
      value: "\u67E5\u770B\u66F4\u591A",
    },
    noMoreText: {
      type: String,
      value: "\u6CA1\u6709\u66F4\u591A",
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
