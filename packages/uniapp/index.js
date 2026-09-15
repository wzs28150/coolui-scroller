import CooluiScroller from './components/coolui-scroller/coolui-scroller.vue'
import CooluiScrollerRefresh from './components/coolui-scroller-refresh/coolui-scroller-refresh.vue'
import CooluiScrollerLoadmore from './components/coolui-scroller-loadmore/coolui-scroller-loadmore.vue'
import CooluiScrollerBackToTop from './components/coolui-scroller-back-to-top/coolui-scroller-back-to-top.vue'
import CooluiScrollerEmpty from './components/coolui-scroller-empty/coolui-scroller-empty.vue'
import CooluiScrollerItem from './components/coolui-scroller-item/coolui-scroller-item.vue'
import CooluiScrollerPage from './components/coolui-scroller-page/coolui-scroller-page.vue'
import CooluiScrollerParallax from './components/coolui-scroller-parallax/coolui-scroller-parallax.vue'
import CooluiScrollerNav from './components/coolui-scroller-nav/coolui-scroller-nav.vue'
import CooluiScrollerNavBar from './components/coolui-scroller-nav-bar/coolui-scroller-nav-bar.vue'
import CooluiScrollerNavPannel from './components/coolui-scroller-nav-pannel/coolui-scroller-nav-pannel.vue'
import CooluiScrollerSearch from './components/coolui-scroller-search/coolui-scroller-search.vue'
import CooluiScrollerSort from './components/coolui-scroller-sort/coolui-scroller-sort.vue'
import CooluiScrollerSortItem from './components/coolui-scroller-sort-item/coolui-scroller-sort-item.vue'
import CooluiScrollerSecondFloor from './components/coolui-scroller-second-floor/coolui-scroller-second-floor.vue'
import CooluiScrollerSecondFloorRefresh from './components/coolui-scroller-second-floor-refresh/coolui-scroller-second-floor-refresh.vue'
import CooluiScrollerHandtip from './components/coolui-scroller-handtip/coolui-scroller-handtip.vue'

const components = [
  CooluiScroller,
  CooluiScrollerRefresh,
  CooluiScrollerLoadmore,
  CooluiScrollerBackToTop,
  CooluiScrollerEmpty,
  CooluiScrollerItem,
  CooluiScrollerPage,
  CooluiScrollerParallax,
  CooluiScrollerNav,
  CooluiScrollerNavBar,
  CooluiScrollerNavPannel,
  CooluiScrollerSearch,
  CooluiScrollerSort,
  CooluiScrollerSortItem,
  CooluiScrollerSecondFloor,
  CooluiScrollerSecondFloorRefresh,
  CooluiScrollerHandtip,
]

const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name || component.__name, component)
  })
}

export {
  install,
  CooluiScroller,
  CooluiScrollerRefresh,
  CooluiScrollerLoadmore,
  CooluiScrollerBackToTop,
  CooluiScrollerEmpty,
  CooluiScrollerItem,
  CooluiScrollerPage,
  CooluiScrollerParallax,
  CooluiScrollerNav,
  CooluiScrollerNavBar,
  CooluiScrollerNavPannel,
  CooluiScrollerSearch,
  CooluiScrollerSort,
  CooluiScrollerSortItem,
  CooluiScrollerSecondFloor,
  CooluiScrollerSecondFloorRefresh,
  CooluiScrollerHandtip,
}

export default { install }
