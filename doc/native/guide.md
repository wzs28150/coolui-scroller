# 组件库介绍

coolui-scroller 是一个专注小程序**下拉刷新 / 上拉加载 / 长列表**的组件库，提供[原生微信小程序版](/native/install)与 [uni-app 版](/uniapp/install)两套实现，组件能力与配置项一致。

<a style="display: inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/v/coolui-scroller.svg" alt="Version"></a>&nbsp;
<a style="display: inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/l/coolui-scroller.svg" alt="License"></a>&nbsp;
<a style="display: inline-block;" href="https://www.npmjs.com/package/coolui-scroller"><img src="https://img.shields.io/npm/dt/coolui-scroller" alt="Download"></a>&nbsp;
<a style="display: inline-block;" href="https://github.com/wzs28150/coolui-scroller"><img src="https://img.shields.io/github/stars/wzs28150/coolui-scroller?style=social" alt="Stars"></a>

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
})
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
13. ~~新增组件 coolui-scroller-floor(下拉二楼组件)~~

## v4.0 版

v4.0.0 有两条主线：**长列表窗口化**，以及**同仓维护的原生 + uni-app 双版本**。

### 长列表窗口化

v3 的长列表是「每一页都保留一个 `scroll-page` 组件实例，滚出视口后把列表项换成占位」。当加载的页数足够多时，**页结构本身**也会成为卡顿来源：页组件实例与 IntersectionObserver 的数量都会随总页数线性增长。

v4.0.0 把「窗口」从 item 层扩展到 page 层：

- 只真实渲染**窗口内**的页（当前可见页 ± 相邻页），窗口外统一折叠为**上下两个占位块**；
- 页高定位不再使用 IntersectionObserver，改为「滚动距离 + 页高前缀和二分」，复杂度 O(log N)；
- 未测量的页用「已测量页的平均值」估算，滚过后测量回填并自动收敛。

| 项目 | v3.x | v4.0.0 |
| --- | --- | --- |
| 页组件实例 | 每一页一个，随总页数增长（O(N)） | 只渲染窗口内的页，约 3~5 个（O(窗口)） |
| 页高定位 | 每页一个 IntersectionObserver（N 个观察者） | 滚动距离 + 页高前缀和二分，**0 个观察者** |
| 窗口外节点 | 每页一个占位节点（N 个） | 折叠为**上下两个**占位块 |
| 窗口重算 | 由观察者回调触发 | 滚动时按需重算，O(log N) |

页数越多收益越明显：加载 50 页时，节点数由「50 个页组件 + 50 个观察者」降为「约 5 个页组件 + 2 个占位块」。

具体写法与升级对照见 [ScrollPage 长列表分页组件](/native/components/page)。

## uni-app 版

从 v4 开始，组件库以**同仓双版本**的形式维护：原生微信小程序版（npm 包 `coolui-scroller`）与 uni-app 版（npm 包 `coolui-scroller-uni`）。两者**组件能力与配置项保持一致**，文档一一对应，用站点顶部的切换器可以随时对照另一端的写法。

uni-app 版不是原生版的简单搬运，写法上按 Vue 的习惯重新实现：

| 项 | 原生微信小程序版 | uni-app 版 |
| --- | --- | --- |
| 组件通信 | 小程序 `relations` 关联父子组件 | Vue `provide/inject` |
| 事件 | `bind:xxx` | `@xxx`；受控属性 `@update:propName`（可写 `v-model:xxx`） |
| 引入方式 | `usingComponents` | easycom 免 import，也支持全局注册 / 页面内局部引入 |
| 长列表 | `scroll-page` 窗口化渲染 | 新增 `coolui-scroller-longlist`（窗口化容器，推荐） |
| 类型 | — | 组件用 `<script setup lang="ts">`，公共类型集中在 `types.d.ts` |
| 样式定制 | `externalClasses` | `virtualHost + apply-shared`，页面里用 `:deep()` 覆盖 |

- 一套代码编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序以及 H5、App 端；
- 保留字属性改名：search 的 `key` → `keyword`、handtip 的 `key` → `storageKey`；
- 各端差异（H5 导航栏占高、插槽与样式作用域等）见 [uni-app 版安装与引入](/uniapp/install) 与 [与原生微信小程序版的差异](/uniapp/platform-diff)。

## 接下来

- **安装与引入**：[安装与引入](/native/install) —— npm 安装、构建 npm、`usingComponents` 全量引入清单
- **挑组件**：[组件文档](/native/components/scroller) —— 根据自己的业务场景选用，也可以在对应插槽里自定义
- **看示例**：[示例 demo](/case/) —— 扫码预览与示例工程源码
- **换平台**：如果项目是 uni-app，请看 [uni-app 版文档](/uniapp/install)，或用页面顶部的平台切换器
