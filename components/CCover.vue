<!-- 表紙。スライド本文の冒頭に <CCover .../> を置く。 -->
<script setup>
defineProps({
  title:     { type: String, required: true },
  subtitle:  { type: String, default: '' },
  date:      { type: String, default: '' },
  presenter: { type: String, default: '' },
  label:     { type: String, default: '' }, // 例: CONFIDENTIAL
})
</script>

<template>
  <div class="c-cover">
    <div v-if="label" class="c-cover-label">{{ label.toUpperCase() }}</div>
    <div class="c-cover-title">{{ title }}</div>
    <div v-if="subtitle" class="c-cover-sub">{{ subtitle }}</div>
    <div v-if="date || presenter" class="c-cover-meta">
      {{ [date, presenter].filter(Boolean).join('　｜　') }}
    </div>
  </div>
</template>

<style scoped>
.c-cover { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.c-cover-label {
  position: absolute; top: 0; right: 0;
  font-size: .7rem; font-weight: 700; letter-spacing: .16em; color: var(--c-gray-light);
}
.c-cover-title { font-size: 2.7rem; font-weight: 700; color: #1A1A1A; line-height: 1.2; margin: 0; }
.c-cover-sub   { margin-top: 1rem; font-size: 1.15rem; font-weight: 700; color: var(--c-red); }
.c-cover-meta  { margin-top: 2.2rem; font-size: .82rem; color: var(--c-gray); }
</style>
