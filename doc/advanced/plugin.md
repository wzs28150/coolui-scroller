# 编辑器插件（VS Code / Trae）

coolui-scroller 提供了编辑器扩展：写 `.wxml` 和 uni-app 的 Vue 模板时，**组件标签、属性、事件、插槽自动补全，悬停即可看到中文说明**；原生小程序里用到组件却没在 `usingComponents` 中引入时还会给出告警和一键修复。

> 当前版本 **0.1.3**，支持 VS Code 与 Trae / VSCodium / Windsurf 等基于 Open VSX 的编辑器。

:::: tip 一套提示，两个平台
`.wxml` 只提示原生小程序组件，`.vue` 的 `<template>` 只提示 uni-app 组件，互不干扰；`.vue` 的 `<script>` / `<style>` 区域不会触发组件提示。
::::

## 安装

| 编辑器 | 安装方式 |
| --- | --- |
| VS Code | 扩展面板搜索 `coolui-scroller`，或命令行 `code --install-extension coolui.coolui-scroller-vscode` |
| Trae / VSCodium / Windsurf 等 | 扩展面板搜索 `coolui-scroller`（走 [Open VSX](https://open-vsx.org/extension/coolui/coolui-scroller-vscode)）；搜不到就用下面的手动安装 VSIX |
| 商店里搜不到 | 手动安装 VSIX，见下 |

### 手动安装 VSIX（兜底方案）

在组件库仓库的 `plugin` 目录执行：

```bash
cd plugin
npm install
npm run package     # 生成 coolui-scroller-vscode-<version>.vsix
```

然后：扩展面板右上角 `⋯` → **Install from VSIX...** → 选择生成的 `.vsix`。

## 功能

| 能力 | 原生小程序（`.wxml`） | uni-app（`.vue`） |
| --- | --- | --- |
| 标签补全 | 输入 `<scro` 补全 `<scroller>`，片段带常用属性与 `bind:` 事件 | 输入 `<coolui-scroller-refres` 补全标签，片段带常用属性与 `@` 事件 |
| 属性补全 | 标签内给出属性、类型、默认值、说明、废弃标记；布尔属性给出 `{{true}}`/`{{false}}`，枚举属性给出候选值 | 同上，支持 `:prop` / `prop` 写法 |
| 事件补全 | `bind:` / `catch:` | `@` / `v-on:` |
| 插槽补全 | 写 `slot="` 时按**外层标签**给出可用插槽 | 写 `#` 时按 `<template #xxx>` 的外层组件给出具名插槽 |
| 悬停文档 | 悬停标签名显示组件概览；悬停属性/事件/插槽显示说明 | 支持 `:prop`、`@event`、`#slot` 的悬停 |
| 引入诊断 | WXML 用到组件但页面 json / `app.json` 未引入时告警，并提供「引入」快速修复 | 不告警（默认由 easycom 自动引入） |
| json 补全 | `usingComponents` 中补全标签名（key）与组件路径（value） | — |

### 别名感知

- **原生版**：会读取当前页面同名 json 与 `app.json` 的 `usingComponents`。所以你把组件引入为 `"myScroller": "coolui-scroller/scroller/index"` 时，`<myScroller ...>` 同样有完整提示。
- **uni-app 版**：会解析 `.vue` 中的 `import` 与 `components` 注册，重命名后的标签也能识别；未 import 时按 easycom 规则，`coolui-scroller*` 标签直接可用。

### 组件数据来源

属性、默认值、事件、插槽、中文说明、引入路径等信息全部由脚本从组件源码与 `doc/` 文档中**自动提取**，与文档站保持同步，不需要手工维护两份数据。

## 配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `cooluiScroller.enable` | `true` | 总开关 |
| `cooluiScroller.enableDiagnostics` | `true` | 是否检查原生组件未引入 |
| `cooluiScroller.packageName` | `coolui-scroller` | 原生版 npm 包名，用于生成引入路径 |
| `cooluiScroller.uniappPackageName` | `coolui-scroller-uni` | uni-app 版 npm 包名，用于解析 import |
| `cooluiScroller.docsBaseUrl` | 原生文档站点目录 | 原生组件悬停里的文档链接地址 |
| `cooluiScroller.uniappDocsBaseUrl` | uni-app 文档站点目录 | uni-app 组件悬停里的文档链接地址 |

## 配合 AI 助手使用

组件库同时提供面向 AI 的文档，装到项目里即可让 AI 助手准确写出组件代码：

- 随 npm 包发布：`node_modules/coolui-scroller/AGENTS.md`、`node_modules/coolui-scroller/llms.txt`
- 线上全量文档：<https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt>

把下面这段放进项目的 `AGENTS.md` 或编辑器 Rules 中，AI 就会自动参考：

```md
## coolui-scroller

使用 coolui-scroller 组件前，先读 node_modules/coolui-scroller/AGENTS.md；
需要完整组件 API 与示例时，读 https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt
```

## 相关

- 插件源码与开发说明：仓库 [`plugin/`](https://github.com/wzs28150/coolui-scroller/tree/dev/plugin) 目录（含元数据提取、打包、发布流程）
- 版本记录见 [更新日志](/version)
