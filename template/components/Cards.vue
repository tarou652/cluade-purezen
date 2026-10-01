<script setup lang="ts">
// 並列の要素（理由・弱点・特徴など）をカードで並べる。
//   <Cards :items="[{ title: '…', body: '…' }, …]" />
// 左上に番号（1, 2, 3…）を出す。accent に番号（1始まり）を渡すとそのカードだけ赤地にする。
// アイコンは出さない（i-carbon-* を動的クラスで渡すと Slidev のビルドで CSS が生成されないため）。
defineProps<{
  items: { title: string, body?: string }[]
  cols?: number
  accent?: number
}>()
</script>

<template>
  <div class="cards" :style="{ gridTemplateColumns: `repeat(${cols || Math.min(items.length, 3)}, 1fr)` }">
    <div v-for="(it, i) in items" :key="i" class="card" :class="{ accent: accent === i + 1 }">
      <div class="badge">{{ i + 1 }}</div>
      <div class="title">{{ it.title }}</div>
      <div v-if="it.body" class="body">{{ it.body }}</div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  gap: var(--space-24);
}
.card {
  background: var(--slide-bg);
  border: 1px solid var(--slide-rule);
  border-top: var(--space-4) solid var(--slide-key);
  border-radius: var(--border-radius-8);
  box-shadow: var(--elevation-1);
  padding: var(--space-24);
}
.card.accent {
  background: var(--slide-key-tint);
  border-color: var(--slide-key-line);
  border-top-color: var(--slide-key);
}
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-40);
  height: var(--space-40);
  margin-bottom: var(--space-16);
  border-radius: var(--border-radius-full);
  background: var(--slide-key);
  color: var(--slide-on-key);
  font-weight: bold;
  font-size: calc(18 / 16 * 1rem);
}
.title {
  color: var(--slide-heading);
  font-weight: bold;
  line-height: 1.5;
}
.body {
  margin-top: var(--space-8);
  color: var(--slide-muted);
  font-size: calc(16 / 16 * 1rem);
  line-height: 1.7;
}
</style>
