<script setup>
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { PLATFORMS, otherKey, platformOfPath, setPlatform, switchTarget } from './platform'

const route = useRoute()
const { frontmatter } = useData()

// 当前平台直接由路径判定：前端路由切换、刷新、直接打开链接都不会判错
const currentKey = computed(() => platformOfPath(route.path))
const current = computed(() => PLATFORMS[currentKey.value])
const other = computed(() => PLATFORMS[otherKey(currentKey.value)])
const target = computed(() => withBase(switchTarget(route.path, other.value.key)))

// 只在平台目录下的文档页展示；单页可用 frontmatter `platformTip: false` 关掉
const visible = computed(() => Boolean(currentKey.value) && frontmatter.value.platformTip !== false)

function remember() {
  setPlatform(other.value.key)
}
</script>

<template>
  <div v-if="visible" class="platform-tip">
    <span class="platform-tip__label">当前文档</span>
    <strong class="platform-tip__name">{{ current.label }}</strong>
    <code class="platform-tip__pkg">{{ current.pkg }}</code>
    <a class="platform-tip__switch" :href="target" @click="remember">
      改用 {{ other.label }} →
    </a>
  </div>
</template>

<style scoped>
.platform-tip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 20px;
  padding: 8px 12px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
  font-size: 13px;
  line-height: 20px;
}

.platform-tip__label {
  color: var(--vp-c-text-3);
}

.platform-tip__name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.platform-tip__pkg {
  padding: 0 6px;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.platform-tip__switch {
  margin-left: auto;
  font-weight: 500;
  white-space: nowrap;
}
</style>
