import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

// 文件名必须是 .mjs：unplugin-auto-import 为纯 ESM 包，
// 而本项目 package.json 未设 "type": "module"，.js 配置会被当作 CJS 加载并报 ERR_REQUIRE_ESM。
//
// @dcloudio/vite-plugin-uni 是 CJS 产物（exports.default + __esModule），
// 在原生 ESM 下 default 拿到的是 module.exports 本身，需再取一层 .default。
const uni = uniPlugin.default ?? uniPlugin

export default defineConfig({
  plugins: [
    uni(),
    // 自动导入 Vue API（ref / computed / watch / onMounted ...）与 uni-app 页面生命周期，
    // 页面与组件内无需再手写 import；只有用到的名称会被注入，产物仍按需打包。
    // dts 生成的声明文件仅用于 IDE 提示。
    AutoImport({
      imports: [
        'vue',
        {
          '@dcloudio/uni-app': [
            'onLaunch',
            'onLoad',
            'onShow',
            'onReady',
            'onHide',
            'onUnload',
            'onPullDownRefresh',
            'onReachBottom',
            'onPageScroll',
            'onShareAppMessage',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Vite 5.2.8 仍用 sass 旧版 JS API，sass>=1.79 会打印 legacy-js-api 弃用警告
        // 静音该警告（无需升级 Vite）；若日后升级到 Vite>=5.4 可改为 api: 'modern-compiler'
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
