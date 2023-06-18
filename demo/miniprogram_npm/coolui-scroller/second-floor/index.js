// miniprogram_npm/coolui-scroller/second-floor/index.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  externalClasses: ["second-floor-class"],
  relations: {
    "../second-floor-refresh/index": {
      type: "child",
      linked(target) {
        // console.log(target);
      },
    },
  },
  properties: {
    threshold: {
      type: Number,
      value: 0,
    },
    center: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        this.init();
      },
    },
    bottom: {
      type: Boolean,
      value: true,
      observer: function (newVal) {
        this.init();
      },
    },
    top: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        this.init();
      },
    },
    scale: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        this.init();
      },
    },
  },
  data: {
    scroll_height: 0,
    touchy: 0,
    isLoading: false,
    isFloorShow: false,
    wapperAnimationData: {},
    innerAnimationData: {},
  },
  ready() {
    this.init();
  },
  methods: {
    debounce(fn, wait) {
      const that = this;
      that.setData({
        timeout: null,
      });
      return function () {
        if (that.data.timeout !== null) {
          clearTimeout(that.data.timeout);
        }
        const timeout = setTimeout(() => {
          fn();
        }, wait);
        that.setData({
          timeout,
        });
      };
    },
    /**
     * @name: 初始化
     * @description: 根据设置初始化动画，初始化参数，初始化子组件
     * @return {*}
     */
    init() {
      let info = wx.getSystemInfoSync();
      this.refreshNodes = this.getRelationNodes(
        "../second-floor-refresh/index"
      );
      this.refreshNode = this.refreshNodes[0] ? this.refreshNodes[0] : null;
      this.refreshNode.setData({
        scroll_height: info.windowHeight,
      });
      const animation = this.setAnimation(-info.windowHeight, 0);
      let animationInner = null;
      let scaleXy = this.data.scale ? 0.1 : 1;
      if (this.data.top) {
        animationInner = this.setAnimation(
          info.windowHeight,
          0,
          scaleXy,
          scaleXy
        );
      }
      if (this.data.center) {
        animationInner = this.setAnimation(
          info.windowHeight / 2,
          0,
          scaleXy,
          scaleXy
        );
      }
      if (this.data.bottom) {
        animationInner = this.setAnimation(0, 0, scaleXy, scaleXy);
      }
      this.setData({
        scroll_height: info.windowHeight,
        wapperAnimationData: animation.export(),
        innerAnimationData: animationInner ? animationInner.export() : {},
        threshold: 0,
      });
      this.wapper = this.selectComponent(".second-floor-wapper");
    },
    /**
     * @name: 触摸拖拽开始
     * @description: 记录初始触摸位置
     * @param {*} e
     * @return {*}
     */
    touchStart(e) {
      // 正在刷新时不操作触摸
      if (this.data.isLoading) {
        return false;
      }
      this.setData({
        touchy: e.changedTouches[0].clientY,
      });
    },
    /**
     * @name: 拖动时执行
     * @description: 修改页面动画，传递触摸动态参数给refresh组件
     * @return {*}
     */
    touchMove(e) {
      // 正在刷新时不进行操作, 二楼已加载是不进行操作
      if (!this.data.isFloorShow && !this.data.isLoading) {
        const distance = Math.round(
          e.changedTouches[0].clientY - this.data.touchy
        );
        let scaleXy = 1;
        if (this.data.scale) {
          scaleXy = 0.1 + distance / 200;
          scaleXy = scaleXy >= 1 ? 1 : scaleXy;
        }

        if (distance > 0) {
          let animation = this.setAnimation(
            -this.data.scroll_height + distance,
            0
          );

          let animationInner = null;

          if (this.data.top) {
            animationInner = this.setAnimation(
              this.data.scroll_height - distance,
              0,
              scaleXy,
              scaleXy
            );
          }

          if (this.data.bottom) {
            animationInner = this.setAnimation(0, 0, scaleXy, scaleXy);
          }

          if (this.data.center) {
            animationInner = this.setAnimation(
              (this.data.scroll_height - distance) / 2,
              0,
              scaleXy,
              scaleXy
            );
          }
          // console.log(animationInner);
          this.setData({
            wapperAnimationData: animation.export(),
            innerAnimationData: animationInner ? animationInner.export() : null,
            threshold: distance,
          });
          this.refreshNode.setText(distance);
        }
      }
    },
    /**
     * @name: 松手后执行
     * @description: 松手时如果拖拽的距离大于屏幕三分之一，直接执行拉到二楼动画，如果大于六分之一小于三分之一则回到六分之一并开启刷新状态，如果小于六分之一直接回弹
     * @return {*}
     */
    touchEnd() {
      // 正在刷新时不进行操作, 二楼已加载是不进行操作，只点屏幕不拖拽时不进行操作
      if (
        !this.data.isFloorShow &&
        this.data.threshold > 0 &&
        !this.data.isLoading
      ) {
        // 大于3分之1 直接拉到二楼
        if (this.data.threshold > this.data.scroll_height / 3) {
          const animation = this.setAnimation(0, 400);
          let animationInner = null;
          if (this.data.top) {
            animationInner = this.setAnimation(0, 400, 1, 1);
          }
          if (this.data.bottom) {
            animationInner = this.setAnimation(0, 0, 1, 1);
          }

          if (this.data.center) {
            animationInner = this.setAnimation(0, 400, 1, 1);
          }
          this.setData(
            {
              wapperAnimationData: animation.export(),
              innerAnimationData: animationInner ? animationInner.export() : {},
            },
            () => {
              setTimeout(() => {
                this.refreshNode.setShow(true);
                this.setData({
                  isFloorShow: true,
                });
                this.triggerEvent("secondShow");
              }, 400);
            }
          );
        } else {
          if (this.data.threshold > this.data.scroll_height / 6) {
            // 大于6分之一，小于3分之一，回到 6分之一停顿开始刷新
            const animation = this.setAnimation(
              -this.data.scroll_height + this.data.scroll_height / 6,
              400
            );
            let animationInner = null;
            if (this.data.top) {
              animationInner = this.setAnimation(
                this.data.scroll_height - this.data.scroll_height / 6,
                400
              );
            }
            if (this.data.bottom) {
              animationInner = this.setAnimation(0, 0);
            }
            if (this.data.center) {
              animationInner = this.setAnimation(
                (this.data.scroll_height - this.data.scroll_height / 6) / 2,
                400
              );
            }
            this.setData(
              {
                wapperAnimationData: animation.export(),
                innerAnimationData: animationInner
                  ? animationInner.export()
                  : {},
              },
              () => {
                this.triggerEvent("refresh");
                this.setData({
                  isLoading: true,
                });
                this.refreshNode.setLoading(true);
              }
            );
          } else {
            // 小于6分之一 直接回顶部
            this.back(false);
          }
        }
      }
    },
    /**
     * @name: 回弹及二楼关闭
     * @description: 拖动小于6分之一直接回顶部或外部自定义调用关闭二楼
     * @return {*}
     */
    back(callback = true) {
      return new Promise((resolve) => {
        const animation = this.setAnimation(-this.data.scroll_height, 800);
        let animationInner = null;

        if (this.data.top) {
          animationInner = this.setAnimation(
            this.data.scroll_height,
            800,
            1,
            this.data.scale ? 0 : 1
          );
        }
        if (this.data.bottom) {
          animationInner = this.setAnimation(0, 0, 1, this.data.scale ? 0 : 1);
        }
        if (this.data.center) {
          animationInner = this.setAnimation(
            this.data.scroll_height / 2,
            800,
            1,
            this.data.scale ? 0 : 1
          );
        }
        this.setData(
          {
            wapperAnimationData: animation.export(),
            innerAnimationData: animationInner ? animationInner.export() : {},
          },
          () => {
            setTimeout(() => {
              this.refreshNode.setShow(false);
              this.refreshNode.setLoading(false);
              this.setData(
                {
                  isFloorShow: false,
                  threshold: 0,
                },
                () => {
                  if (callback) {
                    this.triggerEvent("secondBack");
                    resolve();
                  }
                }
              );
            }, 800);
          }
        );
      });
    },
    /**
     * @name: 刷新后的回弹
     * @description: 刷新之后回弹方法，再请求完数据之后执行
     * @return {*}
     */
    settriggered() {
      return new Promise((resolve) => {
        const animation = this.setAnimation(-this.data.scroll_height, 800);
        let animationInner = null;

        if (this.data.top) {
          animationInner = this.setAnimation(
            this.data.scroll_height,
            800,
            1,
            this.data.scale ? 0 : 1
          );
        }
        if (this.data.bottom) {
          animationInner = this.setAnimation(0, 0, 1, this.data.scale ? 0 : 1);
        }
        if (this.data.center) {
          animationInner = this.setAnimation(
            this.data.scroll_height / 2,
            800,
            1,
            this.data.scale ? 0 : 1
          );
        }
        this.setData(
          {
            wapperAnimationData: animation.export(),
            innerAnimationData: animationInner ? animationInner.export() : {},
            isLoading: false,
          },
          () => {
            setTimeout(() => {
              this.refreshNode.setLoading(false);
              this.setData(
                {
                  threshold: 0,
                },
                () => {
                  resolve();
                }
              );
            }, 400);
          }
        );
      });
    },
    setAnimation(y, duration = 400, scale = 1, opacity = 1) {
      let transformOrigin = "50% 50% 0";
      if (this.data.top) {
        transformOrigin = "50% 0 0";
      }
      if (this.data.bottom) {
        transformOrigin = "50% 100% 0";
      }
      if (this.data.center) {
        transformOrigin = "50% 50% 0";
      }
      const animation = wx.createAnimation({
        delay: 0,
        duration: duration,
        timingFunction: "ease-out",
        transformOrigin: transformOrigin,
      });
      animation.translateY(y).scale(scale, scale).opacity(opacity);

      animation.step();

      return animation;
    },
  },
});
