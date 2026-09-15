import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
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