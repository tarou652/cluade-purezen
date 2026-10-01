#!/usr/bin/env node
// lint-slides.mjs 自体の回帰テスト。悪い例で各ルールが検出され、良い例が通ることを確かめる。
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const run = file => spawnSync(process.execPath, [path.join(here, 'lint-slides.mjs'), path.join(here, 'fixtures', file)], { encoding: 'utf8' })

let failed = 0
function expect(cond, msg) {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`)
  if (!cond)
    failed++
}

const bad = run('bad.md')
expect(bad.status === 1, 'bad.md は exit 1 になる')
for (const [rule, text] of [
  ['R1', '見出しを問いにしない'],
  ['R1', 'ラベルになっている'],
  ['R1', '見出しが短い'],
  ['R2', '絵文字は使わない'],
  ['R2', 'アイコンは i-carbon-'],
  ['R3', 'v-click は手順'],
  ['R4', 'layout: center'],
  ['R5', '禁止語「革命」'],
  ['R5', '引用ブロックは出典つき'],
  ['R6', '数字には <Source>'],
])
  expect(bad.stdout.split('\n').some(l => l.includes(`[${rule}]`) && l.includes(text)), `${rule}: 「${text}」を検出する`)

const good = run('good.md')
expect(good.status === 0, `good.md は exit 0 になる${good.status ? `\n${good.stdout}` : ''}`)

process.exit(failed ? 1 : 0)
