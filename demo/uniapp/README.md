# demo/uniapp

coolui-scroller **uni-app 版**示例工程（Vue3 + Vite，编译到微信小程序）。

## 运行

```bash
pnpm install
pnpm --filter demo-uniapp build:mp-weixin   # 编译到微信小程序，产物在 dist/build/mp-weixin
pnpm --filter demo-uniapp dev:mp-weixin     # 开发模式（watch）
```

用微信开发者工具打开 `dist/build/mp-weixin` 目录预览。

## 结构

```
uniapp/
├── src/
│   ├── main.js        # 应用入口（createSSRApp）
│   ├── App.vue
│   ├── pages.json     # 页面与窗口配置
│   ├── manifest.json  # 应用配置
│   └── pages/index/   # 示例页：下拉刷新 + 上拉加载
├── vite.config.js
└── package.json
```

## 说明

- 示例页通过 npm 包名 `coolui-scroller-uni`（workspace 依赖）引入组件，uni-app 会将其编译为微信小程序原生组件。
- 组件库源码位于 `../../packages/uniapp`，修改后重新编译即可生效。
