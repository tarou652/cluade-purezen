---
name: internal-slides
description: 社内共有向けの Slidev スライド（template/slides.md と、それを書き換えた deck/* ブランチの資料）を書く・直す・レビューするときに使う。DADS トークン準拠・赤基調の style.css と部品（Cards / Stats / Compare / Flow / Layers / Callout）を使い、見出し＝主張・絵文字禁止・v-click 制限・中央寄せ制限・禁止語・数字の出典の6ルールを lint（npm run lint:slides）で検査しながら進める。「スライドを作って/直して」「資料を追加」「AIっぽさを消して」「スライドをレビューして」などの依頼で、明示的にスキル名を言われなくても発動する。
---

# 社内共有スライドを書く

ルールの全文と理由は `docs/slide-rules.md`。ここには作業の手順だけを書く。
ルールは CSS の初期値と lint が守らせるので、覚えるより **lint を回して直す** ことを優先する。

## 手順

1. 資料のブランチにいるか確かめる。新しい資料なら `git switch -c deck/<名前> main` で切る。`main` には資料を書かない（`main` はテンプレートの改善だけ）
2. `template/slides.md`（部品の見本を兼ねる）と `docs/slide-rules.md` を読む
3. 書く前に、スライドごとの「見出し＝主張の一文」と「型」（下表）を先に並べて筋を確かめる。見出しだけ読んで話が通らなければ構成から直す。箇条書きの型が3枚以上続いたら、どれかを図・数字・カードにする
4. 本文を書く
   - スタイルは書かない。`style.css` の初期値と部品に任せる。色や文字サイズを直接指定したくなったら `--slide-*` / `--space-*` / DADS トークンを使う
   - 各スライドに具体を1つ入れる（例・実物のコードやファイル・数字）。抽象語の言い換えだけの箇条書きにしない
   - 数字を書いたら同じスライドに `<Source>…</Source>` か `<Source measured>…</Source>` を置く。根拠が手元にない数字は書かない。調査結果が未入手なら `〔要記入〕` と `<Source todo />` で枠だけ作る
   - `v-click` は手順（`class: reveal-steps`）と比較（`class: reveal-compare`）だけ
   - スライド送りのアニメーション（`transition`）は書かない
   - アイコンは carbon だけ。絵文字は使わない
   - 発表者ノート（`<!-- -->`）に、そのスライドで話すことを残す
5. `npm run lint:slides` を実行し、error を 0 にする。error を消すために検査や禁止語リストを緩めない
6. 見た目を確かめる: `npm run dev` で開くか、`npm run export -- --format png --output <dir>` で画像にして全スライドを見る
7. 共有・公開の前は `npm run lint:slides:strict` で警告（未記入）も 0 にする

## 型（template/components/）

| 型 | 部品 | 使いどころ |
| --- | --- | --- |
| カード | `<Cards :items="[{ title, body }]" :accent="n" />` | 並列の3〜4要素（理由・弱点・特徴） |
| 数字 | `<Stats :items="[{ value, unit, label }]" />` | 大きく見せたい数字。`<Source>` 必須 |
| 比較 | `<Compare :left="{ title, items }" :right="{ title, items }" />` | 前と後、従来と提案 |
| 流れ | `<Flow :steps="[{ title, body }]" :accent="n" />` | 工程・順序。変わる工程を accent で赤に |
| 層 | `<Layers :layers="[{ name, title, body, tags }]" :accent="n" />` | 役割分担・積み重ね |
| 結論 | `<Callout>…</Callout>` | 図や表から言えることを1行。1スライド1つまで |
| 表 | Markdown の表 | 観点 × 対象の比較 |
| コード | コードブロック | 実物（設定ファイル・スクリプト）を見せる |

部品を新しく作るときは `template/components/` に置き、色は `--slide-*` だけを使う。
部品の中のアイコンは `<carbon-xxx />` 形式で書く（`i-carbon-*` クラスは Slidev のビルドで CSS が生成されない）。
テンプレートの改善は `main` で行い、資料のブランチには `git merge main` で取り込む。

## 書き方の注意（lint で拾いきれないもの）

- 見出しは「何が・どうなる」を言い切る。形だけ主張で中身が空の見出し（「〜は重要な役割を果たす」）にしない
- 1スライドで言うことは1つ。箇条書きは3〜5行
- 言い換えで禁止語をすり抜けない。すり抜けを見つけたら `scripts/banned-words.txt` に理由つきで足す
- 調査結果・数値・出典をでっち上げない。ユーザーから受け取っていない事実は `〔要記入〕` のままにする

## グラフ

グラフを載せるときは `docs/slide-rules.md` の「グラフを載せる場合」に従う
（ダッシュボードデザインの実践ガイドブックのパレット `--chart-*`・グリッド・チェックリスト）。
