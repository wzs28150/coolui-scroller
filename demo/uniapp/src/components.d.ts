/* eslint-disable */
/**
 * easycom 组件的全局类型声明
 *
 * `pages.json` 里配置了 easycom（`^coolui-scroller(-.*)?$`），页面模板中直接写标签即可。
 * 这里把这些标签登记为全局组件类型，编辑器（Volar / vue-tsc）即可提示各组件的
 * props、事件与默认值 —— 组件类型来自 coolui-scroller-uni 里各组件的 .vue。
 *
 * 新增组件时，在下面补一行即可。
 */
declare module 'vue' {
  export interface GlobalComponents {
    CooluiScroller: typeof import('coolui-scroller-uni/components/coolui-scroller/coolui-scroller.vue')['default']
    CooluiScrollerRefresh: typeof import('coolui-scroller-uni/components/coolui-scroller-refresh/coolui-scroller-refresh.vue')['default']
    CooluiScrollerLoadmore: typeof import('coolui-scroller-uni/components/coolui-scroller-loadmore/coolui-scroller-loadmore.vue')['default']
    CooluiScrollerBackToTop: typeof import('coolui-scroller-uni/components/coolui-scroller-back-to-top/coolui-scroller-back-to-top.vue')['default']
    CooluiScrollerEmpty: typeof import('coolui-scroller-uni/components/coolui-scroller-empty/coolui-scroller-empty.vue')['default']
    CooluiScrollerItem: typeof import('coolui-scroller-uni/components/coolui-scroller-item/coolui-scroller-item.vue')['default']
    CooluiScrollerPage: typeof import('coolui-scroller-uni/components/coolui-scroller-page/coolui-scroller-page.vue')['default']
    CooluiScrollerLonglist: typeof import('coolui-scroller-uni/components/coolui-scroller-longlist/coolui-scroller-longlist.vue')['default']
    CooluiScrollerParallax: typeof import('coolui-scroller-uni/components/coolui-scroller-parallax/coolui-scroller-parallax.vue')['default']
    CooluiScrollerNav: typeof import('coolui-scroller-uni/components/coolui-scroller-nav/coolui-scroller-nav.vue')['default']
    CooluiScrollerNavBar: typeof import('coolui-scroller-uni/components/coolui-scroller-nav-bar/coolui-scroller-nav-bar.vue')['default']
    CooluiScrollerNavPannel: typeof import('coolui-scroller-uni/components/coolui-scroller-nav-pannel/coolui-scroller-nav-pannel.vue')['default']
    CooluiScrollerSearch: typeof import('coolui-scroller-uni/components/coolui-scroller-search/coolui-scroller-search.vue')['default']
    CooluiScrollerSort: typeof import('coolui-scroller-uni/components/coolui-scroller-sort/coolui-scroller-sort.vue')['default']
    CooluiScrollerSortItem: typeof import('coolui-scroller-uni/components/coolui-scroller-sort-item/coolui-scroller-sort-item.vue')['default']
    CooluiScrollerSecondFloor: typeof import('coolui-scroller-uni/components/coolui-scroller-second-floor/coolui-scroller-second-floor.vue')['default']
    CooluiScrollerSecondFloorRefresh: typeof import('coolui-scroller-uni/components/coolui-scroller-second-floor-refresh/coolui-scroller-second-floor-refresh.vue')['default']
    CooluiScrollerHandtip: typeof import('coolui-scroller-uni/components/coolui-scroller-handtip/coolui-scroller-handtip.vue')['default']
    /* 原生小程序组件（pages.json 的 usingComponents 引入），交给运行时校验 */
    WaveBg: any
  }
}

export {}
