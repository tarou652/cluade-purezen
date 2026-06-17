# Slidev つまずきポイント集（後世への申し送り）

このプロジェクトの構築〜公開で実際にハマった問題と、その原因・対処の記録。
同じ罠を踏まないように残す。環境: Slidev `@slidev/cli` 52.16.0 / npm / GitHub Pages（サブパス公開）。

---

## 1. 【最重要】サブパス公開でスライド送りが 404 になる

### 症状
GitHub Pages の `https://<user>.github.io/<repo>/` で公開すると、
**1枚目は表示されるが、次のスライドへ進むと Slidev の 404（NotFound）が出る**。

- history モード: URL が `/<repo>/<repo>/2` のように **base が二重**になって 404
- hash モード:    URL が `/<repo>/#/<repo>/2` になって 404

### 原因
Slidev 52.x の `getSlidePath()` はスライドのパスを **`BASE_URL + 番号`**（例 `/cluade-purezen/2`）で
生成し、それを `router.push()` に渡す。一方スライドのルートは **`/:no`**（例 `/2`）。
サブパス公開で `BASE_URL` が `/` でないと、base 付きパスがルートにマッチせず NotFound になる。
1枚目だけ動くのは、初期リダイレクト `'' → /1` が base なしの `/1` を使うため。

> 検証方法: ヘッドレスブラウザ（puppeteer + Edge）でローカルの本番同等ビルドを配信して
> 実際に矢印キーで送る／vue-router 単体で `push("/cluade-purezen/2")` が NotFound になることを確認した。
> ルーターモード（hash/history）の問題ではなく、**パスの二重 base** が真因。

### 対処（このプロジェクトで採用）
ルーターガードで「NotFound かつ base で始まるパス」のとき、余分な base を1つ剥がして送り直す。
実装: [../setup/main.ts](../setup/main.ts)

```ts
import { defineAppSetup } from '@slidev/types'

export default defineAppSetup(({ router }) => {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return
  router.beforeEach((to) => {
    if (to.name === 'NotFound' && to.path.startsWith(base)) {
      const fixed = `/${to.path.slice(base.length)}`   // /cluade-purezen/2 → /2
      if (fixed !== to.path)
        return { path: fixed, query: to.query, hash: to.hash, replace: true }
    }
  })
})
```

- これで URL は `/cluade-purezen/2` のままきれいに保たれ、送り・直リンク・リロードが動く。
- ルートで公開（`BASE_URL = /`）するなら、この問題自体が起きない（ガードも no-op）。

---

## 2. hash ルーターは「サブパスの 404」を解決しない

GitHub Pages は rewrite 非対応なので最初は `routerMode: hash` を試したが、**直らなかった**。
hash でも `getSlidePath` が base を付けるため URL が `/<repo>/#/<repo>/2` となり、同じく 404。
さらに hash だと URL に repo 名が2回出て見た目も悪い。

→ 結論: サブパス公開の 404 の本質は #1 のパス二重 base。ルーターモードでは直らない。
このプロジェクトは **history モード**＋#1 のガード＋#3 の `404.html` で解決している。

---

## 3. 直リンク／リロード用に 404.html を index.html のコピーにする

history モードでは、`/<repo>/3` を直接開く・リロードすると、その実体ファイルが無いため
GitHub Pages が 404 を返す。**`404.html` を `index.html` のコピー**にしておくと、
GitHub が 404.html（＝SPA）を返し、history ルーターが base を除いてスライド番号を解決できる。

deploy.yml のビルド直後に:

```yaml
- run: cp dist/index.html dist/404.html
```

---

## 4. スライド内 `<style>` のコメントに `<style>` と書くとビルドが落ちる

```
[plugin vite:vue] ... Element is missing end tag.
```

スライド内のスタイルブロックの**コメント文に `<style>` という文字列**が入っていると、
HTML パーサが要素の開始タグと誤認して落ちる。コメントには書かないこと。

```html
<!-- NG -->
<style>
/* スライド内 <style> はこのスライドだけ… */   ← この <style> が原因
h1 { color: red }
</style>
```

---

## 5. `v-drag` はディレクティブ。コンポーネント風に書くと落ちる

```
SyntaxError: Invalid end tag.   ( </v-drag> で発生 )
```

`v-drag` は**ディレクティブ**なので要素に付ける。`<v-drag>…</v-drag>` は不可。

```html
<!-- OK -->
<div v-drag="[80, 280, 180, 60]">ドラッグ可能</div>

<!-- NG -->
<v-drag="[80,280,180,60]">…</v-drag>
```

---

## 6. Git Bash で `--base /xxx/` を渡すと警告＆base が化ける

ローカルで Git Bash から `slidev build --base /cluade-purezen/` を実行すると:

```
(!) "base" option should start with a slash.
```

これは Git Bash（MSYS）の **POSIX パス変換**で `/cluade-purezen/` が
`C:/Program Files/Git/cluade-purezen/` に化けるため。
- **CI（Linux）では正しく適用される**ので、デプロイには影響しない。
- ローカルで正しい base のビルドを確認したいときは **PowerShell から**実行する。

---

## 7. pnpm が使えないときは npm（corepack enable は管理者権限が必要）

Windows で `corepack enable` は `C:\Program Files\nodejs` への書き込みで EPERM になることがある。
このプロジェクトは **npm に統一**した。`corepack pnpm ...` で都度実行は可能だが常用しない。

---

## メモ: 切り分けの定石
- 「公開したら壊れた」はまず **Actions 成功か** と **配信中の実ファイル**（`curl` で index.html / 404.html / バンドル）を確認。
- ルーティング系はブラウザの**アドレスバーの URL（特に `#` と base の重複）**が最大の手がかり。
- 確証が要るときは **ヘッドレスブラウザで実際に操作**して再現するのが速い。
