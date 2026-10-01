import { defineMermaidSetup } from '@slidev/types'

// Mermaid の配色を DADS トークンに合わせる（Mermaid は CSS 変数を読めないので値を直書き）。
// 値の出典: template/styles/dads-tokens.css。キーカラーは style.css の --slide-key（red-900）
export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    primaryColor: '#fdeeee', // --color-primitive-red-50
    primaryBorderColor: '#ce0000', // --color-primitive-red-900
    primaryTextColor: '#333333', // --color-neutral-solid-gray-800
    lineColor: '#666666', // --color-neutral-solid-gray-600
    secondaryColor: '#f2f2f2', // --color-neutral-solid-gray-50
    tertiaryColor: '#ffffff',
  },
}))
