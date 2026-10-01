<script setup lang="ts">
// 2つを左右に並べて比べる。左（before / 従来）はグレー、右（after / 提案）は赤。
//   <Compare :left="{ title: '今', items: ['…'] }" :right="{ title: '導入後', items: ['…'] }" />
// 前後関係のない並列の比較（A案とB案など）は :arrow="false" で矢印を消す。
// 段階表示はしない（v-click が必要なら class: reveal-compare のスライドで two-cols-header を使う）。
withDefaults(defineProps<{
  left: { title: string, items: string[] }
  right: { title: string, items: string[] }
  arrow?: boolean
}>(), { arrow: true })
</script>

<template>
  <div class="compare" :class="{ 'no-arrow': !arrow }">
    <div class="side left">
      <div class="head">{{ left.title }}</div>
      <ul>
        <li v-for="(t, i) in left.items" :key="i">{{ t }}</li>
      </ul>
    </div>
    <carbon-arrow-right v-if="arrow" class="arrow" />
    <div class="side right">
      <div class="head">{{ right.title }}</div>
      <ul>
        <li v-for="(t, i) in right.items" :key="i">{{ t }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: var(--space-16);
}
.compare.no-arrow {
  grid-template-columns: 1fr 1fr;
  gap: var(--space-24);
}
.side {
  border-radius: var(--border-radius-8);
  overflow: hidden;
  border: 1px solid var(--slide-rule);
}
.head {
  padding: var(--space-8) var(--space-24);
  font-weight: bold;
  background: var(--slide-subtle-bg);
  color: var(--slide-heading);
}
.right { border-color: var(--slide-key-line); background: var(--slide-key-tint); }
.right .head { background: var(--slide-key); color: var(--slide-on-key); }
.side ul { margin: 0; padding: var(--space-16) var(--space-24); }
.side li { font-size: calc(18 / 16 * 1rem); }
.left li::before { background: var(--color-neutral-solid-gray-420) !important; }
.arrow {
  align-self: center;
  width: var(--space-32);
  height: var(--space-32);
  color: var(--slide-key);
}
</style>
