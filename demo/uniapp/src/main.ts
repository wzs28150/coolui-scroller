import { createSSRApp } from 'vue'
import App from './App.vue'

/**
 * uni-app Vue3 入口
 * @see https://uniapp.dcloud.net.cn/tutorial/vue3-basics.html
 */
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
