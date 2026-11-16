# RestEffects Specification

## Overview
- **Target file:** `src/components/sheng/rest-effects.ts` (plain TS module, no React)
- **Source of truth:** module `2110` of murphmaxxing.com, beautified at `/Users/shengyan/sheng-murph-clone/docs/research/source/rest.module.js` (549 lines). Port it 1:1, renamed and typed.
- **Screenshots:** `docs/design-references/02-ultrastack-desktop.jpg` … `07-footer-section.jpg`
- **Interaction model:** mixed. Scroll-driven (seams, ways graph), IntersectionObserver-triggered (decrypt, rise, cover dissolve, mark reveal, ask card drop), pointer-driven (ask field + mark glow), hover (scramble), submit (ask form).

## Public API
```ts
export interface RestEffectsOptions {
  /** Called after the ask form submits (after the 520ms ripple delay), with the trimmed textarea text. */
  onIdeaSent: (idea: string) => void;
  /** Text shown in #ask-note for 2600ms after submit. Source: "Got it. Opening the form". */
  sentNote: string;
  /** Footer #mark wordmark lines. `wide` when the canvas is >= 760px wide, `narrow` otherwise. Source: ["murphmaxxing"] / ["murph","maxxing"]. */
  markText: { wide: readonly string[]; narrow: readonly string[] };
}
/** Wires every below-the-hero effect inside `root` (the `.rest` element). Returns a cleanup function. */
export function initRestEffects(root: HTMLElement, mono: string, options: RestEffectsOptions): () => void;
```
`mono` is the CSS font-family string for JetBrains Mono (used in every `ctx.font`).

## Source → target mapping (keep every numeric constant identical unless listed under "Changes")
| Source | Target name | Notes |
|---|---|---|
| `l = ".:/{}<>=#"` | `NOISE` | |
| `s = " .:/{}<>=#"` | `GLYPHS` | |
| `n = "#09140F"` | `INK` | **→ `"#000000"`** |
| `o = "#5DB888"` | `LIT` | **→ `"#FFFFFF"`** |
| `a(t,e=0,i=1)` | `clamp` | |
| `r` | `easeOutCubic` | |
| `h(t,e)` | `hash2` | sin-hash, keep exact formula |
| `c(t)` | `scrambleNoise` | |
| `d`, `f` | `mixRgb`, `rgb` | |
| `u(t)` | `sizeCanvas` | dpr capped at 2 |
| `p(t,e,i,l,n)` | `buildGlyphAtlas` | |
| `class m` | `class SeamCanvas` | colour from `canvas.dataset.seam` |
| `class w` | — | **Drop** (Solaris plan, not on this page). Also drop the `#plan` / `#plan-code` / `solaris-grid.json` branch in init. |
| `class g` | `class WaysGraph` | |
| `class x` | `class GlyphField` | |
| `M(t)` | `buildAskField` | **tones changed** (below) |
| `y(t)` | — | **Drop** (`#head-code`, subpages only) and its `W` usage. |
| `v(t)` | `buildMark` | **tones + text changed** (below) |
| `b(t,e,i)` | `initRestEffects` | |

## Changes from the source (black & white + this site)
1. `INK = "#000000"`, `LIT = "#FFFFFF"`.
2. `buildAskField` tones: `mixRgb([50,50,50], [230,228,222], i/(tones-1))` instead of `[60,124,90] → [226,240,222]` (the section bg is now `#1F1F1F`, not green).
3. `buildMark` tones: `mixRgb([70,70,70], [245,242,234], i/(tones-1))` instead of `[47,107,74] → [240,244,232]`.
4. `buildMark` text: `options.markText.narrow` when `t.w < 760`, else `options.markText.wide` (source hard-codes `["murph","maxxing"]` / `["murphmaxxing"]`). Pass the options into the builder via closure.
5. `buildMark` vertical fit: the source sizes the font only by width (`r = 96*cols/maxWidth`). Shorter words get taller and their descenders (g, y) clip. Also compute a height limit and take the min:
   ```ts
   // measured at 100px with the same letterSpacing
   const m = lines.map(s => ctx.measureText(s));
   const ascent = Math.max(...m.map(x => x.actualBoundingBoxAscent));
   const descent = Math.max(...m.map(x => x.actualBoundingBoxDescent));
   const heightFit = 100 * (rows / lines.length) * 0.9 / ((ascent + descent) * o); // o = cw/ch
   const size = Math.min(widthFit, heightFit);
   ```
   and position each line so the glyph box is centred in its band instead of `textBaseline:"middle"` on the em box: `y = (rows*(i+.5)/lines.length)/o + (ascent - descent)/2 * size/100` with `textBaseline = "alphabetic"`. Everything else in `buildMark` (stroke width `.012*r`, threshold `.42`, base `5 + floor(5*hash)`) unchanged.
6. Cover dissolve (`V.forEach`): block fill `INK`, glyph colour `"#4A4A4A"` (source `"#34604D"`), near-threshold glyph `LIT`.
7. Ask form submit: `#ask-note` text → `options.sentNote`; after `520 * !reducedMotion` ms call `options.onIdeaSent(idea)`; restore the original note after 2600ms. Same ripple calls as source.
8. No `data-head` elements exist on this page; keeping that loop is harmless (it finds nothing).

## DOM contract (all queried inside `root`)
- `[data-decrypt]` containing `.word` spans → decrypt on enter (rootMargin `"0px 0px -14% 0px"`), each word `240 + 26*len` ms, stagger 70ms, `hide=true`.
- `[data-rise]` → add class `in` on enter.
- `[data-scramble]` containing `[data-label]` → 300ms scramble on `mouseenter`.
- `.seam[data-seam]` canvases (3 of them: `#F5F2EA`, `#1F1F1F`, `#000000`).
- `#ways` with `#way-a`, `#way-b`, `#ships li`, `#merge-at`, `svg #g-a`, `#g-b`, `#g-base-a`, `#g-base-b`.
- `#ask` (section, pointer tracking target), `#ask-field` canvas, `#ask-deck`, `#ask-form`, `#ask-idea` (textarea), `#ask-note`.
- `#end` (footer, pointer target) and `#mark` canvas.
- `.cover canvas` (5 of them; stagger `70*i` for the first five).

## Lifecycle (identical to source)
- Wait for `Promise.all([document.fonts.load("500 12px " + mono), document.fonts.ready])` (fall back to resolved) before `G()` (sizing all canvases, starting cover dissolves, adding scroll/resize listeners).
- `scroll` listener (passive) → rAF → `update(innerHeight)` on seams + ways graph.
- `resize` → only when `innerWidth` changed, debounce 120ms → resize everything.
- `prefers-reduced-motion: reduce` → `still` mode exactly as source (seams full, graph fully drawn, covers hidden, no decrypt/scramble, no ripples).
- Cleanup: abort listeners (AbortController), cancel rAFs, disconnect observers, clear timeouts, restore any mid-scramble text, destroy glyph fields. Guard every async continuation with a `disposed` flag.

## Code requirements
- TypeScript strict, **no `any`**, named exports only, 2-space indent. Descriptive names (no single letters except loop indices / math temporaries).
- Non-null assertions are fine where the source assumes elements exist, but bail out gracefully (`return`) if `#ways` / `#ask-deck` / `#mark` are missing.
- Do not touch any other file.
- Verify: `npx tsc --noEmit` passes.
