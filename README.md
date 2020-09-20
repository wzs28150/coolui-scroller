<!--
 * @Title: 
 * @Descripttion: 
 * @version: 
 * @Author: wzs
 * @Date: 2020-08-16 18:43:13
 * @LastEditors: wzs
 * @LastEditTime: 2020-09-20 17:02:38
-->

# Coolui Scroll v2.0 上拉加载下拉刷新

### v2.0 版
> 上传至npm包可安装下载并npm构建
> 修改参数配置使组件使用更便捷
> 增加加载插槽可以自定义加载更多样式

### 前言
> 基于小程序原生组件scroll-view的扩展与封装,实现简单的上拉加载下拉刷新
> 扩展下拉刷新动画，有灵感的朋友可以丰富更多下拉动画

### 在线征集
> 在线征集下拉刷新动画创意,你可以发草图,或者psd,AE等文件到邮箱：1003418012@qq.com. 只要想法合理立马安排demo~



### 演示片段
> https://developers.weixin.qq.com/s/hXkiivm578kt

### npm 安装 安装之后开发者工具点击npm构建
```
npm i coolui-scroller --production
```

### 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "coolui-scroll": "coolui-scroller/index",
}
```
### 示例图片

#### 基础用法
![avatar](http://coolui.coolwl.cn/assets/scroll1.gif)

[更多示例图片](./demo.md)

## 更新日志
[更新日志](./log.md)

## 基础用法代码演示

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
### 配置 详见api
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



## API

### Props 

#### background 下拉刷新背景颜色 (如：#fff)
> tip: 在写组件的时候遇到了bug 本来该设置应该放在 scrollOption.refresh 中的 不知为何出现了 下拉刷新直接穿位置到页面底部,有知道为什么的么？ 目前还没有解决。

#### scrollOption 滚动设置

1. 分页设置 pagination

    | 参数 | 说明 | 类型 | 默认值 | 版本 |
    | --- | --- | --- | --- | --- |
    | page | 页码 | _Number_ | `1` | 2.0.0 |
    | totalPage | 总页码数 | _Number_ | `0` | 2.0.0 |
    | limit | 每页显示个数 | _Number_ | `0` | 2.0.0 |
    | length | 总个数(个数为0是,页面显示空样式) | _Number_ | `0` | 2.0.0 |

2. 空设置 empty

    | 参数 | 说明 | 类型 | 默认值 | 版本 |
    | --- | --- | --- | --- | --- |
    | img | 数据为空时显示的图片 | _String_ | `http://coolui.coolwl.cn/assets/mescroll-empty.png` | 2.0.0 |

3. 下拉刷新设置 refresh

    | 参数 | 说明 | 类型 | 默认值 | 版本 |
    | --- | --- | --- | --- | --- |
    | type | 下拉样式类型,小程序默认样式或自定义 支持 `default | diy`  | _String_ | `default` | 2.0.0 |    
    | style | 默认模式下样式有深色和浅色 支持 `black | white` | _String_ | `black` | 2.0.0 |
    | diyLevel | 自定义等级,简单设置：1,插槽自定义：2 支持 `1 | 2` | _Number_ |  | 2.0.0 |
    | p | 自定义等级2时,下拉的百分比方便自定义动画,设置0即可| _Number_ | `0` | 2.0.0 |
    | refreshthreshold | 自定义下拉高度 | _Number_ |  | 2.0.0 |    
    | backgroundImage | 自定义下拉背景图片 | _String_ |  | 2.0.0 |     
    | title | 自定义下拉文字 可设置 `show`: 是否显示, `text`: 文字内容, `color`: 文字颜色, `shadow`: 文字阴影范围(0时不显示)  | _Obj_ |  | 2.0.0 |     

4. 上拉加载设置 loadmore

    | 参数 | 说明 | 类型 | 默认值 | 版本 |
    | --- | --- | --- | --- | --- |
    | type | 上拉样式类型,默认样式或插槽自定义 支持 `default | diy`  | _String_ | `default` | 2.0.0 |    
    | icon | 默认样式时设置图标  | _String_ |  | 2.0.0 |  
    | title | 默认样式时设文字  可设置 `show`: 是否显示, `text`: 文字内容, `color`: 文字颜色, `shadow`: 文字阴影范围(0时不显示)  | _Obj_ |  | 2.0.0 |     

### Slots

| 名称 | 说明     | 版本 |
| ---- | -------- |--- |
| inner | 加载列表内容区域 | 2.0.0 |   
| refresh | 下拉自定义结构 | 2.0.0 |   
| loadmore | 上拉自定义结构 | 2.0.0 |   

### Events

| 事件名      | 说明               | 参数                     |版本 |
| ----------- | ------------------ | ------------------------ |--- |
| bind:refresh | 下拉刷新成功时触发     | - |2.0.0 |   
| bind:loadMore | 上拉加载成功时触发 | event.detail: 当前输入值 |2.0.0 |   
| bind:refreshPulling | 下拉时触发 | event.detail.p: 下拉进度 从0开始到1, 可根据p实现一些动画效果 |2.0.0 |   

### Methods
| 事件名      | 说明               | 参数                     |版本 |
| ----------- | ------------------ | ------------------------ |--- |
| loadEnd | 下拉刷新成功时调用关闭loadmore显示,用法  this.selectComponent(".demo1").loadEnd()   | - |2.0.1 |   
<!-- ### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 | -->
