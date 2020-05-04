/*
 * @Title: 滚动插件
 * @Descripttion: 实现上拉加载下拉刷新
 * @version: 0.0.1
 * @Author: wzs
 * @Date: 2020-05-01 16:06:20
 * @LastEditors: wzs
 * @LastEditTime: 2020-05-04 00:57:11
 */
import { CooluiComponent } from '../common/component';
CooluiComponent({
    props: {
        page: {
            type: Number,
            value: 0,
        },
        totalPage: {
            type: Number,
            value: 0,
        },
        isEmpty: {
            type: Number,
            value: 0,
        },
        scrollHeight: {
            type: String,
            value: '100%',
        },
        type: {
            type: String,
            value: 'default',
        },
        refreshStyle: {
            type: String,
            value: 'black',
        },
        refreshBackground: {
            type: String,
            value: '#f2f2f2',
        },
        refreshthreshold: {
            type: Number,
            value: 45,
        },
        refreshBackgroundImage: {
            type: String,
            value: '',
        },
        refreshColor: {
            type: String,
            value: '#999999',
        },
        refreshTitleShow: {
            type: Boolean,
            value: true,
        },
        refreshDiy: {
            type: Boolean,
            value: false,
        },
        emptyImg: {
            type: String,
            value: '',
        },
    },
    data: {
        isRefreshLoading: false,
        isNoneLoading: false,
        triggered: false,
        threshold: 0,
        upTitle: '下拉刷新',
        scrollType: 'refresh' // refresh 和 loadMore 两种模式
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
                page: this.data.page,
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
                }
                else {
                    upTitle = '释放加载';
                }
                this.setData({
                    isRefreshLoading: true,
                    threshold: p,
                    upTitle: upTitle
                });
            }, 300);
        },
        lower: function () {
            if (this.data.page <= this.data.totalPage) {
                this.triggerEvent("loadMore");
            }
        },
        scroll: function (e) {
            if (this.data.page < this.data.totalPage) {
                this.setData({
                    isNoneLoading: false,
                });
            }
            else {
                this.setData({
                    isNoneLoading: true,
                });
            }
        },
    }
});
