# coolui-scroller 编辑器提示插件

为 [coolui-scroller](https://github.com/wzs28150/coolui-scroller) 组件库提供编辑增强，同时覆盖两套组件：

- **微信小程序原生版**：`.wxml` 中的标签、属性、事件、插槽补全，悬停文档，`usingComponents` 缺失引入诊断与一键修复；
- **uni-app 版**：`.vue` 文件 `<template>` 中的标签、属性、事件、插槽补全与悬停文档，事件使用 `@`、属性使用 `:prop` 写法。

属性、默认值、事件、插槽、中文说明、引入路径等信息随组件库版本同步，装完就能用，无需任何配置。

## 功能

| 能力 | 原生小程序（`.wxml`） | uni-app（`.vue`） |
| --- | --- | --- |
| 标签补全 | 输入 `<scro` 补全 `<scroller>`，片段带常用属性与 `bind:` 事件 | 输入 `<coolui-scroller-refres` 补全标签，片段带常用属性与 `@` 事件 |
| 属性补全 | 标签内给出属性、类型、默认值、说明、废弃标记；布尔属性给出 `{{true}}`/`{{false}}`，枚举属性给出候选值 | 同上，支持 `:prop` / `prop` 写法 |
| 事件补全 | `bind:` / `catch:` | `@` / `v-on:` |
| 插槽补全 | 写 `slot="` 时按**外层标签**给出可用插槽 | 写 `#` 时按 `<template #xxx>` 的外层组件给出具名插槽 |
| 悬停文档 | 悬停标签名显示组件概览；悬停属性/事件/插槽显示说明 | 支持 `:prop`、`@event`、`#slot` 的悬停 |
| 引入诊断 | WXML 用到组件但页面 json / app.json 未引入时告警，并提供「引入」快速修复 | 不告警（默认由 easycom 自动引入） |
| json 补全 | `usingComponents` 中补全标签名（key）与组件路径（value） | — |

**别名感知**：原生版会读取当前页面同名 json 与 `app.json` 的 `usingComponents`，因此你把组件引入为
`"myScroller": "coolui-scroller/scroller/index"` 时，`<myScroller ...>` 也能得到完整提示；
uni-app 版会解析 `.vue` 中的 `import` 与 `components` 注册，重命名后的标签同样可识别
（未 import 时，`coolui-scroller*` 标签按 easycom 规则直接可用）。

**两个平台互不干扰**：`.wxml` 只提示原生组件，`.vue` 的 `<template>` 只提示 uni-app 组件，
`.vue` 的 `<script>` / `<style>` 区域不触发组件提示。

## 安装

| 编辑器 | 安装方式 |
| --- | --- |
| VS Code | 扩展面板搜索 `coolui-scroller`，或 `code --install-extension coolui.coolui-scroller-vscode` |
| Trae / VSCodium / Windsurf 等 | 扩展面板搜索 `coolui-scroller`（走 [Open VSX](https://open-vsx.org/extension/coolui/coolui-scroller-vscode)） |
| 微信开发者工具 | 见下方「在微信开发者工具里使用」 |
| 商店里搜不到 | 见下方「手动安装 VSIX」 |

> VS Code 的官方商店（Microsoft Marketplace）不对第三方编辑器开放，所以 Trae / VSCodium 这类衍生编辑器用的是 **Open VSX**，两边都能搜到本插件。

要求 VS Code **1.70 及以上**。

### 手动安装 VSIX

在扩展页面点「Download Extension」下载 `.vsix`（Open VSX 页面同样可以下载），然后：

- 图形界面：扩展面板右上角 `⋯` → **Install from VSIX...** → 选择下载的 `.vsix`；
- 命令行：`code --install-extension coolui-scroller-vscode-<version>.vsix`。

### 在微信开发者工具里使用

微信开发者工具的编辑器兼容大部分 VS Code 扩展，但**不支持直接安装 `.vsix`**，需要解包成文件夹：

1. 把下载的 `.vsix` 改后缀为 `.zip` 并解压，取出里面的 `extension` 文件夹；
2. 把它拷进扩展目录：开发者工具 → **设置 → 拓展设置 → 编辑器自定义扩展 → 打开扩展文件夹**
   （文件夹建议命名为 `coolui.coolui-scroller-vscode-<版本>`）；
3. 回到设置界面**启用**该扩展，然后**关闭并重新打开项目**。

> 自定义扩展默认不启用，且启用 / 禁用是全局生效的（不能按项目开关）。

## 配置项

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `cooluiScroller.enable` | `true` | 总开关 |
| `cooluiScroller.enableDiagnostics` | `true` | 是否检查原生组件未引入 |
| `cooluiScroller.packageName` | `coolui-scroller` | 原生版 npm 包名，用于生成引入路径 |
| `cooluiScroller.uniappPackageName` | `coolui-scroller-uni` | uni-app 版 npm 包名，用于解析 import |
| `cooluiScroller.docsBaseUrl` | 原生文档站点目录 | 原生组件悬停里的文档链接地址 |
| `cooluiScroller.uniappDocsBaseUrl` | uni-app 文档站点目录 | uni-app 组件悬停里的文档链接地址 |

## 相关链接

- 组件库文档站：<https://wzs28150.github.io/coolui-scroller/v4/>
- 组件库仓库：<https://github.com/wzs28150/coolui-scroller>
- 问题反馈：<https://github.com/wzs28150/coolui-scroller/issues>

> 本插件只做编辑期提示，不参与小程序运行时代码，可以放心安装。
