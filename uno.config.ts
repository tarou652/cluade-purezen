import { defineConfig } from 'unocss'

// Slidev はルートの uno.config.ts を読み込み、内蔵設定（preset-icons 等）と
// マージする。ここでは「使う色（デザイントークン）」と「再利用クラス（shortcuts）」を定義する。
export default defineConfig({
  theme: {
    colors: {
      // ブランドカラー。`bg-brand` `text-brand-dark` のように使える
      brand: {
        DEFAULT: '#0d9488', // teal-600
        light: '#5eead4',
        dark: '#0f766e',
      },
      accent: '#e11d48', // rose-600
      ink: '#1f2937', // 本文の濃いめテキスト
    },
  },
  shortcuts: {
    // よく使う組み合わせに名前を付けて再利用する
    btn: 'px-4 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition cursor-pointer inline-flex items-center gap-1',
    'btn-outline': 'px-4 py-1.5 rounded-lg border border-brand text-brand hover:bg-brand hover:text-white transition cursor-pointer',
    card: 'p-5 rounded-2xl bg-white/60 dark:bg-white/5 shadow-lg ring-1 ring-black/5 backdrop-blur',
    chip: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-brand-light/30 text-brand-dark',
    'title-gradient': 'bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent',
  },
})
