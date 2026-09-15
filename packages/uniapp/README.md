# coolui-scroller-uni

coolui-scroller 的 **uni-app 版本**：下拉刷新、上拉加载、长列表分页、下拉二楼、排序筛选等组件库，支持编译到微信/支付宝/百度/字节/QQ 小程序及 H5、App 端。

- 组件 API 与交互效果与原生版保持一致，属性与配置项可直接对照原生版文档。
- 基于 Vue `provide/inject` 实现组件通信，替代原生 `relations`。
- 跨端 API 统一封装在 `utils/platform.js`，自动适配各端差异。
- 兼容 Vue 2 / Vue 3。

## 安装

```bash
npm i coolui-scroller-uni
```

## 引入组件

### 方式一：全局注册（Vue3）

在 `main.js` 中：

```js
import { createSSRApp } from 'vue'
import App from './App.vue'
import CooluiScrollerUni from 'coolui-scroller-uni'

export function createApp() {
  const app = createSSRApp(App)
  app.use(CooluiScrollerUni)
  return { app }
}
```

Vue2 项目使用 `Vue.use(CooluiScrollerUni)` 即可。

### 方式二：easycom（推荐，免 import，本仓库 demo 即用此方式）

在 `pages.json` 中配置：

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^coolui-scroller(-.*)?$": "coolui-scroller-uni/components/coolui-scroller$1/coolui-scroller$1.vue"
    }
  }
}
```

配置后模板中直接使用组件标签，无需 `import` 与 `components` 注册：

```vue
<coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
  <template #refresh>
    <coolui-scroller-refresh :config="{ height: 60 }" />
  </template>
  <!-- ... -->
</coolui-scroller>
```

### 方式三：页面内局部引入

```vue
<script>
import { CooluiScroller } from 'coolui-scroller-uni'
export default {
  components: { CooluiScroller },
}
</script>
```

## 基础用法（下拉刷新 + 上拉加载）

```vue
<template>
  <view class="page">
    <coolui-scroller
      :isEmpty="isEmpty"
      background="#f2f2f2"
      @refresh="refresh"
      @loadmore="loadmore"
    >
      <template #refresh>
        <coolui-scroller-refresh :config="{ height: 60 }" />
      </template>

      <view v-for="(item, index) in list" :key="index" class="item">
        {{ item }}
      </view>

      <template #loadmore>
        <coolui-scroller-loadmore :status="loadStatus" />
      </template>
    </coolui-scroller>
  </view>
</template>
```

```js
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
```

## 组件清单

| 组件 | 说明 |
| ---- | ---- |
| `coolui-scroller` | 滚动容器（下拉刷新 / 上拉加载 / 空态 / 回到顶部） |
| `coolui-scroller-refresh` | 下拉刷新动画 |
| `coolui-scroller-loadmore` | 上拉加载更多 |
| `coolui-scroller-back-to-top` | 回到顶部 |
| `coolui-scroller-empty` | 空列表占位 |
| `coolui-scroller-item` | 列表项（水波纹） |
| `coolui-scroller-page` | 长列表分页 |
| `coolui-scroller-parallax` | 下拉视差 |
| `coolui-scroller-nav` | 分类导航 |
| `coolui-scroller-nav-bar` | 顶部导航栏 |
| `coolui-scroller-nav-pannel` | 切换容器 |
| `coolui-scroller-search` | 搜索框 |
| `coolui-scroller-sort` / `coolui-scroller-sort-item` | 排序筛选 |
| `coolui-scroller-second-floor` / `coolui-scroller-second-floor-refresh` | 下拉二楼 |
| `coolui-scroller-handtip` | 手势提示 |

## 组件通信

原生版通过 `relations` 关联父子组件，uni-app 版改为 Vue `provide/inject`：

- `coolui-scroller` → `coolui-scroller-refresh` / `coolui-scroller-back-to-top`
- `coolui-scroller-refresh` → `coolui-scroller-parallax`
- `coolui-scroller-nav-pannel` → `coolui-scroller`
- `coolui-scroller-sort` → `coolui-scroller-sort-item`
- `coolui-scroller-second-floor` → `coolui-scroller-second-floor-refresh` / `coolui-scroller-nav-bar`

使用时保持组件的**嵌套层级**与文档一致即可，无需手动配置。

## 与原生版的差异

- **保留字属性改名**：原生 `key` 在 Vue 中为保留字，search 组件改用 `keyword`，通过 `@update:keyword` 同步。
- **事件命名**：原生 `bind:xxx` 对应 Vue 的 `@xxx`（如 `bind:refresh` → `@refresh`）；受控属性通过 `@update:propName` 同步（如 sort-item 的 `@update:value`）。

## 示例工程

仓库内提供 `demo/uniapp` 示例工程（Vue3 + Vite，编译到微信小程序）：

```bash
pnpm install
pnpm --filter demo-uniapp build:mp-weixin   # 编译到微信小程序
pnpm --filter demo-uniapp dev:mp-weixin     # 开发模式（watch）
```

用微信开发者工具打开 `demo/uniapp/dist/build/mp-weixin` 即可预览。

示例工程已配置 **easycom**（组件免 import）与 **unplugin-auto-import**（Vue API 免 import），页面内不出现任何组件或 `ref` 之类的 import，可直接作为接入参考。

## 目录结构

```
packages/uniapp/
├── components/
│   ├── coolui-scroller/          # 滚动容器
│   ├── coolui-scroller-refresh/  # 下拉刷新
│   └── ...                       # 其余组件
├── utils/
│   └── platform.js               # 跨端 API 封装
└── index.js                      # 入口（install 插件 + 组件导出）
```

## 使用文档

各组件详细属性与配置见 [coolui-scroller 官方文档](https://wzs28150.github.io/coolui-scroller/v3/platform/uni-app)。
