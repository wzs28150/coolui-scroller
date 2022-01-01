Component({
  relations: {
    "../scroller/index": {
      type: "parent",
      linked() {},
    },
  },
  properties: {
    ripple: {
      type: Boolean,
      value: false
    },
  },
  data: {
    rippleStyle: "",
  },
  methods: {
    itemTap(e) {
      if (this.data.ripple) {
        var x = e.changedTouches[0].pageX;
        var y = e.currentTarget.offsetTop;
        this.setData({
          rippleStyle: "left:" + x + "px;animation: ripple 0.5s linear;",
        });
        setTimeout((res) => {
          this.setData({
            rippleStyle: "",
          });
        }, 500);
      }
    },
  },
});
