# CLAUDE.md

このファイルは [Claude Code](https://claude.com/claude-code) がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

社内共有用のプレゼン資料を **Slidev**（Markdown + Vue ベースのスライドツール）で作るためのテンプレート。

- `main` には **テンプレートの改善だけ** を置く（`template/`・`scripts/`・`docs/slide-rules.md`・`.claude/skills/`）
- 資料は1つにつき1ブランチ（`deck/<名前>`）。ブランチ内で `template/slides.md` を書き換える
- テンプレートの改善を資料に取り込むときは、資料のブランチで `git merge main`
- リポジトリ: https://github.com/tarou652/cluade-purezen

| ブランチ | 中身 |
| --- | --- |
| `deck/skill` | Skill ― AIに「やり方」を教える技術 |
| `deck/ai-minutes` | AI議事録ツールの調査共有（旧構成 `minutes/`） |
| `deck/book` | 本の要約デッキ（旧構成。GitHub Pages 公開用の deploy.yml はこのブランチにある） |
| `deck/slidev-guide` | Slidev の機能デモ（旧構成） |
| `deck/skill-presentation` | コンサル風のスキル紹介デッキ（旧構成） |

## 技術スタック / 前提

- **ツール**: Slidev（https://sli.dev）。テーマは使わず `template/style.css` が見た目を持つ
- **パッケージマネージャ**: npm に統一する（pnpm は使わない）
- **Node**: 20 系（`.nvmrc` で固定。ローカルは 24 でも動作確認済み）

## よく使うコマンド

資料が増えてもコマンドは増やさない。すべて `template/slides.md` を対象にする。

```bash
npm install                  # 依存インストール
npm run dev                  # 開発サーバ起動（http://localhost:3030）
npm run build                # dist/ に静的ビルド
npm run export               # PDF にエクスポート
npm run lint:slides          # ルール検査（CI と同じ。error を 0 にする）
npm run lint:slides:strict   # 共有前（〔要記入〕も 0 にする）
npm run test:lint            # 検査スクリプトの回帰テスト
```

## ディレクトリ構成（main）

```
.
├─ template/
│  ├─ slides.md          # 見本デッキ。資料のブランチではこれを書き換える
│  ├─ style.css          # 見た目（DADS トークンのみ参照・赤基調）
│  ├─ styles/dads-tokens.css  # DADS から取り込んだトークン（直接編集しない）
│  ├─ components/        # Cards / Stats / Compare / Flow / Layers / Callout / Source
│  └─ setup/             # サブパス公開の 404 対策・Mermaid 配色
├─ scripts/              # lint-slides.mjs（ルール検査）・禁止語・設定・回帰テスト
├─ docs/slide-rules.md   # ルールの全文
├─ .claude/skills/       # internal-slides（スライドを書く手順）ほか
└─ .github/workflows/lint-slides.yml
```

`template/` が Slidev の userRoot になるので、`style.css` / `components/` / `setup/` は `template/` 配下のものが使われる。

## 作業方針 / 規約

- スライドを書く・直すときは `.claude/skills/internal-slides/SKILL.md` の手順に従い、`npm run lint:slides` の error を 0 にする。ルールは [docs/slide-rules.md](./docs/slide-rules.md)
- **スライド原則**: 「1スライド1メッセージ」。見出しは主張の一文
- **見た目**: 箇条書きだけのスライドを続けない。`template/components/` の部品（カード・数字・比較・流れ・層）で図にする
- **色**: 赤（`--slide-key`）とグレーだけ。直接の色指定はしない。`--slide-*` / `--space-*` / DADS トークンを使う
- **アイコン**: carbon だけ。部品の中では `<carbon-xxx />` のコンポーネント形式で書く（`i-carbon-*` クラスは Slidev のビルドで CSS が生成されない）
- **段階表示**: `v-click` は手順（`class: reveal-steps`）と比較（`class: reveal-compare`）だけ
- **発表者ノート**: 各スライドに presenter notes を残す
- **数字・出典**: 創作しない。未入手のものは `〔要記入〕` と `<Source todo />` で残す
- **著作権**: 本文の長い転載は避け、自分の言葉で要約する。引用は出典を明記して最小限に

⚠️ 公開や Slidev 機能でハマったときは [docs/troubleshooting.md](./docs/troubleshooting.md)（つまずきポイント集）を参照すること。
