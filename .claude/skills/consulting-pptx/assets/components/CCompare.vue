<!-- 2カラム比較（右カラムを赤系で強調）。left/right は文字列配列 -->
<script setup>
defineProps({
  leftTitle:  { type: String, required: true },
  left:       { type: Array,  required: true },
  rightTitle: { type: String, required: true },
  right:      { type: Array,  required: true },
})
</script>

<template>
  <div class="c-compare">
    <div class="c-col">
      <div class="c-col-title">{{ leftTitle }}</div>
      <ul><li v-for="(t, i) in left" :key="i">{{ t }}</li></ul>
    </div>
    <div class="c-col accent">
      <div class="c-col-title">{{ rightTitle }}</div>
      <ul><li v-for="(t, i) in right" :key="i">{{ t }}</li></ul>
    </div>
  </div>
</template>

<style scoped>
.c-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: 1rem; }
.c-col {
  background: var(--c-card); border: 1px solid var(--c-rule); border-radius: 8px;
  padding: 1.1rem 1.3rem; box-shadow: 0 3px 9px rgba(0,0,0,.10);
}
.c-col.accent { background: var(--c-red-tint); border: 1.5px solid var(--c-red); }
.c-col-title { font-size: 1rem; font-weight: 700; color: var(--c-ink); margin-bottom: .7rem; }
.c-col.accent .c-col-title { color: var(--c-red); }
.c-col ul { list-style: none; padding: 0; margin: 0; }
.c-col li { position: relative; padding-left: 1.2em; margin: .4em 0; font-size: .86rem; line-height: 1.45; color: var(--c-ink); }
.c-col li::before { content: ""; position: absolute; left: 0; top: .5em; width: .45em; height: .45em; background: var(--c-red); }
</style>
