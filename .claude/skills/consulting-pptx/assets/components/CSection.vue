<!-- 章扉（白地に大きな赤い番号＋タイトル）。dark を付けると濃赤地になる。 -->
<script setup>
defineProps({
  number:   { type: [Number, String], default: null },
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  dark:     { type: Boolean, default: false }, // サンドイッチ構成にしたいとき
})
const pad2 = (n) => String(n).padStart(2, '0')
</script>

<template>
  <div class="c-section" :class="{ dark }">
    <div v-if="number != null" class="c-section-num c-num">{{ pad2(number) }}</div>
    <div class="c-section-body">
      <h2 class="c-section-title">{{ title }}</h2>
      <div v-if="subtitle" class="c-section-sub">{{ subtitle }}</div>
    </div>
  </div>
</template>

<style scoped>
.c-section { height: 100%; display: flex; align-items: center; gap: 2rem; }
.c-section-num { font-size: 9rem; font-weight: 700; color: var(--c-red); line-height: .9; }
.c-section-title { font-size: 2rem; font-weight: 700; color: var(--c-ink); margin: 0; }
.c-section-sub { margin-top: .6rem; font-size: .95rem; color: var(--c-gray); }

/* 濃赤地バージョン（dark） */
.c-section.dark { margin: calc(-1 * 3.0rem) calc(-1 * 3.4rem); padding: 3.0rem 3.4rem; background: var(--c-red-dark); }
.c-section.dark .c-section-num { color: rgba(255,255,255,.22); }
.c-section.dark .c-section-title { color: #fff; }
.c-section.dark .c-section-sub { color: #F2C9CF; }
</style>
