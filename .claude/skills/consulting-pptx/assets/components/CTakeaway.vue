<!-- 薄赤の結論ボックス。1スライドに1つだけ使うと効く。本文はデフォルトスロットへ。 -->
<script setup>
defineProps({ label: { type: String, default: 'ポイント' } })
</script>

<template>
  <div class="c-takeaway">
    <div class="c-takeaway-label">{{ label }}</div>
    <div class="c-takeaway-text"><slot /></div>
  </div>
</template>

<style scoped>
.c-takeaway {
  display: flex; align-items: center; gap: 1rem; margin-top: 1.4rem;
  background: var(--c-red-tint); border: 1.5px solid var(--c-red); border-radius: 8px;
  padding: .9rem 1.2rem; box-shadow: 0 3px 9px rgba(0,0,0,.10);
}
.c-takeaway-label { flex: 0 0 auto; font-size: .85rem; font-weight: 700; color: var(--c-red); }
.c-takeaway-text { font-size: .95rem; font-weight: 700; color: var(--c-ink); line-height: 1.4; }
</style>
