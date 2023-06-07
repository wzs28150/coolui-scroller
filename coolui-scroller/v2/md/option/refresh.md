# 下拉配置
> 下拉配置情况较多，先看参数, 然后我们分情况来介绍
### 参数
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 下拉样式类型,小程序默认样式或自定义 支持 `default 或 diy`  | _String_ | `default` | 2.0.0 |    
| diyLevel | 自定义等级,简单设置：1,插槽自定义：2 支持 `1`或`2` | _Number_ |  | 2.0.0 |
| style | 默认模式下样式有深色和浅色 支持 `black 或 white` | _String_ | `black` | 2.0.0 |
| p | 自定义等级2时,下拉的百分比方便自定义动画,设置0即可| _Number_ | `0` | 2.0.0 |
| height | 自定义下拉高度(原设置refreshthreshold) | _Number_ |  | 2.0.2 |    
| background | 自定义下拉背景 可设置`color`: 背景颜色 `img`: 背景图片 | _Obj_ |  | 2.0.2 |     
| title | 自定义下拉文字 可设置 `show`: 是否显示, `text`: 文字内容, `color`: 文字颜色, `shadow`: 文字阴影范围(0时不显示)  | _Obj_ |  | 2.0.0 | 
| icon | 自定义下拉图标 可设置`img`: 图片 `name`: 图标名称，内置图标敬请期待 | _Obj_ | { name: 'down' } | 2.0.2 |    
| shake | 下拉时是否开启震动  | _Boolean_ |  | 2.0.0 | 

### 情况一：使用官方的原有效果：
> 示例：在这个效果中无需写页面结构，我们可以设置深色浅色及背景颜色等

![基础用法](https://raw.githubusercontent.com/wzs28150/coolui-scroller/web/v2/images/refresh1.jpg)

> 配置：

```js
    Option: {
      refresh: {
        type: 'default', // 设置类型为系统默认效果
        style: 'black', // 设置样式官方提供两种：深色和浅色 值为 black 或 white(注意：该设置只有在type为default时有效)
        background: {
           color: "#f2f2f2" // 设置背景颜色,默认为 #f2f2f2(注意：背景颜色如果是深色系,请设置style为white,否则中间三个点就看不见了)
        },
        shake:true // 是否开启下拉震动
      }
    },
```
### 情况二：我们推荐的组件的基础效果：
> 示例：在这个效果中无需写页面结构，我们可以设置下拉文字(title)、下拉图标(icon)、下拉背景(background)、下拉高度等(height)。

![推荐用法](https://raw.githubusercontent.com/wzs28150/coolui-scroller/web/v2/images/refresh2.gif)
> 配置：

```js
    Option: {
      refresh: {
        type: 'diy', // 开启自定义效果区别于官方提供的效果
        diyLevel: 1, // 设置自定义等级1，使用组件提供的效果模式
        height: 70,
        background: {
            color: '#000',
            img: 'http://coolui.coolwl.cn/assets/bg.jpg'
        },
        title: {
          show: true, // 是否显示文字,如果设置了false 图标同时不显示,这样你可以完全通过背景来实现下拉效果
          text: '下拉刷新', // 文字内容
          color: "#000000", // 文字颜色
          shadow: 5 // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
        },
        icon: {
            img: '',
            name: 'down' // 组件默认为down一个可旋转的箭头
        },
        shake:true // 是否开启下拉震动
      }
    },
```
### 情况三：在情况二的基础上禁用文字,并使用图片作为背景：
> 示例：在这个效果中我们可以设置gif动图，实现更多有趣的效果。

![动图用法](https://raw.githubusercontent.com/wzs28150/coolui-scroller/web/v2/images/refresh3.gif)
> 配置：

```js
    Option: {
      refresh: {
        type: 'diy', // 开启自定义效果区别于官方提供的效果
        diyLevel: 1, // 设置自定义等级1，使用组件提供的效果模式
        height: 70,  // 设置下拉的高度
        background: {
            color: '#000',
            img: 'http://coolui.coolwl.cn/assets/tm_mui_bike.gif'
        },
        title: {
          show: false // 是否显示文字,如果设置了false 图标同时不显示,这样你可以完全通过背景来实现下拉效果
        },
        shake:true // 是否开启下拉震动
      }
    },
```
### 情况四：将diyLevel设置为2,开启完全自定义：
> 示例：在这个效果中我们要使用插槽,然后在页面自定义下拉得结构及使用动画。搭配refreshPulling方法。动态修改下拉进度p值来实现一些动画

![动图用法](https://raw.githubusercontent.com/wzs28150/coolui-scroller/web/v2/images/refresh4.gif)
```html
    <coolui-scroll class="demo1"  scrollOption="{{Option}}" bindrefreshPulling="refreshPulling">
        <view class="refresh" slot="refresh">
            <!-- Option.refresh.p值范围由0~1,当下拉到最大时值为1,恢复之后值为0,可搭配css动画来实现一些缩放、移动、旋转等效果-->
            <view style="transform: scale({{Option.refresh.p}})" />
        </view>
    </coolui-scroll>           
```
> 配置：

```js
    Option: {
      refresh: {
        type: 'diy', // 开启自定义效果区别于官方提供的效果
        diyLevel: 2, // 设置自定义等级2，完全自定义模式
        height: 60,  // 设置下拉的高度
        p: 0         // 下拉的百分比方便自定义动画,设置0即可
      }
    },
```