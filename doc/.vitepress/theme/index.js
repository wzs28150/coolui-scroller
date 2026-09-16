import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PlatformCards from './PlatformCards.vue'
import PlatformSwitch from './PlatformSwitch.vue'
import PlatformTip from './PlatformTip.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 首页 index.md 与各文档页可直接使用这些组件
    app.component('PlatformCards', PlatformCards)
    app.component('PlatformSwitch', PlatformSwitch)
    app.component('PlatformTip', PlatformTip)
  },
}
