/*
 * @Title: 滚动插件
 * @Descripttion: 实现上拉加载下拉刷新
 * @version: 2.0.1
 * @Author: wzs
 * @Date: 2020-05-01 16:06:20
 * @LastEditors: wzs
 * @LastEditTime: 2020-09-20 15:36:18
 */
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    behaviors: [],

    // 属性定义（详情参见下文）
    properties: {
        scrollOption: {
            type: Object,
            value: {
                pagination: {
                    page: 1,
                    totalPage: 0,
                    limit: 0,
                    length: 0
                },
                empty: {
                    img: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
                },
                refresh: {
                    type: 'default'
                },
                loadmore: {
                    type: 'default'
                }
            }
        },
        background: {
            type: String
        }
    },

    data: {
        isRefreshLoading: false,
        isNoneLoading: false,
        isLoading: true,
        triggered: false,
        threshold: 0,
        upTitle: '下拉刷新',
        scrollType: 'refresh', // refresh 和 loadMore 两种模式
        lazy: null
    },
    methods: {
        onPulling: function () {
            this.setData({
                isRefreshLoading: true,
            });
        },
        onRefresh() {
            if (this._freshing)
                return;
            this._freshing = true;
            setTimeout(() => {
                this.setData({
                    triggered: false
                });
                this._freshing = false;
            }, 1000);
        },
        onRestore(e) {
            this.triggerEvent("refresh", {
                page: this.data.scrollOption.pagination.page,
            });
            setTimeout(() => {
                this.setData({
                    isRefreshLoading: false,
                    upTitle: '下拉刷新',
                    threshold: 0
                });
            }, 1000);
        },
        onPullingDiy: function (evt) {
            setTimeout(() => {
                var p = Math.min(evt.detail.dy / 80, 1);
                this.triggerEvent("refreshPulling", {
                    p: p
                });
                let upTitle = '';
                if (p < 0.5) {
                    upTitle = '下拉刷新';
                } else {
                    upTitle = '释放加载';
                }
                this.setData({
                    isRefreshLoading: true,
                    threshold: p,
                    upTitle: upTitle
                });
            }, 300);
        },
        lower: function (e) {
            if (this.data.lazy) {
                clearTimeout(this.data.lazy);
            }
            if (this.data.scrollOption.pagination.page <= this.data.scrollOption.pagination.totalPage) {
                let lazy = setTimeout(() => {
                    console.log('加载开始:显示loadmore');
                    this.triggerEvent("loadMore");
                }, 800);
                this.setData({
                    lazy: lazy,
                });
            }
        },
        scroll: function (e) {
            if (this.data.scrollOption.pagination.page < this.data.scrollOption.pagination.totalPage) {
                this.setData({
                    isNoneLoading: false,
                    isLoading: true,
                });
            } else {
                this.setData({
                    isNoneLoading: true,
                    isLoading: false,
                });
            }
        },
        loadEnd: function () {
            console.log('加载结束:隐藏loadmore');
            this.setData({
                isLoading: false
            });
        }
    }

})