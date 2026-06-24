---
name: consulting-pptx
description: >-
  Create polished, consulting-style PowerPoint decks with a FIXED house design —
  white background, red (C8102E) accent, clean Yu Gothic typography — and a
  presenter script (speaker notes / 台本) on every single slide. Use this skill
  whenever the user wants to build, generate, or design a .pptx / slide deck /
  presentation / 提案資料 / 報告資料 / プレゼン / スライド, ESPECIALLY when they
  want a consistent, repeatable look across decks, a "consulting" or "コンサル風"
  style, a red-and-white theme, or speaker notes / talking points / 台本 / ナレ
  ーション for each page. Trigger even if the user only says "パワポ作って" or
  "スライドにまとめて" — this skill is the default way to produce decks so they
  always come out on-brand. Do NOT use for reading/editing an unrelated existing
  deck with its own template (use the generic pptx skill for that).
license: Proprietary
---

# consulting-pptx

毎回同じ「コンサル風（白背景・赤基調）」デザインのパワポを作るためのスキル。
デザインは `assets/theme.js` にコードとして固定してある。**theme.js の部品を
使って組む限り、誰がいつ作っても同じ見た目に揃う**のが最大の狙い。

## Claude Code での導入（最初の1回だけ）

1. このフォルダ一式を Claude Code のスキル置き場に置く。
   - ユーザー全体で使う: `~/.claude/skills/consulting-pptx/`
   - 特定プロジェクトだけ: `<repo>/.claude/skills/consulting-pptx/`
   （`SKILL.md` がその直下に来る形。`assets/ references/ scripts/ package.json` も同階層）
2. スキルフォルダ内で依存をインストールする（これで自己完結する）:
   ```bash
   cd ~/.claude/skills/consulting-pptx && npm install
   ```
   `theme.js` の `require("pptxgenjs")` はこの `node_modules` から解決される。
3. （QAの画像化を使う場合のみ）LibreOffice と Poppler を入れる:
   - mac: `brew install --cask libreoffice && brew install poppler`
   - Ubuntu: `sudo apt install -y libreoffice poppler-utils`

導入後は「コンサル風のパワポで〇〇の提案資料を作って。台本も付けて」のように
頼めば、このスキルが起動して下記ワークフローで生成する。

> パス解決: 生成スクリプトから theme.js を読むときは、**このSKILL.mdと同じ
> フォルダの `assets/theme.js` への絶対パス**を使う（例:
> `~/.claude/skills/consulting-pptx/assets/theme.js`）。`save()` は内部で
> `scripts/rezip.py` を自分の相対位置から呼ぶので、出力先はどこでもよい。

## 絶対ルール（必ず守る）

1. **デザインは theme.js に従う。** 色・フォント・余白・レイアウトを自前で即興
   で決めない。`createDeck()` と各部品関数だけで構成する。色を変えたい要望が
   あれば theme.js の `THEME.colors` を編集して全体に効かせる（その場しのぎの
   ハードコードをしない）。
2. **全スライドに台本を付ける。** `deck.script(slide, "…")` を 1 枚ずつ必ず呼ぶ。
   台本はスライド本文の要約ではなく「実際に口で話す原稿」。書き方は
   `references/script-writing.md` を読むこと。台本が無いページがあってはいけない。
3. **赤はアクセント。** 赤で塗りつぶさない。背景は常に白。赤は数字・キッカー・
   丸番号・強調ボックスなど“効かせどころ”に集中させる（白70:灰20:赤10 が目安）。
4. **AIっぽい装飾を入れない。** タイトル下線、全幅のカラーバー、カード端の細い
   アクセント帯は禁止（theme.js もこれらを使っていない）。差をつけたいときは
   淡い地色か影で。なお全スライドの外周は赤い縁取り（外側だけ赤く塗る＝`THEME.frame`）
   が自動で入る。太さは `THEME.frame.inset`、不要なら `THEME.frame.inset = 0` で外せる。

## ワークフロー

1. **構成を決める。** 内容から「表紙 → 章扉 → 本文…→ まとめ」の流れを作る。各
   本文ページに「キッカー（テーマ）」と「一言メッセージ（言いたい結論）」を割り
   当てる。コンサル資料はタイトルが結論文（例:「国内市場は二極化が進む」）。
2. **生成スクリプトを書く。** `assets/theme.js` を require し、下記APIで組む。
   各ページ作成直後に `deck.script()` で台本を付ける。
3. **保存する。** `await deck.save("/abs/path/out.pptx")`（内部で rezip も実行）。
4. **QA する（必須）。** 後述の手順で画像化し、はみ出し・重なり・空きムラを確認。
   1巡だけ直して終える。深追いしない。

## クイックスタート

```js
// theme.js は「このスキルフォルダの assets/theme.js」を絶対パスで読む
const { createDeck } = require(require("os").homedir() + "/.claude/skills/consulting-pptx/assets/theme.js");
// プロジェクト配置なら例: require("/abs/path/<repo>/.claude/skills/consulting-pptx/assets/theme.js")

(async () => {
  const deck = createDeck({ title: "新規事業 提案", author: "山田太郎", confidential: true });

  // 表紙
  deck.cover({ title: "新規事業 参入提案", subtitle: "国内サブスク市場への展開", date: "2026.06", presenter: "戦略企画部" });
  deck.script(deck.last, "本日はご多用の中…（自己紹介と、この資料のゴールを30秒で）");

  // 章扉
  deck.section({ number: 1, title: "市場環境", subtitle: "なぜ今この市場なのか" });
  deck.script(deck.last, "まず前提となる市場環境から共有します。");

  // 本文（タイトルは結論文で）
  const s = deck.content({ kicker: "市場規模", title: "市場は5年で1.8倍に拡大する" });
  deck.stats(s, [
    { value: "1.8", unit: "倍", label: "5年間の市場拡大率" },
    { value: "12", unit: "%", label: "年平均成長率(CAGR)" },
    { value: "3,200", unit: "億円", label: "2030年予測市場規模" },
  ]);
  deck.takeaway(s, "成長市場であり、参入の好機は今後2〜3年に限られる。");
  deck.script(s, "市場規模を3つの数字で。1.8倍、CAGR12%…（各数字の出典と含意を話す）");

  await deck.save("/abs/path/output.pptx");
})();
```

実行: `node build_deck.js`

## 部品API（createDeck 経由）

スライドを作る:
- `deck.cover({ title, subtitle?, date?, presenter? })` — 表紙。
- `deck.section({ number, title, subtitle? })` — 白地の章扉（大きな赤い番号）。
- `deck.sectionDark({ number, title, subtitle? })` — 濃赤地の章扉（任意。要所で）。
- `deck.content({ kicker, title })` — 本文枠（ヘッダー＋フッター）。戻り値に本文を重ねる。
- `deck.blank()` — ヘッダー無しの自由レイアウト用。

本文に重ねる部品（第1引数を省略すると直前のスライドへ）:
- `deck.bullets(s, ["要点", { text:"親", sub:"補足" }], { fontSize? })` — 四角マーカーの箇条書き。
- `deck.stats(s, [{ value, unit?, label }], { y? })` — 大きな赤い数字の統計を横並び。
- `deck.cards(s, [{ title, body?, badge?, tint? }], { cols?, y?, h? })` — 影付きカードのグリッド。
- `deck.steps(s, [{ title, body? }], { y? })` — 赤い丸番号の横型プロセス。
- `deck.compare(s, { leftTitle, left:[…], rightTitle, right:[…] })` — 2カラム比較（右が赤強調）。
- `deck.takeaway(s, "結論文", { label? })` — 薄赤の結論ボックス。1枚に1つまで。

グラフ（ネイティブ・編集可能なまま挿入。配色は赤基調を自動適用。データは
`{ labels:[…], values:[…] }` 単系列、または `[{ name, labels, values }, …]` 複数系列）:
- `deck.col(s, { labels, values })` — 縦棒。`deck.bar` は横棒。
- `deck.line(s, data, { lineSmooth? })` — 折れ線（複数系列は配列で渡す）。
- `deck.pie(s, { labels, values })` / `deck.doughnut(s, …)` — 円 / ドーナツ。
- 数値の羅列は表より**グラフにすると見やすい**。推移は折れ線、内訳は円/ドーナツ、比較は棒。

台本:
- `deck.script(s, "話す原稿")` — **毎ページ必須**。`references/script-writing.md` 参照。

任意（依存があるとき）:
- `await deck.iconPng(IconComponent, "#FFFFFF", 256)` — react-icons を白アイコンPNG化し、
  赤丸（`addShape("ellipse", { fill:{color: THEME.colors.red} })`）に重ねて使う。

## レイアウトの指針

- 1スライド＝1メッセージ。タイトルは結論を言い切る文にする。
- **文字だけのページを作らない。** 統計・カード・プロセス・比較・図のいずれかを必ず入れる。
- レイアウトを毎ページ変える（箇条書きばかりにしない）。stats/cards/steps/compare を使い分ける。
- 箇条書きは1項目1〜2行・最大6項目。長文は分割する。
- ダーク章扉は使うなら全章で統一（“サンドイッチ”）。混在させない。
- 配色比率の目安: 白 70% / 灰(文字) 20% / 赤(差し色) 10%。

詳しいトークン値・部品の引数は `assets/theme.js` 冒頭のコメントを参照。

## QA（必須・1巡）

```bash
# 1) 画像化
soffice --headless --convert-to pdf output.pptx
rm -f slide-*.jpg
pdftoppm -jpeg -r 150 output.pdf slide
ls -1 "$PWD"/slide-*.jpg

# 2) 本文チェック（抜け・誤字・順序、プレースホルダ残り）
#   pptxのテキストを目視。台本はノートに入っているか確認する。
```

画像を見て、はみ出し・重なり・要素同士の近すぎ・余白のムラ・コントラスト不足が
ないか確認する。問題があれば直して、**該当ページだけ**再生成・再確認する。
1巡で十分。微小なズレを延々と追わない。

> フォント注意: 日本語フォント(Yu Gothic)はこの環境のLibreOfficeで代替表示され、
> プレビューの字幅が実際と異なることがある。文字詰まり/はみ出しの最終判断は、
> ユーザーのPowerPoint上の表示が正となる。テキスト領域には1割ほど余裕を持たせる。

## 依存

- `pptxgenjs`（生成）— スキルフォルダで `npm install` 済みなら自動で解決。
- LibreOffice(`soffice`) + Poppler(`pdftoppm`)（QAの画像化、任意）。
- 任意: `react-icons react react-dom sharp`（赤丸アイコンを使う場合。`package.json`
  の optionalDependencies に含む）。
