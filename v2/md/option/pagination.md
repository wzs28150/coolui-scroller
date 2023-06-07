# 分页配置

### 分页配置比较简单，有四个参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| page | 页码 | _Number_ | `1` | 2.0.0 |
| totalPage | 总页码数 | _Number_ | `0` | 2.0.0 |
| limit | 每页显示个数 | _Number_ | `0` | 2.0.0 |
| length | 总个数(个数为0是,页面显示空样式) | _Number_ | `0` | 2.0.0 |

### js
```js
 pagination: {
    page: 1,
    totalPage: 10,
    limit: 10,
    length: 100
 }
```
### 注意
> 请严格的设置totalPage, 当totalPage总页数等于当前页数时证明所有页面都已经加载完毕。页面底部的loadmore才会隐藏不出现
