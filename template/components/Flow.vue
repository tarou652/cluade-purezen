<script setup lang="ts">
// 工程・流れを横に並べる図。Mermaid より崩れにくく、テンプレートの色に揃う。
//   <Flow :steps="[{ title: '録音', body: '…' }, …]" :accent="3" />
// accent に番号（1始まり）を渡すとその工程だけ赤地にする。
defineProps<{
  steps: { title: string, body?: string }[]
  accent?: number
}>()
</script>

<template>
  <div class="flow">
    <template v-for="(s, i) in steps" :key="i">
      <div class="step" :class="{ accent: accent === i + 1 }">
        <div class="no">STEP {{ i + 1 }}</div>
        <div class="title">{{ s.title }}</div>
        <div v-if="s.body" class="body">{{ s.body }}</div>
      </div>
      <carbon-chevron-right v-if="i < steps.length - 1" class="arrow" />
    </template>
  </div>
</template>

<style scoped>
.flow {
  display: flex;
  align-items: stretch;
  gap: var(--space-8);
}
.step {
  flex: 1;
  border: 1px solid var(--slide-rule);
  border-radius: var(--border-radius-8);
  background: var(--slide-subtle-bg);
  padding: var(--space-16) var(--space-24);
}
.step.accent {
  background: var(--slide-key);
  border-color: var(--slide-key);
  color: var(--slide-on-key);
}
.no {
  color: var(--slide-key);
  font-size: calc(14 / 16 * 1rem);
  font-weight: bold;
  letter-spacing: 0.08em;
}
.title {
  margin-top: var(--space-4);
  color: var(--slide-heading);
  font-weight: bold;
}
.body {
  margin-top: var(--space-8);
  color: var(--slide-muted);
  font-size: calc(16 / 16 * 1rem);
  line-height: 1.7;
}
.step.accent .no,
.step.accent .title,
.step.accent .body { color: var(--slide-on-key); }
.arrow {
  align-self: center;
  flex: none;
  width: var(--space-24);
  height: var(--space-24);
  color: var(--slide-key);
}
</style>
