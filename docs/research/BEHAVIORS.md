# Behaviors — murphmaxxing.com home

Extracted from the shipped JavaScript (`docs/research/source/page.pretty.js` module 6943 = HomeMotion class, module 246 = UltraMark, module 3770 = SignupForm; `rest.module.js` = module 2110 scroll effects) and verified in Chrome at 1440×900 and 770×692. Timings in ms.

## Global
- `html{scroll-behavior:smooth}`; no Lenis/Locomotive, no scroll-snap, no Framer Motion/GSAP. Everything is hand-rolled canvas + rAF + IntersectionObserver.
- `prefers-reduced-motion: reduce` → all intros skip to final state, canvases still (`still` flag), CSS animations off.
- `.home.js` gates every effect; `[data-t]` texts are `visibility:hidden` until `.hero.on`.
- Fonts: effects wait for `document.fonts.load("500 12px <mono>")` + `fonts.ready` before sizing canvases.

## 0. Nav bar
- Fixed, 56px, bg #000, bottom hairline. Links are mono 14px. Hover → `color: var(--lit)` + **text scramble** (300ms; `data-hover="300"`): characters replaced by `.:/{}<>=#` noise resolving left→right (ease-out cubic). "work with me" button: 36px, 1px border rgba(245,242,234,.4), radius 10, `data-hover="300"`.
- Logo `#hero-replay` click → `preventDefault`, re-run title scramble + hero intro.

## 1. Hero (time-driven intro, then idle "breathing")
Timeline from `start()` (t=0):
- 0: title words scramble in: l1a 0→240, l1b 120→460, l1c 240→760, l2 460→920 (`scramble(key, delay, dur)`), status texts reply 1040/420, videos 1120/360, followers 1200/360, guides 1280/360, price 1760/360. Scramble = prefix of real text + noise chars for the rest; text steps every 40ms.
- 920: caret appears (`#hero-caret` opacity 1, CSS `home-blink 1.1s steps(1) infinite`).
- 1260: `.del.on` → strike-through: `:before` band scaleX 0→1 (.46s cubic-bezier(.22,1,.36,1)), `:after` line same with .14s delay; text colour → dimmed.
- `.sub` has class `rise` → `home-rise .42s` from opacity 0/translateY(12px), `animation-delay:.86s`.
- 1500: `booting=false` → `#hero-curtain` opacity 0 (curtain = solid #000 over the stage).
- 1500 (CSS): `.lift` → `home-drop .64s cubic-bezier(.16,1,.3,1) 1.5s both` (card drops from translate3d(0,-40px,140px) rotateX(16deg)); `.ground` shadow `home-settle .7s 1.66s`.
- 1700: placeholder typewriter starts (`phNext`).
- 1900: `land()` → glyph "impact" ripple on the canvas centred on the card (1100ms).
- Grid `/home/hero-grid.json` fetch → `begin()`: builds cell data, `ready=true` → `#hero-poster` opacity 0, canvas intro:
  - `intro()`: all cells drawn (figure cells blank). **Pen** draws the figure outline from the head down both sides (start +120, dur 980, ease-out quad) with the bright glyph (`#` at level LEVELS = white row of atlas) flashing 170ms then settling. **Fill**: figure interior cells appear from the centre outward (620 + 16·deep + rand·130). **Queue**: figure cells (1360+) and right-of-seam cells (1560 + 1000·(far/max)^.8 + rand·170) get cleared (12% flash first) → photo shows through.
  - **Breath** (every 33ms, CYCLE 8200ms): glyph index and brightness level per remaining cell modulate with a "lung" wave travelling from the figure centroid (`far` chamfer distance), plus jitter; seam band cells flicker on/off with `chance(fx, edge+wobble, width)`.
  - **Art** (`#hero-art`): after the queue finishes, the 2× sprite over the figure paints in top→bottom (edges first) at ART_MAX .5 alpha; its level follows the lung so it pulses.
- Pointer over `.hero`: **glow** (glyph brightness bump within radius 12 cells, 900ms decay) + **card tilt**: `--rx` (±2.4°), `--ry` (±3°), `--sx/--sy` shadow offset, `--lit` sheen/rim opacity (0–1 within 120px), `--mx/--my` sheen position; go button nudges `--bx` (±2px) `--by` (±1px) when the pointer is within 40/32px. Eased 0.12–0.2 per frame. Pointer leave → all targets 0.
- Placeholder typewriter: EXAMPLES cycle; type 46ms/char, hold 1900, delete 22ms/char, pause 340 before next. Pauses while focused or when the field has text. Focus → shows full current example then deletes it.
- Submit (`#hero-form`): `preventDefault`; idea text **vanishes** (noise shrinking right→left over 560ms), note text becomes "Got it. Opening the form" for 2600ms, `land()` impact, then `onIdeaSent(idea)` (original: sessionStorage + `/consult`). **Clone**: prefill `#ask-idea` and smooth-scroll to `#ask`.
- Hover on `[data-hover]` elements (nav links, work, go): scramble that key for N ms.
- Canvas sizing: dpr ≤2, cells = canvas px / cols; atlas of 10 glyphs × 6 levels + 1 "lit" row prerendered.

## 2. Status section (orig. ultrastack)
- `UltraMark` canvas (5:1): text rendered to an offscreen alpha mask → cell grid (v=3.4px, E=1.6v); on first view: **sweep-in** left→right 1700ms (ease-out cubic) with noisy glyphs, then static glyph layer at .5 alpha + slow colour waves (period 8.2s) on fill/edge/shadow layers. `pointerenter` → a highlight wave (1100ms) crosses left→right. IntersectionObserver pauses when offscreen. **Clone**: same engine driven by the portrait photo luminance instead of text (see portrait-engine.spec.md).
- `h2[data-decrypt]`: on enter (rootMargin `0px 0px -14% 0px`) each `.word` decrypts (noise → text, 240 + 26·len ms, staggered 70ms), hidden as noise before start.
- Signup form: POST to kit.com, state machine idle/sending/done/refused. **Clone**: replaced by a links row (no newsletter).

## 3. Sheet (paper): seam canvases
- `.seam` canvas (absolute, 160px tall, overlapping the previous section): on scroll, `update(vh)` paints `data-seam` colour cells (16px, 12px <760) whose coverage grows as the seam enters the viewport: `i = clamp((vh − rect.bottom + 40) / (.6·vh))`; cell visible if `.04 + .96i − (.86·rowFromBottom + .44·hash + wave·row) ≥ 0`; near-threshold cells draw a glyph instead of a block. Repaints only when `i` changes by >.002.

## 3a. Ways (scroll-driven)
- `#ways` SVG `.graph` overlays the grid: `size()` computes path A (left column: vertical from top 14 → bottom of `#way-a`, then a cubic curve into column B at `#merge-at`) and path B (vertical in column B from 14 → last `#ships li`). Paths have `pathLength="1"`, `stroke-dasharray:1`, `stroke-dashoffset:1`.
- `update(vh)`: progress `l = clamp((.62·vh − rect.top − 14)/(end − 14))` → `g-b.strokeDashoffset = 1 − l`, `g-a` = `1 − clamp(l / mergeFrac)`. Each `#ships li` gets `.on` when the line passes its mark (dot fills, text darkens, `.live` turns accent). `.g-base` dashed guide stays.
- ≤760: single column, paths both in column 1 (`s` = same left → path A is empty).

## 3b. Questions
- `h2[data-decrypt]`; each `.q[data-rise]` fades/rises in (`opacity 0 → 1`, `translateY(16px) → 0`, .42s cubic-bezier(.22,1,.36,1)) on enter.

## 4. Ask band
- `.seam[data-seam=#1F1F1F]` at top.
- `#ask-field` canvas (full section): base pattern from layered sines masked to the right/top (`M` builder: cw 8.4 (7 <760), ch 1.6cw, 8 tones, restMax .42). **Pointer** within 150px lifts cell tone (eased `near`), **ripples** (1700ms expanding rings) on: card enter (+460ms, power .9), textarea input (throttled 120ms, .5), submit (1.1). Static otherwise (rAF only while something moves).
- `#ask-deck` on enter (`rootMargin 0 0 -24%`) → `.in` → card `home-drop .64s`.
- `h2.h1[data-decrypt]`.
- Submit: `preventDefault`, ripple, clear textarea, `#ask-note` → "Got it. Opening the form" (2600ms), after 520ms `onIdeaSent(idea)`. **Clone**: open `mailto:shengyan555@gmail.com?subject=…&body=<idea>`.
- Hover on `[data-scramble]` (go button, ghost links, footer links): `[data-label]` scrambles 300ms.

## 5. Projects (orig. guides)
- `.seam[data-seam=#000]`; `h2[data-decrypt]`; `.ghost` hover scramble + border/colour → lit + arrow nudge 3px.
- Each `.cover canvas` starts fully painted (cell 12px, 7 if <400px wide): black blocks with sparse glyphs; on enter it **dissolves** from the right edge inward over 760ms (the left side holds longest) (stagger 70ms for the first five) then `hidden`. Title hover → lit (.15s).

## 6. Footer
- `#mark` canvas (6:1, 8:5 ≤760): wordmark text → glyph mask (`v` builder, cw 4.2 / 3, 8 tones, restMax .8); on enter → `show()` reveal left→right 1100ms; pointer glow within 150px.
- Links `[data-scramble]`.

## Responsive summary (from CSS; window could not go below 770px in this session)
- ≤900: ultra/ask/guides/questions/solaris grids → single column; `.ask-deck` max 504.
- ≤760: `--bar:93px`, nav wraps to a second row; hero min-height 860, `.main` padding-top 28, title `clamp(34px,12vw,60px)`, sub 17px; stage `top:100px;left:-420px;width:1350px`; `.shade` gradient shows; card padding 16, well 44, go 46, note hidden, status reply hidden; ways single column; row covers 96px; seams 112px.
- ≤560: `.ultra` 300px, canvas 5:3 (two-line wordmark).
- ≤359: button arrows hidden.
