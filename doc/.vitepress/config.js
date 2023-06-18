import { defineConfig } from 'vitepress'
import info from '../../packages/package.json'
// console.log(info.version)
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'coolui-scroller',
  description: 'coolui-scroller',
  base: '/coolui-scroller/v3/',
  outDir: '../v3/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide' },
      {
        text: '组件',
        link: '/components/scroller.md',
      },
      { text: '有趣的下拉', link: '/case' },
      {
        text: 'v' + info.version,
        items: [
          {
            text: 'v3.2.5',
            link: '/version.md#v3-2-5',
          },
          {
            text: 'v3.2.3',
            link: '/version.md#v3-2-3',
          },
          {
            text: 'v3.1.1',
            link: '/version.md#v3-1-1',
          },
          {
            text: 'v3.0.8',
            link: '/version.md#v3-0-8',
          },
          {
            text: 'v3.0.5',
            link: '/version.md#v3-0-5',
          },
          {
            text: 'v3.0.4',
            link: '/version.md#v3-0-4',
          },
          {
            text: 'v3.0.0',
            link: '/version.md#v3-0-0',
          },
          {
            text: 'v2',
            link: 'https://wzs28150.github.io/coolui-scroller/v2/',
          },
          {
            text: 'v1',
            link: 'https://github.com/wzs28150/coolui-scroller/tree/1.0',
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': [],
      '/components/': [
        { text: 'Scroller 滚动组件', link: '/components/scroller.md' },
        { text: 'Item 列表项组件', link: '/components/item.md' },
        { text: 'Page 长列表分页组件', link: '/components/page.md' },
        { text: 'Empty 空列表组件', link: '/components/empty.md' },
        { text: 'Handtip 手势提示组件', link: '/components/handtip.md' },
        { text: 'Loadmore 加载更多组件', link: '/components/loadmore.md' },
        { text: 'Refresh 下拉刷新组件', link: '/components/refresh.md' },
        { text: 'Parallax 下拉视差组件', link: '/components/parallax.md' },
        { text: 'Nav 分类导航软件', link: '/components/nav.md' },
        { text: 'Search 搜索组件', link: '/components/search.md' },
        { text: 'Sort 排序及分类筛选组件', link: '/components/sort.md' },
        { text: 'Floor 下拉二楼组件', link: '/components/floor.md' },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wzs28150/coolui-scroller' },
    ],
    outlineTitle: '快速跳转',
    outline: 2,
  },
})
