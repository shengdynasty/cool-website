# Design Tokens — murphmaxxing.com → Sheng Yan (black & white)

Source: `docs/research/source/global.pretty.css`, `home.pretty.css`, computed styles via Chrome MCP at 1440×900.

## Fonts
| Role | Source | Clone |
|---|---|---|
| Sans (body, ledes, card labels) | `switzer` variable 100–900, self-hosted woff2 | `src/fonts/switzer-variable.woff2` via `next/font/local` → `--font-sans-face` |
| Mono (titles, nav, buttons, status, all canvas glyphs) | `JetBrains Mono` 100–800 (next/font/google, 7 subsets) | `src/fonts/jetbrains-mono-latin.woff2` via `next/font/local` → `--font-mono-face`; `.home{--mono: <family>}` set inline from `jetbrainsMono.style.fontFamily` |
| Fallbacks | `switzer Fallback` = Arial size-adjust 101.38%; `JetBrains Mono Fallback` = Arial size-adjust 134.59% | `adjustFontFallback: "Arial"` |

Body: 16px/24px. `.hero`/`.rest`: 18px, line-height 1.5 / 1.6, `font-variant-ligatures:none`.

## Colour map (every hex in the source and what it became)
| Source | Where | Clone |
|---|---|---|
| `#09140F` | night bg (html, body, bar, hero, rest, night, curtain, INK in canvases) | `#000000` |
| `#F5F2EA` | cream: paper bg, night text, cream buttons | `#F5F2EA` (kept — "the white it's using") |
| `#0F1F18` | ink on paper | `#0A0A0A` |
| `#2F6B4A` | `--accent`: caret, logo square, hero-go bg, well focus ring, signup button, g-line, branch, dots, live | night contexts → `#F5F2EA`; paper contexts → `#0A0A0A` (overrides.css) |
| `#2F6B4A` | `.ask` section bg (green band) | `#1F1F1F` |
| `#5DB888` | `--lit`: hover, focus rings, caret blink, hero pen glyph, cover highlight | `#FFFFFF` |
| `#C9D6C6` | muted on night (status bar, ledes, dd, notes) | `#BDBDBD` |
| `#3C4C42` / `#46564C` | muted on paper | `#4D4D4D` |
| `#E4ECE3` | ask lede | `#D9D9D9` |
| `#9DAE9E` | night input placeholder | `#8A8A8A` |
| `#27553D` | signup button hover | `#FFFFFF` |
| `#34604D` | cover canvas glyphs | `#4A4A4A` |
| `rgba(226,48,40,.62)` / `#FF5247` / `#FFE3E0` | strike-through band / line / struck text | `rgba(245,242,234,.16)` / `#F5F2EA` / `#9A9A9A` |
| `rgba(245,242,234,.16)` | `--night-line` | kept |
| `rgba(9,20,15,.14)` | `--paper-line` | `rgba(0,0,0,.14)` |
| `#3A3C40→#2A2C2F` | hero card face (already neutral) | kept |
| `#FBF8F1→#EDE8DC`, `#DFD9CB`, `#B9B2A1` | paper card face/well/edge | kept |

Canvas palettes (JS): hero atlas `[52+162e, 92+134e, 74+136e]` → grey `46+194e`; art tiles `rgb(96+150h,128+118h,108+124h)` → grey `110+140h`; ask-field tones `[60,124,90]→[226,240,222]` → `[60,60,60]→[228,226,220]`; mark tones `[47,107,74]→[240,244,232]` → `[47,47,47]→[240,238,232]`; seams `data-seam="#F5F2EA" | "#1F1F1F" | "#000000"`.

## Layout
- `--bar: 56px` (93px ≤760px). Gutter `clamp(20px,4vw,56px)`.
- Hero `min-height:max(900px,100vh)` (860px ≤760). Stage `width:max(100%,1440px)`, aspect 8/5, centred; ≤760: `top:100px;left:-420px;width:1350px`.
- Title `clamp(34px,5.28vw,92px)` / 1.12 / -0.03em (≤760: `clamp(34px,12vw,60px)`). Sub 21px/1.45 max 470px.
- h1 `clamp(40px,5.28vw,92px)`/1.08, h2 `clamp(32px,4.4vw,72px)`/1.1, both mono 500 -0.03em.
- Card 504px max, radius 16, padding 24/24/20; well 52px; go 52px; radius 10.
- Grids: ultra `1.1fr 1fr` gap 48×72; ways `1fr 1fr`; questions `1fr 1.4fr` gap 40×56; ask `1.2fr 504px` gap 48×72; guides `1fr 1fr` gap 40×56.
- Seam canvases: 160px tall at `top:-159px` (112/-111 ≤760).
- Breakpoints: 900px (grids collapse), 760px (bar wraps, stage shifts, mobile type), 560px (ultra), 359px (button svg hidden).

## MailZoo green (added after the B&W pass)
Sampled from the MailZoo logo as the old portfolio's MailZoo page renders it (office photo at `brightness(.75)`): the frog's face reads **#2CA942** (hsl 131° 59% 42%); the "Zoo" letters read #43B933.
| Token | Value | Used for |
|---|---|---|
| `--zoo` (= `--lit`) | `#2CA942` | dark sections: logo mark, cursor, link hover/focus, active nav, card prompt + focus ring, reading progress, hero pen-outline flash, cover-dissolve edge glyphs |
| `--zoo-ink` (= Tailwind `accent`) | `#1F7A30` | paper sections (4.8:1 on cream): ways graph line + dots + "still building", post category labels, card title hover, active filter pill, article callout tint, link-row hover |
Big surfaces (backgrounds, buttons, text) stay black / cream / grey, so the green stays a splash.
