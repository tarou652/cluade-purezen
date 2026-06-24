<!-- 大きな赤い統計を横並び。items: [{ value, unit?, label }] -->
<script setup>
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <div class="c-stats">
    <div v-for="(it, i) in items" :key="i" class="c-stat">
      <div class="c-stat-value c-num">
        {{ it.value }}<span v-if="it.unit" class="c-stat-unit">{{ it.unit }}</span>
      </div>
      <div class="c-stat-label">{{ it.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.c-stats { display: flex; gap: 1.6rem; margin-top: 1.2rem; }
.c-stat { flex: 1; }
.c-stat-value { font-size: 3.2rem; font-weight: 700; color: var(--c-red); line-height: 1; }
.c-stat-unit { font-size: 1.25rem; font-weight: 700; margin-left: .15rem; }
.c-stat-label { margin-top: .55rem; font-size: .85rem; color: var(--c-gray); line-height: 1.4; }
</style>
