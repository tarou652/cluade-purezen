<script setup lang="ts">
// 数字の根拠をスライド左下に出す。
//   <Source>書名や記事名, 発行元, 2026-09</Source>        … 出典
//   <Source measured>社内試行 n=12, 2026-09 計測</Source> … 実測値
//   <Source todo /> / <Source measured todo />            … 未記入（lint が警告、--strict でエラー）
// scripts/lint-slides.mjs は、数字を含むスライドにこのタグがあるかを検査する。
defineProps<{ measured?: boolean, todo?: boolean }>()
</script>

<template>
  <p class="source">
    <span class="source-label">{{ measured ? '実測' : '出典' }}</span>
    <slot v-if="!todo" />
    <span v-else>〔要記入〕</span>
  </p>
</template>

<style scoped>
.source {
  position: absolute;
  left: var(--space-48);
  right: var(--space-48);
  bottom: var(--space-16);
  margin: 0;
  color: var(--slide-muted);
  font-size: calc(14 / 16 * 1rem);
  line-height: 1.5;
}
.source-label {
  font-weight: bold;
  margin-right: var(--space-8);
}
</style>
