# 微信小程序canvas 波浪背景组件 wave-bg-weapp 
### 前言
> 最近的项目中坑爹的设计师设计了一个波浪的背景效果,
> 本着高度还原设计稿的原则打算用canvas实现一下,
> 一番百度之后并没有找到满意的效果,
> 所以自己撸了一个感觉还不错共享给大家.

### 效果
![avatar](https://raw.githubusercontent.com/wzs28150/wave-bg-weapp/7f661120be43021a6af8852f17aa84246a5e647c/demo.gif)
### 演示片段
> https://developers.weixin.qq.com/s/g9tWlAmG7st8
### 依赖
> 组件依赖simplex-noise Simplex噪声算法
### npm 安装 安装之后开发者工具点击npm构建
```
npm i wave-bg-weapp --production
```
### 引入
> 在app.json或index.json中引入组件
```
"usingComponents": {
   "bg": "/miniprogram_npm/wave-bg-weapp/bg/index"
}
```
### 页面结构
```
<bg class="bg" color="#d13435" percent="90" position="top" amp="20"></bg>
```

### 参数
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 波浪填充颜色  | _String_ | `#d13435` | 1.0.2 |    
| percent | 高度百分比 如:90(即波浪高度为canvas高度的90%) | _Number_ | 50 | 1.0.2 |    
| position | 波浪填充位置  可设置 `top`: 在上部填充颜色, `bottom`: 在下部填充颜色 | _String_ | top | 1.0.2 |  
| amp | 波浪振幅 | _Number_ | 20 | 2.0.2 | 

### 插槽
> 不知道为何canvas写完之后发现层级很高,但是看官方文档支持同层渲染阿 没研究明白,弄了个插槽可以将一些元素覆盖上去,本质上是写了cover-view,所以插槽里只能用cover-view下支持的组件,而且开发者工具看不到覆盖的东西,真机测试有效果

```
<bg class="bg" color="#d13435" percent="90" position="top" amp="20">
  <cover-view>插槽内容</cover-view>
</bg>
```
