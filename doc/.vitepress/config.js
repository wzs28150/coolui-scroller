import { defineConfig } from 'vitepress'
import info from '../../package.json'

// 两个平台的组件文档分开维护：同一组件页只讲本平台的引入方式与差异，
// 「当前在看哪个平台」由路径判定（见 .vitepress/theme/platform.js）。
const nativeComponents = [
  { text: 'Scroller 滚动组件', link: '/native/components/scroller' },
  { text: 'Item 列表项组件', link: '/native/components/item' },
  { text: 'ScrollPage 长列表分页组件', link: '/native/components/page' },
  { text: 'Empty 空列表组件', link: '/native/components/empty' },
  { text: 'Handtip 手势提示组件', link: '/native/components/handtip' },
  { text: 'Loadmore 加载更多组件', link: '/native/components/loadmore' },
  { text: 'Refresh 下拉刷新组件', link: '/native/components/refresh' },
  { text: 'Parallax 下拉视差组件', link: '/native/components/parallax' },
  { text: 'Nav 分类导航组件', link: '/native/components/nav' },
  { text: 'NavPannel 切换组件', link: '/native/components/navPannel' },
  { text: 'Search 搜索组件', link: '/native/components/search' },
  { text: 'Sort 排序及分类筛选组件', link: '/native/components/sort' },
  { text: 'SecondFloor 下拉二楼组件', link: '/native/components/floor' },
  { text: 'BackToTop 回到顶部组件', link: '/native/components/backToTop' },
]

const uniappComponents = [
  { text: '组件总览 / 命名对照', link: '/uniapp/components/' },
  { text: 'Scroller 滚动容器', link: '/uniapp/components/scroller' },
  { text: 'Item 列表项组件', link: '/uniapp/components/item' },
  { text: 'Longlist 长列表窗口化（推荐）', link: '/uniapp/components/longlist' },
  { text: 'Page 长列表分页（旧方案）', link: '/uniapp/components/page' },
  { text: 'Empty 空列表组件', link: '/uniapp/components/empty' },
  { text: 'Handtip 手势提示组件', link: '/uniapp/components/handtip' },
  { text: 'Loadmore 加载更多组件', link: '/uniapp/components/loadmore' },
  { text: 'Refresh 下拉刷新组件', link: '/uniapp/components/refresh' },
  { text: 'Parallax 下拉视差组件', link: '/uniapp/components/parallax' },
  { text: 'Nav 分类导航组件', link: '/uniapp/components/nav' },
  { text: 'NavBar 顶部导航栏', link: '/uniapp/components/navBar' },
  { text: 'NavPannel 切换组件', link: '/uniapp/components/navPannel' },
  { text: 'Search 搜索组件', link: '/uniapp/components/search' },
  { text: 'Sort 排序及分类筛选组件', link: '/uniapp/components/sort' },
  { text: 'SecondFloor 下拉二楼组件', link: '/uniapp/components/floor' },
  { text: 'BackToTop 回到顶部组件', link: '/uniapp/components/backToTop' },
]

const footerGroup = [
  { text: '常见问题', link: '/advanced/faq' },
  { text: '更新日志', link: '/version' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'coolui-scroller',
  description:
    'coolui-scroller：小程序下拉刷新 / 上拉加载 / 长列表组件库，提供原生微信小程序版（coolui-scroller）与 uni-app 版（coolui-scroller-uni）',
  base: '/coolui-scroller/v4/',
  outDir: '../v4/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      // 「开始」默认指向平台选择页 /start；如果用户之前选过平台，
      // 点击时会直接进入对应平台的安装页（见 .vitepress/theme/Layout.vue 里的点击处理）。
      { text: '开始', link: '/start' },
      // 平台入口放在导航栏右侧的切换器里（显示两个平台名、点击即切换），
      // 这里不再重复放「原生微信小程序 / uni-app」两个链接，避免又多一处平台入口。
      { text: '进阶', link: '/advanced/faq', activeMatch: '/advanced/' },
      {
        text: '示例',
        items: [
          { text: '示例 demo（扫码 / 源码）', link: '/case/' },
          { text: '有趣的下拉', link: '/case/case' },
          { text: '下拉组合', link: '/case/case2' },
          { text: '下拉二楼', link: '/case/case3' },
        ],
      },
      { text: '社群', link: '/community' },
      { text: '赞助', link: '/sponsors' },
      {
        text: 'v' + info.version,
        items: [
          { text: '更新日志', link: '/version' },
          { text: 'v3 文档站', link: 'https://wzs28150.github.io/coolui-scroller/v3/' },
          { text: 'v2 文档站', link: 'https://wzs28150.github.io/coolui-scroller/v2/' },
          { text: 'v1 源码（GitHub）', link: 'https://github.com/wzs28150/coolui-scroller/tree/1.0' },
        ],
      },
    ],

    sidebar: {
      '/native/': [
        {
          text: '开始',
          items: [
            { text: '安装与引入', link: '/native/install' },
            { text: '组件库介绍', link: '/native/guide' },
          ],
        },
        { text: '组件', items: nativeComponents },
        { text: '其他', items: footerGroup },
      ],
      '/uniapp/': [
        {
          text: '开始',
          items: [
            { text: '安装与引入', link: '/uniapp/install' },
            { text: '快速开始', link: '/uniapp/quickstart' },
            { text: '组件库介绍', link: '/uniapp/guide' },
            { text: '与原生微信小程序版的差异', link: '/uniapp/platform-diff' },
          ],
        },
        { text: '组件', items: uniappComponents },
        { text: '其他', items: footerGroup },
      ],
      '/advanced/': [{ text: '进阶', items: [{ text: '常见问题 FAQ', link: '/advanced/faq' }] }],
    },

    search: {
      provider: 'local',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/wzs28150/coolui-scroller' }],
    outlineTitle: '快速跳转',
    outline: 2,
  },
})
