<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

// 数値を 0 から目標値までなめらかにカウントアップする GSAP デモ。
const props = withDefaults(defineProps<{ to?: number; suffix?: string }>(), {
  to: 2024,
  suffix: '',
})

const display = ref('0')

function play() {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: props.to,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate() {
      display.value = Math.round(obj.val).toLocaleString()
    },
  })
}

onMounted(play)
</script>

<template>
  <span class="tabular-nums">
    {{ display }}<span class="opacity-70">{{ suffix }}</span>
    <button
      class="ml-3 align-middle text-xs px-2 py-0.5 rounded bg-gray-500/20 hover:bg-gray-500/40 transition"
      @click="play"
    >↺</button>
  </span>
</template>
