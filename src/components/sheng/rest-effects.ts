/**
 * Below-the-hero effects for the home page (everything inside `.rest`): seam
 * canvases, the scroll-drawn "ways" graph, the ask-band glyph field, the
 * footer wordmark, word decrypts, rises, hover scrambles and cover dissolves.
 *
 * Typed port of murphmaxxing.com webpack module 2110
 * (docs/research/source/rest.module.js). Algorithms and numeric constants match
 * the source. Differences: black & white palette, the Solaris plan is dropped, the ask form sends a real
 * note through `onSubmit` (with validation and a status line), and the footer wordmark
 * text is configurable and also fitted to its height.
 */

export interface ContactNote {
  message: string;
  email: string;
}

export interface RestEffectsOptions {
  /**
   * Sends the ask card's note. Resolves with the status line to show under the card (e.g. "Sent."),
   * rejects with an Error whose message is shown instead. Only needed on pages with the ask card.
   */
  onSubmit?: (note: ContactNote) => Promise<string>;
  /** Footer #mark wordmark lines. `wide` when the canvas is >= 760px wide, `narrow` otherwise. Source: ["murphmaxxing"] / ["murph","maxxing"]. */
  markText: { wide: readonly string[]; narrow: readonly string[] };
}

type MarkText = RestEffectsOptions["markText"];
type Rgb = readonly [number, number, number];

/** Noise characters for scrambles, seam fringes and cover glyphs. */
const NOISE = ".:/{}<>=#";
/** Glyph atlas columns: index 0 is blank, 1-9 grow denser. */
const GLYPHS = " .:/{}<>=#";
const INK = "#000000";
const LIT = "#2CA942"; // MailZoo green: cover-dissolve edge glyphs
/** Resting glyph colour on the project covers (source "#34604D"). */
const COVER_GLYPH = "#2A6A3A";

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Deterministic pseudo-random value in [0, 1) for a cell (classic sin hash). */
const hash2 = (x: number, y: number): number => {
  const value = 43758.5453 * Math.sin(127.1 * x + 311.7 * y);
  return value - Math.floor(value);
};

/** Replaces every non-space character with a random noise character. */
const scrambleNoise = (text: string): string => {
  let out = "";
  for (const char of text) out += char === " " ? " " : NOISE[Math.floor(Math.random() * NOISE.length)];
  return out;
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => [
  Math.round(from[0] + (to[0] - from[0]) * amount),
  Math.round(from[1] + (to[1] - from[1]) * amount),
  Math.round(from[2] + (to[2] - from[2]) * amount),
];

const rgb = (color: Rgb): string => `rgb(${color[0]},${color[1]},${color[2]})`;

/** `count` CSS colours stepping evenly from `dark` (tone 0) to `light` (last tone). */
const tonePalette = (dark: Rgb, light: Rgb, count: number): string[] => {
  const tones: string[] = [];
  for (let i = 0; i < count; i++) tones.push(rgb(mixRgb(dark, light, i / (count - 1))));
  return tones;
};

interface SizedCanvas {
  ctx: CanvasRenderingContext2D;
  /** CSS pixels */
  width: number;
  height: number;
  dpr: number;
}

/** Matches the backing store to the CSS size (dpr capped at 2) and scales the context to CSS pixels. */
function sizeCanvas(canvas: HTMLCanvasElement): SizedCanvas {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height, dpr };
}

interface GlyphAtlas {
  canvas: HTMLCanvasElement;
  /** Device-pixel size of one sprite */
  spriteWidth: number;
  spriteHeight: number;
}

/** Pre-renders every glyph (columns) in every tone (rows) so cells can be blitted with drawImage. */
function buildGlyphAtlas(
  cellWidth: number,
  cellHeight: number,
  tones: readonly string[],
  dpr: number,
  mono: string,
): GlyphAtlas {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(cellWidth * dpr) * GLYPHS.length;
  canvas.height = Math.ceil(cellHeight * dpr) * tones.length;
  const ctx = canvas.getContext("2d")!;
  const spriteWidth = canvas.width / GLYPHS.length;
  const spriteHeight = canvas.height / tones.length;
  ctx.font = `500 ${Math.round(0.92 * cellHeight * dpr)}px ${mono}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  tones.forEach((tone, row) => {
    ctx.fillStyle = tone;
    for (let glyph = 1; glyph < GLYPHS.length; glyph++) {
      ctx.fillText(GLYPHS[glyph], (glyph + 0.5) * spriteWidth, (row + 0.54) * spriteHeight);
    }
  });
  return { canvas, spriteWidth, spriteHeight };
}

/** Anything repainted from the scroll position. */
interface ScrollEffect {
  size(): void;
  update(viewportHeight: number): void;
}

/**
 * A `.seam` canvas overlapping the bottom of the previous section: blocks of the
 * next section's colour (`data-seam`) rise from the bottom as it scrolls into view,
 * with a fringe of noise glyphs along the ragged edge.
 */
class SeamCanvas implements ScrollEffect {
  private readonly canvas: HTMLCanvasElement;
  private readonly mono: string;
  private readonly still: boolean;
  private readonly color: string;
  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private cell = 16;
  private cols = 0;
  private rows = 0;
  private lastProgress = -1;

  constructor(canvas: HTMLCanvasElement, mono: string, still: boolean) {
    this.canvas = canvas;
    this.mono = mono;
    this.still = still;
    // A missing data-seam leaves the context's default fill (#000000), as in the source.
    this.color = canvas.dataset.seam ?? INK;
  }

  size(): void {
    const { ctx, width, height } = sizeCanvas(this.canvas);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.cell = width < 760 ? 12 : 16;
    this.cols = Math.ceil(width / this.cell);
    this.rows = Math.ceil(height / this.cell);
    this.lastProgress = -1;
  }

  update(viewportHeight: number): void {
    const { ctx } = this;
    if (!ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    // 0 while the seam's bottom is 40px or more below the fold, 1 once it has risen another 60% of the viewport.
    const progress = this.still ? 1 : clamp((viewportHeight - rect.bottom + 40) / (0.6 * viewportHeight));
    if (rect.top > viewportHeight || rect.bottom < 0 || Math.abs(progress - this.lastProgress) < 0.002) return;
    this.lastProgress = progress;
    const { cols, rows, cell, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = this.color;
    ctx.font = `500 ${cell - 3}px ${this.mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let row = 0; row < rows; row++) {
      // ~0 on the bottom row, ~1 on the top row
      const fromBottom = (rows - row - 0.5) / rows;
      for (let col = 0; col < cols; col++) {
        const wave = 0.16 * Math.sin(0.11 * col + 1.3) + 0.1 * Math.sin(0.31 * col);
        // Coverage climbs from the bottom; the hash makes the edge ragged, the wave makes it undulate.
        const coverage = 0.04 + 0.96 * progress - (0.86 * fromBottom + 0.44 * hash2(col, row) + wave * fromBottom);
        if (coverage < 0) continue;
        const x = col * cell;
        const y = row * cell;
        if (coverage > 0.1) {
          ctx.fillRect(x, y, cell, cell + 0.5);
        } else {
          ctx.fillText(NOISE[Math.floor(hash2(col + 3, row) * NOISE.length)], x + cell / 2, y + cell / 2);
        }
      }
    }
  }
}

/**
 * `#ways`: two SVG lines (pathLength="1") drawn in by scroll. Line B runs down column B
 * to the last ship; line A runs down column A, then curves into column B at `#merge-at`.
 * Ships light up (`.on`) as the line passes them.
 */
class WaysGraph implements ScrollEffect {
  private readonly root: HTMLElement;
  private readonly still: boolean;
  private readonly columnA: HTMLElement;
  private readonly columnB: HTMLElement;
  private readonly ships: HTMLLIElement[];
  private readonly lineA: SVGPathElement;
  private readonly lineB: SVGPathElement;
  private readonly baseA: SVGPathElement;
  private readonly baseB: SVGPathElement;
  /** Both lines start this far below the top of #ways. */
  private readonly lineTop = 14;
  private lineEnd = 0;
  /** y of each ship's dot, relative to #ways */
  private marks: number[] = [];
  /** Fraction of line B's length at which line A meets it */
  private mergeFraction = 0;

  constructor(root: HTMLElement, still: boolean) {
    this.root = root;
    this.still = still;
    this.columnA = root.querySelector<HTMLElement>("#way-a")!;
    this.columnB = root.querySelector<HTMLElement>("#way-b")!;
    this.ships = [...root.querySelectorAll<HTMLLIElement>("#ships li")];
    this.lineA = root.querySelector<SVGPathElement>("#g-a")!;
    this.lineB = root.querySelector<SVGPathElement>("#g-b")!;
    this.baseA = root.querySelector<SVGPathElement>("#g-base-a")!;
    this.baseB = root.querySelector<SVGPathElement>("#g-base-b")!;
  }

  size(): void {
    const rootRect = this.root.getBoundingClientRect();
    const rectA = this.columnA.getBoundingClientRect();
    const rectB = this.columnB.getBoundingClientRect();
    // A ship's dot sits 12px below the top of its content box.
    const markOf = (item: HTMLElement): number =>
      item.getBoundingClientRect().top - rootRect.top + parseFloat(getComputedStyle(item).paddingTop) + 12;
    // Stacked single-column layout (<=760px): line A has nowhere to merge from.
    const sameColumn = Math.abs(rectA.left - rectB.left) < 4;
    const xA = rectA.left - rootRect.left + 1;
    const xB = rectB.left - rootRect.left + 1;
    const end = markOf(this.ships[this.ships.length - 1]);
    this.marks = this.ships.map(markOf);
    this.lineEnd = end;
    const mergeY = this.root.querySelector("#merge-at")!.getBoundingClientRect().top - rootRect.top;
    const bottomA = rectA.bottom - rootRect.top + 8;
    const top = this.lineTop;
    const pathA = sameColumn ? "" : `M${xA} ${top}V${bottomA}C${xA} ${mergeY},${xB} ${bottomA + 6},${xB} ${mergeY + 8}`;
    const pathB = `M${xB} ${top}V${end}`;
    this.lineA.setAttribute("d", pathA);
    this.baseA.setAttribute("d", pathA);
    this.lineB.setAttribute("d", pathB);
    this.baseB.setAttribute("d", pathB);
    this.mergeFraction = sameColumn ? 0 : (mergeY - top) / (end - top);
  }

  update(viewportHeight: number): void {
    const rect = this.root.getBoundingClientRect();
    if (rect.top > viewportHeight || rect.bottom < -100) return;
    // The "pen" sits at 62% of the viewport height, in #ways coordinates.
    const reach = this.still ? 1e6 : 0.62 * viewportHeight - rect.top;
    const progress = clamp((reach - this.lineTop) / (this.lineEnd - this.lineTop));
    // pathLength="1" + dasharray 1: dashoffset 1 -> 0 draws a line in. Line A finishes at the merge point.
    this.lineB.style.strokeDashoffset = String(1 - progress);
    this.lineA.style.strokeDashoffset = String(1 - clamp(progress / Math.max(this.mergeFraction, 0.01)));
    this.ships.forEach((ship, index) => ship.classList.toggle("on", reach >= this.marks[index] - 4));
  }
}

interface Ripple {
  /** Centre in canvas CSS pixels */
  x: number;
  y: number;
  power: number;
  start: number;
}

/** Fills in a field's grid (cell size, tones, atlas, resting levels) for its current size. */
type GlyphFieldBuilder = (field: GlyphField) => void;

/**
 * A canvas of glyph cells with a resting pattern (`base`, from the builder) that
 * brightens near the pointer and under expanding ripple rings. Only animates
 * (rAF) while something is moving.
 */
class GlyphField {
  readonly canvas: HTMLCanvasElement;
  readonly mono: string;
  private readonly build: GlyphFieldBuilder;
  private readonly still: boolean;
  private ctx: CanvasRenderingContext2D | null = null;
  private ripples: Ripple[] = [];
  private pointerX = -1e4;
  private pointerY = -1e4;
  /** Eased 0..1 presence of the pointer over the tracked element */
  private nearness = 0;
  private frameId = 0;
  private pointerMoved = false;
  private revealing = false;
  private revealStart = 0;
  private destroyed = false;

  // Grid state. size() sets width/height/dpr; the builder sets the rest.
  width = 0;
  height = 0;
  dpr = 1;
  cols = 0;
  rows = 0;
  cellWidth = 8;
  cellHeight = 12;
  toneCount = 8;
  /** Tone a level-9 cell reaches at rest, as a fraction of the tone range */
  restMax = 0.5;
  /** Resting glyph level per cell, 0-9 (0 = empty) */
  base = new Uint8Array(0);
  atlas: GlyphAtlas | null = null;

  constructor(canvas: HTMLCanvasElement, mono: string, build: GlyphFieldBuilder, still: boolean) {
    this.canvas = canvas;
    this.mono = mono;
    this.build = build;
    this.still = still;
  }

  size(): void {
    const { ctx, width, height, dpr } = sizeCanvas(this.canvas);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.build(this);
    // The source only repaints here. Also restart the loop for a reveal or ripple
    // that began before the first size() (wake() is a no-op until then).
    if (this.paint(performance.now()) || this.ripples.length > 0) this.wake();
  }

  ripple(x: number, y: number, power = 1): void {
    if (this.still) return;
    this.ripples.push({ x, y, power, start: performance.now() });
    this.wake();
  }

  wake(): void {
    if (this.frameId || this.still || this.destroyed || !this.ctx) return;
    this.frameId = requestAnimationFrame(this.frame);
  }

  /** Left-to-right reveal over 1100ms. */
  show(): void {
    if (this.still) return;
    this.revealing = true;
    this.revealStart = performance.now();
    this.wake();
  }

  track(target: HTMLElement, signal: AbortSignal): void {
    target.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") return;
        const rect = this.canvas.getBoundingClientRect();
        this.pointerX = event.clientX - rect.left;
        this.pointerY = event.clientY - rect.top;
        this.pointerMoved = true;
        this.wake();
      },
      { signal },
    );
    target.addEventListener(
      "pointerleave",
      () => {
        this.pointerX = -1e4;
        this.pointerY = -1e4;
        this.wake();
      },
      { signal },
    );
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  private readonly frame = (now: number): void => {
    this.frameId = 0;
    this.ripples = this.ripples.filter((ripple) => now - ripple.start < 1700);
    const nearTarget = this.pointerX > -1e3 ? 1 : 0;
    const moved = this.pointerMoved;
    this.pointerMoved = false;
    if (this.paint(now) || moved || this.ripples.length > 0 || Math.abs(nearTarget - this.nearness) > 0.01) {
      this.wake();
    }
  };

  /** Eased reveal progress; overshoots to 1.02 so the ragged edge fully clears. */
  private revealProgress(now: number): number {
    const t = clamp((now - this.revealStart) / 1100);
    if (t >= 1) this.revealing = false;
    return 1.02 * easeOutCubic(t);
  }

  /** Draws one frame; returns true while a reveal is still in progress. */
  private paint(now: number): boolean {
    const { ctx, atlas } = this;
    if (!ctx || !atlas) return false;
    const { width, height, cols, rows, cellWidth, cellHeight, base } = this;
    const maxTone = this.toneCount - 1;
    ctx.clearRect(0, 0, width, height);
    this.nearness += ((this.pointerX > -1e3 ? 1 : 0) - this.nearness) * 0.14;
    const reveal = this.revealing ? this.revealProgress(now) : 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const level = base[row * cols + col];
        const x = col * cellWidth;
        const y = row * cellHeight;
        // Reveal sweeps left to right with a hashed, ragged edge.
        if (reveal < 1 && 0.3 * hash2(col, row) + (col / cols) * 0.7 > reveal) continue;
        let boost = 0;
        if (this.nearness > 0.01) {
          const distance = Math.hypot(x - this.pointerX, y - this.pointerY);
          if (distance < 150) boost += (1 - distance / 150) ** 2 * 0.7 * this.nearness;
        }
        for (const ripple of this.ripples) {
          const age = (now - ripple.start) / 1700;
          // Distance from the expanding ring (radius grows max(width, 1200)px per lifetime), in 90px units.
          const ring = (Math.hypot(x - ripple.x, y - ripple.y) - age * Math.max(width, 1200)) / 90;
          if (ring > -2 && ring < 2) boost += Math.exp(-ring * ring * 2) * (1 - age) * ripple.power;
        }
        if (!level && boost < 0.08) continue;
        const tone = Math.min(maxTone, Math.round(((level / 9) * this.restMax + boost) * maxTone));
        // Empty cells lit by the pointer or a ripple get a stable pseudo-random glyph.
        const glyph = level || 1 + Math.floor(9 * hash2(col, row));
        ctx.drawImage(
          atlas.canvas,
          glyph * atlas.spriteWidth,
          tone * atlas.spriteHeight,
          atlas.spriteWidth,
          atlas.spriteHeight,
          x,
          y,
          cellWidth,
          cellHeight,
        );
      }
    }
    return reveal < 1;
  }
}

/** `#ask-field`: layered-sine terrain, ramped in from the left and faded at the top and bottom. */
function buildAskField(field: GlyphField): void {
  field.cellWidth = field.width < 760 ? 7 : 8.4;
  field.cellHeight = 1.6 * field.cellWidth;
  field.cols = Math.ceil(field.width / field.cellWidth);
  field.rows = Math.ceil(field.height / field.cellHeight);
  field.toneCount = 8;
  field.restMax = 0.42;
  const tones = tonePalette([34, 84, 46], [140, 214, 152], field.toneCount); // dark → light MailZoo green
  field.atlas = buildGlyphAtlas(field.cellWidth, field.cellHeight, tones, field.dpr, field.mono);
  field.base = new Uint8Array(field.cols * field.rows);
  for (let row = 0; row < field.rows; row++) {
    for (let col = 0; col < field.cols; col++) {
      // Normalised cell position
      const u = col / field.cols;
      const v = row / field.rows;
      const terrain = Math.sin(7 * u + 3 * v + 0.8) + 0.5 * Math.sin(15 * u - 5 * v) + 0.5 * Math.sin(11 * v + 4 * u);
      // Ramps in over 4%-54% of the width; fades over the top 22% and the bottom 18%.
      const mask = clamp((u - 0.04) / 0.5) * clamp(v / 0.22) * clamp((1 - v) / 0.18);
      field.base[row * field.cols + col] = Math.min(9, Math.floor(10 * clamp((terrain + 1.6) / 3.2) * mask));
    }
  }
}

/**
 * `#head-code`: the subpage header's glyph terrain (source `y`). The pattern is seeded by the page path so
 * every page gets its own; masked to the right half and top on desktop, to the bottom band on phones.
 */
function buildHeadCode(field: GlyphField): void {
  const narrow = field.width < 760;
  field.cellWidth = narrow ? 7 : 8.4;
  field.cellHeight = 1.6 * field.cellWidth;
  field.cols = Math.ceil(field.width / field.cellWidth);
  field.rows = Math.ceil(field.height / field.cellHeight);
  field.toneCount = 8;
  field.restMax = 0.5;
  const tones = tonePalette([28, 76, 40], [200, 235, 206], field.toneCount);
  field.atlas = buildGlyphAtlas(field.cellWidth, field.cellHeight, tones, field.dpr, field.mono);
  const seed = [...location.pathname].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 97;
  field.base = new Uint8Array(field.cols * field.rows);
  for (let row = 0; row < field.rows; row++) {
    for (let col = 0; col < field.cols; col++) {
      const u = col / field.cols;
      const v = row / field.rows;
      const terrain =
        Math.sin(7 * u + 3 * v + seed) + 0.5 * Math.sin(15 * u - 5 * v + 2 * seed) + 0.5 * Math.sin(11 * v + 4 * u + 3 * seed);
      const mask = narrow ? clamp((v - 0.7) / 0.2) : clamp((u - 0.5) / 0.36) * clamp(v / 0.2);
      field.base[row * field.cols + col] = Math.min(9, Math.floor(10 * clamp((terrain + 1.6) / 3.2) * mask));
    }
  }
}

/**
 * `#mark`: the wordmark is rasterised into a one-pixel-per-cell alpha mask and
 * covered cells get dense glyphs (levels 5-9).
 */
function buildMark(field: GlyphField, markText: MarkText): void {
  const narrow = field.width < 760;
  field.cellWidth = narrow ? 3 : 4.2;
  field.cellHeight = 1.6 * field.cellWidth;
  field.cols = Math.ceil(field.width / field.cellWidth);
  field.rows = Math.ceil(field.height / field.cellHeight);
  field.toneCount = 8;
  field.restMax = 0.8;
  const tones = tonePalette([28, 76, 40], [245, 242, 234], field.toneCount); // green → cream, like the source's mark
  field.atlas = buildGlyphAtlas(field.cellWidth, field.cellHeight, tones, field.dpr, field.mono);
  field.base = new Uint8Array(field.cols * field.rows);
  // getImageData throws on an empty rect (e.g. a hidden canvas).
  if (field.cols === 0 || field.rows === 0) return;

  const mask = document.createElement("canvas");
  mask.width = field.cols;
  mask.height = field.rows;
  const maskCtx = mask.getContext("2d", { willReadFrequently: true })!;
  const lines = narrow ? markText.narrow : markText.wide;
  // Cells are 1.6x taller than wide, so the text is squashed vertically to keep its proportions on screen.
  const aspect = field.cellWidth / field.cellHeight;
  const setLetterSpacing = (fontSize: number): void => {
    if ("letterSpacing" in maskCtx) maskCtx.letterSpacing = `${-0.03 * fontSize}px`;
  };

  // Measure at 100px (alphabetic baseline) with the same letter spacing.
  maskCtx.font = `500 100px ${field.mono}`;
  setLetterSpacing(100);
  const metrics = lines.map((line) => maskCtx.measureText(line));
  const ascent = Math.max(...metrics.map((metric) => metric.actualBoundingBoxAscent));
  const descent = Math.max(...metrics.map((metric) => metric.actualBoundingBoxDescent));
  // The widest line spans 96% of the columns (source), capped so each line's ink box
  // fills at most 90% of its band's height (keeps descenders from clipping).
  const widthFit = (96 * field.cols) / Math.max(...metrics.map((metric) => metric.width));
  const heightFit = (100 * (field.rows / lines.length) * 0.9) / ((ascent + descent) * aspect);
  const fontSize = Math.min(widthFit, heightFit);

  maskCtx.font = `500 ${fontSize}px ${field.mono}`;
  setLetterSpacing(fontSize);
  maskCtx.textBaseline = "alphabetic";
  maskCtx.lineJoin = "round";
  maskCtx.lineWidth = 0.012 * fontSize;
  maskCtx.fillStyle = "#fff";
  maskCtx.strokeStyle = "#fff";
  maskCtx.setTransform(1, 0, 0, aspect, 0, 0);
  lines.forEach((line, i) => {
    // Baseline that centres the ink box (not the em box) in this line's band, in pre-squash units.
    const y = (field.rows * (i + 0.5)) / lines.length / aspect + (((ascent - descent) / 2) * fontSize) / 100;
    maskCtx.fillText(line, 0.01 * field.cols, y);
    maskCtx.strokeText(line, 0.01 * field.cols, y);
  });

  const pixels = maskCtx.getImageData(0, 0, field.cols, field.rows).data;
  for (let i = 0; i < field.base.length; i++) {
    const col = i % field.cols;
    const row = (i - col) / field.cols;
    if (pixels[4 * i + 3] / 255 > 0.42) field.base[i] = 5 + Math.floor(5 * hash2(col, row));
  }
}

interface ScrambleState {
  text: string;
  duration: number;
  /** Show noise (instead of the current text) before the start time */
  hide: boolean;
  start: number;
}

/** Wires every below-the-hero effect inside `root` (the `.rest` element). Returns a cleanup function. */
export function initRestEffects(root: HTMLElement, mono: string, options: RestEffectsOptions): () => void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const controller = new AbortController();
  const { signal } = controller;
  const observers = new Set<IntersectionObserver>();
  const timeouts = new Set<number>();
  const coverFrames = new Map<HTMLCanvasElement, number>();
  let disposed = false;

  /** setTimeout that is cleared on cleanup. */
  const later = (callback: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      if (!disposed) callback();
    }, delay);
    timeouts.add(id);
    return id;
  };

  /** Runs `callback` once, the first time `target` enters the viewport (immediately under reduced motion). */
  const onEnter = (target: Element, callback: () => void, rootMargin = "0px 0px -14% 0px"): void => {
    if (reducedMotion) {
      callback();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed || !entries[0].isIntersecting) return;
        observer.disconnect();
        observers.delete(observer);
        callback();
      },
      { rootMargin },
    );
    observers.add(observer);
    observer.observe(target);
  };

  // Text scrambles: noise resolving left to right into the real text.
  const scrambles = new Map<Element, ScrambleState>();
  let scrambleFrame = 0;
  const tickScrambles = (now: number): void => {
    scrambleFrame = 0;
    if (disposed) return;
    for (const [element, state] of scrambles) {
      const progress = clamp((now - state.start) / state.duration);
      if (progress >= 1) {
        element.textContent = state.text;
        scrambles.delete(element);
        continue;
      }
      if (now < state.start) {
        if (state.hide) element.textContent = scrambleNoise(state.text);
        continue;
      }
      const resolved = Math.floor(easeOutCubic(progress) * state.text.length);
      element.textContent = state.text.slice(0, resolved) + scrambleNoise(state.text.slice(resolved));
    }
    if (scrambles.size > 0) scrambleFrame = requestAnimationFrame(tickScrambles);
  };
  const scramble = (element: Element, text: string, delay: number, duration: number, hide = false): void => {
    if (reducedMotion || disposed) return;
    scrambles.set(element, { text, duration, hide, start: performance.now() + delay });
    if (!scrambleFrame) scrambleFrame = requestAnimationFrame(tickScrambles);
  };
  /** Each word decrypts over 240ms + 26ms per character, 70ms after the previous one; noise until its turn. */
  const decryptWords = (words: readonly Element[], firstDelay: number): void => {
    let delay = firstDelay;
    for (const word of words) {
      const text = word.textContent ?? "";
      scramble(word, text, delay, 240 + 26 * text.length, true);
      delay += 70;
    }
  };

  for (const block of root.querySelectorAll("[data-decrypt]")) {
    const words = [...block.querySelectorAll(".word")];
    onEnter(block, () => decryptWords(words, 0));
  }
  // Subpage headings: words decrypt straight away (the CSS keeps them hidden until .go).
  for (const head of root.querySelectorAll("[data-head]")) {
    head.classList.add("go");
    decryptWords([...head.querySelectorAll(".word")], 120);
  }
  for (const element of root.querySelectorAll("[data-rise]")) {
    onEnter(element, () => element.classList.add("in"));
  }
  for (const trigger of root.querySelectorAll("[data-scramble]")) {
    const label = trigger.querySelector("[data-label]");
    if (!label) continue;
    const text = label.textContent ?? "";
    trigger.addEventListener("mouseenter", () => scramble(label, text, 0, 300), { signal });
  }

  const scrollEffects: ScrollEffect[] = [...root.querySelectorAll<HTMLCanvasElement>(".seam")].map(
    (canvas) => new SeamCanvas(canvas, mono, reducedMotion),
  );
  const ways = root.querySelector<HTMLElement>("#ways");
  if (ways) scrollEffects.push(new WaysGraph(ways, reducedMotion));

  const createField = (selector: string, build: GlyphFieldBuilder): GlyphField | null => {
    const canvas = root.querySelector<HTMLCanvasElement>(selector);
    return canvas ? new GlyphField(canvas, mono, build, reducedMotion) : null;
  };
  const askField = createField("#ask-field", buildAskField);
  const mark = createField("#mark", (field) => buildMark(field, options.markText));
  const headCode = createField("#head-code", buildHeadCode);
  const fields = [askField, mark, headCode].filter((field): field is GlyphField => field !== null);

  let scrollFrame = 0;
  const onScroll = (): void => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (disposed) return;
      const viewportHeight = window.innerHeight;
      for (const effect of scrollEffects) effect.update(viewportHeight);
    });
  };
  const resizeAll = (): void => {
    for (const effect of scrollEffects) effect.size();
    for (const field of fields) field.size();
    onScroll();
  };

  const askSection = root.querySelector<HTMLElement>("#ask");
  if (askField && askSection) askField.track(askSection, signal);
  if (mark) {
    const footer = root.querySelector<HTMLElement>("#end");
    if (footer) mark.track(footer, signal);
    onEnter(mark.canvas, () => mark.show(), "0px");
  }
  if (headCode?.canvas.parentElement) headCode.track(headCode.canvas.parentElement, signal);

  const deck = root.querySelector<HTMLElement>("#ask-deck");
  if (deck && askField) {
    /** Ripple centred on the card, in ask-field canvas coordinates. */
    const rippleFromDeck = (power: number): void => {
      const deckRect = deck.getBoundingClientRect();
      const fieldRect = askField.canvas.getBoundingClientRect();
      askField.ripple(
        deckRect.left + deckRect.width / 2 - fieldRect.left,
        deckRect.top + deckRect.height / 2 - fieldRect.top,
        power,
      );
    };
    onEnter(
      deck,
      () => {
        deck.classList.add("in");
        later(() => rippleFromDeck(0.9), 460);
      },
      "0px 0px -24% 0px",
    );

    const idea = root.querySelector<HTMLTextAreaElement>("#ask-idea");
    const email = root.querySelector<HTMLInputElement>("#ask-email");
    const note = root.querySelector<HTMLElement>("#ask-note");
    const form = root.querySelector<HTMLFormElement>("#ask-form");
    const button = form?.querySelector<HTMLButtonElement>("button[type=submit]") ?? null;
    if (idea && email && note && form) {
      const restingNote = note.textContent ?? "";
      let lastInputRipple = 0;
      let resetTimer = 0;
      let sending = false;
      const showNote = (text: string, holdMs: number): void => {
        note.textContent = text;
        window.clearTimeout(resetTimer);
        timeouts.delete(resetTimer);
        resetTimer = later(() => {
          note.textContent = restingNote;
        }, holdMs);
      };
      idea.addEventListener(
        "input",
        () => {
          // At most one typing ripple per 120ms
          const now = performance.now();
          if (now - lastInputRipple < 120) return;
          lastInputRipple = now;
          rippleFromDeck(0.5);
        },
        { signal },
      );
      form.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();
          if (sending) return;
          const message = idea.value.trim();
          const address = email.value.trim();
          if (!message) {
            showNote("Write a few words first.", 3200);
            idea.focus();
            return;
          }
          if (!email.checkValidity() || !address) {
            showNote("Add your email so I can reply.", 3200);
            email.focus();
            return;
          }
          if (!options.onSubmit) return;
          rippleFromDeck(1.1);
          sending = true;
          if (button) button.disabled = true;
          showNote("Sending…", 20000);
          options
            .onSubmit({ message, email: address })
            .then(
              (status) => {
                if (disposed) return;
                idea.value = "";
                email.value = "";
                showNote(status, 9000);
              },
              (error: unknown) => {
                if (disposed) return;
                showNote(error instanceof Error ? error.message : "That didn't go through. Try again.", 6000);
              },
            )
            .finally(() => {
              sending = false;
              if (button) button.disabled = false;
            });
        },
        { signal },
      );
    }
  } else if (askField) {
    onEnter(askField.canvas, () => askField.show());
  }

  const covers = [...root.querySelectorAll<HTMLCanvasElement>(".cover canvas")];
  /** Paints a cover solid (ink blocks, sparse glyphs), then dissolves it over 760ms once it enters view. */
  const dissolveCover = (canvas: HTMLCanvasElement, delay: number): void => {
    if (reducedMotion) {
      canvas.hidden = true;
      return;
    }
    const { ctx, width, height } = sizeCanvas(canvas);
    const cell = width > 400 ? 12 : 7;
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const draw = (threshold: number): void => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${cell}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Highest on the left: as the threshold rises, cells clear from the right edge inward.
          const value = 0.4 * hash2(col, row) + (1 - col / cols) * 0.6;
          if (value < threshold) continue;
          ctx.fillStyle = INK;
          ctx.fillRect(col * cell, row * cell, cell, cell);
          if (hash2(row, col) < 0.5) {
            // Cells about to clear show a lit glyph.
            ctx.fillStyle = value - threshold < 0.12 ? LIT : COVER_GLYPH;
            ctx.fillText(
              NOISE[Math.floor(hash2(col + 5, row) * NOISE.length)],
              col * cell + cell / 2,
              row * cell + cell / 2,
            );
          }
        }
      }
    };
    draw(0);
    onEnter(canvas, () => {
      const startAt = performance.now() + delay;
      const step = (now: number): void => {
        coverFrames.delete(canvas);
        if (disposed) return;
        const progress = clamp((now - startAt) / 760);
        draw(1.02 * easeOutCubic(progress));
        if (progress < 1) coverFrames.set(canvas, requestAnimationFrame(step));
        else canvas.hidden = true;
      };
      coverFrames.set(canvas, requestAnimationFrame(step));
    });
  };

  const start = (): void => {
    if (disposed) return;
    resizeAll();
    headCode?.show();
    covers.forEach((canvas, index) => dissolveCover(canvas, index < 5 ? 70 * index : 0));
    window.addEventListener("scroll", onScroll, { passive: true, signal });
    let lastWidth = window.innerWidth;
    let resizeTimer = 0;
    window.addEventListener(
      "resize",
      () => {
        // Height-only resizes (mobile toolbars) are ignored.
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        window.clearTimeout(resizeTimer);
        timeouts.delete(resizeTimer);
        resizeTimer = later(resizeAll, 120);
      },
      { signal },
    );
  };

  // Canvas glyphs need the mono face; size and paint only once it has loaded (or failed to).
  const fontsReady: Promise<unknown> = document.fonts
    ? Promise.all([document.fonts.load(`500 12px ${mono}`), document.fonts.ready])
    : Promise.resolve();
  void fontsReady.then(start, start);

  return () => {
    disposed = true;
    controller.abort();
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(scrambleFrame);
    for (const frame of coverFrames.values()) cancelAnimationFrame(frame);
    coverFrames.clear();
    for (const observer of observers) observer.disconnect();
    observers.clear();
    for (const id of timeouts) window.clearTimeout(id);
    timeouts.clear();
    // Leave no element stuck mid-scramble.
    for (const [element, state] of scrambles) element.textContent = state.text;
    scrambles.clear();
    for (const field of fields) field.destroy();
  };
}
