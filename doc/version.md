# 版本更新

### v3.3.6

1. 修改 scroller 组件 解决滚动时由于未使用 backToTop 缺少判断时造成的 data 不存在的 bug。

### v3.3.4

1. 修改 scroller 组件 增加 backToTop 插槽, 可单独配置返回顶部按钮，移除 isBackBtn 配置。

2. 新增 backToTop 组件，可设置阈值、显示时间及样式。

### v3.3.3

1. 修改 loadmore 组件 解决 loadmore 组件的 no more 颜色属性不起作用。

### v3.3.2

1. 修改 search 组件 增加 css 变量, 可修改搜索文字颜色及背景颜色。

### v3.3.1

1. 修改 floor 组件 增加 tip 设置, 可进入页面时自动下拉一次提示用户有二楼内容。

### v3.3.0

1. 修改 scroller 组件 nav 增加 animation 设置, 暴露 scroll-view 的 scroll-with-animation 设置。

### v3.2.9

1. 修改 分类导航组件 nav 增加 type、spaceBetween、navPerView、border、text、background 设置,废弃 active-color 设置。

### v3.2.8

1. 修改 滚动组件 scroller 增加 top 设置,可设置滚动到指定位置

### v3.2.7

1. 新增 切换组件 nav-pannel
2. 修改 nav 组件宽度计算触发的时机,解决刚进页面时宽度出现问题的 bug
3. 新增 scroller 增加事件 contentHeight 方便获取内容区域高度(不包含头部 header 的高度)

### v3.2.6

1. 新增 图文社交 案例
2. 新增 nav-bar 组件搭配 下拉二楼使用
3. 新增 LOGO 文字下拉效果

### v3.2.5

1. 使用 pnpm monorepo 整理代码
2. 更新 demo 页面

### v3.2.3

1. 新增二楼组件 second-floor
2. 新增二楼刷新组件 second-floor-refresh

### v3.1.1

1. 修改下拉刷新背景颜色设置, 取消 scroll 的 background, 还原 refresh 的 background.color
2. 修改 loadmore 设置,不同状态下可单独设置文字颜色
3. 调整 empty 组件位置解决 isEmpty 为 true 时 无法下拉的 bug,删除 empty 的背景颜色

### v3.0.8

1.新增 sort 排序分类筛选组件

### v3.0.5

1. 取消返回到顶部原来执行刷新的方法
2. 添加回到顶部参数，开启回到顶部滚动动画

### v3.0.4

1. 修改 item 组件增加水波效果
2. 修改下拉 refresh 触发时机
3. 新增 refresh 下拉状态属性 refreshstate
4. 新增 refresh 下拉设置 isAutoTriggered，判断是否自动回弹
5. 修改组件内 callback 为 promise

### v3.0.0

1. 基于小程序原生组件 scroll-view 的扩展与封装,实现简单的上拉加载下拉刷新
2. 扩展下拉刷新动画，有灵感的朋友可以丰富更多下拉动画
3. 上传至 npm 包可安装下载并 npm 构建
4. 修改参数配置使组件使用更便捷
5. 增加加载插槽可以自定义加载更多样式
6. 增加多组件配合使列表功能更丰富
