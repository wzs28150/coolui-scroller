import { ref } from 'vue'
import { withBase } from 'vitepress'

/**
 * 站点平台状态：整站只有「原生微信小程序」和「uni-app」两个平台维度。
 * 页面上「当前在哪个平台」始终由路径推断（SSR 安全、刷新不会错），
 * 这份状态只负责记住用户上次的选择，用于首页卡片高亮与切换目标。
 */

export const PLATFORMS = {
  native: {
    key: 'native',
    label: '原生微信小程序版',
    short: '原生微信小程序',
    pkg: 'coolui-scroller',
    prefix: '/native',
    entry: '/native/install',
    desc: '不使用 uni-app 编译，直接在微信小程序原生项目里使用',
    points: ['npm 安装 + 构建 npm', '`usingComponents` 引入，标签名可自定义', '组件目录也可直接拷贝进项目'],
  },
  uniapp: {
    key: 'uniapp',
    label: 'uni-app 版',
    short: 'uni-app',
    pkg: 'coolui-scroller-uni',
    prefix: '/uniapp',
    entry: '/uniapp/install',
    desc: '用 Vue 语法编写，一套代码编译到小程序 / H5 / App',
    points: ['uni-app 项目（Vue2 / Vue3 均可）', 'easycom 自动引入，免 import', '带 TypeScript 类型定义'],
  },
}

const STORAGE_KEY = 'coolui-scroller-doc-platform'

/** 用户记住的平台（默认原生，和站点主体一致） */
export const platform = ref('native')

/** 路径 → 平台：文档页路径里已经带有平台信息，用它判定最可靠 */
export function platformOfPath(path = '') {
  const clean = String(path).split('?')[0]
  // 注意：SSR 阶段的 route.path 带 base 前缀（/coolui-scroller/v4/native/...），
  // 客户端不带，所以这里按目录段匹配，两种形式都成立。
  if (/(?:^|\/)uniapp(?:\/|$)/.test(clean)) return 'uniapp'
  if (/(?:^|\/)native(?:\/|$)/.test(clean)) return 'native'
  return ''
}

/** 页面实际所属平台（优先路径，其次记住的选择） */
export function activeKeyOf(path = '') {
  return platformOfPath(path) || platform.value
}

export function otherKey(key) {
  return key === 'native' ? 'uniapp' : 'native'
}

function readStored() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return PLATFORMS[value] ? value : ''
  } catch (e) {
    return ''
  }
}

function writeStored(key) {
  try {
    window.localStorage.setItem(STORAGE_KEY, key)
  } catch (e) {
    /* 隐私模式下 localStorage 不可用，忽略即可 */
  }
}

/** 进入/切换页面时同步：路径能判定平台就记住它，否则沿用上次的选择 */
export function initPlatform(path = '') {
  const fromPath = platformOfPath(path)
  if (fromPath) {
    platform.value = fromPath
    writeStored(fromPath)
  } else {
    platform.value = readStored() || platform.value
  }
}

/** 记录用户显式选择 */
export function setPlatform(key) {
  if (!PLATFORMS[key]) return
  platform.value = key
  writeStored(key)
}

/** 用户是否显式选过平台（首页卡片、平台切换器、切换提示条都会记录） */
export function hasChosenPlatform() {
  return Boolean(readStored())
}

/**
 * 站内跳转。
 * 注意：这里**不能**用 useRouter().go(href) —— 在 vitepress 1.0.0-beta.1 里拿到的是
 * vue-router 实例，`go()` 是「历史前进/后退几步」的语义，传字符串等于什么都不做。
 * 优先用 push，拿不到再用整页跳转兜底。
 */
export function goto(router, path) {
  if (router && typeof router.push === 'function') {
    router.push(path)
    return
  }
  if (typeof window !== 'undefined') window.location.assign(withBase(path))
}

/** 侧边栏 / 页面切换文案里用到的「另一平台」 */
export function otherPlatform(key) {
  return PLATFORMS[otherKey(key)]
}

// ---------------------------------------------------------------------------
// 跨平台跳转：两个平台的文档结构一一对应（组件都是一组件一页），
// 因此按「精确映射 → 组件页映射 → 平台入口页」三级兜底，保证任何页面都能切过去。
// ---------------------------------------------------------------------------

const PAGE_ALIAS = {
  '/native/install': '/uniapp/install',
  '/native/guide': '/uniapp/guide',
  '/uniapp/install': '/native/install',
  '/uniapp/guide': '/native/guide',
  '/uniapp/quickstart': '/native/install',
  '/uniapp/platform-diff': '/native/guide',
}

/** 原生组件文档 slug → uni-app 组件文档 slug（命名不同的在这里对齐） */
const COMPONENT_TO_UNIAPP = {
  scroller: 'scroller',
  item: 'item',
  page: 'longlist',
  empty: 'empty',
  handtip: 'handtip',
  loadmore: 'loadmore',
  refresh: 'refresh',
  parallax: 'parallax',
  nav: 'nav',
  navPannel: 'navPannel',
  search: 'search',
  sort: 'sort',
  floor: 'floor',
  backToTop: 'backToTop',
}

/** uni-app 组件文档 slug → 原生组件文档 slug（反向；空值表示原生侧没有对应文档页） */
const COMPONENT_TO_NATIVE = {
  scroller: 'scroller',
  item: 'item',
  longlist: 'page',
  page: 'page',
  empty: 'empty',
  handtip: 'handtip',
  loadmore: 'loadmore',
  refresh: 'refresh',
  parallax: 'parallax',
  nav: 'nav',
  navBar: '',
  navPannel: 'navPannel',
  search: 'search',
  sort: 'sort',
  floor: 'floor',
  backToTop: 'backToTop',
}

/** 去掉查询串、结尾斜杠、base 前缀与 SSR 路径上的 .html，得到站内路径（/native/... 或 /uniapp/...） */
function normalize(path) {
  const clean =
    String(path)
      .split('#')[0]
      .split('?')[0]
      .replace(/\.html$/, '')
      .replace(/\/index$/, '')
      .replace(/\/+$/, '') || '/'
  const matched = clean.match(/\/(native|uniapp)(\/.*)?$/)
  return matched ? '/' + matched[1] + (matched[2] || '') : clean
}

/** 当前页在目标平台的落点 */
export function switchTarget(path = '/', toKey) {
  const clean = normalize(path)
  const target = PLATFORMS[toKey] ? toKey : otherKey(activeKeyOf(clean))

  if (PAGE_ALIAS[clean]) return PAGE_ALIAS[clean]
  if (clean === '/uniapp/components' || clean === '/native/components') {
    return target === 'uniapp' ? '/uniapp/components/' : '/native/components/scroller'
  }

  const matched = clean.match(/^\/(native|uniapp)\/components\/(.+)$/)
  if (matched) {
    const slug = matched[2]
    if (target === 'uniapp') return `/uniapp/components/${COMPONENT_TO_UNIAPP[slug] || slug}`
    const back = COMPONENT_TO_NATIVE[slug]
    // 原生侧没有对应文档页（如 nav-bar）时，落到安装页的组件清单
    return back ? `/native/components/${back}` : '/native/install'
  }

  return PLATFORMS[target].entry
}
