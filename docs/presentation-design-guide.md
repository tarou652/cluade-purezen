# プレゼンデザイン指針（Web調査まとめ）

プレゼン資料デザインの記事を **22本**（日本語12・英語10）読んで合意点を抽出したもの。
このデッキ（Slidev / `book.md`）のスタイル方針の根拠。実装は [../style.css](../style.css)。

> 調査日: 2026-06。出典は末尾。

---

## 全記事でほぼ一致した「鉄則」

### 1. 1スライド＝1メッセージ
- 言いたいことは1枚1つ。足りなければ分割する。
- 文字は「キーワード」で。文章を読ませない（読む vs 聞くは脳内で競合）。
- 文字量の目安:
  - 英語: 1スライド4項目以下／1項目4語以下、6×6、5-5-5
  - 日本語: キーメッセージ **9〜13文字**、本文 **40文字以内**、行間 **1.2**
- タイトルは「結果」でなく **主張そのもの**を書く（meaningful headline）。

### 2. 配色は3色・比率 70 / 25 / 5
- **ベース70%（無彩色＝白/グレー）／メイン25%／アクセント5%**。
- **原色（RGB100%）は使わない** → 彩度を落とした「くすみ色」へ。
- **本文は黒でなく“濃いグレー”**（目の負担減・柔らかい）。
- 背景は **白 #FFFFFF / オフホワイト #F5F5F5**、文字とのコントラスト **4.5:1 以上**。

### 3. フォントはゴシック/サンセリフ・最大2書体
- 推奨: 游ゴシック・メイリオ・ヒラギノ角ゴ・Noto Sans JP。**MSゴシックは避ける**。
- **2書体まで**（見出し用・本文用）。
- **強調は太さ（bold/semibold）で**。下線・斜体は使わない。

### 4. 文字サイズと階層（ジャンプ率）
- 本文最小: 日本語 **18〜24pt** / 英語 **24pt**（10-20-30 なら 30pt）。
- タイトル **28〜36pt** ＞ 見出し ＞ 本文 18〜24pt の **3階層**に統一。
- 見出しは本文より **50%以上大きく**。

### 5. 余白は15〜20%（“呼吸”）
- スライド面積の **15〜20%（端から5〜15%）を空ける**。
- 余白は「無駄」でなく **情報を区切る/グルーピングする道具**。

### 6. 整列・グリッド・近接
- **見えないグリッドに全要素を揃える**。基本は **左揃え**。
- 関連要素は **近づけ（proximity）**、無関係は離す。
- “スキャッタショット（バラ撒き）”は素人に見える最大要因。

### 7. 視覚的階層と視線（Z/F）
- 大きさ・コントラスト・色で **優先順位を視覚化**（最重要を大きく太く）。
- 視線は **左上→右下（Z）／テキスト多めは F**。重要情報を経路上に。

### 8. 文字より図解（ビジュアル優先）
- **テキストだけのスライドは作らない**。グラフ・図・アイコンで見せる。
- グラフは用途別: 縦棒=推移/増減、横棒=項目比較、円=割合（最大6分割）、折れ線=時系列。
- 画像は **1スライド1枚・高解像度**。装飾だけの画像は削る。アイコンは **同一セット**。

### 9. アニメは「目的」のときだけ
- 基本は **フェードのみ**。多用は素人っぽい。
- 例外＝ **段階表示（progressive disclosure）**：話す時に出し、済んだらディム（= Slidev の `v-click`）。

### 10. 一貫性（テンプレ/マスター）
- 色・フォント・余白を **テーマ/マスターで全体固定**。色の“意味”を最後まで変えない。

---

## このデッキへの適用判断（style.css の方針）

| 採用ルール | 実装 |
|---|---|
| 3色に厳格化 | 無彩色（紙/グレー）＋メイン1色 **ネイビー #16223A** ＋アクセント1 **amber #E8A33D**。teal は廃止 |
| 本文は濃いグレー | 本文 **#3A465C**、見出しのみネイビー |
| 強調は太さ・下線箱をやめる | 見出しの“箱バー”を廃止し、**短い amber アクセント線**（2.5rem）に |
| 反転は章扉だけ | 全面ネイビー反転は `layout: section`（章扉）に限定し頻度を下げる |
| 余白と行間 | 箇条書きの行間 1.65・項目間に余白、見出し下に余白 |
| フォント2系統 | 見出し=Space Grotesk＋Zen Kaku Gothic New / 本文=Inter＋Noto Sans JP |

---

## 出典（22本・抜粋）

**日本語**
- Schoo「プレゼン資料の作り方のコツ」 https://schoo.jp/matome/article/1630
- 伝わるデザイン「スライドのデザイン」 https://student.tsutawarudesign.com/slide_design/
- okunote「9つのコツ」 https://okunote.co.jp/column/1001-01/
- キンコーズ「10のコツ」 https://www.kinkos.co.jp/column/powerpoint-design/
- ビットセンス「3つの鉄則」 https://www.bitsense.co.jp/ppt-2/
- ヌルジャパン「色・フォント・配置」 https://nulljapan.jp/column/slide-color/
- プレゼンデザイン「色の使い方」 https://ppt.design4u.jp/color-selection/
- Fuyuna Blog「フォント・色の選び方」 https://fuyuna.net/making-slide-document-font-color
- Cone「デザインパターン集」 https://cone-c-slide.com/see-sla/blog/design-pattern/
- Cone「作り方6ステップ」 https://cone-c-slide.com/see-sla/blog/presentation-document/
- フリースタイル「見やすいデザインの極意」 https://www.freestyle-entertainment.co.jp/ppt/column/how-to-make/

**英語**
- PMC「Ten simple rules for effective presentation slides」 https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/
- UCSD「Evidence-Based Presentation Design」 https://multimedia.ucsd.edu/best-practices/presentation-design.html
- VirtualSpeech「Designing presentation slides」 https://virtualspeech.com/blog/designing-presentation-slides
- Noun Project「Golden Rules of Presentation Design」 https://blog.thenounproject.com/the-golden-rules-of-presentation-design/
- Univ. of York「Basic slide design」 https://subjectguides.york.ac.uk/presentations/design
- Hype「PowerPoint design rules」 https://hypepresentations.com/blog/powerpoint-design-rules/
- Deckary「Layout, Color & Typography」 https://deckary.com/blog/pillar-powerpoint-design-guide
- FullyDeckedUp「Typography in presentations」 https://fullydeckedup.com/blog/understanding-the-basic-principles-of-typography-in-presentations/
- IxDF「Visual Hierarchy」 https://ixdf.org/literature/topics/visual-hierarchy
- Narratio「10 Slide Design Tips」 https://narratiocreative.com/resources/10-slide-design-tips-best-practices/
