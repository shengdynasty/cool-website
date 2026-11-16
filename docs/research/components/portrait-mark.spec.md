# PortraitMark Specification

## Overview
- **Target file:** `src/components/sheng/PortraitMark.tsx` (`"use client"`)
- **Replaces:** the 5:1 "ultrastack" ASCII wordmark canvas at the top of the status section (`docs/design-references/02-ultrastack-desktop.jpg`).
- **Source of truth:** `UltraMark` (module `246`) in `/Users/shengyan/sheng-murph-clone/docs/research/source/page.pretty.js`, lines 20–245. Port it 1:1, renamed and typed, then apply the changes below. Same animation, different input: the person's portrait instead of a word.
- **Interaction model:** time-driven sweep-in on first view (IntersectionObserver gated), slow ambient colour waves, highlight wave on `pointerenter`.

## Props / markup
```tsx
export interface PortraitMarkProps {
  /** RGBA cutout: grey photo in RGB, Vision person mask in alpha. 900×600 (3:2). */
  src: string;            // "/home/portrait-cutout.webp"
  /** Plain B&W photo shown when JS is off. */
  fallbackSrc: string;    // "/home/portrait.webp"
  alt: string;
  /** CSS font-family string for JetBrains Mono. */
  mono: string;
}
export function PortraitMark({ src, fallbackSrc, alt, mono }: PortraitMarkProps) {
  // returns:
  // <div className="ultra ascii-portrait">
  //   <canvas ref={canvasRef} role="img" aria-label={alt} />
  //   <img className="ultra-plain" src={fallbackSrc} alt="" aria-hidden="true" width={1086} height={724} />
  // </div>
}
```
CSS already exists: `.ultra.ascii-portrait` is max-width 520px, `canvas { width:100%; aspect-ratio:3/2 }`, and `.ultra-plain` only shows under `html:not(.js)`. Use a plain `<img>` (eslint-disable `@next/next/no-img-element` on that line), not `next/image`.

## What changes vs. UltraMark
UltraMark's `R()` renders the text into an offscreen alpha mask twice (fill, and fill+stroke) and derives three per-cell layers:
`A` = fill alpha, `C` = max(0, stroke − fill) (outline ring), `L` = max(0, strokeFrom1–2RowsAbove − stroke) (drop shadow).

Replace only the mask source. Keep the cell metrics (`v = w < 400 ? 2.6 : 3.4`, `E = 1.6*v`, `cols = floor(w/v)`, `rows = floor(h/E)`), the static glyph layer `P`, and the whole frame function `j` (sweep 1700ms with ease-out cubic, ambient waves period 8.2s, pointerenter wave 1100ms, IO pause, reduced-motion still frame) exactly as they are.

New mask derivation in `R()`:
```ts
// draw the cutout stretched to one pixel per cell (cells are 1:1.6 so this keeps the photo's aspect)
off.width = cols; off.height = rows;
offCtx.drawImage(image, 0, 0, cols, rows);
const px = offCtx.getImageData(0, 0, cols, rows).data;
for (let t = 0; t < cols * rows; t++) {
  const a = px[4 * t + 3] / 255;           // person mask
  const y = px[4 * t] / 255;               // grey luminance
  fill[t] = a * (0.16 + 0.84 * smoothstep(0.06, 0.78, y));
}
// stroke = mask dilated by one cell (3×3 max), then
outline[t] = Math.max(0, stroke[t] - mask[t]);
shadow[t]  = Math.max(0, Math.max(stroke[t - cols] ?? 0, stroke[t - 2 * cols] ?? 0) - stroke[t]);
```
(`smoothstep(e0,e1,x)`: `t = clamp((x-e0)/(e1-e0)); t*t*(3-2t)`.) Use `fill` / `outline` / `shadow` wherever the source uses `A` / `C` / `L`, including when building the static glyph layer `P` (`alpha = min(1, A + .9C + .35L)`, skip `< .04`).

Delete the text-specific code (`e.length` split for narrow widths, `measureText`, `letterSpacing`, `fillText`/`strokeText` of the word).

## Colours (black & white)
| Source | Use | New value |
|---|---|---|
| `r` (pastel ramp, 6 stops) | fill cells | `[[0,[245,242,234]],[.25,[226,224,218]],[.5,[250,248,242]],[.75,[214,212,206]],[1,[245,242,234]]]` |
| `a` (rainbow, 8 stops) | outline cells | `[[0,[255,255,255]],[.5,[206,204,198]],[1,[255,255,255]]]` |
| `l = [44,24,118]`, `n = [74,44,170]` | shadow cells | `[34,34,34]`, `[64,64,64]` |
| `o = [255,255,255]` | white mix target | unchanged |
| `[120,110,190]` | fill tint | `[118,118,118]` |
| `"#fff"` | static glyph layer | `"#F5F2EA"` |

## Lifecycle
- On mount: load the image (`const img = new Image(); img.src = src; await img.decode()`), and wait for `document.fonts.ready`. Then `R()`, set the sweep start `k = performance.now() + 250`, and request a frame. Guard with a `disposed` flag.
- `IntersectionObserver` on the canvas sets `visible` and requests a frame when it becomes visible (source behaviour).
- `pointerenter` on the canvas → highlight wave, only after the sweep finished (source: `performance.now() - k < 1700` → ignore).
- `resize` (window) → `R()` then request a frame.
- Cleanup: set disposed, disconnect IO, cancel rAF, remove listeners.

## Responsive
- Desktop: 520px wide max → 3:2 canvas (≈153×64 cells).
- `< 400px` canvas width: smaller cells (2.6px) as in the source.
- ≤560px viewport: full column width (CSS handles it).

## Code requirements
- TypeScript strict, **no `any`**, named export `PortraitMark`, descriptive names, 2-space indent.
- `useEffect` deps: `[src, mono]`.
- Do not touch any other file.
- Verify: `npx tsc --noEmit` passes.
