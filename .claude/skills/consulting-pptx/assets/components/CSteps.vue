<!-- 横型の番号付きプロセス（赤い丸番号、間に赤い ›）。items: [{ title, body? }] か文字列配列 -->
<script setup>
defineProps({ items: { type: Array, required: true } })
const titleOf = (it) => (typeof it === 'string' ? it : it.title)
const bodyOf  = (it) => (typeof it === 'string' ? '' : it.body)
</script>

<template>
  <div class="c-steps">
    <template v-for="(it, i) in items" :key="i">
      <div class="c-step">
        <div class="c-step-num c-num">{{ i + 1 }}</div>
        <div class="c-step-title">{{ titleOf(it) }}</div>
        <div v-if="bodyOf(it)" class="c-step-body">{{ bodyOf(it) }}</div>
      </div>
      <div v-if="i < items.length - 1" class="c-step-arrow">›</div>
    </template>
  </div>
</template>

<style scoped>
.c-steps { display: flex; align-items: flex-start; gap: .4rem; margin-top: 1.6rem; }
.c-step { flex: 1; text-align: center; }
.c-step-num {
  width: 3rem; height: 3rem; border-radius: 50%; background: var(--c-red); color: #fff;
  font-size: 1.4rem; font-weight: 700; margin: 0 auto;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 9px rgba(0,0,0,.12);
}
.c-step-title { margin-top: .7rem; font-size: .9rem; font-weight: 700; color: var(--c-ink); }
.c-step-body { margin-top: .35rem; font-size: .76rem; color: var(--c-gray); line-height: 1.5; }
.c-step-arrow { color: var(--c-red); font-size: 1.8rem; font-weight: 700; line-height: 3rem; }
</style>
