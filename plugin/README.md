# coolui-scroller 编辑器提示插件（VSCode）

为 [coolui-scroller](https://github.com/wzs28150/coolui-scroller) 组件库提供编辑增强，同时覆盖两套组件：

- **微信小程序原生版**：`.wxml` 中的标签、属性、事件、插槽补全，悬停文档，`usingComponents` 缺失引入诊断与一键修复；
- **uni-app 版**：`.vue` 文件 `<template>` 中的标签、属性、事件、插槽补全与悬停文档，事件使用 `@`、属性使用 `:prop` 写法。

组件的最新信息（属性、默认值、事件、插槽、中文说明、引入路径）全部由脚本从组件源码与文档中
自动提取，**不需要手工维护两份数据**。

## 安装

| 编辑器 | 安装方式 |
| --- | --- |
| VS Code | 扩展面板搜索 `coolui-scroller`，或 `code --install-extension coolui.coolui-scroller-vscode` |
| Trae / VSCodium / Windsurf 等 | 走 [Open VSX](https://open-vsx.org/extension/coolui/coolui-scroller-vscode)，在扩展面板搜索 `coolui-scroller` |
| 上面都搜不到 | 手动安装 VSIX，见下 |

> VS Code 的官方商店（Microsoft Marketplace）不对第三方编辑器开放，所以衍生编辑器用的是 **Open VSX**，两个商店需要分别发布（见[打包与发布](#打包与发布)）。

### 手动安装 VSIX（所有 VS Code 衍生编辑器通用）

```bash
npm run package      # 生成 coolui-scroller-vscode-<version>.vsix
```

- 图形界面：扩展面板右上角 `⋯` → **Install from VSIX...** → 选择生成的 `.vsix`；
- 命令行：`code --install-extension coolui-scroller-vscode-<version>.vsix`。

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

别名感知：原生版会读取当前页面同名 json 与 `app.json` 的 `usingComponents`，因此你把组件引入为
`"myScroller": "coolui-scroller/scroller/index"` 时，`<myScroller ...>` 也能得到完整提示；
uni-app 版会解析 `.vue` 中的 `import` 与 `components` 注册，重命名后的标签同样可识别
（未 import 时，`coolui-scroller*` 标签按 easycom 规则直接可用）。

两个平台互不干扰：`.wxml` 只提示原生组件，`.vue` 的 `<template>` 只提示 uni-app 组件，
`.vue` 的 `<script>` / `<style>` 区域不触发组件提示。

## 目录结构

```
plugin/
├─ src/
│  ├─ extension.ts            # 激活入口：注册 Provider、命令、事件
│  ├─ meta.ts                 # 元数据索引（标签名 / 路径 -> 组件）
│  ├─ tags.ts                 # 解析 usingComponents / .vue import，建立 tag -> 组件映射
│  ├─ providers/
│  │  ├─ completion.ts        # 标签 / 属性 / 事件 / 插槽补全
│  │  ├─ hover.ts             # 悬停文档
│  │  ├─ jsonCompletion.ts    # json 里的引入补全
│  │  └─ diagnostics.ts       # 缺失引入诊断 + 快速修复
│  ├─ utils/                  # 模板上下文解析、Markdown 渲染、json 文本编辑
│  └─ data/components.json    # 生成的元数据（由脚本产出）
├─ scripts/
│  ├─ extract-metadata.mjs    # 从 packages/native、packages/uniapp 与 doc 提取元数据
│  ├─ build.mjs               # esbuild 打包
│  └─ smoke.mjs               # 冒烟测试（mock vscode API）
└─ images/icon.png            # 扩展图标（Marketplace 与扩展列表中展示）
```

## 开发与调试

```bash
cd plugin
npm install
npm run build          # 提取元数据（native + uni-app）+ 打包到 dist/extension.js
npm run typecheck      # 类型检查
npm test               # 冒烟测试（28 项用例）
```

以 `plugin` 目录作为工作区打开后，按 `F5` 可选择「运行扩展（原生 demo）」或「运行扩展（uni-app demo）」；
修改源码后执行 `npm run watch` 可持续构建。

组件更新（新增属性、组件）后执行 `npm run extract` 重新生成 `src/data/components.json`。

## 图标

扩展图标为 `images/icon.png`（PNG，至少 128×128），通过 `package.json` 的 `icon` 字段引用：

```jsonc
"icon": "images/icon.png"
```

打包时会一并放进 VSIX（`.vscodeignore` 未排除 `images/`）。换图标直接替换该文件即可，保持文件路径不变；若换了路径，记得同步改 `icon` 字段。

## 打包与发布

```bash
npm run package        # 只打包：生成 coolui-scroller-vscode-<version>.vsix
npm run publish        # 打包并发布到 VS Code Marketplace
```

`npm run publish` 会自动先执行 `vscode:prepublish`（提取元数据 + 生产构建），不需要手动 build。

### 首次发布前的准备

| 步骤 | 位置 | 说明 |
| --- | --- | --- |
| 创建 publisher | <https://marketplace.visualstudio.com/manage> | ID 必须与 `package.json` 的 `publisher` 一致（当前为 `coolui`）；若该 ID 已被占用，需改用其它 ID 并同步修改 `package.json` |
| 创建 PAT | <https://dev.azure.com> → User settings → Personal access tokens | Scope 勾选 **Marketplace → Manage**，Organization 选 All accessible organizations |
| 登录 | 本地命令行 | `npx @vscode/vsce login coolui`，粘贴 PAT（本地记住，后续发布无需再输） |

不想登录也可以，发布时直接带上 token：

```bash
npx @vscode/vsce publish --no-dependencies -p <PAT>
# 或用环境变量：$env:VSCE_PAT="<PAT>"; npm run publish
```

### 手动上传（不配置 PAT）

```bash
npm run package
```

然后到 publisher 管理页 → **New extension → Visual Studio Code** → 上传生成的 `.vsix`。

### 发布注意事项

- 每次发布的 `version` 必须递增，已发布的版本不能重复发布；
- `name`（`coolui-scroller-vscode`）首次发布后不可更改，`displayName` 可随时改；
- 发布前建议先确认打包内容：

```bash
npx --yes @vscode/vsce ls --no-dependencies
```

  清单里应包含 `images/icon.png`、`dist/extension.js`、`README.md`、`LICENSE`，且不含 `src/`、`scripts/`；
- `*.vsix` 已在 `.gitignore` 中忽略，不要提交进仓库；
- **VS Code Marketplace 与 Open VSX 是两套互相独立的商店**，Trae / VSCodium / Windsurf 等基于 Open VSX 的编辑器需要在下面再发一份。

### 发布到 Open VSX（Trae / VSCodium / Windsurf 等）

首次发布需要四步：

| 步骤 | 位置 | 说明 |
| --- | --- | --- |
| 1. 注册 Eclipse 账号 | <https://accounts.eclipse.org/user/register> | **必须填 `GitHub Username`**，且要与登录 open-vsx.org 用的那个 GitHub 账号一致 |
| 2. 签署发布者协议 | <https://open-vsx.org> 用 GitHub 登录 → Profile → **Log in with Eclipse** → **Show Publisher Agreement** → Agree | 不签协议发布会失败 |
| 3. 生成 Access Token | <https://open-vsx.org/user-settings/tokens> → **Generate New Token** | 只显示一次，需自行保管 |
| 4. 创建命名空间 | 命令行 | 命名空间名必须与 `package.json` 的 `publisher` 一致，即 `coolui` |

```bash
# 创建命名空间（只需执行一次）
npx --yes ovsx create-namespace coolui -p <OPENVSX_TOKEN>

# 发布当前版本：从源码构建并上传，会自动跑 vscode:prepublish
$env:OVSX_PAT="<OPENVSX_TOKEN>"; npm run publish:ovsx
```

也可以直接发布已经打好的 `.vsix`（跳过重新构建）：

```bash
npx --yes ovsx publish coolui-scroller-vscode-0.1.3.vsix -p <OPENVSX_TOKEN>
```

发布后到 <https://open-vsx.org/extension/coolui/coolui-scroller-vscode> 核对，之后 Trae 等编辑器的扩展面板里即可搜到。

## 配置项

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `cooluiScroller.enable` | `true` | 总开关 |
| `cooluiScroller.enableDiagnostics` | `true` | 是否检查原生组件未引入 |
| `cooluiScroller.packageName` | `coolui-scroller` | 原生版 npm 包名，用于生成引入路径 |
| `cooluiScroller.uniappPackageName` | `coolui-scroller-uni` | uni-app 版 npm 包名，用于解析 import |
| `cooluiScroller.docsBaseUrl` | 原生文档站点目录 | 原生组件悬停里的文档链接地址 |
| `cooluiScroller.uniappDocsBaseUrl` | uni-app 文档站点目录 | uni-app 组件悬停里的文档链接地址 |
