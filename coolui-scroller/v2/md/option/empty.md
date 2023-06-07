# 空数据配置
### 空数据配置是配置当前列表数据为空时的占位内容
> 出现空数据的前提是：pagination分页设置中length=0
### 参数
> 只做了简单的中间背景图标和文字的设计，你也可以发挥你的想象去安排gif图片去实现有趣的空数据画面

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| img | 数据为空时显示的图片 | _String_ | `http://coolui.coolwl.cn/assets/mescroll-empty.png`(测试图片正式上线请更换) | 2.0.0 |
| text | 数据为空时显示的文字,不设置则不显示 | _String_ | `暂无数据` | 2.0.2 |

### 效果
![空数据页面](https://raw.githubusercontent.com/wzs28150/coolui-scroller/web/v2/images/empty.jpg)<br/><br/>
