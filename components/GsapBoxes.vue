<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

// スライドに置いた複数の四角形を GSAP でアニメーションさせるデモ。
// 「再生」ボタンでいつでも再アニメーションできる。
const root = ref<HTMLElement | null>(null)

function play() {
  if (!root.value) return
  const boxes = root.value.querySelectorAll('.gsap-box')
  // 一度初期状態に戻してから再生
  gsap.set(boxes, { opacity: 0, y: 40, scale: 0.6, rotate: -15 })
  gsap.to(boxes, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    duration: 0.8,
    ease: 'back.out(1.7)', // GSAP の "跳ねる" イージング
    stagger: 0.15,         // 1つずつ時間差で
  })
}

onMounted(play)
</script>

<template>
  <div ref="root" class="flex flex-col items-center gap-6">
    <div class="flex gap-4">
      <div
        v-for="n in 5"
        :key="n"
        class="gsap-box w-16 h-16 rounded-xl grid place-items-center text-white font-bold text-xl shadow-lg"
        :style="{ background: `hsl(${n * 50}, 80%, 55%)` }"
      >
        {{ n }}
      </div>
    </div>
    <button
      class="px-4 py-1.5 rounded-md bg-teal-600 text-white text-sm hover:bg-teal-500 transition"
      @click="play"
    >
      ▶ 再生
    </button>
  </div>
</template>
