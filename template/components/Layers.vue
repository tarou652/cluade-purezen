<script setup lang="ts">
// 役割の層（上下関係・積み重ね）を帯で見せる図。上から順に描く。
//   <Layers :layers="[{ name: 'プロセス', title: 'どうやるか', tags: ['スキル'] }, …]" :accent="1" />
defineProps<{
  layers: { name: string, title: string, body?: string, tags?: string[] }[]
  accent?: number
}>()
</script>

<template>
  <div class="layers">
    <div v-for="(l, i) in layers" :key="i" class="layer" :class="{ accent: accent === i + 1 }">
      <div class="name">{{ l.name }}</div>
      <div class="main">
        <div class="title">{{ l.title }}</div>
        <div v-if="l.body" class="body">{{ l.body }}</div>
      </div>
      <div v-if="l.tags" class="tags">
        <span v-for="t in l.tags" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layers {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.layer {
  display: grid;
  grid-template-columns: 9em 1fr auto;
  align-items: center;
  gap: var(--space-24);
  border: 1px solid var(--slide-rule);
  border-radius: var(--border-radius-8);
  background: var(--slide-subtle-bg);
  padding: var(--space-16) var(--space-24);
}
.layer.accent {
  background: var(--slide-key-tint);
  border-color: var(--slide-key-line);
}
.name {
  color: var(--slide-muted);
  font-size: calc(16 / 16 * 1rem);
  font-weight: bold;
}
.layer.accent .name { color: var(--slide-key); }
.title {
  color: var(--slide-heading);
  font-weight: bold;
}
.body {
  color: var(--slide-muted);
  font-size: calc(16 / 16 * 1rem);
}
.tags { display: flex; gap: var(--space-8); }
.tag {
  border-radius: var(--border-radius-full);
  background: var(--slide-bg);
  border: 1px solid var(--slide-rule);
  padding: 0 var(--space-16);
  font-size: calc(16 / 16 * 1rem);
  font-weight: bold;
}
.layer.accent .tag {
  background: var(--slide-key);
  border-color: var(--slide-key);
  color: var(--slide-on-key);
}
</style>
