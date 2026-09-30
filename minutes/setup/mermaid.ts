import { defineMermaidSetup } from '@slidev/types'

// Mermaid の配色を DADS トークンに合わせる（Mermaid は CSS 変数を読めないので値を直書き）。
// 値の出典: minutes/styles/dads-tokens.css
export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    primaryColor: '#e8f1fe', // --color-key-50
    primaryBorderColor: '#0017c1', // --color-key-900
    primaryTextColor: '#333333', // --color-neutral-solid-gray-800
    lineColor: '#666666', // --color-neutral-solid-gray-600
    secondaryColor: '#f2f2f2', // --color-neutral-solid-gray-50
    tertiaryColor: '#ffffff',
  },
}))
