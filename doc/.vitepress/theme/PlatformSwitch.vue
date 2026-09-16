<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { PLATFORMS, activeKeyOf, setPlatform, switchTarget } from './platform'

const route = useRoute()
const router = useRouter()

const list = [PLATFORMS.native, PLATFORMS.uniapp]
const active = computed(() => activeKeyOf(route.path))

function select(key) {
  if (key === active.value) return
  const target = switchTarget(route.path, key)
  setPlatform(key)
  router.go(target)
}
</script>

<template>
  <div class="platform-switch" role="group" aria-label="切换文档平台">
    <button
      v-for="item in list"
      :key="item.key"
      type="button"
      class="platform-switch__btn"
      :class="{ 'is-active': active === item.key }"
      :aria-pressed="active === item.key"
      :title="item.desc"
      @click="select(item.key)"
    >
      {{ item.short }}
    </button>
  </div>
</template>

<style scoped>
.platform-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  margin-right: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
}

.platform-switch__btn {
  padding: 3px 9px;
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: var(--vp-c-text-2);
  background-color: transparent;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.platform-switch__btn:hover {
  color: var(--vp-c-text-1);
}

.platform-switch__btn.is-active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* 小屏导航栏空间有限，平台切换由页面顶部的提示条承担 */
@media (max-width: 767px) {
  .platform-switch {
    display: none;
  }
}
</style>
