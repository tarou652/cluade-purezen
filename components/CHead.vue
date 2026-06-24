<!-- 本文スライドのヘッダー（キッカー＋結論タイトル）。下線は引かない。 -->
<script setup>
defineProps({
  kicker: { type: String, default: '' },
  title:  { type: String, required: true },
})
</script>

<template>
  <div class="c-head">
    <div v-if="kicker" class="c-kicker">{{ kicker }}</div>
    <h2 class="c-head-title">{{ title }}</h2>
  </div>
</template>

<style scoped>
.c-head { margin-bottom: 1.4rem; }
.c-head-title { font-size: 1.7rem; font-weight: 700; color: var(--c-ink); margin: 0; line-height: 1.3; }
</style>
