# AI 助手支持

coolui-scroller 为 AI 编码助手（Cursor / Claude Code / CodeBuddy / Trae / GitHub Copilot 等）准备了可直接读取的文档：**装包即用，不需要额外配置**，AI 就能准确写出组件代码。

## 提供了什么

| 文件 | 位置 | 内容 |
| --- | --- | --- |
| `AGENTS.md` | 随 npm 包发布，`node_modules/coolui-scroller/AGENTS.md` | 组件心智模型、最小可用示例、事件与属性对照、高频坑 |
| `llms.txt` | 随 npm 包发布，`node_modules/coolui-scroller/llms.txt` | 该包的文档索引与「关键事实」清单 |
| `llms-full.txt` | 线上（内容最全） | 全部组件 API 与示例合并成的单文件全文 |

线上地址（也可直接发给 AI）：

- 索引：<https://wzs28150.github.io/coolui-scroller/v4/llms.txt>
- 全文：<https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt>

> uni-app 版把包名换成 `coolui-scroller-uni` 即可，文件结构完全一致。

## 怎么用

### 1. 直接让 AI 读（最快）

在 AI 助手里说：

> 先读 https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt，再用 coolui-scroller 写一个下拉刷新 + 上拉加载的列表页

### 2. 让 AI 自动找到（推荐）

把下面这段放进你项目的 `AGENTS.md`（Cursor 可放 `.cursor/rules/*.mdc`，CodeBuddy / Claude Code 放对应的 Rules）：

```md
## coolui-scroller

使用 coolui-scroller 组件前，先读 node_modules/coolui-scroller/AGENTS.md；
需要完整组件 API 与示例时，读 https://wzs28150.github.io/coolui-scroller/v4/llms-full.txt
```

这样每次让 AI 改列表页时，它都会先拿到正确的属性、事件与插槽写法，不用你反复贴文档。

### 3. 配合编辑器插件

安装[编辑器插件](/advanced/plugin)后，写 `.wxml` / `.vue` 时标签、属性、事件、插槽都有补全与中文悬停文档，和 AI 补全互补。

## 这样设计的原因

- **文件名是通用约定**：`AGENTS.md` 是 AI 编码助手的默认入口文件，`llms.txt` / `llms-full.txt` 遵循 [llms.txt 约定](https://llmstxt.org/)，主流工具会优先探测。
- **随包发布**：AI 在 `node_modules` 里就能读到，不依赖联网；同时线上留一份全量单文件，避免把 npm 包撑大。
- **自动生成**：内容由 `scripts/build-llms.mjs` 从 `doc/` 下的文档生成，组件文档一改，AI 看到的就同步更新（执行 `pnpm docs:llms`）。

> 如果你发现 AI 写出的组件用法不对，多半是它没读到上面的文件 —— 用「第 2 步」的规则片段把它指过去即可，也欢迎到 [社群](/community)反馈。
