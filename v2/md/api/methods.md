# 方法
### loadEnd 加载结束之后 关闭loadmore显示
> 页面结构
```html
    // 设置class 方便js获取组件
	<coolui-scroll class="demo1">
    </coolui-scroll>
```
> js 
```js
    this.selectComponent(".demo1").loadEnd()
```