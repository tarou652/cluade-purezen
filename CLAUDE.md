# CLAUDE.md

このファイルは [Claude Code](https://claude.com/claude-code) がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

ある本の内容を他の人に分かりやすく伝えるためのプレゼン資料を **Slidev**（Markdown + Vue ベースのスライドツール）で作成するプロジェクト。

- 詳細な計画は [docs/project-plan.md](./docs/project-plan.md) を参照。
- 土台づくりは完了（Slidev セットアップ済み）。コンテンツは本を読み終えてから着手。
- リポジトリ: https://github.com/tarou652/cluade-purezen

## 技術スタック / 前提

- **ツール**: Slidev（https://sli.dev）/ テーマは `@slidev/theme-seriph`
- **パッケージマネージャ**: npm に統一する（pnpm は使わない）
- **Node**: 20 系（`.nvmrc` で固定。ローカルは 24 でも動作確認済み）
- **公開先**: GitHub Pages（推奨・手軽）/ または S3 + CloudFront

## よく使うコマンド

```bash
npm install                              # 依存インストール
npm run dev                              # 開発サーバ起動（http://localhost:3030）
npm run build                            # dist/ に静的ビルド
npm run build -- --base /cluade-purezen/ # GitHub Pages 公開用ビルド（base 付き）
npm run build -- --download              # PDF 同梱でビルド（配布用）
npm run build -- --without-notes         # 発表者ノートを除外して公開
npm run export                           # PDF/PNG 等にエクスポート
```

## 想定ディレクトリ構成

```
.
├─ slides.md              # Slidev エントリポイント（現在は機能デモデッキ）
├─ components/            # Vue コンポーネント（自動インポート。GsapBoxes / GsapCounter）
├─ examples/              # 雛形・サンプル（book-template.md など）
├─ public/                # 画像など静的ファイル（/image.png で参照）
├─ notes/                 # 章別の読書メモ（任意）
├─ docs/                  # プロジェクトドキュメント（計画・Slidev ガイド・テンプレ）
├─ .github/workflows/
│  └─ deploy.yml          # GitHub Pages デプロイ（docs/templates/ にテンプレあり）
├─ package.json
└─ README.md
```

> 使い方の詳細は [docs/slidev-guide.md](./docs/slidev-guide.md)（アニメ / GSAP / アイコン / UI / コード）。
> 外部ライブラリは `npm i` → `components/*.vue` 内で `import` して使うのが基本。アイコンは `@iconify-json/*` を入れて `i-<set>-<name>` クラスで使う。

## 作業方針 / 規約

- **スライド原則**: 「1スライド1メッセージ」。レイアウトは `cover` / `two-cols` / `center` / `section` などを活用。
- **図解**: フロー・関係図は Mermaid を使う。
- **段階表示**: 必要に応じて `v-click` を使う。
- **画像**: `public/` に置き、`/image.png` の形で参照する。
- **発表者ノート**: 各スライドに presenter notes を残す。公開物から外す場合は `--without-notes`。
- **著作権**: 共有資料のため本文の長い転載は避け、**自分の言葉で要約**する。引用する場合は出典（書名・著者・該当箇所）を明記し、最小限にとどめる。

## デプロイ（GitHub Pages）

`.github/workflows/deploy.yml` は作成済み（npm + base `/cluade-purezen/`）。

1. リポジトリ Settings → Pages → Source を「GitHub Actions」に設定（**初回のみ手動**）。
2. `main` に push すると Actions が走り、`https://tarou652.github.io/cluade-purezen/` で公開される。

※ Pages の Source を設定する前に push すると build は通っても deploy ステップが失敗する。先に Source 設定を済ませること。

※ GitHub Pages は rewrite 非対応のため、ルーティングは **ハッシュルーター**（`slides.md` ヘッドマターの `routerMode: hash`）を使う。これが無いと「ページ遷移のたびに 404」になる。

## 進め方の順序

Phase 0（土台づくり）→ Phase 1（読書しながら抽出）→ Phase 2（構成設計）→ Phase 3（実装）→ Phase 4（公開）→ Phase 5（仕上げ）。詳細は [docs/project-plan.md](./docs/project-plan.md)。
