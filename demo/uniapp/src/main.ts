import { createSSRApp } from 'vue'
import App from './App.vue'

/**
 * H5 / App 端导航栏 loading 兜底：
 * uni 的 showNavigationBarLoading 会把导航栏标题文本整个替换成转圈
 * （小程序端是原生导航栏，标题保留、转圈在标题左侧）。
 * 组件内部最终也是走到 uni.showNavigationBarLoading()，所以直接在入口把它接管：
 * 需要保留标题的端改为给 body 打 .coolui-nav-loading 标记，
 * 由 App.vue 里的全局样式在标题左侧自绘一个转圈；小程序仍走 uni 原生实现。
 */
function patchNavigationBarLoading() {
  if (typeof uni === 'undefined' || !uni) {
    return
  }
  const api = uni as unknown as Record<string, unknown>

  /** H5 的导航栏是 uni 运行时渲染的 DOM，用它作为能力检测 */
  const hasH5PageHead = () =>
    typeof document !== 'undefined' && !!document.querySelector('uni-page-head .uni-page-head__title')

  const shouldKeepTitle = () => {
    try {
      const getInfo = api.getSystemInfoSync as (() => { uniPlatform?: string }) | undefined
      const info = getInfo ? getInfo() : null
      const platform = (info && info.uniPlatform) || ''
      if (platform) {
        // 各小程序（mp-weixin 等）走原生实现；H5（'h5' / 'web'）与 App（'app'）需要保留标题
        return platform.indexOf('mp-') !== 0
      }
    } catch (e) {
      // ignore
    }
    return hasH5PageHead()
  }

  const setClass = (loading: boolean) => {
    try {
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList[loading ? 'add' : 'remove']('coolui-nav-loading')
      }
    } catch (e) {
      // ignore
    }
  }

  const originalShow = api.showNavigationBarLoading as ((options?: unknown) => unknown) | undefined
  const originalHide = api.hideNavigationBarLoading as ((options?: unknown) => unknown) | undefined

  api.showNavigationBarLoading = (options?: unknown) => {
    if (shouldKeepTitle()) {
      setClass(true)
      return
    }
    if (originalShow) {
      originalShow(options)
    }
  }

  api.hideNavigationBarLoading = (options?: unknown) => {
    if (shouldKeepTitle()) {
      setClass(false)
      return
    }
    if (originalHide) {
      originalHide(options)
    }
  }
}

/**
 * uni-app Vue3 入口
 * @see https://uniapp.dcloud.net.cn/tutorial/vue3-basics.html
 */
export function createApp() {
  patchNavigationBarLoading()
  const app = createSSRApp(App)
  return {
    app,
  }
}
