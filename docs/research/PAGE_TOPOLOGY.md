# Page Topology — murphmaxxing.com home (as cloned for Sheng Yan)

Single route `/`. `<main id="main"><div class="home js" style="--mono:…">` wraps everything. Page height ≈ 6212px at 1440 (original).

| # | Section | Element | Top (1440) | Height | Bg | Interaction model |
|---|---|---|---|---|---|---|
| 0 | Nav bar | `header.bar` (fixed, z 50) | 0 | 56 | #000 | hover-scramble links; logo click replays hero intro |
| 1 | Hero | `div.hero` | 0 | 900 (max(900px,100vh)) | #000 | **time-driven intro** + pointer (card tilt, glyph glow) + typewriter placeholder + submit vanish |
| 1a | Stage | `.stage` (abs, 8:5) | 0 | 900 | photo | canvases `#hero-code` (glyph field), `#hero-art` (figure sprite), `#hero-poster` img, `#hero-curtain` |
| 1b | Status bar | `footer.status` | 860 | 40 | rgba(0,0,0,.84) | scramble-in on load |
| 2 | Status / MailZoo (orig. "ultrastack") | `section#ultrastack.night.pad.ultra-home` | 900 | 1157 | #000 | ASCII canvas (portrait) + decrypt heading on enter |
| 3 | Sheet (paper) | `div.sheet` | 2057 | 1843 | #F5F2EA | seam canvas at its top (scroll-driven dissolve from #000 → cream) |
| 3a | Ways | `section.pad.ways-section` | 2057 | 963 | — | **scroll-driven** SVG line draw + checklist dots turn on |
| 3b | Questions | `section.pad.questions` | 3020 | 880 | — | decrypt heading, `[data-rise]` fade-up on enter |
| 4 | Ask (CTA band) | `section#ask.ask.pad` | 3899 | 837 | #1F1F1F | seam; `#ask-field` glyph canvas with pointer glow + ripples; card drops in; textarea input ripples; submit → mailto |
| 5 | Projects (orig. "guides") | `section#guides.night.pad.guides` | 4736 | 1675 | #000 | seam; decrypt heading; cover canvases dissolve away on enter; hover scramble on ghost |
| 6 | Footer | `footer#end.night.pad.end` | 6411 | 381 | #000 | `#mark` ASCII wordmark canvas revealed on enter, pointer glow; link scramble |

Z-index: bar 50 > guides 3 = end 3 > ultra 2 = ask 2 > sheet 1. Seams are `position:absolute; top:-159px; height:160px` inside sections 3/4/5 so they paint over the previous section's bottom.

Scroll container: window. No scroll-snap, no smooth-scroll library (`html{scroll-behavior:smooth}` only). All scroll effects are IntersectionObserver (decrypt, rise, covers, mark) or `scroll` listener → rAF (seams, ways graph).

Dependencies: everything inside `.home` needs `.js` class (added in a layout effect) — without it canvases are hidden/fallbacks show. `[data-t]` texts are hidden until the hero engine adds `.on`.
