---
name: consulting-pptx
description: >-
  Create polished, consulting-style **Slidev** decks (Markdown + Vue) with a
  FIXED house design — white background, red (C8102E) accent, clean Yu Gothic
  typography, a red outer frame — and a presenter script (speaker notes / 台本)
  on every single slide. Use this skill whenever the user wants to build,
  generate, or design a slide deck / presentation / 提案資料 / 報告資料 / プレゼン
  / スライド as Slidev, ESPECIALLY when they want a consistent, repeatable
  "consulting" or "コンサル風" look, a red-and-white theme, or speaker notes /
  talking points / 台本 / ナレーション for each page. Trigger even if the user
  only says "スライド作って" or "スライドにまとめて". Do NOT use for the book deck
  (book.md / apple-basic) — that has its own skill (book-slides). Do NOT use for
  reading/editing an unrelated existing deck with its own template.
license: Proprietary
---

# consulting-pptx（Slidev版）

毎回同じ「コンサル風（白背景・赤基調）」デザインのスライドを **Slidev**
（Markdown + Vue）で作るためのスキル。デザインは `assets/` にコード（共通CSS＋
Vueコンポーネント）として固定してある。**この部品を使って組む限り、誰がいつ
作っても同じ見た目に揃う**のが最大の狙い。

> 旧版は pptxgenjs で .pptx を生成していたが、このプロジェクト（Slidev）に合わせ、
> 同じハウスデザインを Slidev デッキとして出力する形に変換した。

## このスキルが持つもの（`assets/`）

- `consulting.css` … ハウスデザインの共通スタイル（色トークン・和文フォント・
  赤い外周フレーム・赤い四角マーカー等）。**正となる定義はここ**。
- `components/*.vue` … 再利用コンポーネント（下記）。Slidev はデッキ近傍の
  `components/` を自動インポートするので、**プロジェクトの `components/` に
  コピーして使う**。
- `deck-template.md` … そのまま動くスターターデッキ（表紙〜まとめ＋台本入り）。
- `references/script-writing.md` … 台本（スピーカーノート）の書き方。

## 導入（最初の1回だけ）

1. コンポーネントをプロジェクトの `components/` にコピーする（自動インポート用）:
   ```bash
   cp .claude/skills/consulting-pptx/assets/components/*.vue components/
   ```
2. 依存は不要（Slidev 本体はプロジェクト直下に導入済み）。プレビューは
   `npx slidev <deck>.md --open` で確認する。

## 絶対ルール（必ず守る）

1. **デザインは `assets/` に従う。** 色・フォント・余白を自前で即興で決めない。
   先頭スライドの `<style>` は `assets/consulting.css`（または `deck-template.md`
   の `<style>` ブロック）を**そのまま貼る**。色を変えたい要望は `:root` の
   CSS変数（`--c-red` など）を編集して全体に効かせる。
2. **全スライドに台本を付ける。** 各スライドの**末尾**に `<!-- 台本: … -->` を
   必ず置く（Slidev はスライド内で最後のHTMLコメントをスピーカーノートとして
   扱う）。台本はスライド本文の要約ではなく「実際に口で話す原稿」。書き方は
   `references/script-writing.md`。台本が無いページがあってはいけない。
3. **赤はアクセント。** 赤で塗りつぶさない。背景は常に白。赤は数字・キッカー・
   丸番号・強調ボックスなど“効かせどころ”に集中（白70:灰20:赤10 が目安）。
4. **AIっぽい装飾を入れない。** タイトル下線・全幅カラーバー・カード端の細い
   アクセント帯は禁止。差をつけたいときは淡い地色か影で。全スライド外周の赤い
   フレームは共通CSSで自動。不要なら `:root` の `--c-frame: 0` で外す。

## ワークフロー

1. **構成を決める。** 「表紙 → 章扉 → 本文…→ まとめ」の流れを作る。各本文ページ
   に「キッカー（テーマ）」と「結論文タイトル（言いたい結論）」を割り当てる。
   コンサル資料はタイトルが結論文（例:「国内市場は二極化が進む」）。
2. **デッキを書く。** `assets/deck-template.md` をコピーして `decks/<name>.md`
   などに置き、内容を差し替える。スライドは `---` で区切る。各ページ末尾に
   `<!-- 台本: … -->`。
3. **プレビュー/ビルド。** `npx slidev decks/<name>.md --open` で確認。配布は
   `npx slidev build decks/<name>.md` / PDFは `npx slidev export decks/<name>.md`。
4. **QA（必須・1巡）。** プレビューを見て、はみ出し・重なり・余白のムラ・台本の
   付け忘れを確認。該当ページだけ直す。深追いしない。

## 部品（コンポーネント）

スライド種別:
- `<CCover title subtitle? date? presenter? label? />` — 表紙。
- `<CSection :number title subtitle? />` — 白地の章扉（大きな赤い番号）。
  `dark` を付けると濃赤地（要所で。使うなら全章で統一）。
- `<CHead kicker title />` — 本文ページのヘッダー（キッカー＋結論タイトル）。

本文に重ねる部品:
- `<CStats :items="[{ value, unit?, label }]" />` — 大きな赤い数字を横並び。
- `<CCards :items="[{ title, body?, badge?, tint? }]" :cols="3" />` — 影付きカード。
- `<CSteps :items="[{ title, body? }]" />` — 赤い丸番号の横型プロセス。
- `<CCompare leftTitle :left rightTitle :right />` — 2カラム比較（右が赤強調）。
- `<CTakeaway label?>結論文</CTakeaway>` — 薄赤の結論ボックス。1枚に1つまで。
- 箇条書きは普通の Markdown `- …`（共通CSSで赤い四角マーカーになる）。

図解・グラフ:
- フロー/関係図は **Mermaid**（```mermaid ブロック）を使う（プロジェクト規約）。
- 数値の比較・推移・内訳は、まず `CStats` / `CCards` で見せられないか検討する。
  本格的なグラフが要るなら Vue のチャートコンポーネントを `components/` に足す
  （任意。配色は `--c-red` 基調に合わせる）。

台本:
- 各スライド末尾の `<!-- 台本: … -->`。**毎ページ必須**。`references/script-writing.md` 参照。

## レイアウトの指針

- 1スライド＝1メッセージ。タイトルは結論を言い切る文にする。
- **文字だけのページを作らない。** 統計・カード・プロセス・比較・図のいずれかを必ず入れる。
- レイアウトを毎ページ変える（箇条書きばかりにしない）。stats/cards/steps/compare を使い分ける。
- 箇条書きは1項目1〜2行・最大6項目。長文は分割する。
- 配色比率の目安: 白 70% / 灰(文字) 20% / 赤(差し色) 10%。

詳しいトークン値は `assets/consulting.css` を参照。

## メモ

- 出力は Slidev（Markdown）。.pptx が必要なら `npx slidev export --format pptx <deck>.md`
  でエクスポートできる（レイアウトは Slidev レンダリング基準になる）。
- このスキルは consulting デッキ用。本（book.md / apple-basic テーマ）の編集は
  `book-slides` スキルの担当。混在させない。
