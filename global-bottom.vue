<script setup lang="ts">
// Global Layers: このコンポーネントは「全スライドの最背面/最前面」に常時描画される。
// global-bottom.vue = 各スライドの下に、global-top.vue = 上に重なる。
// ここでは全ページ共通のフッターを表示している。
</script>

<template>
  <footer class="fixed bottom-2 left-3 z-10 text-xs opacity-40 pointer-events-none flex items-center gap-1">
    <span class="i-bi-book" />
    Slidev 実践ガイド
  </footer>
</template>
