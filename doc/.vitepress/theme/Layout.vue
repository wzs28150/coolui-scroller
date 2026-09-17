<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PlatformSwitch from './PlatformSwitch.vue'
import PlatformTip from './PlatformTip.vue'
import { PLATFORMS, goto, hasChosenPlatform, initPlatform, platform } from './platform'

const { Layout } = DefaultTheme
const route = useRoute()
const router = useRouter()

// 客户端挂载后再读 localStorage，避免与 SSR 输出不一致
onMounted(() => {
  initPlatform(route.path)
  document.addEventListener('click', onNavStartClick, true)
})
onUnmounted(() => document.removeEventListener('click', onNavStartClick, true))
watch(() => route.path, (path) => initPlatform(path))

/**
 * 导航里的「开始」固定指向平台选择页 /start：
 * - 还没选过平台 → 交给默认跳转，进 /start 选择；
 * - 之前选过平台 → 直接进该平台的安装页，省一步。
 * 只拦导航栏菜单里的这个链接，首页 hero 的「快速开始」不受影响，随时能回到 /start 重选。
 */
function onNavStartClick(event) {
  const el = event.target
  const link = el && el.closest ? el.closest('.VPNavBarMenu a[href]') : null
  if (!link) return

  const path = (link.getAttribute('href') || '').split('#')[0].split('?')[0]
  if (!/(?:^|\/)start(?:\.html)?$/.test(path)) return
  if (!hasChosenPlatform()) return

  event.preventDefault()
  event.stopPropagation()
  goto(router, PLATFORMS[platform.value].entry)
}
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <!-- 平台切换器在布局上排到 GitHub 图标左边（见 custom.css 里的 order 调整） -->
      <div class="nav-bar-platform">
        <PlatformSwitch />
      </div>
    </template>
    <template #doc-before>
      <PlatformTip />
    </template>
  </Layout>
</template>
