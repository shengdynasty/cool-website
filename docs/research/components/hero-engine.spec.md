# HeroEngine + Home markup Specification

## Overview
- **Target files:** `src/components/sheng/hero-engine.ts`, `HomeMotion.tsx`, section components (`Hero.tsx`, `StatusSection.tsx`, `Sheet.tsx`, `AskSection.tsx`, `ProjectsSection.tsx`, `SiteFooter.tsx`), `src/app/page.tsx`
- **Source of truth:** webpack module 6943 (`HomeMotion` class `r` + component `n`) in `docs/research/source/page.pretty.js` lines 340–923, and the server HTML in `docs/research/source/index.html`.
- **Screenshot:** `docs/design-references/01-hero-desktop-1440.jpg`
- **Interaction model:** time-driven intro → idle breathing loop; pointer (tilt, glow); typewriter placeholder; submit vanish. See BEHAVIORS.md §1.

## Engine changes vs. source
| Source | Clone |
|---|---|
| `fetch("/home/paris-grid.json")` | `options.gridUrl` = `/home/hero-grid.json` (built from the skyline photo) |
| `SEAM = .335`, top edge `.405` | `grid.seam` = `[0.435, 0.44]` (crown −14 cols, body edge at the bottom), defaults to the source values |
| intro centre `(.46 cols, .47 rows)` | `grid.c` = face centroid `[0.536, 0.43]`, defaults to the source values |
| atlas `[52+162e, 92+134e, 74+136e]` lerped from `#09140F` | grey `82+140e` (same luminance) lerped from `#000` |
| lit row `#5DB888` | `#FFFFFF` |
| art tiles `rgba(9,20,15,.5)` + `rgb(96+150h,128+118h,108+124h)` | `rgba(0,0,0,.5)` + grey `120+125h` |
| `EXAMPLES` (booking app…) | `hero.card.examples` |
| note when sent "Got it. Opening the form" | `hero.card.sent` |
| `onIdeaSent` → sessionStorage + `/consult` | opens `mailto:` with the idea as the body |
| no dispose guard on the grid fetch | `disposed` flag (React StrictMode mounts twice in dev) |

All timings, easing curves, thresholds and the PRNG seed are unchanged.

## Markup contract (must match the source HTML)
- `.home` (inline `--mono`, inline script adds `.js`) → `.hero` (contains the fixed `header.bar`) + `.rest`.
- `.stage`: photo `<img>`, `#hero-poster`, `canvas#hero-code`, `canvas#hero-art`, `.shade`, `#hero-curtain`.
- Title spans have **no whitespace** between them; `.del#hero-del` wraps `[data-t=l1b]`; `.wrapline` on l1c; `.caret#hero-caret` after l2.
- `[data-t]` keys: n0–n3, work, l1a, l1b, l1c, l2, go, price, note, reply, videos, followers, guides.
- `[data-hover]` on nav links (300), work (300), `#hero-go` (380, `data-key="go"`).
- Decrypt headings: `<span><span class="word" aria-hidden="true">Word</span> </span>`, last word without the trailing space.

## Content
All copy in `src/content/home.ts`, sourced from the cool-website repo.
