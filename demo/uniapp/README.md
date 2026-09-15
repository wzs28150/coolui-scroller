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
│   ├── main.js             # 应用入口（createSSRApp）
│   ├── App.vue
│   ├── pages.json          # 页面与窗口配置（含 easycom 规则）
│   ├── auto-imports.d.ts   # 自动导入生成的声明文件（仅供 IDE 提示）
│   ├── manifest.json       # 应用配置
│   └── pages/index/        # 示例页：下拉刷新 + 上拉加载
├── vite.config.mjs         # 必须是 .mjs，原因见下方「说明」
└── package.json
```

## 说明

- **组件免 import**：组件通过 `pages.json` 里的 **easycom** 规则自动引入，页面内无需 `import`、无需注册，模板中直接写 `<coolui-scroller-xxx>` 即可，且只编译用到的组件。
- **Vue API 免 import**：`ref` / `computed` / `watch` / `onMounted` / `nextTick` / `getCurrentInstance` 以及 uni-app 生命周期 `onLaunch` / `onLoad` 等，由 `vite.config.mjs` 中的 **unplugin-auto-import** 自动导入，页面与组件内同样无需手写 import。
- 配置文件必须命名为 `vite.config.mjs`：`unplugin-auto-import` 是纯 ESM 包，而本工程 `package.json` 未设 `"type": "module"`，若仍叫 `vite.config.js` 会被按 CJS 加载并报 `ERR_REQUIRE_ESM`。另外 `@dcloudio/vite-plugin-uni` 是 CJS 产物，在 ESM 配置下需要 `uniPlugin.default ?? uniPlugin` 取一次 default。
- 组件库源码位于 `../../packages/uniapp`，修改后重新编译即可生效。
