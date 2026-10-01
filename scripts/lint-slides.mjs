#!/usr/bin/env node
// スライドの「AIっぽさ」を機械的に検査する。docs/slide-rules.md のルール1〜6に対応。
//
//   node scripts/lint-slides.mjs minutes/slides.md            # エラーがあれば exit 1
//   node scripts/lint-slides.mjs --strict minutes/slides.md   # 警告（未記入の出典など）もエラー扱い
//
// 文書の分割だけ @slidev/parser に任せ、判定はすべて正規表現（grep 相当）で行う。
// 設定は scripts/slide-lint.config.json、禁止語は scripts/banned-words.txt。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from '@slidev/parser'

const here = path.dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(fs.readFileSync(path.join(here, 'slide-lint.config.json'), 'utf8'))
const bannedWords = loadBannedWords(path.join(here, 'banned-words.txt'))

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const files = args.filter(a => !a.startsWith('--'))
if (files.length === 0) {
  console.error('usage: lint-slides.mjs [--strict] <slides.md>...')
  process.exit(2)
}

// 中央寄せを許すレイアウト（ルール4）
const CENTER_OK_LAYOUTS = new Set(['cover', 'section'])
// Slidev 標準で中央寄せになるレイアウト
const CENTERED_LAYOUTS = new Set(['center', 'fact', 'statement', 'intro', 'quote', 'end'])
// 見出しがラベルで終わっていたら主張ではない（ルール1）
const LABEL_ENDING = /(とは|について|まとめ|概要|はじめに|おわりに|目次|アジェンダ|背景|課題|事例|比較|紹介|一覧|ポイント|メリット|デメリット|方法|手順|結論|参考|付録|出典|質疑応答|Q&A|編|とは何か)$/
// 絵文字（ルール2）。→ などの記号は対象外
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}]/u
// 既知のアイコンセット名（コンポーネント記法 <carbon-xxx /> の検出用）
const ICON_SETS = ['carbon', 'bi', 'ph', 'mdi', 'ri', 'tabler', 'lucide', 'heroicons', 'material-symbols', 'logos', 'twemoji', 'noto', 'fluent', 'fluent-emoji', 'openmoji', 'fa', 'fa6-solid', 'fa6-regular', 'ic', 'uil', 'svg-spinners']
// アニメ・段階表示（ルール3）
const REVEAL = /<v-(clicks?|after|switch)\b|\sv-(click|clicks|after|switch|mark|motion)\b/
// 中央寄せ（ルール4）
const CENTER_MARKUP = /\btext-center\b|<center\b|align=["']?center|text-align:\s*center|\bplace-(items|content|self)-center\b/
// 単位つきの数字（ルール6）。日付（年・月・日）は対象外
const NUMBER_WITH_UNIT = /[0-9０-９]+(?:[.,][0-9]+)?\s*(%|％|倍|割|件|人|名|社|円|万|億|千|時間|分|秒|日間|週間|か月|ヶ月|カ月|年間|pt|ポイント|回|枚|字|文字|トークン)/

const problems = []
function report(level, file, line, rule, message) {
  problems.push({ level, file, line, rule, message })
}

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const srcLines = src.split('\n')
  const { slides } = parseSync(src, file)
  let revealSlides = 0

  // ルール2: 絵文字はファイル全体（ノート・表題を含む）で禁止。コードブロックは除く
  stripCodeLines(srcLines, { keepMermaid: true }).forEach((text, i) => {
    if (text !== null && EMOJI.test(text))
      report('error', file, i + 1, 'R2', `絵文字は使わない: ${text.trim().slice(0, 40)}`)
  })

  for (const slide of slides) {
    const fm = slide.frontmatter || {}
    const layout = fm.layout || (slide.index === 0 ? 'cover' : 'default')
    const classes = String(fm.class || '')
    // content は前後の空行が削られているので、本文1行目の実際の行番号を探す
    const firstLine = slide.content.split('\n')[0]
    let base = slide.contentStart ?? slide.start
    while (base < srcLines.length && srcLines[base] !== firstLine) base++
    base += 1
    const lines = stripCodeLines(stripNotes(slide.content).split('\n'), { keepMermaid: true })
    const at = i => base + i
    const body = lines.filter(l => l !== null).join('\n')
    const hasSource = /<Source\b/.test(body)
    const where = `スライド${slide.index + 1}`

    // ---- ルール1: 見出しは主張の一文 ----
    if (!CENTER_OK_LAYOUTS.has(layout)) {
      const hIdx = lines.findIndex(l => l !== null && /^#\s+/.test(l))
      if (hIdx === -1) {
        report('error', file, at(0), 'R1', `${where}: 見出し(# )がない`)
      }
      else {
        const h = lines[hIdx].replace(/^#\s+/, '').replace(/<[^>]+>/g, '').replace(/\*\*/g, '').trim()
        const len = [...h.replace(/\s/g, '')].length
        if (/[?？]$/.test(h))
          report('error', file, at(hIdx), 'R1', `見出しを問いにしない。答え（主張）を書く: 「${h}」`)
        else if (LABEL_ENDING.test(h) || /とは/.test(h))
          report('error', file, at(hIdx), 'R1', `見出しがラベルになっている。主張の一文にする: 「${h}」`)
        else if (len < config.minHeadingLength)
          report('error', file, at(hIdx), 'R1', `見出しが短い（${len}字 < ${config.minHeadingLength}字）。主語と述語のある一文にする: 「${h}」`)
        else if (len > config.maxHeadingLength)
          report('error', file, at(hIdx), 'R1', `見出しが長い（${len}字 > ${config.maxHeadingLength}字）。論点を1つに絞る: 「${h}」`)
      }
    }

    // ---- ルール2: アイコンは1セットだけ ----
    lines.forEach((l, i) => {
      if (l === null)
        return
      for (const m of l.matchAll(/\bi-([a-z0-9]+(?:-[a-z0-9]+)*?)-[a-z0-9-]+/g)) {
        if (!m[0].startsWith(`i-${config.iconSet}-`))
          report('error', file, at(i), 'R2', `アイコンは i-${config.iconSet}-* に統一する: ${m[0]}`)
      }
      for (const m of l.matchAll(/<([a-z0-9-]+?)-[a-z0-9-]+\s*\/?>/g)) {
        const set = ICON_SETS.find(s => m[0].startsWith(`<${s}-`))
        if (set && set !== config.iconSet)
          report('error', file, at(i), 'R2', `アイコンは ${config.iconSet} セットに統一する: ${m[0]}`)
      }
    })

    // ---- ルール3: v-click は手順・比較のスライドだけ ----
    const revealLine = lines.findIndex(l => l !== null && REVEAL.test(` ${l}`))
    if (revealLine !== -1 || fm.clicks) {
      if (!/\breveal-(steps|compare)\b/.test(classes))
        report('error', file, at(Math.max(revealLine, 0)), 'R3', `${where}: v-click は手順(class: reveal-steps)か比較(class: reveal-compare)のスライドでだけ使う`)
      revealSlides++
    }

    // ---- ルール4: 中央寄せは表紙と章扉だけ ----
    if (!CENTER_OK_LAYOUTS.has(layout)) {
      if (CENTERED_LAYOUTS.has(layout))
        report('error', file, at(0), 'R4', `${where}: layout: ${layout} は中央寄せになる。表紙(cover)と章扉(section)以外は左揃え`)
      if (/\btext-center\b/.test(classes))
        report('error', file, at(0), 'R4', `${where}: class: text-center は表紙と章扉だけ`)
      lines.forEach((l, i) => {
        if (l !== null && CENTER_MARKUP.test(l))
          report('error', file, at(i), 'R4', `中央寄せは表紙と章扉だけ: ${l.trim().slice(0, 50)}`)
      })
    }

    // ---- ルール7: スライド送りのアニメーション（transition）は使わない ----
    if (fm.transition && fm.transition !== 'none')
      report('error', file, at(0), 'R7', `${where}: スライド送りのアニメーションは使わない（transition: ${fm.transition} を消す）`)

    // ---- ルール5: 禁止語・禁止パターン ----
    lines.forEach((l, i) => {
      if (l === null)
        return
      const text = l.replace(/<Source\b[^>]*>.*?<\/Source>/g, '')
      for (const w of bannedWords) {
        if (w.re.test(text))
          report('error', file, at(i), 'R5', `禁止語「${w.label}」: ${text.trim().slice(0, 50)}`)
      }
      if (/[!！]\s*$/.test(text.replace(/<[^>]+>/g, '')))
        report('error', file, at(i), 'R5', `感嘆符で終えない: ${text.trim().slice(0, 50)}`)
    })
    const quoteLine = lines.findIndex(l => l !== null && /^\s*>/.test(l))
    if (quoteLine !== -1 && !hasSource)
      report('error', file, at(quoteLine), 'R5', `引用ブロックは出典つきの引用にだけ使う（<Source> を添える）。キャッチコピーは本文か見出しに書く`)

    // ---- ルール6: 数字には出典か実測値 ----
    const numLine = lines.findIndex(l => l !== null && NUMBER_WITH_UNIT.test(l.replace(/<Source\b[^>]*>.*?<\/Source>/g, '').replace(/<[^>]+>/g, '')))
    if (numLine !== -1 && !hasSource)
      report('error', file, at(numLine), 'R6', `数字には <Source>（出典）か <Source measured>（実測）を添える: ${lines[numLine].trim().slice(0, 50)}`)
    // <Stats> は数字と単位を別の props に書くので、上の正規表現では拾えない。部品があれば出典を必須にする
    const statsLine = lines.findIndex(l => l !== null && /<Stats\b/.test(l))
    if (statsLine !== -1 && !hasSource)
      report('error', file, at(statsLine), 'R6', `数字には <Source>（出典）か <Source measured>（実測）を添える（<Stats> を使うスライド）`)

    // 未記入のまま残っている出典・プレースホルダーは警告（--strict でエラー）
    lines.forEach((l, i) => {
      if (l !== null && (/<Source\b[^>]*\btodo\b/.test(l) || /〔要記入|TODO/.test(l)))
        report('warn', file, at(i), 'TODO', `未記入: ${l.trim().slice(0, 60)}`)
    })
  }

  if (revealSlides > config.maxRevealSlides)
    report('error', file, 1, 'R3', `v-click を使うスライドが ${revealSlides} 枚ある（上限 ${config.maxRevealSlides} 枚）`)
}

// ---- 出力 ----
const errors = problems.filter(p => p.level === 'error' || (strict && p.level === 'warn'))
const warns = problems.filter(p => p.level === 'warn' && !strict)
for (const p of problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
  const tag = (p.level === 'error' || strict) ? 'error' : 'warn '
  console.log(`${p.file}:${p.line}  ${tag}  [${p.rule}] ${p.message}`)
  if (process.env.GITHUB_ACTIONS && tag === 'error')
    console.log(`::error file=${p.file},line=${p.line},title=${p.rule}::${p.message}`)
}
console.log(`\n${errors.length} error(s), ${warns.length} warning(s)`)
process.exit(errors.length > 0 ? 1 : 0)

// ---------------------------------------------------------------------------

function loadBannedWords(file) {
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map((l) => {
      const m = l.match(/^\/(.+)\/$/)
      return m
        ? { label: m[1], re: new RegExp(m[1]) }
        : { label: l, re: new RegExp(l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }
    })
}

// 発表者ノート（<!-- -->）を空行に置き換える（行番号は保つ）
function stripNotes(text) {
  return text.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ''))
}

// コードブロック内の行を null にする。mermaid は図の中の文字も検査したいので残す
function stripCodeLines(lines, { keepMermaid }) {
  let fence = null
  return lines.map((l) => {
    const m = l.match(/^\s*(`{3,}|~{3,})\s*(\S*)/)
    if (fence === null && m) {
      fence = { mark: m[1], keep: keepMermaid && m[2].startsWith('mermaid') }
      return null
    }
    if (fence !== null) {
      if (l.trim().startsWith(fence.mark)) {
        fence = null
        return null
      }
      return fence.keep ? l : null
    }
    return l
  })
}
