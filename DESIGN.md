---
name: My Gold
description: Personal GMI gold portfolio, read like the commodity-quote page of an Indonesian business daily.
colors:
  masthead-yellow: "#F4C430"
  masthead-ink-secondary: "#4B3C00"
  ink: "#151513"
  ink-secondary: "#575A5A"
  ink-tertiary: "#83888A"
  paper: "#F5F6F6"
  rule: "#DCDEDE"
  tint: "#ECEEEE"
  plate-ink: "#F7F7F4"
  plate-ink-secondary: "#B9B7AE"
  quote-green: "#0B7A3B"
  quote-red: "#C0261D"
  quote-green-on-mast: "#0A5F2F"
  quote-red-on-mast: "#8F1A12"
  flag-amber: "#A35A00"
  focus-blue: "#1F5FD1"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 74"
    fontFeature: "'tnum', 'lnum'"
  signal:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 70"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    fontVariation: "'wdth' 80"
    fontFeature: "'tnum', 'lnum'"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    fontVariation: "'wdth' 88"
    fontFeature: "'tnum', 'lnum'"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    fontVariation: "'wdth' 78"
  caption:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  tag: "3px"
  plate: "6px"
  segment: "8px"
  pill: "999px"
spacing:
  gutter: "16px"
  row: "11px"
  section-gap: "28px"
  column: "560px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "48px"
  button-fab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 20px 0 16px"
    height: "52px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "48px"
  button-small:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  segmented-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    height: "36px"
  advice-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate-ink}"
    rounded: "{rounded.plate}"
    padding: "16px 16px 14px"
  masthead:
    backgroundColor: "{colors.masthead-yellow}"
    textColor: "{colors.ink}"
  tag-new:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.caption}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
---

# Design System: My Gold

## Overview

**Creative North Star: "The Morning Quote Page"**

The app reads like the commodity page of an Indonesian business daily. A full-bleed chrome-yellow masthead carries the one headline quote. Below it, cool newsprint paper holds tight ruled quote tables. Every number is a figure in a column, set condensed and tabular, and each number appears once.

Hierarchy comes from weight, width, case and reversal, not from boxes or shadows. Sections open on a 2px ink rule. Rows are separated by 1px hairlines. Exactly one element per screen is reversed onto an ink plate: the advice. State is drawn as line form: solid rule means live, dashed rule means stale or pending.

Density is a single 560px phone column with a 16px gutter. Dark mode inverts to an ink ground; the masthead dims to deep ochre with yellow type, and the plate flips to light-on-dark ink.

**Key Characteristics:**
- One committed section hue: the whole masthead is yellow, never a small accent.
- One family, Archivo variable; width does the work (condensed figures, normal prose).
- Ruled tables, no cards, no card shadows.
- One reversed plate per screen.
- Up/down drawn as small filled SVG triangles in quote green and red.

## Colors

Newsprint neutrals with one full-strength yellow and market green/red.

### Primary
- **Chrome Yellow** (masthead-yellow): fills the entire masthead and the theme color; reused as the chart cursor dot, the break-even "now" marker, the owned-size dot in tables, the FAB icon, and the signal word on the plate. Dark mode masthead becomes deep ochre `#231E0D` with yellow type.

### Neutral
- **Press Ink** (ink): all primary text, section rules, filled buttons, the advice plate ground.
- **Graphite** (ink-secondary): metadata, table headers, inactive segments.
- **Pencil Grey** (ink-tertiary): placeholders, dashed stale rules, footer.
- **Cool Newsprint** (paper): page ground and text on ink fills.
- **Hairline** (rule): row dividers, chart baseline, segmented borders.
- **Wash** (tint): pressed states, rail track, image placeholders.
- **Masthead Umber** (masthead-ink-secondary): secondary text on yellow.
- **Plate Paper / Plate Grey** (plate-ink, plate-ink-secondary): text on the reversed plate.

### Market and state
- **Quote Green / Quote Red** (quote-green, quote-red): price up / down on paper; deepened variants (`-on-mast`) on yellow. Red also marks errors and missing inputs.
- **Flag Amber** (flag-amber): sanity-check warnings on the update screen; between OK and wrong.
- **Focus Blue** (focus-blue): 2px focus outline only.

### Named Rules
**The Full-Strength Masthead Rule.** Yellow is a section hue at 100% across the masthead, not a sprinkled accent. Elsewhere it appears only as small markers (dots, cursor, icon).

**The Market Colors Rule.** Green and red mean price direction (red also means error). Never decorative.

## Typography

**Display Font:** Archivo variable, wdth 62–125, wght 400–800 (with system-ui fallback)

**Character:** One grotesque family, tuned by width: condensed (wdth 70–88) for figures, labels and the signal; normal width (100) for prose. All figures use tabular lining numerals.

### Hierarchy
- **Display** (700, 44px, wdth 74, 1.05): the masthead portfolio value only.
- **Signal** (800, 30px, wdth 70, +0.02em): the BELI / TUNGGU / NETRAL / JUAL word on the advice plate.
- **Headline** (700, 22px, wdth 80): secondary prices (1 g buyback, world price pair).
- **Title** (700, 17px): app name, section headings, screen titles, plate headline.
- **Body** (400, 15px, 1.45): prose and table cells.
- **Figure** (600, 15px, wdth 88): quote-line and table figures.
- **Label** (600, 13px, condensed): date stamp, segments, small buttons, metadata.
- **Caption** (12px): table headers, chart axis, footer, uppercase status tags (+0.04em).

### Named Rules
**The Width Before Weight Rule.** Numbers get condensed width and tabular figures (`.n` + wdth 74–88). Prose stays at wdth 100.

## Layout

Single column, `max-width: 560px`, 16px side gutter, centered. Masthead is full-bleed with the column inside. Sections are separated by 28px, each opening with a 2px ink top rule and a heading row (title left, condensed metadata right, baseline-aligned). Table rows pad 11px vertically. Fixed bottom elements (FAB, save bar, snackbar) align to the 560px column and respect safe-area insets; main content reserves 96px at the bottom.

## Elevation & Depth

Flat by default; depth comes from reversal (yellow masthead, ink plate) and rules. Shadows appear only on floating elements above the page.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 4px 14px rgba(0,0,0,.22), 0 1px 3px rgba(0,0,0,.2)`): the fixed "Perbarui harga" FAB.
- **Toast** (`box-shadow: 0 6px 18px rgba(0,0,0,.25)`): snackbar.

### Named Rules
**The No-Card Rule.** Content sits on paper between rules. No card containers, no card shadows.

## Shapes

Mostly square. Controls are full pills (FAB 26px, buttons 24px, small buttons 18px). The advice plate, thumbnails, inputs on the gate and error boxes use a 6px corner. Segmented control 8px. Tags 3px. Rules: 2px ink section rule, 1px ink table-header rule, 1px hairline rows, 1.5px ink outline on outline buttons and underline inputs. Dashed lines mark stale or pending state (stale stamp, stale-price row, add-screenshot tile, break-even gap on the rail, break-even line on the chart).

## Components

### Buttons
- **Shape:** full pill.
- **Primary:** ink fill, paper text, 48px tall, weight 650. Disabled at 35% opacity.
- **FAB:** ink pill, 52px, camera icon in yellow, Float shadow, fixed bottom-right of the column. Press scales to 0.97.
- **Outline:** 1.5px ink border, transparent; pressed fills with wash.
- **Small (36px):** outline pill for inline actions like the stale-price "Perbarui".
- **Icon button:** 44px circle, no fill; pressed shows a translucent ink wash.

### Segmented range control
Five equal cells in a hairline box (8px corner). Active cell inverts to ink with paper text.

### Advice plate (signature)
The only reversed element: ink ground, 6px corner, signal word condensed 800 in yellow, date at caption size, headline + explanation, and a disclosure with a rotating chevron for reasons. In dark mode the signal word sits on a yellow chip.

### Quote table (signature)
Full-width, tabular lining numerals. Header: caption grey with 1px ink underline. Rows: 11px padding, hairline dividers, no last divider. Size column bold condensed; change column right-aligned with a triangle glyph. An owned size carries a small yellow dot ringed in ink. Sum rows add a 1px ink top rule. On the update screen the same table takes underline inputs (transparent until focus, then 1.5px ink); missing rows go red, flagged rows amber.

### Break-even rail (signature)
A 4px line on a wash track with ink fill to the current value, ink ticks for modal and goal, a dashed red gap, and a yellow ink-ringed "now" dot. Legend below in label/figure type.

### Masthead
Yellow, 56px bar (mark, name, underlined date stamp, refresh), label, display value, then one quote line with P/L and change. The stamp underline turns dashed when the price is stale.

### Tags
Uppercase caption, 3px corner: "Baru" ink-filled, "Sudah ada" ink-outlined.

## Do's and Don'ts

### Do:
- **Do** open every section with the 2px ink rule and a title/metadata heading row.
- **Do** set every figure condensed with tabular lining numerals.
- **Do** keep exactly one reversed ink plate per screen.
- **Do** use dashed lines for stale or pending state and solid for live.
- **Do** draw direction as filled 9×8px SVG triangles in quote green/red.

### Don't:
- **Don't** wrap content in rounded cards or give non-floating elements shadows.
- **Don't** use yellow as text or fill on paper beyond small markers; it belongs to the masthead.
- **Don't** repeat a number in two places on the same screen.
- **Don't** add a second typeface; vary Archivo width and weight instead.
