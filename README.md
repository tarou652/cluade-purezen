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

## ドキュメント

- [docs/project-plan.md](./docs/project-plan.md) — プロジェクト計画（Phase 0〜5）
- [CLAUDE.md](./CLAUDE.md) — 開発ガイド

## 技術スタック

- Slidev（テーマ: `@slidev/theme-seriph`）
- パッケージマネージャ: npm
- Node 20 系（`.nvmrc`）
