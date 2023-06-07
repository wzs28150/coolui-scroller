import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    copy({
      targets: [
        { src: './.vitepress/v2/**', dest: '../coolui-scroller/v2/' },
        // 还可以添加其他需要复制的文件/目录
      ],
      // 排除 .md 文件
      verbose: true,
      copyOnce: true,
      hook: 'writeBundle',
      // flatten: false,
      // exclude: '**/*.md',
    }),
  ],
})
