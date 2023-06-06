# coolui-scroller

<a href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/v/coolui-scroller.svg" alt="Version"></a>&nbsp;
<a href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/l/coolui-scroller.svg" alt="License"></a>&nbsp;
<a href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/dt/coolui-scroller" alt="Download"></a>&nbsp;
<a href="https://github.com/wzs28150/coolui-scroller"><img src="https://img.shields.io/github/stars/wzs28150/coolui-scroller?style=social" alt="Stars"></a>

## 前言

### 初衷

本来写这个组件的初衷，是在我写了一个小程序之后，发现小程序如果要实现下拉刷新、上拉加载有两种方式:

1. 页面级的：利用页面 Page 里提供的方法。下拉虽说是那个东西但是它只有下拉三个点的动画效果而且只能显示在头部就很尴尬。很多时候一个列表的头部往往会有一些组件比如搜索、分类导航等等。所以往往列表都是局部的非页面级的。这时候下拉时动画出现在最顶部就显得很突兀。

```javascript
Page({
  onPullDownRefresh: function () {
    // 监听用户下拉刷新事件。
  },
  onReachBottom: function () {
    // 监听用户上拉触底事件。
  },
  onPageScroll: function () {
    // 监听用户滑动页面事件。
  },
});
```

2. 组件级的：利用 scroll-view。 但是当你打开 scroll-view 官方文档时，映入眼帘的是一列列的参数属性方法。要完全弄懂里面的内容，恐怕你得上手写写，挨个试试里面的参数和方法才行。而对于下拉刷新这个效果文档上有个简易的 demo 可寻。上拉加载也只有 bindscrolltolower 这么个方法和 lower-threshold 阈值。所以要实现起来完全还得靠自己。

所以在写项目的最后我把页面的列表下拉刷新,上拉加载进行了初步的封装。单独拿出来方便之后重复使用。所以有了起初的 1.0 版。

### 发展

#### V2.0

scroll-view 组件初期并没有那么多配置,所以 1.0 实现的效果很有限。
后来随着官方 scroll-view 组件的不断的更新。增加了很多新的属性和事件使得下拉可以自定义起来。虽然也有很多地方不尽人意，但是可玩度还是有很多的。所以又升级了 2.0 版增加了很多下拉的自定义动画效果和上拉加载的效果。

2.0 版组件还是围绕着 scroll-view,写法上只有一个封装好的 scroller 组件。内置了一个基础的下拉效果。提供下拉的插槽位置。并给出了几个有趣的下拉效果 demo(如：天猫效果、京东小人效果)让下拉又有了更多的可能性;配置上也考虑了很多增加了列表为空时的设置上拉加载的配置。整个配置就是一个 Obj,细化到文字、背景。

V2.0 配置：

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

之后由于疫情及个人原因这个组件搁置了一阵子。当我再次打开它时便有了重构的想法。

#### V3.0

3.0 版打算把之前各个部分的插槽进行细化及拆分。并新增空列表插槽及组件、初次进入程序时的手势提示组件、顶部插槽及顶部插槽可用的组件(如：搜索组件、分类组件、下拉筛选组件)。

除了组件的变化外，核心列表准备加入长列表处理，解决数据量大时列表会出现的问题(如：setData 加载大数据的耗时高、列表渲染出来的 Dom 结构多、占用的内存高，造成页面被系统回收的概率变大等)。起初想以官方给出的 recycle-view 组件进行扩展。但是使用中，遇到很多坑及不方便之处。最让我接受不了的是需要设置 itemSize 这个方法。当我在不确定列表元素宽高的时候就很难设置。后来经过大量的思考和查资料及尝试。决定采用知乎上 daisy 提出的长列表解决方案。

该组件还在开发中各组件陆续上线~

### v3.0 版

1. 基于小程序原生组件 scroll-view 的扩展与封装,实现简单的上拉加载下拉刷新
2. 扩展下拉刷新动画，有灵感的朋友可以丰富更多下拉动画
3. 上传至 npm 包可安装下载并 npm 构建
4. 修改参数配置使组件使用更便捷
5. 增加加载插槽可以自定义加载更多样式
6. 增加多组件配合使列表功能更丰富

### 开发进度

1. ~~调整为虚拟长列表模式~~
2. ~~支持多组件搭配，使插件更灵活~~
3. ~~新增组件 coolui-scroller-item(列表项组件)~~
4. ~~新增组件 coolui-scroller-page(长列表分页组件)~~
5. ~~新增组件 coolui-scroller-empty(空列表组件)~~
6. ~~新增组件 coolui-scroller-handtip(手势提示组件)~~
7. ~~新增组件 coolui-scroller-loadmore(加载更多组件)~~
8. ~~新增组件 coolui-scroller-nav(分类导航组件)~~
9. ~~新增组件 coolui-scroller-refresh(下拉刷新组件)~~
10. ~~新增组件 coolui-scroller-parallax(下拉刷新视差位移组件)~~
11. ~~新增组件 coolui-scroller-search(搜索组件)~~
12. ~~新增组件 coolui-scroller-sort(分类筛选及排序组件)~~

### 支持 coolui-scroller

做一个组件库是一个繁琐且长期的事情，接下来我将花费业余时间进行多版本的完善。
如果 coolui-scroller 对您的工作或者学习有所帮助，您可以捐赠 coolui-scroller 的研发工作，捐赠无门槛，哪怕是一瓶肥宅快乐水，也可以帮助我多敲半小时代码。

| 微信                                       | 支付宝 |
| ------------------------------------------ | ------ |
| ![微信](https://wzs28150.github.io/coolui-scroller/v3/images/wx.jpg) | ![支付宝](https://wzs28150.github.io/coolui-scroller/v3/images/zfb.jpg) |

## 示例 demo

请微信扫码打开小程序查看

![示例](https://wzs28150.github.io/coolui-scroller/v3/images/demo.jpg)


示例代码： [https://github.com/wzs28150/coolui-scroller/tree/demo](https://github.com/wzs28150/coolui-scroller/tree/demo)

请 clone 下载到本地使用微信开发者工具查看

```
git clone -b demo  https://github.com/wzs28150/coolui-scroller.git
```

## 安装

### npm 安装

```
npm i coolui-scroller --production
```

### npm 构建

安装之后开发者工具点击 npm 构建:<br/>
![npm构建1](https://wzs28150.github.io/coolui-scroller/v3/images/set1.png)<br/>
当看到站点里面出现 miniprogram_npm 文件夹就算安装完成了<br/>
![npm构建2](https://wzs28150.github.io/coolui-scroller/v3/images/set2.png)

## 引入

### 1.调用组件

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "scroller": "coolui-scroller/scroller/index"
}
```

### 2.页面结构

```html
<scroller class="my-scroller" > </scroller>
```

### 3.配置

在 js 的 data 中进行配置参数设置，v3.0 版将功能细化到各个组件中具体配置详见([组件](https://wzs28150.github.io/coolui-scroller/v3/components/scroller.html))

### 4.组件

根据自己的业务场景选用组件，也可以在对应的插槽中自定义
