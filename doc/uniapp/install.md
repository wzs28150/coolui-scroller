# 安装与引入

本页是 **uni-app 版**（npm 包 `coolui-scroller-uni`）的接入方式。组件源码为 `.vue`（`<script setup lang="ts">`），兼容 **Vue 2 / Vue 3**，可编译到微信 / 支付宝 / 百度 / 字节 / QQ 小程序以及 **H5、App** 端。

::: tip 用的是原生微信小程序项目？
请看 [原生微信小程序版安装与引入](/native/install)，或点顶部导航切换平台。
:::

## 安装

```bash
npm i coolui-scroller-uni
```

不使用 npm 的项目（例如直接用 HBuilderX 开发），也可以把包里的 `components/`、`utils/`、`types.ts`、`index.js` 拷进项目目录——发布的是源码，可以直接参与编译，把 easycom 规则指向你的实际目录即可。

## 引入组件

### 方式一：easycom（推荐）

在 `pages.json` 里加自定义规则（本仓库 demo 即用此方式）：

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

配置后模板里直接用标签，**无需 `import`，也无需在 `components` 里注册**：

```vue
<coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
  <template #refresh>
    <coolui-scroller-refresh :config="{ height: 60 }" />
  </template>
</coolui-scroller>
```

> 注意：`autoscan: false` 时规则必须自己写全，标签名要能匹配上面的正则（`coolui-scroller-*`）。若 easycom 不生效，先确认 `pages.json` 的修改已编译生效、组件目录名与规则一致。

### 方式二：全局注册

`main.js`（Vue3）：

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

Vue2 项目用 `Vue.use(CooluiScrollerUni)`。

### 方式三：页面内局部引入

```vue
<script>
import { CooluiScroller } from 'coolui-scroller-uni'
export default {
  components: { CooluiScroller },
}
</script>
```

## TypeScript 支持

组件用 `PropType<T>` 精确标注了 props，并给 `defineEmits`、`provide/inject` 的通信 API 补了类型，编辑器（Volar / vue-tsc）可获得完整提示。公共类型集中在 `types.ts`，可直接引入：

```ts
import type {
  CooluiScrollerProps,
  CooluiScrollerRefreshProps,
  CooluiRefreshConfig,
  CooluiSortOption,
} from 'coolui-scroller-uni/types'
```

## 组件清单

见 [组件总览 / 命名对照](/uniapp/components/)，里面有原生微信小程序版与 uni-app 版的标签对照表。

## 示例工程

仓库里的 `demo/uniapp` 是 Vue3 + Vite 的示例工程（已配置 easycom 与自动导入，可直接作为接入参考）：

```bash
pnpm install
pnpm --filter demo-uniapp build:mp-weixin   # 编译到微信小程序
pnpm --filter demo-uniapp dev:mp-weixin     # 开发模式（watch）
```

编译后用微信开发者工具打开 `demo/uniapp/dist/build/mp-weixin` 预览；App 端用 `npm run build:app` 生成资源包，再用 HBuilderX 打包。

## 下一步

- [快速开始](/uniapp/quickstart)：最小可运行的下拉刷新 + 上拉加载
- [与原生微信小程序版的差异](/uniapp/platform-diff)：事件命名、通信方式，以及 H5 / 小程序 / App 各端的坑
