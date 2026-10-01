# 社内共有スライドのルール（AI議事録デッキ）

`template/slides.md`（社内共有スライドのテンプレート。資料は deck/* ブランチでこれを書き換える）のデザインと文体のルール。
前回のデッキ（`book.md`）の反省から、ルールは「読んで守る」形ではなく、
**CSS の初期値と CI の検査で「書けば守られる」形**にしている。

| 仕組み | 置き場所 | 役割 |
| --- | --- | --- |
| DADS トークン | `template/styles/dads-tokens.css` | 色・文字サイズ・角丸の値（手を加えずに取り込んだもの）|
| スライドの初期値 | `template/style.css` | トークンだけを参照。左揃え・引用の装飾なし・中央寄せは表紙と章扉だけ |
| 出典表示 | `template/components/Source.vue` | `<Source>` / `<Source measured>` で数字の根拠を左下に出す |
| 検査 | `scripts/lint-slides.mjs` | ルール1〜6を検出。CI（`.github/workflows/lint-slides.yml`）で実行 |
| 禁止語 | `scripts/banned-words.txt` | ルール5の語リスト。理由をコメントで残して追記する |
| 閾値 | `scripts/slide-lint.config.json` | アイコンセット名・見出しの文字数・v-click の上限枚数 |

```bash
npm run dev                  # 開発サーバ
npm run lint:slides          # 検査（未記入は警告）
npm run lint:slides:strict   # 公開前の検査（未記入もエラー）
npm run test:lint            # 検査スクリプト自体の回帰テスト
npm run build                # dist に静的ビルド
```

---

## 前回のデッキで起きていたこと

`book.md` に今の検査をかけると **68 件**のエラーが出る（`node scripts/lint-slides.mjs book.md`）。

- 絵文字、`v-click` の多用（46 箇所）、中央寄せ、引用ブロックのキャッチコピー
- 「〜とは？」「まとめ」のようなラベル型の見出し
- 根本原因: `docs/presentation-design-guide.md` に書いたルールが実装されておらず、書き手の注意力に頼っていた

---

## デザインの土台

### DADS（デジタル庁デザインシステム）

- 出典: [digital-go-jp/design-system-example-components-html](https://github.com/digital-go-jp/design-system-example-components-html) の `src/global.css`（MIT License）と `@digital-go-jp/design-tokens` 2.0.1
- `dads-tokens.css` は直接編集しない。更新するときは上流から取り込み直す
- スライド側で使う値は `style.css` の `--slide-*` / `--space-*` に名前を付けて参照する
- 文字サイズは DADS のスケールから選ぶ: 表紙 45px、章扉 36px、見出し 32px、本文 20px、表 18px、出典 14px
- 余白は 8px グリッド（`--space-8` 〜 `--space-64`）
- 書体は Noto Sans JP の1系統（DADS の `--font-family-sans`）

### 色と部品

- 色は白・赤・グレーの3つ。赤は前回のコンサル風デッキ（#C8102E）に近い DADS `red-900` を `--slide-key` に当てている
  - 外周フレーム・見出し下の短線・箇条書きのマーカー・表の見出し線に赤を使う。章扉は濃い赤（`red-1100`）の地
  - 強調は1スライドに1か所。部品の `accent` で選んだ要素だけを赤にし、残りはグレー
- 箇条書きだけのスライドを続けると単調になり、中身も薄く見える（前回のフィードバック）。図・数字・カードは `template/components/` の部品で出す

| 部品 | 使いどころ |
| --- | --- |
| `Cards` | 並列の3〜4要素（理由・弱点・特徴） |
| `Stats` | 大きな数字。ルール6の検査対象（`<Stats>` があるスライドは `<Source>` 必須）|
| `Compare` | 前と後、従来と提案の左右比較 |
| `Flow` | 工程・順序の横並び図 |
| `Layers` | 役割の層・積み重ね |
| `Callout` | 図や表から言える結論を1行。1スライド1つまで |

- 部品の中のアイコンは `<carbon-xxx />` のコンポーネント形式で書く。`i-carbon-*` クラスは Slidev 52 のビルドで CSS が生成されず空になる

### グラフを載せる場合

「[ダッシュボードデザインの実践ガイドブック](https://www.digital.go.jp/en/resources/dashboard-guidebook)」（デジタル庁）のパレット・グリッド・チェックリストに従う。

- パレット: ガイドブックの7色（Solid Gray / Blue / Light Blue / Cyan / Green / Orange / Red）を `--chart-base`, `--chart-1`〜`--chart-6` として `style.css` に置いている
  - **暫定**: 各色の段階（`blue-900` など）はガイドブック本体の値とまだ照合していない。照合したらこの行を消す
- 強調したい系列だけに色を付け、それ以外は `--chart-base`（グレー）にする
- 載せる前にガイドブック付属のチェックリスト（グラフのデザイン・データ・アクセシビリティ）を通す
- グラフの数字にもルール6（`<Source>`）がかかる

---

## ルール

### 1. 見出しは主張の一文にする

- 見出しだけ読めば話の筋が分かるようにする。「現状」ではなく「議事録の作成に会議1回あたり30分かかっている」
- 検査: 表紙と章扉以外の全スライドに `# ` 見出しがあること。`？` で終わる、`とは` を含む、ラベル語（まとめ・概要・背景・比較・参考など）で終わる、12字未満、40字超はエラー
- 章扉（`layout: section`）の見出しはラベルでよい

### 2. 絵文字は禁止。アイコンは1セット（Carbon）に統一する

- 検査: ファイル全体（発表者ノートを含む）の絵文字。`i-<set>-*` クラスと `<set-name />` 記法で carbon 以外のセット

### 3. v-click は手順や比較を見せるときだけ使う

- 使うスライドには `class: reveal-steps`（手順）か `class: reveal-compare`（比較）を付ける。手順は済んだ項目が自動で薄くなる
- 検査: この class がないスライドで `v-click` / `v-clicks` / `v-after` などを使うとエラー。使うスライドはデッキ全体で 4 枚まで

### 4. 中央寄せは表紙と章扉だけ

- `style.css` が表紙（`cover`）と章扉（`section`）以外の `text-center` を無効化している
- 検査: `layout: center` / `fact` / `statement` / `intro` / `quote` / `end`、`text-center`、`<center>`、`text-align: center`、`place-*-center`

### 5. 禁止語を使わない

- 誇張（革命・画期的・圧倒的…）、AI文体の定型句（シームレス・ワクワク・いかがでしたか・〜ではなく、…）、曖昧な量（大幅に・さまざまな…）
- 検査: `scripts/banned-words.txt`（本文のみ。発表者ノートとコードは対象外）。感嘆符で終わる行もエラー
- 引用ブロック（`>`）は出典つきの引用だけ。`<Source>` のないスライドで使うとエラー

### 6. 数字には出典か実測値を添える

- `<Source>書名・記事名, 発行元, 公開日</Source>` か `<Source measured>計測範囲, 時期</Source>`
- 検査: 単位つきの数字（%・倍・件・人・分・時間・円 など。年月日は対象外）か `<Stats>` があるスライドに `<Source` がないとエラー
- まだ埋まっていない根拠は `<Source todo />` と `〔要記入〕` で置く。通常の検査では警告、`--strict` ではエラー

### 7. 1〜6 を CI で検査する

- `.github/workflows/lint-slides.yml` が `template/` と `scripts/` の変更時に `test:lint` → `lint:slides` → `build` を実行する

---

## 検査の限界

- ルール1は形で見ているだけで、主張として正しいかは見ていない。「〜である」と書いてあれば通る
- ルール6は単位のない数字（「3つ」など）を見ない
- 検査を通すための抜け道（禁止語の言い換えなど）を見つけたら、`banned-words.txt` かスクリプトに足す

## 公開について

このデッキは社内向けなので、`deploy.yml`（GitHub Pages・一般公開）には含めていない。
共有は `npm run build` の成果物か、`npm run export` の PDF で行う。
