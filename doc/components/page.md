# scroll-page 长列表分页组件

## 介绍

长列表解决方案：将数据分为多个 page 页面(如下图)。每个 page 页面包含列表项 item。计算每个 page 的高度。当 page1 已加载完并且已经划过到可视区上面时，将该 page1 设为当前的 page 高度，并删除里面的列表项 item。完成用一个空的 page 进行占位。这样就减少了过多的列表项 dom。当页面向下滚动时。page1 又进入可视区时，将列表项 item 再还原回来。

为了保证滚动时的连贯性。我们保存了当前可视区及可视区上下两个 page 页面中的列表项。其余 page 中的列表项全部删除，只有滚动到时才显示。这样就保证页面中有且只有三个 page 中有列表项。其余均是空白占位区域。

<img :src="'/images/page1.jpg'" alt="示例图一" >

<img :src="'/images/page2.png'" alt="示例图二" >

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "scroll-page": "coolui-scroller/scroll-page/index"
}
```

## 代码演示

注意：需要引入组件提供的方法来计算每个 page 页面的高度

::: code-group

```html [index.wxml]
<scroller
  class="{{(loadMoreSetting.status == 'loading' && list.length == 0) ? 'isloading' : ''}}"
  id="scroller"
  bind:loadmore="getList"
  bind:refresh="refresh"
  isEmpty="{{isEmpty}}"
  background="#f2f2f2"
>
  <refresh slot="refresh" type="default" config="{{defaultSetting}}" />
  <!-- 列表 -->
  <!-- page组件循环页 -->
  <scroll-page
    wx:for="{{ list }}"
    id="wrp_{{pageIndex}}"
    wx:for-index="pageIndex"
    wx:for-item="listSingleItem"
    wx:key="index"
    pageList="{{ listSingleItem }}"
  >
    <!-- item组件循环项 -->
    <item
      wx:for="{{ listSingleItem }}"
      wx:for-index="index"
      wx:for-item="listItem"
      wx:key="index"
    >
      <view class="item">
        <image class="item-image" src="{{listItem.img}}"></image>
        <view class="item-title"
          >{{(pageIndex * 3) + listItem.id}}.{{listItem.title}}</view
        >
      </view>
    </item>
    <!-- item组件循环项 -->
  </scroll-page>
  <!-- page组件循环页 -->
  <!-- 列表 -->
  <!-- 加载更多组件 -->
  <loadmore
    slot="loadmore"
    status="{{loadMoreSetting.status}}"
    loadingText="{{loadMoreSetting.loadingText}}"
    noMoreText="{{loadMoreSetting.noMoreText}}"
    moreText="{{loadMoreSetting.moreText}}"
    color="{{loadMoreSetting.color}}"
  />
  <!-- 加载更多组件 -->
</scroller>
```

```js [index.js]
// 调用组件提供的方法文件
const utils = require('coolui-scroller/index.js')

Page({
  data: {
    isEmpty: false,
    list: [],
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点深色还是浅色
    },
    loadMoreSetting: {
      status: 'more',
      moreText: '上拉加载更多',
      loadingText: '加载中...',
      noMoreText: '-- 到底啦 --',
      color: '#999',
    },
    emptySetting: {
      img: '../../img/empty.png',
      // img: 'http://www.365editor.com/images/nodata.png',
      text: '暂无文章',
    },
  },

  onLoad() {
    // 设置缓存全部数据
    this.wholeList = []
    // 设置当前渲染第几页
    this.currentRenderIndex = 0
    // 设置缓存每一页页面高度
    this.pageHeightArr = []
    // 设置总页数
    this.totalPageNum = 0
    // 设置分页
    this.param = {
      limit: 4,
      page: 0,
    }

    this.getList()
  },
  getList() {
    const than = this
    const loadMoreSetting = than.data.loadMoreSetting
    // 判断当前是否为加载状态 防止页面重复添加数据
    if (loadMoreSetting.status !== 'loading') {
      loadMoreSetting.status = 'loading'
      than.setData({
        loadMoreSetting,
      })
      const page = this.param.page
      this.currentRenderIndex = page
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        const loadMoreSetting = than.data.loadMoreSetting
        loadMoreSetting.status = 'noMore'
        than.setData({
          loadMoreSetting,
        })
      } else {
        //  获取远程数据可换成自己封装的请求方法
        wx.request({
          url: 'https://coolui.coolwl.cn',
          data: {
            page: page + 1,
            isempty: 0, // 设置为1可测试空数据
            limit: 10,
            pagenum: 10,
            islong: 1,
          },
          method: 'get',
          success(res) {
            if (res.data.code === 200) {
              than.totalPageNum = res.data.data.last
              if (res.data.data.list.length === 0 && page === 0) {
                const loadMoreSetting = than.data.loadMoreSetting
                loadMoreSetting.status = 'noMore'
                than.setData({
                  isEmpty: true,
                  loadMoreSetting,
                })
              } else {
                than.wholeList[page] = res.data.data.list
                const datas = {}
                datas['list[' + page + ']'] = res.data.data.list
                than.setData(datas, () => {
                  // 调用方法设置page页面高度
                  utils.setHeight(than)
                  const loadMoreSetting = than.data.loadMoreSetting
                  loadMoreSetting.status = 'more'
                  than.setData({
                    loadMoreSetting,
                  })
                  than.param.page += 1
                })
              }
            }
          },
        })
      }
    }
  },
  refresh() {
    // 初始化缓存数据
    const that = this
    this.wholeList = []
    this.currentRenderIndex = 0
    this.pageHeightArr = []
    this.param = {
      limit: 4,
      page: 0,
    }
    that.setData({
      list: [],
    })
    // 重新拉取数据
    that.getList()
  },
})
```

:::

## 配置

| 参数     | 说明                           | 类型    | 默认值 | 版本  |
| -------- | ------------------------------ | ------- | ------ | ----- |
| pageList | 传入当前 page 分页面的列表数组 | _Array_ | 无     | 3.0.0 |
