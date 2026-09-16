<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PlatformSwitch from './PlatformSwitch.vue'
import PlatformTip from './PlatformTip.vue'
import { initPlatform } from './platform'

const { Layout } = DefaultTheme
const route = useRoute()

// 客户端挂载后再读 localStorage，避免与 SSR 输出不一致
onMounted(() => initPlatform(route.path))
watch(() => route.path, (path) => initPlatform(path))
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <PlatformSwitch />
    </template>
    <template #doc-before>
      <PlatformTip />
    </template>
  </Layout>
</template>
