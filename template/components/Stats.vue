<script setup lang="ts">
// 数字を大きく見せる。数字を出すスライドには必ず <Source> を置く（lint が検査する）。
//   <Stats :items="[{ value: '30', unit: '分', label: '会議1回あたりの作成時間' }]" />
// accent に番号（1始まり）を渡すと、その数字だけ赤にする（ほかはグレー）。
defineProps<{
  items: { value: string, unit?: string, label: string }[]
  accent?: number
}>()
</script>

<template>
  <div class="stats" :style="{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }">
    <div v-for="(it, i) in items" :key="i" class="stat" :class="{ accent: (accent ?? 1) === i + 1 }">
      <div class="value">
        {{ it.value }}<span v-if="it.unit" class="unit">{{ it.unit }}</span>
      </div>
      <div class="label">{{ it.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  gap: var(--space-32);
}
.stat {
  border-left: var(--space-4) solid var(--slide-rule);
  padding-left: var(--space-24);
}
.stat.accent { border-left-color: var(--slide-key); }
.value {
  color: var(--slide-heading);
  font-size: calc(64 / 16 * 1rem);
  font-weight: bold;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.stat.accent .value { color: var(--slide-key); }
.unit {
  margin-left: var(--space-4);
  font-size: calc(28 / 16 * 1rem);
}
.label {
  margin-top: var(--space-8);
  color: var(--slide-muted);
  font-size: calc(18 / 16 * 1rem);
}
</style>
