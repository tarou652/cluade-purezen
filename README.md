# cluade-purezen — 社内共有スライドのテンプレート

[Slidev](https://sli.dev) で社内共有用のスライドを作るためのテンプレート。
`main` にはテンプレートだけを置き、**資料は1つにつき1ブランチ**（`deck/<名前>`）で作る。

## 資料を作る

```bash
npm install
git switch -c deck/<名前> main   # 資料ごとにブランチを切る
npm run dev                      # template/slides.md を http://localhost:3030 で開く
```

`template/slides.md` を書き換える。コマンドは資料が増えても変わらない。

```bash
npm run dev                  # プレビュー
npm run lint:slides          # ルール検査（未記入は警告）
npm run lint:slides:strict   # 共有前の検査（未記入もエラー）
npm run build                # dist/ に静的出力
npm run export               # PDF に書き出し
npm run test:lint            # 検査スクリプト自体の回帰テスト
```

テンプレートの改善（部品・style.css・lint）は `main` で行い、各資料のブランチには `git merge main` で取り込む。

## ブランチ

| ブランチ | 中身 |
| --- | --- |
| `main` | テンプレート（`template/`）・検査（`scripts/`）・ルール（`docs/slide-rules.md`） |
| `deck/skill` | Skill ― AIに「やり方」を教える技術 |
| `deck/ai-minutes` | AI議事録ツールの調査共有 |
| `deck/book` | 本の要約デッキ（GitHub Pages で公開。push で deploy が走る） |
| `deck/slidev-guide` | Slidev の機能デモ |
| `deck/skill-presentation` | コンサル風のスキル紹介デッキ（旧デザイン） |

## デザイン

- 白地・赤（DADS red-900）・グレーの3色。赤い外周フレーム、見出し下の赤い短線
- 色・文字サイズ・余白は DADS（デジタル庁デザインシステム）のトークンだけを使う
- 図・数字・カードは `template/components/` の部品で出す

| 部品 | 使いどころ |
| --- | --- |
| `<Cards>` | 並列の3〜4要素（理由・弱点・特徴） |
| `<Stats>` | 大きな数字（`<Source>` 必須） |
| `<Compare>` | 前と後、従来と提案の左右比較 |
| `<Flow>` | 工程・順序の横並び図 |
| `<Layers>` | 役割の層・積み重ね |
| `<Callout>` | スライドの結論1行 |
| `<Source>` | 数字の出典・実測の表示 |

ルールの全文は [docs/slide-rules.md](./docs/slide-rules.md)、開発ガイドは [CLAUDE.md](./CLAUDE.md)。

## 技術スタック

- Slidev（テーマなし。`template/style.css` が見た目を持つ）
- パッケージマネージャ: npm
- Node 20 系（`.nvmrc`）
