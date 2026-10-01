# cluade-purezen — Book Summary Slides

ある本の内容を、他の人にも分かりやすく伝えるためのプレゼン資料を [Slidev](https://sli.dev) で作成するプロジェクト。

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev        # http://localhost:3030 でプレビュー
```

スライド本体は [slides.md](./slides.md) を編集します。

## ビルド

```bash
npm run build                            # dist/ に静的出力
npm run build -- --base /cluade-purezen/ # GitHub Pages 公開用
```

## 公開（GitHub Pages）

`main` に push すると [GitHub Actions](.github/workflows/deploy.yml) が自動でビルド・デプロイします。
初回のみ、リポジトリ Settings → Pages → Source を「GitHub Actions」に設定してください。

公開 URL: https://tarou652.github.io/cluade-purezen/

## AI議事録デッキ（社内共有用）

[minutes/slides.md](./minutes/slides.md)。デジタル庁デザインシステム（DADS）のトークンを使い、
見た目と文体のルールを CI で検査する。ルールは [docs/slide-rules.md](./docs/slide-rules.md)。

```bash
npm run dev:minutes          # プレビュー
npm run lint:slides          # ルール検査（未記入は警告）
npm run lint:slides:strict   # 共有前の検査（未記入もエラー）
npm run build:minutes        # minutes/dist に静的出力（GitHub Pages には載せない）
```

## ドキュメント

- [docs/project-plan.md](./docs/project-plan.md) — プロジェクト計画（Phase 0〜5）
- [docs/slide-rules.md](./docs/slide-rules.md) — 社内共有スライドのルールと検査
- [CLAUDE.md](./CLAUDE.md) — 開発ガイド

## 技術スタック

- Slidev（テーマ: `@slidev/theme-seriph`）
- パッケージマネージャ: npm
- Node 20 系（`.nvmrc`）
