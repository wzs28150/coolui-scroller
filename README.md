
# Scroll 上拉加载下拉刷新
### 在线征集
> 在线征集下拉刷新动画创意,你可以发草图,或者psd,AE等文件到邮箱：1003418012@qq.com. 只要想法合理立马安排demo~

### 前言
> 基于小程序原生组件scroll-view的扩展与封装,实现简单的上拉加载下拉刷新
> 扩展下拉刷新动画，有灵感的朋友可以丰富更多下拉动画

### 演示片段
> https://developers.weixin.qq.com/s/UIJgxDm37DjV

### npm 安装 安装之后开发者工具点击npm构建
```
npm i coolui-scroller --production
```

### 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "coolui-scroll": "coolui-scroller/scroll/index",
}
```
### 示例

<div style="overflow:hidden;clear:both">
<div class="clearfix" style="float:left">

#### 基础用法
<img src="http://coolui.coolwl.cn/assets/scroll1.gif?v=1" style="width:375px" />
</div>


<div class="clearfix" style="float:right">

#### 升级用法
<img src="http://coolui.coolwl.cn/assets/scroll2.gif?v=1" style="width:375px" />
</div>
</div>
<div style="overflow:hidden;clear:both">
<div class="clearfix" style="float:left">

#### 天猫动画背景
<img src="http://coolui.coolwl.cn/assets/scroll3.gif?v=1" style="width:375px" />
</div>


<div class="clearfix" style="float:right">

#### 京东下拉
<img src="http://coolui.coolwl.cn/assets/scroll4.gif?v=1" style="width:375px" />
</div>

<div class="clearfix" style="float:right">

#### 弹射火箭
<img src="http://coolui.coolwl.cn/assets/scroll5.gif?v=1" style="width:375px" />
</div>

<div class="clearfix" style="float:right">

#### 端午安康(2020.06.24 新增端午下拉动画祝大家端午安康~)
<img src="http://coolui.coolwl.cn/assets/scroll6.gif?v=1" style="width:375px" />
</div>
</div>

## 基础用法代码演示

### 基础用法页面结构

```html
<coolui-scroll
  page="{{scroll.page}}"
  totalPage="{{scroll.totalPage}}"
  bindupper="upper"
  bindlower="lower"
  isEmpty="{{list.length}}"
  height="{{scroll.height}}"
>
  <view class="list-inner" slot="inner">
    <!-- 循环内容 -->
    <view class="item" wx:for="{{tmList}}" wx:key="unique">
      第{{index + 1}}条内容
    </view>
    <!-- 循环内容 -->
  </view>
</coolui-scroll>
```
### 基础用法配置
```js
// 配置
scroll: {
  page: 1,
  totalPage: 10,
  emptyImg: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
},
```
### 数据加载
```js
// 模拟数据
let listData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// 加载数据
onShow: function () {
    // 页面加载时执行一次加载
    this.getData('refresh', 1)
},
getData: function (type, page) {
  let that = this
  let list = that.data.list;
  if (type == 'refresh') {
    let scroll = that.data.scroll
    scroll.page = page
    setTimeout(() => {
      that.setData({
        list: listData,
        scroll: scroll
      });
    }, 300);
  } else {
    let scroll = that.data.scroll
    scroll.page = page
    setTimeout(() => {
      if (that.data.scroll.page <= that.data.scroll.totalPage) {
        that.setData({
          list: list.concat(listData),
          scroll: scroll
        });
      }
    }, 1000);
  }
},
```
### 下拉刷新方法
```js
// 下拉刷新
refresh: function () {
  this.getData('refresh', 1)
},
```
### 上拉加载方法
```js
// 上拉加载
loadMore: function () {
  this.getData('loadMore', this.data.scroll.page + 1)
},
```
### 设置下拉刷新样式
```html
<coolui-scroll refreshStyle="black" refreshBackground="#f2f2f2" ></coolui-scroll>
```
### 自定义下拉刷新

#### 开启自定义
```html
<coolui-scroll type="diy" ></coolui-scroll>
```
#### 设置下拉高度
```html
<coolui-scroll type="diy" refreshthreshold="{{90}}" ></coolui-scroll>
```
#### 设置下拉刷新背景图片(可设置动图)
```html
<coolui-scroll type="diy" refreshBackgroundImage="http://coolui.coolwl.cn/assets/tm_mui_bike.gif" ></coolui-scroll>
```
#### 可设置下拉刷新文字颜色
```html
<coolui-scroll type="diy" refreshColor"#fff"></coolui-scroll>
```
#### 可取消下拉加载文字只显示图片
```html
<coolui-scroll type="diy" refreshBackgroundImage="http://coolui.coolwl.cn/assets/tm_mui_bike.gif" refreshTitleShow="{{false}}"></coolui-scroll>
```
#### 可自定义下拉刷新结构
```html
<coolui-scroll type="diy" refreshDiy="{{true}}">
  <view class="refresh" slot="refresh">
    下拉加载
  </view>
</coolui-scroll>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| page | 页码 | _Number_ | `1` | - |
| totalPage | 总页码数 | _Number_ | `1` | - |
| isEmpty | 数据是否为空,传入列表的长度:`list.length` | _Number_ | `0` | - |
| emptyImg | 数据是否为空时显示的图片 | _string_ | `无` | - |
| scrollHeight | 滚动列表高度，默认为 `100%`,随外层结构高度变化 | _string_ | `100%` | - |
| type | 是否开启自定义开启则设置`diy` | _string_ | `default` | - |
| refreshDiy | 是否开启深度自定义,自定义下拉结构及动画,需开启自定义,使用插槽自定义 | _boolean_ | `false` | - |
| refreshStyle | 设置默认下拉刷新的原点颜色 | _string_ | `#f2f2f2` | - |
| refreshBackground | 设置默认下拉刷新的背景颜色,支持`black | white`  | _string_ | `black` | - |
| refreshthreshold | 设置下拉刷新高度 | _Number_ | `45` | - |
| refreshBackgroundImage | 设置自定义下拉刷新的背景图片图片路径,开启自定义才设置有效  | _string_ | `无` | - |
| refreshTitleShow | 设置是否显示自定义下拉刷新的文字,开启自定义才设置有效  | _boolean_ | `true` | - |
| refreshColor | 设置自定义下拉刷新的文字颜色,开启自定义才设置有效  | _string_ | `#999999` | - |

### Slots

| 名称 | 说明     |
| ---- | -------- |
| inner | 加载列表内容区域 |
| refresh | 下拉自定义结构 |

### Events

| 事件名      | 说明               | 参数                     |
| ----------- | ------------------ | ------------------------ |
| bind:refresh | 下拉刷新成功时触发     | - |
| bind:loadMore | 上拉加载成功时触发 | event.detail: 当前输入值 |
| bind:refreshPulling | 下拉时触发 | event.detail.p: 下拉进度 从0开始到1, 可根据p实现一些动画效果 |

<!-- ### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 | -->
