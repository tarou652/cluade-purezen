import { defineAppSetup } from '@slidev/types'

// サブパス公開（GitHub Pages の /<repo>/）対策。
//
// Slidev 52.x の getSlidePath() は `BASE_URL + 番号`（例: /cluade-purezen/2）を
// router.push() に渡すが、スライドのルートは `/:no`（例: /2）なので、
// base が付いたパスはマッチせず NotFound になる（= ページ送りで 404）。
//
// ここでは「NotFound かつ パスが base で始まる」場合に、余分な base を1つ剥がして
// 正しいルートへ送り直す。これで navigation が直り、URL もきれいになる。
export default defineAppSetup(({ router }) => {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/')
    return

  router.beforeEach((to) => {
    if (to.name === 'NotFound' && to.path.startsWith(base)) {
      const fixed = `/${to.path.slice(base.length)}`
      if (fixed !== to.path)
        return { path: fixed, query: to.query, hash: to.hash, replace: true }
    }
  })
})
