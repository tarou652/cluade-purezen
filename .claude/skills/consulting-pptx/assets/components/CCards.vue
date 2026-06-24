<!-- 影付きカードのグリッド。items: [{ title, body?, badge?, tint? }] -->
<script setup>
defineProps({
  items: { type: Array, required: true },
  cols:  { type: Number, default: 0 }, // 0 なら items 数（最大3）から自動
})
</script>

<template>
  <div
    class="c-cards"
    :style="{ gridTemplateColumns: `repeat(${cols || Math.min(items.length, 3)}, 1fr)` }"
  >
    <div v-for="(it, i) in items" :key="i" class="c-card" :class="{ tint: it.tint }">
      <div v-if="it.badge != null" class="c-card-badge c-num">{{ it.badge }}</div>
      <div class="c-card-title">{{ it.title }}</div>
      <div v-if="it.body" class="c-card-body">{{ it.body }}</div>
    </div>
  </div>
</template>

<style scoped>
.c-cards { display: grid; gap: 1rem; margin-top: 1rem; }
.c-card {
  background: #fff; border: 1px solid var(--c-rule); border-radius: 8px;
  padding: 1.1rem 1.2rem; box-shadow: 0 3px 9px rgba(0,0,0,.10);
}
.c-card.tint { background: var(--c-red-tint); border-color: var(--c-red); }
.c-card-badge {
  width: 1.9rem; height: 1.9rem; border-radius: 50%; background: var(--c-red);
  color: #fff; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; margin-bottom: .7rem;
}
.c-card-title { font-size: 1rem; font-weight: 700; color: var(--c-ink); line-height: 1.35; }
.c-card-body { margin-top: .5rem; font-size: .82rem; color: var(--c-gray); line-height: 1.55; }
</style>
