---
# consulting-pptx (Slidev版) スターターデッキ
# 使い方: このファイルをコピーして decks/<name>.md に置き、内容を差し替える。
# components/ に assets/components/*.vue をコピーしておくこと（C系コンポーネントの自動インポート用）。
# theme はプロジェクト導入済みの seriph を使う（見た目は下の <style> で上書きする）。
theme: seriph
title: 提案資料タイトル
info: |
  出典・補足をここに。
class: text-left
transition: slide-left
mdc: true
---

<CCover
  title="新規事業 参入提案"
  subtitle="国内サブスク市場への展開"
  date="2026.06"
  presenter="戦略企画部"
  label="CONFIDENTIAL"
/>

<!--
台本: 本日はお時間をいただきありがとうございます。戦略企画部の田中です。
これから約20分で、新規事業の市場参入について「なぜ今なのか・どう勝つのか」をご説明します。
結論から申し上げると、参入の好機は今後2〜3年に絞られる、というのが本日の主張です。
-->

<!-- 全スライド共通のハウスデザイン（先頭スライドの <style> に置けば全体へ適用される） -->
<style>
:root {
  --c-red:        #C8102E;
  --c-red-dark:   #8A0A20;
  --c-red-tint:   #FBEAEC;
  --c-ink:        #1A1A1A;
  --c-gray:       #595959;
  --c-gray-light: #8C8C8C;
  --c-rule:       #E3E3E3;
  --c-card:       #F6F6F6;
  --c-frame:      7px;
}
.slidev-layout {
  background: #fff; color: var(--c-ink);
  font-family: "Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Meiryo", sans-serif;
  box-shadow: inset 0 0 0 var(--c-frame) var(--c-red);
  padding: 3.0rem 3.4rem;
}
.slidev-layout h1 { font-weight: 700; color: var(--c-ink); line-height: 1.25; }
.slidev-layout h2 { font-weight: 700; color: var(--c-ink); }
.slidev-layout a  { color: var(--c-red); }
.slidev-layout ul { list-style: none; padding-left: 0; }
.slidev-layout ul > li { position: relative; padding-left: 1.3em; margin: .45em 0; line-height: 1.5; }
.slidev-layout ul > li::before { content: ""; position: absolute; left: 0; top: .55em; width: .5em; height: .5em; background: var(--c-red); }
.slidev-layout blockquote { border-left: 3px solid var(--c-red); color: var(--c-gray); }
.c-kicker { color: var(--c-red); font-weight: 700; font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; margin-bottom: .35rem; }
.c-num { font-family: "Arial", "Helvetica Neue", sans-serif; font-variant-numeric: tabular-nums; }
</style>

---

<CSection :number="1" title="市場環境" subtitle="なぜ今この市場なのか" />

<!--
台本: ここからが本論です。まず前提となる市場環境を共有します。
要点は「成長していること」と「窓が開いているのは今だけ」という2点です。
-->

---

<CHead kicker="市場規模" title="市場は5年で1.8倍に拡大する" />

<CStats :items="[
  { value: '1.8', unit: '倍', label: '5年間の市場拡大率' },
  { value: '12',  unit: '%',  label: '年平均成長率 (CAGR)' },
  { value: '3,200', unit: '億円', label: '2030年予測市場規模' },
]" />

<CTakeaway>成長市場であり、参入の好機は今後2〜3年に限られる。</CTakeaway>

<!--
台本: 市場規模を3つの数字で。1.8倍、CAGR12%——これは△△調査をベースにした保守的な見立てです。
2030年には3,200億円規模になる見込みで、つまり「今動けば取りに行ける」市場だと言えます。
-->

---

<CHead kicker="勝ち筋" title="3つの打ち手で差別化する" />

<CCards :items="[
  { badge: 1, title: '価格', body: '従量課金で初期障壁を下げる。' },
  { badge: 2, title: '体験', body: '導入1日のオンボーディング。' },
  { badge: 3, title: '囲い込み', body: 'API連携で乗り換えコストを上げる。', tint: true },
]" />

<!--
台本: 勝ち筋は3つ。価格・体験・囲い込みです。とくに3点目の連携が、競合に対する持続的な堀になります。
-->

---

<CHead kicker="進め方" title="4ステップで90日以内に立ち上げる" />

<CSteps :items="[
  { title: '検証', body: '想定顧客10社にヒアリング' },
  { title: '試作', body: 'MVPを4週間で構築' },
  { title: '先行導入', body: '3社でβ運用' },
  { title: '本格展開', body: '価格確定・販売開始' },
]" />

<!--
台本: スケジュールは90日。最初の30日は検証に充て、ここで需要が確認できなければ撤退判断もします。
-->

---

<CHead kicker="比較" title="自社運用より外部連携が優位" />

<CCompare
  leftTitle="自社で全部作る"
  :left="['初期費用が大きい', '立ち上げに6か月', '保守人員が必要']"
  rightTitle="外部連携で立ち上げる"
  :right="['初期費用を圧縮', '90日で立ち上げ', 'コア機能に集中']"
/>

<!--
台本: 作るか・繋ぐかの比較です。右の外部連携なら、立ち上げを90日に短縮しつつコアに集中できます。
-->

---
layout: center
---

<CSection title="ご清聴ありがとうございました" subtitle="質疑応答へ" />

<!--
台本: 以上が提案の全体像です。ご質問をいただければ、想定問答も用意していますのでお答えします。
-->
