# 📚 Book Summary Slides — プロジェクト計画

ある本の内容を、他の人にも分かりやすく伝えるためのプレゼン資料を **Slidev** で作成するプロジェクト。

## 概要

| 項目 | 内容 |
| --- | --- |
| ツール | [Slidev](https://sli.dev)（Markdown + Vue ベースのスライド） |
| パッケージマネージャ | npm |
| Node バージョン | 20 系（`.nvmrc` で固定。ローカルは 24 でも動作確認済み） |
| 公開先 | GitHub Pages（手軽）/ または S3 + CloudFront（使い慣れた構成） |
| リポジトリ | https://github.com/tarou652/cluade-purezen |
| 状態 | 土台づくり完了（Slidev スキャフォールド済み）。内容は読書後に着手。 |

---

## Phase 0. プロジェクト土台づくり（完了）

- [x] GitHub リポジトリを作成（`cluade-purezen`）
- [x] Slidev を構成（対話式スキャフォールドの代わりに手動セットアップ：`package.json` / `slides.md` 等）
- [x] パッケージマネージャを npm に統一
- [x] Node バージョンを固定（`.nvmrc` で 20 系）
- [x] ローカル起動確認
  ```bash
  npm run dev   # http://localhost:3030
  ```
- [x] `.gitignore` 確認（`node_modules`, `dist`）
- [x] テーマを選定（`@slidev/theme-seriph`）
- [x] README にプロジェクト概要・起動方法を記載
- [ ] 初回コミット & push

---

## Phase 1. 読書しながらコンテンツ抽出（読書と並行）

- [ ] 章ごとに要点メモを取る（`notes/` ディレクトリに章別 Markdown でも可）
- [ ] 本全体の「一番伝えたいメッセージ」を1〜2行で言語化
- [ ] 想定読者を決める（前提知識・職種・興味）
- [ ] 「聞いた人に何を持ち帰ってほしいか」を3点以内で定義
- [ ] 章構成 → 発表用ストーリーへの再編成（本の順番＝発表の順番とは限らない）
- [ ] 引用は最小限・要約は自分の言葉で（著作権配慮。後述）

---

## Phase 2. スライド構成設計

- [ ] アウトライン作成（タイトル → 導入/なぜこの本か → 本論セクション → まとめ → 参考）
- [ ] 「1スライド1メッセージ」で割り付け
- [ ] 図解が必要な箇所を洗い出す（概念図・フロー・比較表）
- [ ] コード例・データを入れるか検討
- [ ] 発表時間の目安を決める（例: 15分 → スライド15〜20枚目安）

---

## Phase 3. Slidev でスライド実装

- [ ] `slides.md` を構成に沿って執筆
- [ ] レイアウト活用（`cover` / `two-cols` / `center` / `section` など）
- [ ] Mermaid で図解（フロー・関係図）
- [ ] コードハイライト & 行ハイライト（必要なら）
- [ ] クリックアニメーション（`v-click`）で段階表示
- [ ] 画像は `public/` に配置し `/image.png` で参照
- [ ] 発表者ノート（presenter notes）を各スライドに追記
- [ ] フロントマターでタイトル・テーマ・著者情報を設定

---

## Phase 4. ビルド & 公開

### 案A: GitHub Pages（推奨・手軽）
- [x] `.github/workflows/deploy.yml` を追加（[テンプレ](./templates/deploy.yml)。npm + base `/cluade-purezen/` 設定済み）
- [ ] リポジトリ Settings → Pages → Source を **GitHub Actions** に設定
- [ ] push して Actions 成功を確認 → `https://tarou652.github.io/cluade-purezen/` で公開確認

### 案B: S3 + CloudFront（使い慣れた構成）
- [ ] `npm run build` で `dist/` を生成（SPA）
- [ ] S3 へ同期 + CloudFront invalidation を GitHub Actions に組み込む
- [ ] OAC / キャッシュ設定は既存の admin ダッシュボード構成を流用

### 共通オプション
- [ ] PDF 配布が必要なら `npm run build -- --download`
- [ ] 発表者ノートを公開物から除外するなら `--without-notes`

---

## Phase 5. レビュー & 仕上げ

- [ ] リハーサル（時間を計測）
- [ ] 文字サイズ・コントラスト・可読性チェック
- [ ] 専門用語に補足があるか確認（想定読者基準）
- [ ] フィードバックをもらって修正
- [ ] 最終版にタグ付け（例: `v1.0`）

---

## ⚠️ 著作権メモ

他人に共有する資料なので、本文の長い転載は避け、**自分の言葉で要約**するのが安全です。
図表や文章を引用する場合は出典（書名・著者・該当箇所）を明記し、引用は必要最小限に。

---

## 📁 想定ディレクトリ構成

```
cluade-purezen/
├─ slides.md              # エントリポイント（Slidev / 現在は機能デモ）
├─ components/            # Vue コンポーネント（自動インポート）
├─ examples/              # 雛形・サンプル（book-template.md）
├─ public/                # 画像など静的ファイル
├─ notes/                 # 章別の読書メモ（任意）
├─ docs/                  # 計画・Slidev ガイド・テンプレ
├─ .github/workflows/
│  └─ deploy.yml          # GitHub Pages デプロイ
├─ package.json
└─ README.md
```
