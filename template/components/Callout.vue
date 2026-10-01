<script setup lang="ts">
// スライドの結論を1行で押さえる帯。1スライド1つまで。キャッチコピーではなく、図や表から言えることを書く。
//   <Callout>確認の工程は省けないので、担当の仕事は「書く」から「直す」に変わる</Callout>
</script>

<template>
  <div class="callout">
    <carbon-arrow-right class="icon" />
    <div class="text"><slot /></div>
  </div>
</template>

<style scoped>
.callout {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  margin-top: var(--space-32);
  padding: var(--space-16) var(--space-24);
  border-left: var(--space-8) solid var(--slide-key);
  background: var(--slide-key-tint);
  color: var(--slide-heading);
  font-weight: bold;
}
.icon {
  flex: none;
  width: var(--space-24);
  height: var(--space-24);
  margin-top: var(--space-4);
  color: var(--slide-key);
}
.text :deep(p) { margin: 0; }
</style>
