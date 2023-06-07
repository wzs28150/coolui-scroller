# 事件
### refresh        下拉刷新成功时触发
> 页面设置
```html
    <coolui-scroll bindrefresh="refresh" >
    </coolui-scroll>
```
> js
```js
    refresh: function () {
        // 设置 Option.pagination.page = 0
        // 执行 数据刷新
    },
```
### loadMore       上拉加载成功时触发
> 页面设置
```html
    <coolui-scroll bindloadMore="loadMore" >
    </coolui-scroll>
```
> js
```js
    loadMore: function () {
        // 设置 Option.pagination.page + 1
        // 执行 数据请求
    },
```
### refreshPulling 下拉时触发
> 页面设置
```html
    <coolui-scroll bindrefreshPulling="refreshPulling" >
    </coolui-scroll>
```
> js
```js
    refreshPulling: function (e) {
        // 设置 Option.refresh.p 更新下拉系数
        console.log(e.detail.p)
        Option.refresh.p = e.detail.p
        this.setData({
            Option: Option
        });
        // 执行 数据请求
    },
```