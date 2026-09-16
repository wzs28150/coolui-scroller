# 常见问题

这里收集的是实际项目里最常遇到的几类问题。两个版本表现基本一致，涉及写法差异的地方会分别说明。

## 下拉刷新没有弹性回弹感

**现象**：下拉时很快到底、松手只回弹一次，手感发硬；而示例里「下拉刷新 - 原生效果」那种"松手先回落、刷新完再整体回弹"的两段回弹没有出现。

**原因**：组件下拉时的位移是 `moveY = -moveHeight + distance * 0.5`，`moveHeight` 取自 `background.height || height`。没有设置 `background.height` 时它等于 `height`（比如 50），手指拉约 100px 就饱和，只剩单段回弹。

**解决**：让下拉行程大于刷新自身高度：

```js
{
  height: 50,                                  // 刷新自身高度：松手后回落到这里显示加载动画
  background: { color: '#f2f2f2', height: 120 } // 下拉行程：整体回弹的距离
}
```

两个版本都适用（uni-app 版写在 `<coolui-scroller-refresh :config="...">` 或对应组件配置里）。

## H5 上出现页面级滚动条（小程序正常）

**原因**：H5 端 uni-app 会额外渲染内置导航栏（高度 = `--window-top`），而页面写的 `height: 100vh` 是整个视口高度，没扣掉这一截；同时 `pages.json` 的 `disableScroll` 只在小程序端生效。所以小程序正常、H5 多出一条滚动条。

**解决**：全屏页按可视区高度兜底，并用条件编译只影响 H5：

```scss
/* #ifdef H5 */
.page {
  height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
}
/* #endif */
```

内容高于一屏的页面（`min-height: 100vh`）只改 `min-height` 即可，仍保留正常滚动。详见[跨端差异](/uniapp/platform-diff#h5-内置导航栏会额外占高)。

## 列表项之间没有间距、内容贴着卡片边缘

**原因**：一是页面里把卡片容器的内边距重置成了 0（`.pannel .pannel-inner { padding: 0 }`）；二是列表项的间距写成了 `.coolui-scroller .item` 这类**跨组件选择器**，在页面 scoped 样式里穿不进组件，小程序端尤其明显。

**解决**：

- 卡片留白交给容器样式（不要重复声明或重置全局卡片样式）；
- 列表项间距写在**页面可命中的选择器**上，或给插槽内容自带 class 后再写样式。

## 长列表高度不对 / 滚动位置跳动

长列表靠"页"来占位，页高需要算准：

- 原生微信小程序版 `scroll-page`：需要引入组件提供的方法计算每个 page 页面的高度（见 [ScrollPage 文档](/native/components/page)）。
- uni-app 版优先用 `coolui-scroller-longlist`：窗口化方案，窗口外折叠为上下占位块，不依赖总页数。

页高与实际内容高度差别越大，滚动条长度和滚动位置就越不准，尽量让每页内容高度一致。

## easycom 配置后组件不生效（uni-app）

按顺序排查：

1. `pages.json` 改完是否重新编译；
2. `autoscan: false` 时规则必须自己写全，标签名要能匹配你写的正则；
3. 组件目录名与规则里的路径是否一致（拷贝源码接入时尤其容易漏，路径要指向你实际放置的目录）。

见[安装与引入](/uniapp/install#方式一easycom推荐)。

## 事件 / 属性名对不上（uni-app）

原生微信小程序版的 `bind:refresh` 在 uni-app 版是 `@refresh`；`sort-item` 的选中值通过 `@update:value` 同步；search 组件的 `key` 因是 Vue 保留字改名为 `keyword`（`@update:keyword`）。完整对照见[与原生微信小程序版的差异](/uniapp/platform-diff)。

## 该选原生微信小程序版还是 uni-app 版？

| 你的项目 | 选它 |
| --- | --- |
| 微信小程序原生项目（不走 uni-app 编译） | [原生微信小程序版](/native/install)，包名 `coolui-scroller` |
| uni-app 项目，需要同时编译到小程序 / H5 / App | [uni-app 版](/uniapp/install)，包名 `coolui-scroller-uni` |

两个版本组件能力与配置项一致，用顶部平台切换器即可在对应文档间跳转。
