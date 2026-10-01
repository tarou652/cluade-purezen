---
theme: none
title: 〔要記入：資料のタイトル〕
info: |
  社内共有スライドのテンプレート。資料ごとに deck/<名前> ブランチを切り、このファイルを書き換える。
  ルールは docs/slide-rules.md、検査は npm run lint:slides。
layout: cover
transition: fade
mdc: true
fonts:
  sans: Noto Sans JP
  mono: Noto Sans Mono
  weights: '400,700'
---

# 〔要記入：資料のタイトル〕

〔要記入：サブタイトル〕

〔要記入：発表者〕 〔要記入：発表日〕

<!--
このテンプレートは部品の見本を兼ねている。使わない型のスライドは消してよい。
〔要記入〕が残っている間は npm run lint:slides が警告を出す。共有前は npm run lint:slides:strict で 0 件にする。
-->

---

# この資料で決めたいのは〔要記入：判断してほしいこと〕です

<Cards :items="[
  { title: '決めたいこと', body: '〔要記入〕' },
  { title: '判断に使う情報', body: '〔要記入〕' },
  { title: '今日は扱わないこと', body: '〔要記入〕' },
]" />

<!--
型: カード（Cards）。並列の3〜4要素を並べる。
-->


---
layout: section
---

# 〔要記入：章の名前〕

〔要記入：この章で言うこと〕

---

# 〔要記入：数字が言っていることを一文で〕

<Stats :items="[
  { value: '〔要記入〕', unit: '分', label: '〔要記入：何の数字か〕' },
  { value: '〔要記入〕', unit: '件', label: '〔要記入：何の数字か〕' },
]" />

<Callout>〔要記入：この数字から言えること〕</Callout>

<Source measured todo />

<!--
型: 数字（Stats）。強調したい数字を accent で選ぶ（省略時は1つ目が赤）。
数字を出すスライドには <Source> が必須（lint が検査する）。
-->

---

# 〔要記入：導入前と後で何が変わるか〕

<Compare
  :left="{ title: '今', items: ['〔要記入〕', '〔要記入〕', '〔要記入〕'] }"
  :right="{ title: '導入後', items: ['〔要記入〕', '〔要記入〕', '〔要記入〕'] }"
/>

<!--
型: 比較（Compare）。左がグレー、右が赤。
-->

---

# 〔要記入：流れのどこが変わるかを一文で〕

<Flow :accent="2" :steps="[
  { title: '〔要記入〕', body: '〔要記入〕' },
  { title: '〔要記入〕', body: '〔要記入〕' },
  { title: '〔要記入〕', body: '〔要記入〕' },
]" />

<Callout>〔要記入：図から言えること〕</Callout>

<!--
型: 流れ（Flow）。工程や順序を横に並べる。変化する工程を accent で赤にする。
-->

---

# 〔要記入：それぞれの役割の違いを一文で〕

<Layers :accent="1" :layers="[
  { name: '〔要記入〕', title: '〔要記入〕', body: '〔要記入〕', tags: ['〔要記入〕'] },
  { name: '〔要記入〕', title: '〔要記入〕', body: '〔要記入〕', tags: ['〔要記入〕'] },
]" />

<!--
型: 層（Layers）。上下の役割分担・積み重ねを見せる。
-->

---
class: reveal-steps
---

# 〔要記入：進め方を一文で〕

<v-clicks>

1. 〔要記入〕
2. 〔要記入〕
3. 〔要記入〕

</v-clicks>

<!--
型: 段階表示つきの手順。v-click は手順（reveal-steps）と比較（reveal-compare）だけ。デッキ全体で4枚まで。
-->

---

# この資料の数字と比較は、すべて次の出典にもとづいている

- 〔要記入：書名・記事名／発行元／公開日／URL〕
- デザイン: デジタル庁デザインシステム（DADS）デザイントークン

<!--
出典は「誰が・いつ・どこで」出したかが分かる形で書く。
-->
