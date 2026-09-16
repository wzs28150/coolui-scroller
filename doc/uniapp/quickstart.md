# 快速开始

这里是最小可运行的「下拉刷新 + 上拉加载」示例，直接拷进页面即可跑起来（配合 [安装与引入](/uniapp/install) 的 easycom 配置）。

## 页面代码

```vue
<template>
  <view class="page">
    <coolui-scroller
      :isEmpty="isEmpty"
      background="#f2f2f2"
      @refresh="refresh"
      @loadmore="loadmore"
    >
      <!-- 下拉刷新动画 -->
      <template #refresh>
        <coolui-scroller-refresh :config="{ height: 60 }" />
      </template>

      <!-- 列表内容 -->
      <view v-for="(item, index) in list" :key="index" class="item">
        {{ item }}
      </view>

      <!-- 上拉加载 -->
      <template #loadmore>
        <coolui-scroller-loadmore :status="loadStatus" />
      </template>
    </coolui-scroller>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false,
      list: [],
      page: 1,
      loadStatus: 'loading',
    }
  },
  onLoad() {
    this.getList(1)
  },
  methods: {
    getList(page) {
      // 请求数据，返回 promise
      return new Promise((resolve) => {
        setTimeout(() => {
          const start = (page - 1) * 10
          const arr = []
          for (let i = start; i < start + 10; i++) arr.push('数据' + (i + 1))
          this.list = this.list.concat(arr)
          resolve()
        }, 600)
      })
    },
    refresh() {
      this.page = 1
      this.list = []
      this.getList(1).then(() => {
        this.loadStatus = 'loading'
      })
    },
    loadmore() {
      this.page++
      this.getList(this.page).then(() => {
        this.loadStatus = 'loading'
      })
    },
  },
}
</script>
```

## 关键点

| 点 | 说明 |
| --- | --- |
| `@refresh` / `@loadmore` | 原生微信小程序版的 `bind:refresh` 在这里写成 `@refresh`（Vue 事件绑定） |
| `#refresh` / `#loadmore` | 插槽名与原生微信小程序版一致，保持组件嵌套层级即可，无需额外配置 |
| `getList` 返回 promise | 组件按 promise 结束刷新/加载流程，返回前不要提前 resolve，否则动画会提前收起 |
| `:isEmpty` | 数据为空时显示空态，配合 `coolui-scroller-empty` 自定义空列表 |

## 长列表

数据量大时不要直接渲染全部节点，用长列表组件：

- `coolui-scroller-longlist`：**推荐**，窗口化方案 —— 窗口外的内容折叠为上下占位块，渲染的节点数与总页数无关。
- `coolui-scroller-page`：旧方案，按页整页占位。

完整用法见示例工程 `demo/uniapp/src/pages/longlist/index.vue`，组件说明见 [组件总览](/uniapp/components/#coolui-scroller-longlist)。

## 两个高频坑

1. **下拉手感发硬、没有弹性**：把刷新配置的 `background.height` 设得比 `height` 大（例如 `height: 50`、`background.height: 120`），松手才会先回落到刷新高度显示动画、完成后再整体回弹。详见 [常见问题](/advanced/faq#下拉刷新没有弹性回弹感)。
2. **H5 上出现页面级滚动条**：全屏页写 `height: 100vh` 没扣掉 H5 内置导航栏，改成 `calc(100vh - var(--window-top))`。详见 [跨端差异](/uniapp/platform-diff#h5-内置导航栏会额外占高)。
