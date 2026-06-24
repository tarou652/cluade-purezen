/**
 * consulting-pptx — Theme & Component Library
 * ------------------------------------------------------------
 * コンサル風（白背景・赤基調）デザインを「コードで固定」するモジュール。
 * このファイルの定数を使う限り、誰がいつ生成しても同じ見た目に揃う。
 *
 * 使い方の最短ルート:
 *   const { createDeck } = require("./theme.js");
 *   const deck = createDeck({ title: "提案書", author: "山田", confidential: true });
 *   deck.cover({ title: "新規事業 提案", subtitle: "市場参入戦略", date: "2026.06" });
 *   deck.script(deck.last, "ここで話す台本…");   // ← 各ページに台本(=ノート)
 *   const s = deck.content({ kicker: "市場環境", title: "国内市場は二極化が進む" });
 *   deck.bullets(s, ["要点1", "要点2"]);
 *   deck.script(s, "このページの台本…");
 *   await deck.save("/abs/path/output.pptx");
 *
 * 個別部品だけ使いたい場合は THEME と各 draw 関数を直接 import してもよい。
 */

const pptxgen = require("pptxgenjs");
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/* ============================================================
 * 1. デザイントークン（ここを変えれば全体の見た目が一括で変わる）
 * ========================================================== */
const THEME = {
  colors: {
    red:       "C8102E", // 主役の赤（コンサルレッド）
    redDark:   "8A0A20", // 濃い赤（強調・ダークなセクション扉）
    redTint:   "FBEAEC", // ごく薄い赤（カード背景の差し色）
    ink:       "1A1A1A", // 本文・見出しの主要テキスト
    gray:      "595959", // 補助テキスト
    grayLight: "8C8C8C", // キャプション・ページ番号
    rule:      "E3E3E3", // 区切り線（ヘアライン）
    cardBg:    "F6F6F6", // ニュートラルなカード地色
    white:     "FFFFFF",
    bg:        "FFFFFF", // スライド背景は常に白
  },
  // 日本語＋英字を両方きれいに出せるフォント。英語資料にする場合は
  // heading/body を "Calibri" / "Arial" などに差し替えるだけでよい。
  fonts: {
    heading: "Yu Gothic",
    body:    "Yu Gothic",
    num:     "Arial",      // 大きな数字(統計)はArialの方がシャープ
  },
  // グラフの系列色（赤を主役に、補助はグレー系）
  chart: ["C8102E", "8A0A20", "E8536A", "F4A6B0", "595959", "B5B5B5"],
  // 全スライド外周の赤い縁取り（inset=縁の太さ inch、0 で無効化）
  frame: { inset: 0.15, color: "C8102E" },
  // 16:9 (10 x 5.625 inch) を前提にしたレイアウト基準
  geom: {
    W: 10, H: 5.625,
    margin: 0.6,
    headerTop: 0.55,
    bodyTop: 1.6,
    footerY: 5.12,
  },
};
const C = THEME.colors;
const F = THEME.fonts;
const G = THEME.geom;
const CONTENT_W = G.W - G.margin * 2;

/* shadow は毎回新しいオブジェクトを返す（pptxgenjsが破壊的に書き換えるため共有禁止） */
const softShadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

/* ============================================================
 * 2. 低レベル部品
 * ========================================================== */

/** 背景を赤くし、内側に白い面を置く＝外周だけ赤い縁取りになる（全ページ共通） */
function base(slide) {
  const ins = THEME.frame.inset;
  if (!ins) { slide.background = { color: C.bg }; return; }
  slide.background = { color: THEME.frame.color };
  slide.addShape("rect", {
    x: ins, y: ins, w: G.W - ins * 2, h: G.H - ins * 2,
    fill: { color: C.white }, line: { type: "none" },
  });
}

/** キッカー（小見出しラベル）＋タイトルの共通ヘッダー。下線は引かない */
function header(slide, { kicker, title }) {
  const x = G.margin;
  let titleY = G.headerTop;
  if (kicker) {
    slide.addText(String(kicker).toUpperCase(), {
      x, y: G.headerTop - 0.04, w: CONTENT_W, h: 0.3,
      fontFace: F.heading, fontSize: 11, bold: true, color: C.red,
      charSpacing: 2, align: "left", valign: "middle", margin: 0,
    });
    titleY = G.headerTop + 0.36;
  }
  slide.addText(title, {
    x, y: titleY, w: CONTENT_W, h: 0.7,
    fontFace: F.heading, fontSize: 26, bold: true, color: C.ink,
    align: "left", valign: "top", margin: 0,
  });
}

/** フッター（左ラベル＋右ページ番号、線なし） */
function footer(slide, { label, page }) {
  if (label) {
    slide.addText(label, {
      x: G.margin, y: G.footerY, w: CONTENT_W - 1, h: 0.3,
      fontFace: F.body, fontSize: 8.5, color: C.grayLight, align: "left", valign: "middle", margin: 0,
    });
  }
  if (page != null) {
    slide.addText(String(page), {
      x: G.W - G.margin - 1, y: G.footerY, w: 1, h: 0.3,
      fontFace: F.num, fontSize: 9, color: C.grayLight, align: "right", valign: "middle", margin: 0,
    });
  }
}

/* ============================================================
 * 3. スライド種別（扉・本文）
 * ========================================================== */

/** 表紙 */
function cover(pres, { title, subtitle, date, presenter, label }) {
  const s = pres.addSlide();
  base(s);
  s.addText(title, {
    x: G.margin, y: 2.2, w: CONTENT_W, h: 1.4,
    fontFace: F.heading, fontSize: 40, bold: true, color: C.ink, align: "left", valign: "top", margin: 0,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: G.margin, y: 3.55, w: CONTENT_W, h: 0.5,
      fontFace: F.heading, fontSize: 17, bold: true, color: C.red, align: "left", valign: "top", margin: 0,
    });
  }
  const meta = [date, presenter].filter(Boolean).join("   ｜   ");
  if (meta) {
    s.addText(meta, {
      x: G.margin, y: 4.7, w: CONTENT_W, h: 0.3,
      fontFace: F.body, fontSize: 11, color: C.gray, align: "left", valign: "middle", margin: 0,
    });
  }
  if (label) {
    s.addText(label.toUpperCase(), {
      x: G.W - G.margin - 3, y: 0.45, w: 3, h: 0.3,
      fontFace: F.heading, fontSize: 9, bold: true, color: C.grayLight, charSpacing: 2,
      align: "right", valign: "middle", margin: 0,
    });
  }
  return s;
}

/** セクション扉（白地に大きな赤い番号＋タイトル） */
function section(pres, { number, title, subtitle, page }) {
  const s = pres.addSlide();
  base(s);
  if (number != null) {
    s.addText(String(number).padStart(2, "0"), {
      x: G.margin, y: 1.4, w: 3, h: 2.4,
      fontFace: F.num, fontSize: 130, bold: true, color: C.red, align: "left", valign: "middle", margin: 0,
    });
  }
  s.addText(title, {
    x: G.margin + 2.7, y: 2.0, w: CONTENT_W - 2.7, h: 1.2,
    fontFace: F.heading, fontSize: 30, bold: true, color: C.ink, align: "left", valign: "middle", margin: 0,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: G.margin + 2.72, y: 3.15, w: CONTENT_W - 2.7, h: 0.5,
      fontFace: F.body, fontSize: 13, color: C.gray, align: "left", valign: "top", margin: 0,
    });
  }
  footer(s, { page });
  return s;
}

/** 濃い赤地のセクション扉（任意。サンドイッチ構成にしたいとき） */
function sectionDark(pres, { number, title, subtitle, page }) {
  const s = pres.addSlide();
  s.background = { color: C.redDark };
  if (number != null) {
    s.addText(String(number).padStart(2, "0"), {
      x: G.margin, y: 1.4, w: 3, h: 2.4,
      fontFace: F.num, fontSize: 130, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0,
      transparency: 18,
    });
  }
  s.addText(title, {
    x: G.margin + 2.7, y: 2.0, w: CONTENT_W - 2.7, h: 1.2,
    fontFace: F.heading, fontSize: 30, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: G.margin + 2.72, y: 3.15, w: CONTENT_W - 2.7, h: 0.5,
      fontFace: F.body, fontSize: 13, color: "F2C9CF", align: "left", valign: "top", margin: 0,
    });
  }
  if (page != null) {
    s.addText(String(page), {
      x: G.W - G.margin - 1, y: G.footerY, w: 1, h: 0.3,
      fontFace: F.num, fontSize: 9, color: "E2A9B2", align: "right", valign: "middle", margin: 0,
    });
  }
  return s;
}

/** 本文スライドの枠（ヘッダー＋フッターだけ用意し、空の本文領域を返す） */
function content(pres, { kicker, title, label, page }) {
  const s = pres.addSlide();
  base(s);
  header(s, { kicker, title });
  footer(s, { label, page });
  // 本文の使える領域（参考値）: x, y, w, h
  s._body = { x: G.margin, y: G.bodyTop, w: CONTENT_W, h: G.footerY - G.bodyTop - 0.1 };
  return s;
}

/* ============================================================
 * 4. 本文コンテンツ部品（content() で作ったスライドに重ねる）
 * ========================================================== */

/** 箇条書き（四角マーカー。読みやすさ優先でテキストはink、赤はアクセントに集中） */
function bullets(slide, items, opts = {}) {
  const b = slide._body || { x: G.margin, y: G.bodyTop, w: CONTENT_W, h: 3.0 };
  const x = opts.x ?? b.x, y = opts.y ?? b.y, w = opts.w ?? b.w, h = opts.h ?? b.h;
  const fontSize = opts.fontSize ?? 16;
  const runs = items.map((it, i) => {
    const text = typeof it === "string" ? it : it.text;
    const sub = typeof it === "object" ? it.sub : null;
    const arr = [{ text, options: { bullet: { code: "25AA", indent: 18 }, color: C.ink, breakLine: true, paraSpaceAfter: sub ? 2 : 10 } }];
    if (sub) arr.push({ text: sub, options: { bullet: false, indentLevel: 1, color: C.gray, fontSize: fontSize - 2, breakLine: true, paraSpaceAfter: 10 } });
    return arr;
  }).flat();
  slide.addText(runs, {
    x, y, w, h, fontFace: F.body, fontSize, color: C.ink,
    align: "left", valign: "top", paraSpaceAfter: 10, lineSpacingMultiple: 1.05,
  });
}

/** 大きな統計（赤い数字＋ラベル）を横並びで配置 */
function stats(slide, items, opts = {}) {
  const y = opts.y ?? 2.2;
  const w = opts.w ?? CONTENT_W;
  const x0 = opts.x ?? G.margin;
  const each = w / items.length;
  items.forEach((it, i) => {
    const x = x0 + each * i;
    slide.addText([
      { text: String(it.value), options: { fontSize: 50, bold: true, color: C.red, fontFace: F.num } },
      ...(it.unit ? [{ text: " " + it.unit, options: { fontSize: 20, bold: true, color: C.red, fontFace: F.num } }] : []),
    ], { x, y, w: each - 0.2, h: 0.95, align: "left", valign: "middle", margin: 0 });
    slide.addText(it.label, {
      x, y: y + 0.95, w: each - 0.2, h: 0.6,
      fontFace: F.body, fontSize: 13, color: C.gray, align: "left", valign: "top", margin: 0,
    });
  });
}

/** カードのグリッド（白カード＋淡い影。任意で赤い番号バッジ） */
function cards(slide, items, opts = {}) {
  const cols = opts.cols ?? Math.min(items.length, 3);
  const rows = Math.ceil(items.length / cols);
  const gap = opts.gap ?? 0.3;
  const x0 = opts.x ?? G.margin;
  const y0 = opts.y ?? G.bodyTop;
  const totalW = opts.w ?? CONTENT_W;
  const totalH = opts.h ?? (G.footerY - y0 - 0.1);
  const cw = (totalW - gap * (cols - 1)) / cols;
  const ch = (totalH - gap * (rows - 1)) / rows;
  const pad = 0.36;                 // カード内側の余白
  items.forEach((it, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = x0 + c * (cw + gap), y = y0 + r * (ch + gap);
    slide.addShape("roundRect", {
      x, y, w: cw, h: ch, rectRadius: 0.06,
      fill: { color: it.tint ? C.redTint : C.white }, line: { color: C.rule, width: 1 },
      shadow: softShadow(),
    });
    let ty = y + pad;
    if (it.badge != null) {
      const d = 0.5;
      slide.addShape("ellipse", { x: x + pad, y: ty, w: d, h: d, fill: { color: C.red }, line: { type: "none" } });
      slide.addText(String(it.badge), {
        x: x + pad, y: ty, w: d, h: d, fontFace: F.num, fontSize: 18, bold: true,
        color: "FFFFFF", align: "center", valign: "middle", margin: 0,
      });
      ty += d + 0.2;
    }
    slide.addText(it.title, {
      x: x + pad, y: ty, w: cw - pad * 2, h: 0.5,
      fontFace: F.heading, fontSize: 15, bold: true, color: C.ink, align: "left", valign: "top", margin: 0,
      fit: "shrink",
    });
    if (it.body) {
      slide.addText(it.body, {
        x: x + pad, y: ty + 0.52, w: cw - pad * 2, h: ch - (ty - y) - 0.52 - pad,
        fontFace: F.body, fontSize: 13, color: C.gray, align: "left", valign: "top", margin: 0,
        lineSpacingMultiple: 1.18, fit: "shrink",
      });
    }
  });
}

/** 横並びの番号付きプロセス（赤い丸番号＋ラベル、間に赤い ›） */
function steps(slide, items, opts = {}) {
  const y = opts.y ?? 2.4;
  const x0 = opts.x ?? G.margin;
  const w = opts.w ?? CONTENT_W;
  const d = 0.7;
  const each = w / items.length;
  items.forEach((it, i) => {
    const cx = x0 + each * i + (each - d) / 2;
    slide.addShape("ellipse", { x: cx, y, w: d, h: d, fill: { color: C.red }, line: { type: "none" }, shadow: softShadow() });
    slide.addText(String(i + 1), {
      x: cx, y, w: d, h: d, fontFace: F.num, fontSize: 26, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(it.title || it, {
      x: x0 + each * i, y: y + d + 0.15, w: each, h: 0.45,
      fontFace: F.heading, fontSize: 13.5, bold: true, color: C.ink, align: "center", valign: "top", margin: 0,
    });
    if (it.body) {
      slide.addText(it.body, {
        x: x0 + each * i + 0.1, y: y + d + 0.6, w: each - 0.2, h: 0.9,
        fontFace: F.body, fontSize: 12, color: C.gray, align: "center", valign: "top", margin: 0,
      });
    }
    if (i < items.length - 1) {
      slide.addText("›", {
        x: x0 + each * (i + 1) - 0.25, y, w: 0.5, h: d,
        fontFace: F.heading, fontSize: 28, bold: true, color: C.red, align: "center", valign: "middle", margin: 0,
      });
    }
  });
}

/** 2カラム比較（左＝現状/Before、右＝あるべき/After を赤系で強調） */
function compare(slide, { leftTitle, left, rightTitle, right }, opts = {}) {
  const y = opts.y ?? G.bodyTop;
  const h = opts.h ?? (G.footerY - y - 0.1);
  const gap = 0.4;
  const cw = (CONTENT_W - gap) / 2;
  const col = (x, titleText, items, accent) => {
    slide.addShape("roundRect", {
      x, y, w: cw, h, rectRadius: 0.06,
      fill: { color: accent ? C.redTint : C.cardBg }, line: { color: accent ? C.red : C.rule, width: accent ? 1.25 : 1 },
      shadow: softShadow(),
    });
    const pad = 0.4;
    slide.addText(titleText, {
      x: x + pad, y: y + 0.3, w: cw - pad * 2, h: 0.5,
      fontFace: F.heading, fontSize: 16, bold: true, color: accent ? C.red : C.ink, align: "left", valign: "middle", margin: 0,
      fit: "shrink",
    });
    slide.addText(items.map((t, i) => ({
      text: t, options: { bullet: { code: "25AA", indent: 16 }, color: C.ink, breakLine: true },
    })), {
      x: x + pad, y: y + 0.95, w: cw - pad * 2, h: h - 1.25,
      fontFace: F.body, fontSize: 14, color: C.ink, align: "left", valign: "top", paraSpaceAfter: 9,
      lineSpacingMultiple: 1.1, fit: "shrink",
    });
  };
  col(G.margin, leftTitle, left, false);
  col(G.margin + cw + gap, rightTitle, right, true);
}

/** 結論ボックス（薄赤地に「ポイント」ラベル＋本文）。1枚に1つだけ使うと効く */
function takeaway(slide, text, opts = {}) {
  const labelText = opts.label || "ポイント";
  const x = opts.x ?? G.margin;
  const w = opts.w ?? CONTENT_W;
  const h = opts.h ?? 0.95;
  const y = opts.y ?? (G.footerY - h - 0.15);
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.06, fill: { color: C.redTint }, line: { color: C.red, width: 1.25 }, shadow: softShadow(),
  });
  slide.addText(labelText, {
    x: x + 0.3, y, w: 1.4, h, fontFace: F.heading, fontSize: 13, bold: true, color: C.red,
    align: "left", valign: "middle", margin: 0,
  });
  slide.addText(text, {
    x: x + 1.7, y: y + 0.12, w: w - 2.0, h: h - 0.24,
    fontFace: F.body, fontSize: 14.5, bold: true, color: C.ink, align: "left", valign: "middle", margin: 0,
    fit: "shrink",
  });
}

/* ============================================================
 * 4.5 グラフ（ネイティブ・編集可能なまま。ブランド配色を自動適用）
 * ========================================================== */

/** 系列を pptxgenjs 形式に正規化（{labels,values} 単系列 / [{name,labels,values}] 複数系列） */
function normSeries(data) {
  if (Array.isArray(data)) return data;
  return [{ name: data.name || "", labels: data.labels, values: data.values }];
}

/**
 * 汎用グラフ。type: "col"(縦棒) | "bar"(横棒) | "line" | "pie" | "doughnut"
 * 本文領域に自動配置（opts.x/y/w/h で上書き可）。
 */
function chart(slide, type, data, opts = {}) {
  const b = slide._body || { x: G.margin, y: G.bodyTop, w: CONTENT_W, h: G.footerY - G.bodyTop - 0.1 };
  const series = normSeries(data);
  const isPie = type === "pie" || type === "doughnut";
  // 単系列の棒・折れ線は赤一色で統一（賑やかさを避ける）。複数系列・円はパレット。
  const defaultColors = (!isPie && series.length === 1) ? [THEME.chart[0]] : THEME.chart;
  const o = {
    x: opts.x ?? b.x, y: opts.y ?? b.y, w: opts.w ?? b.w, h: opts.h ?? b.h,
    chartColors: opts.chartColors ?? defaultColors,
    showTitle: false,
    chartArea: { fill: { color: C.white } },
    showLegend: opts.showLegend ?? (series.length > 1 || isPie),
    legendPos: opts.legendPos ?? (isPie ? "r" : "b"),
    legendColor: C.gray, legendFontFace: F.body, legendFontSize: 10,
    dataLabelFontFace: F.body, dataLabelFontSize: opts.dataLabelFontSize ?? 11,
  };
  if (isPie) {
    Object.assign(o, {
      showPercent: opts.showPercent ?? true,
      showValue: opts.showValue ?? false,
      dataLabelColor: C.white,
      ...(type === "doughnut" ? { holeSize: opts.holeSize ?? 55 } : {}),
    });
    slide.addChart(type, series, o);
    return slide;
  }
  Object.assign(o, {
    barDir: type === "bar" ? "bar" : "col",
    catAxisLabelColor: C.gray, catAxisLabelFontFace: F.body, catAxisLabelFontSize: 11,
    valAxisLabelColor: C.gray, valAxisLabelFontFace: F.body, valAxisLabelFontSize: 10,
    valGridLine: { color: C.rule, size: 0.5 },
    catGridLine: { style: "none" },
    showValue: opts.showValue ?? (series.length === 1),
    dataLabelPosition: opts.dataLabelPosition ?? "outEnd",
    dataLabelColor: C.ink,
    ...(type === "line" ? { lineSize: 3, lineSmooth: opts.lineSmooth ?? true } : {}),
  });
  slide.addChart(type === "line" ? "line" : "bar", series, o);
  return slide;
}


async function iconPng(IconComponent, color = "#FFFFFF", size = 256) {
  const React = require("react");
  const ReactDOMServer = require("react-dom/server");
  const sharp = require("sharp");
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

/* ============================================================
 * 6. createDeck — 自動ページ番号 + 台本 + 保存(rezip)まで面倒を見る高レベルAPI
 * ========================================================== */
function createDeck(meta = {}) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "C16x9", width: G.W, height: G.H });
  pres.layout = "C16x9";
  pres.author = meta.author || "";
  pres.title = meta.title || "";
  const label = meta.confidential ? (meta.label || "CONFIDENTIAL") : meta.label || null;

  const state = { page: 0, last: null };
  const wrap = (s) => { state.last = s; return s; };

  const api = {
    pres,
    get last() { return state.last; },

    cover(o) { return wrap(cover(pres, { label, ...o })); },

    section(o) { state.page++; return wrap(section(pres, { page: state.page, ...o })); },
    sectionDark(o) { state.page++; return wrap(sectionDark(pres, { page: state.page, ...o })); },

    content(o) { state.page++; return wrap(content(pres, { label, page: state.page, ...o })); },
    blank() { state.page++; const s = pres.addSlide(); base(s); footer(s, { label, page: state.page }); return wrap(s); },

    // 本文部品（最後に作ったスライド、または明示したスライドへ）
    bullets(s, items, opts) { bullets(s || state.last, items, opts); return s || state.last; },
    stats(s, items, opts) { stats(s || state.last, items, opts); return s || state.last; },
    cards(s, items, opts) { cards(s || state.last, items, opts); return s || state.last; },
    steps(s, items, opts) { steps(s || state.last, items, opts); return s || state.last; },
    compare(s, data, opts) { compare(s || state.last, data, opts); return s || state.last; },
    takeaway(s, text, opts) { takeaway(s || state.last, text, opts); return s || state.last; },

    // グラフ（type省略の専用ラッパー）
    chart(s, type, data, opts) { chart(s || state.last, type, data, opts); return s || state.last; },
    col(s, data, opts) { chart(s || state.last, "col", data, opts); return s || state.last; },   // 縦棒
    bar(s, data, opts) { chart(s || state.last, "bar", data, opts); return s || state.last; },   // 横棒
    line(s, data, opts) { chart(s || state.last, "line", data, opts); return s || state.last; },
    pie(s, data, opts) { chart(s || state.last, "pie", data, opts); return s || state.last; },
    doughnut(s, data, opts) { chart(s || state.last, "doughnut", data, opts); return s || state.last; },

    /** 台本(=スピーカーノート)。各ページに必ず付けること。 */
    script(s, text) { (s || state.last).addNotes(text); return s || state.last; },

    iconPng,

    async save(outPath) {
      const abs = path.resolve(outPath);
      await pres.writeFile({ fileName: abs });
      // pptxgenjs は無圧縮ZIPを書くので必ず再圧縮する
      try {
        execFileSync("python3", [path.join(__dirname, "..", "scripts", "rezip.py"), abs], { stdio: "ignore" });
      } catch (e) {
        console.warn("[consulting-pptx] rezip skipped (run scripts/rezip.py manually):", e.message);
      }
      return abs;
    },
  };
  return api;
}

module.exports = {
  THEME, createDeck,
  // 個別部品（createDeckを使わず細かく組みたい場合）
  base, header, footer, cover, section, sectionDark, content,
  bullets, stats, cards, steps, compare, takeaway, chart, iconPng,
};
