<script setup>
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { PLATFORMS, initPlatform, platform, setPlatform } from './platform'

const list = [PLATFORMS.native, PLATFORMS.uniapp]

// 只有已记住选择时才标出来，避免 SSR 与客户端渲染不一致
const remembered = ref('')

onMounted(() => {
  initPlatform('')
  remembered.value = platform.value
})

function pick(key) {
  setPlatform(key)
  remembered.value = key
}
</script>

<template>
  <div class="platform-cards">
    <a
      v-for="item in list"
      :key="item.key"
      class="platform-card"
      :class="{ 'is-active': remembered === item.key }"
      :href="withBase(item.entry)"
      @click="pick(item.key)"
    >
      <div class="platform-card__head">
        <h3 class="platform-card__title">{{ item.label }}</h3>
        <span v-if="remembered === item.key" class="platform-card__badge">上次访问</span>
      </div>
      <code class="platform-card__pkg">{{ item.pkg }}</code>
      <p class="platform-card__desc">{{ item.desc }}</p>
      <ul class="platform-card__points">
        <li v-for="point in item.points" :key="point">{{ point }}</li>
      </ul>
      <span class="platform-card__enter">进入文档 →</span>
    </a>
  </div>
</template>

<style scoped>
/* 宽度由首页正文容器 .home-content 统一控制，这里只负责栅格 */
.platform-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 24px 0 0;
}

.platform-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.platform-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.platform-card.is-active {
  border-color: var(--vp-c-brand-1);
}

.platform-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: var(--vp-c-text-1);
}

.platform-card__badge {
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 18px;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.platform-card__pkg {
  align-self: flex-start;
  margin-top: 8px;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
}

.platform-card__desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.platform-card__points {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.platform-card__points li {
  position: relative;
  padding-left: 14px;
  font-size: 13px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.platform-card__points li::before {
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  content: '·';
  font-weight: 700;
}

.platform-card__enter {
  margin-top: 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
</style>
