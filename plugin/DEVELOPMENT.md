# 开发说明

插件自身的开发、打包与发布说明。本文件**不会打进 VSIX**（已在 `.vscodeignore` 中排除），
所以构建脚本、PAT、目录结构这类内容都写在这里；面向用户的功能介绍写在 [README.md](./README.md)。

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

  清单里应包含 `images/icon.png`、`dist/extension.js`、`README.md`、`LICENSE`，且不含 `src/`、`scripts/`、`DEVELOPMENT.md`；
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
