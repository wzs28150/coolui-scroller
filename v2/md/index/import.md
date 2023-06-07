# 引入
### 在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "coolui-scroll": "coolui-scroller/index",
}
```
### 页面结构

```html
<coolui-scroll class="demo1"  scrollOption="{{scroll}}" bindrefresh="refresh" bindloadMore="loadMore" background="#fff">
			<view class="list-inner" slot="inner">
        <!-- 循环内容 -->
				<view class="item" wx:for="{{list}}" wx:key="unique">
					第{{index + 1}}条内容
				</view>
        <!-- 循环内容 -->
			</view>
</coolui-scroll>
```
### 然后在js的data中进行配置参数设置 (详见[配置](/index.html#/option/index))
```js
// data 中配置
scroll: {
  //  设置分页信息
  pagination: {
    page: 1,
    totalPage: 10,
    limit: 10,
    length: 100
  },
  // 设置数据为空时的图片
  empty: {
    img: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
  },
  // 设置下拉刷新
  refresh: {
    type: 'default',
    style: 'black',
    background: "#000"
  },
  // 设置上拉加载
  loadmore: {
    type: 'default',
    icon: 'http://upload-images.jianshu.io/upload_images/5726812-95bd7570a25bd4ee.gif',
    background: '#f2f2f2', 
    // backgroundImage: 'http://coolui.coolwl.cn/assets/bg.jpg',
    title: {
      show: true,
      text: '加载中',
      color: "#999",
      shadow: 5
    }
  }
},
```
### 事件 详见api
```js
// 加载数据
let that = this
getData:function (type) {
  // 可走后台接口
  if (type == 'refresh') {
    // 刷新时执行
    // 设置页数1
    let scroll = that.data.scroll
    scroll.pagination.page = 1
  }else{
    // 加载时执行
    // 设置页数+1
    let scroll = that.data.scroll
    scroll.pagination.page = scroll.pagination.page + 1

    // 数据加载完隐藏loadmore
    that.selectComponent(".demo1").loadEnd()
  }
},
// 下拉 刷新 页数设置1
refresh: function () {
  this.getData('refresh')
},
// 上拉 加载 页数设置+1
loadMore: function () {
  this.getData('loadMore')
},
// 自定义下拉刷新时执行 插槽下拉 返回的下拉进度p
refreshPulling: function (e) {
  p = e.detail.p
},
```