# demo/uniapp-plugin

用于**发布到 DCloud 插件市场**（`ext.dcloud.net.cn`）的示例工程：内置 `uni_modules` 插件 + 一个演示页面。

插件内容由脚本从 `packages/uniapp`（npm 包 `coolui-scroller-uni`）同步而来，**不要手工改 `uni_modules/` 下的文件**，改了会在下次同步时被覆盖。

## 与 demo/uniapp 的区别

| 工程 | 引入方式 | 用途 |
| --- | --- | --- |
| `demo/uniapp` | npm 包 + easycom 自定义规则（Vue3 + Vite 的 CLI 工程） | 日常开发调试 |
| `demo/uniapp-plugin` | `uni_modules`（HBuilderX 工程） | 发布 DCloud 插件市场 |

两者刻意分开：同名组件如果同时存在 npm 版和 uni_modules 版，easycom 会解析冲突。

## 示例页面：与 demo/uniapp 保持一致

本工程的 `pages/`、`static/`、`components/`、`wxcomponents/`、`types.ts`、`App.vue`、`pages.json`
都是**生成物**（不要手改）。要改示例页面，改 `demo/uniapp/src` 里的文件，然后执行：

```bash
pnpm sync:plugin-demo   # 单独同步示例页面；pnpm build:uni-modules 会顺带执行
```

同步时会自动处理 HBuilderX 工程与 Vite 工程的三个差异：

1. **补 auto-import**：`demo/uniapp` 用 `unplugin-auto-import` 注入 Vue API 与 uni 生命周期（页面里不写 `import`），
   HBuilderX 没有这个插件 —— 脚本按实际用到的名字补上显式 `import`；
2. **改模块路径**：`coolui-scroller-uni/...` → `@/uni_modules/coolui-scroller/...`；
3. **改 `pages.json`**：去掉 `easycom` 配置（uni_modules 插件的 `components/` 目录符合 easycom 默认规则，无需配置）。

同步结束会自动自查：npm 包引用是否有残留、auto-import 是否补齐、`/static/` 图片是否存在、
`pages.json` 声明的页面是否都有对应文件 —— 有一项不过就直接报错，不会带着问题去发布。

## 同步插件（改完 packages/uniapp 之后执行）

```bash
pnpm build:uni-modules
```

会把 `packages/uniapp` 的 `components/`、`utils/`、`types.d.ts`、`index.js` 复制到
`uni_modules/<插件ID>/`，并按当前版本号重新生成 `package.json` 与 `readme.md`。

> `changelog.md` 只在首次生成，之后由你手工维护历史记录。

## 插件 ID

插件 ID 形如 `作者ID-插件英文名称`（同时也是 `uni_modules/` 下的目录名、`package.json` 的 `id`），由 `scripts/build-uni-modules.mjs` 顶部的常量决定：

```js
const AUTHOR_ID = 'coolui' // 作者ID 段
const PLUGIN_NAME = 'scroller' // 插件名 段
const PLUGIN_ID = `${AUTHOR_ID}-${PLUGIN_NAME}` // → coolui-scroller
```

官方要求：两段都只能用英文数字、作者ID 至少 2 位、不能包含 `DCloud`、`uni` 等关键字，且**整个 ID 最长 20 个字符**。作者 ID 由你自己取，**不需要、也没法**与 DCloud 账号对应（账号里没有这个字段）。

当前取 `coolui-scroller`（15 位）：作者ID 用产品名 `coolui`，插件名用 `scroller`，既保留了品牌前缀又没有超长。

> **插件 ID 发布后不可更改**。换 ID 时改完常量执行 `pnpm build:uni-modules`（会生成新目录），再手动删掉旧目录。

## 用 HBuilderX 发布

1. 用 **HBuilderX** 打开本项目（打开 `demo/uniapp-plugin` 目录）
2. 先确认能跑：运行到「微信小程序模拟器」或「浏览器」，页面上能看到列表、下拉刷新、上拉加载
3. 在左侧目录树里 **右键 `uni_modules/<插件ID>` 目录（或它的 `package.json`）** → **发布到插件市场**
4. 在弹窗里填写并提交：
   - 分类：**前端组件 → 通用组件**（`dcloudext.type` 已设为 `component-vue`）
   - **隐私、权限及商业化声明**三项：必填
   - 可勾选「上传当前项目作为示例工程」，用户导入后可一键跑起来
5. 提交后等待 DCloud 审核

发布新版本走同一入口；`changelog.md` 的内容会自动同步到插件更新日志。

## 说明

- 本工程**不需要** `easycom` 配置：uni_modules 插件的 `components/` 目录符合 easycom 默认规则，导入后直接写标签即可。
- 页面需要在 `pages.json` 中打开 `disableScroll`，避免页面级下拉与组件下拉冲突。
- 组件里的 `<style lang="scss">` 需要 sass 编译能力，HBuilderX 首次运行会提示安装「scss/sass 编译」插件，按提示安装即可。
- 本目录不在 pnpm workspace 内（见根目录 `pnpm-workspace.yaml`），因此没有 `package.json`，纯粹作为 HBuilderX 工程使用。
