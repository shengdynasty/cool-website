/**
 * Hero motion engine: a typed port of murphmaxxing.com's `HomeMotion` class (webpack module 6943),
 * recoloured black and white and parameterised for a different photo.
 *
 * What it drives inside `.hero`:
 * - title / status / price text scramble-in, caret, struck word
 * - the ASCII stage: `#hero-code` glyph field (pen outline of the figure, interior fill, clearing to the photo,
 *   then an 8.2s "breathing" loop with a flickering seam) and `#hero-art` (2x sprite over the figure)
 * - card tilt + sheen that follows the pointer, glyph glow under the pointer, "impact" ripple when the card lands
 * - typewriter placeholder cycling through examples, and the submit "vanish" before handing the idea off
 *
 * Grid data comes from `scripts/build-hero-grid.mjs` (same format as the source's paris-grid.json,
 * plus optional `c` = intro centre and `seam` = [top, bottom] seam positions).
 */
import type { HeroGrid } from "@/types/hero";

export interface HeroEngineOptions {
  /** CSS font-family for JetBrains Mono, used for every canvas glyph. */
  mono: string;
  /** URL of the grid JSON. Ignored when `grid` is given. */
  gridUrl?: string;
  /** The grid itself, for builds that can't fetch (the static artifact inlines it). */
  grid?: HeroGrid;
  /** Placeholder examples, typed out and deleted in a loop. */
  examples: readonly string[];
  /** Text shown in the card note for 2600ms after a submit. */
  sentNote: string;
  /** Receives the trimmed idea after the vanish animation. */
  onIdeaSent: (idea: string) => void;
}

interface HeroState {
  /** In-flight scrambled text per data-t key. */
  t: Record<string, string>;
  idea: string;
  ph: string | null;
  sent: boolean;
  ready: boolean;
  booting: boolean;
  caret: boolean;
  struck: boolean;
}

interface ScrambleJob {
  start: number;
  dur: number;
  text: string;
}

interface Tilt {
  rx: number; ry: number; trx: number; try: number;
  lit: number; tlit: number;
  bx: number; by: number; tbx: number; tby: number;
}
type TiltKey = "rx" | "ry" | "lit" | "bx" | "by";

interface ArtCell {
  col: number;
  row: number;
  idx: number;
  edge: boolean;
  order: number;
}

interface BandCell {
  i: number;
  fx: number;
  edge: number;
  width: number;
}

interface TimedCell {
  i: number;
  d: number;
}

/** [cell, time to settle, glyph to settle on (0 = restore)] */
type Flash = [number, number, number];

const GLYPHS = " .:/{}<>=#";
const NOISE = ".:/{}<>=#";
const INK = "#000000";
const LIT = "#2CA942"; // MailZoo green: the pen outline flash
const LEVELS = 6;
const ART_MAX = 0.5;
const CYCLE = 8200;
const DEFAULT_SEAM: [number, number] = [0.405, 0.335];
const DEFAULT_CENTRE: [number, number] = [0.46, 0.47];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export class HeroEngine {
  private readonly root: HTMLElement;
  private readonly mono: string;
  private readonly gridUrl: string;
  private readonly inlineGrid: HeroGrid | null;
  private readonly examples: readonly string[];
  private readonly sentNote: string;
  private readonly onIdeaSent: (idea: string) => void;

  private state: HeroState = {
    t: {}, idea: "", ph: null, sent: false, ready: false, booting: true, caret: false, struck: false,
  };
  private readonly TEXT: Record<string, string> = {};
  private jobs: Record<string, ScrambleJob> = {};
  private readonly hovers: Record<string, () => void> = {};
  private readonly texts: HTMLElement[];

  private readonly canvas: HTMLCanvasElement;
  private readonly art: HTMLCanvasElement;
  private readonly deck: HTMLElement;
  private readonly goEl: HTMLElement;
  private readonly poster: HTMLElement;
  private readonly curtain: HTMLElement;
  private readonly caret: HTMLElement;
  /** The struck word ("(coding)" in the source). Optional: a plain title has none. */
  private readonly del: HTMLElement | null;
  /** The title line whose scramble finishing turns the caret on (the last one present). */
  private caretKey = "l2";
  private readonly field: HTMLInputElement;

  private grid: HeroGrid | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private brush: CanvasRenderingContext2D | null = null;
  private atlas: HTMLCanvasElement | null = null;
  private tiles: HTMLCanvasElement | null = null;

  private cols = 0;
  private rows = 0;
  private sizeW = 0;
  private cw = 0;
  private ch = 0;
  private tw = 0;
  private th = 0;
  private cx = 0;
  private cy = 0;
  private t0 = 0;
  private t1 = 0;
  private xs: number[] = [];
  private ys: number[] = [];

  private base = new Uint8Array(0);
  private fig = new Uint8Array(0);
  private near = new Uint8Array(0);
  private cur = new Uint8Array(0);
  private lvl = new Uint8Array(0);
  private rest = new Uint8Array(0);
  private luck = new Float32Array(0);
  private jit = new Float32Array(0);
  private far = new Float32Array(0);
  private deep = new Float32Array(0);
  private lung = new Float32Array(256);
  private band: BandCell[] = [];
  private arcs: number[][] = [];

  private artCells: ArtCell[] = [];
  private artLevel = new Uint8Array(0);
  private artOn = 0;

  private pen: { start: number; dur: number; n: [number, number] } | null = null;
  private fill: TimedCell[] = [];
  private queue: TimedCell[] = [];
  private fi = 0;
  private qi = 0;
  private flashes: Flash[] = [];
  private impact: { start: number; col: number; row: number } | null = null;
  private glow: { col: number; row: number; at: number } | null = null;
  private vanish: { start: number; dur: number; text: string } | null = null;

  private readonly tilt: Tilt = { rx: 0, ry: 0, trx: 0, try: 0, lit: 0, tlit: 0, bx: 0, by: 0, tbx: 0, tby: 0 };

  private visible = true;
  private focused = false;
  private lastText = 0;
  private lastBreath = 0;
  private phI = 0;
  private phN = 0;
  private phDir = 1;
  private phNext = 0;

  private raf = 0;
  private disposed = false;
  private io: IntersectionObserver | null = null;
  /** Latest pointer event, applied in the next frame so layout is read once per frame, not per event. */
  private pendingAim: PointerEvent | null = null;
  private deckPad: number | null = null;
  private ro: ResizeObserver | null = null;
  private readonly listeners = new AbortController();
  private readonly timers = new Set<number>();

  constructor(root: HTMLElement, options: HeroEngineOptions) {
    this.root = root;
    this.mono = options.mono;
    this.gridUrl = options.gridUrl ?? "";
    this.inlineGrid = options.grid ?? null;
    this.examples = options.examples.length ? options.examples : [""];
    this.sentNote = options.sentNote;
    this.onIdeaSent = options.onIdeaSent;

    const byId = <T extends HTMLElement>(id: string) => {
      const el = root.querySelector<T>(`#${id}`);
      if (!el) throw new Error(`HeroEngine: #${id} not found`);
      return el;
    };

    this.texts = [...root.querySelectorAll<HTMLElement>("[data-t]")];
    for (const el of this.texts) this.TEXT[el.dataset.t ?? ""] = el.textContent ?? "";

    this.canvas = byId<HTMLCanvasElement>("hero-code");
    this.art = byId<HTMLCanvasElement>("hero-art");
    this.deck = byId("hero-deck");
    this.goEl = byId("hero-go");
    this.poster = byId("hero-poster");
    this.curtain = byId("hero-curtain");
    this.caret = byId("hero-caret");
    this.del = root.querySelector<HTMLElement>("#hero-del");
    this.field = byId<HTMLInputElement>("idea-code");

    const opts = { signal: this.listeners.signal };
    root.addEventListener("pointermove", this.onMove, opts);
    root.addEventListener("pointerleave", this.onLeave, opts);
    byId("hero-form").addEventListener("submit", this.onSend, opts);
    this.field.addEventListener("input", this.onIdea, opts);
    this.field.addEventListener("focus", this.onFocus, opts);
    this.field.addEventListener("blur", this.onBlur, opts);
    byId("hero-replay").addEventListener("click", this.replay, opts);
    for (const el of root.querySelectorAll<HTMLElement>("[data-hover]")) {
      const key = el.dataset.t ?? el.dataset.key ?? "";
      el.addEventListener("mouseenter", this.hover(key, Number(el.dataset.hover)), opts);
    }
  }

  // ---------------------------------------------------------------- state + DOM

  private setState(patch: Partial<HeroState>) {
    Object.assign(this.state, patch);
    this.render();
  }

  private render() {
    const s = this.state;
    for (const el of this.texts) {
      const next = this.value(el.dataset.t ?? "");
      if (el.textContent !== next) el.textContent = next;
    }
    this.poster.style.opacity = s.ready ? "0" : "1";
    this.curtain.style.opacity = s.booting && !s.ready ? "1" : "0";
    this.caret.style.opacity = s.caret ? "1" : "0";
    this.del?.classList.toggle("on", s.struck);
    const placeholder = s.ph ?? this.examples[0];
    if (this.field.placeholder !== placeholder) this.field.placeholder = placeholder;
    if (this.field.value !== s.idea) this.field.value = s.idea;
  }

  private value(key: string) {
    if (key === "note" && this.state.sent) return this.sentNote;
    return this.state.t[key] ?? this.TEXT[key] ?? "";
  }

  private later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
    return id;
  }

  // ---------------------------------------------------------------- lifecycle

  start() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.setState({ booting: false, caret: true, struck: true });
      this.root.classList.add("on");
      return;
    }
    this.titles();
    this.stepText(performance.now());
    this.root.classList.add("on");
    this.phNext = performance.now() + 1700;
    this.later(() => this.setState({ booting: false }), 1500);
    this.later(() => this.land(), 1900);

    const fontsReady = document.fonts ? document.fonts.load(`500 12px ${this.mono}`) : Promise.resolve([]);
    const loadGrid = () =>
      (this.inlineGrid ? Promise.resolve(this.inlineGrid) : fetch(this.gridUrl).then((res) => res.json() as Promise<HeroGrid>))
        .then((grid) => {
          if (this.disposed) return;
          this.grid = grid;
          this.begin();
        })
        .catch(() => {});
    fontsReady.then(loadGrid, loadGrid);

    this.raf = requestAnimationFrame(this.frame);
    this.io = new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;
    });
    this.io.observe(this.canvas);
    this.ro = new ResizeObserver(() => this.resized());
    this.ro.observe(this.canvas);
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
    this.listeners.abort();
    this.io?.disconnect();
    this.ro?.disconnect();
    for (const el of this.texts) el.textContent = this.TEXT[el.dataset.t ?? ""] ?? "";
  }

  private titles() {
    this.setState({ caret: false, struck: false });
    // Source schedule for its four title pieces. Only the pieces present in the markup run, shifted so
    // the first one starts at 0 (a one-line title like "Sheng Yan" uses just "l2").
    const schedule: [string, number, number][] = [["l1a", 0, 240], ["l1b", 120, 340], ["l1c", 240, 520], ["l2", 460, 460]];
    const present = schedule.filter(([key]) => key in this.TEXT);
    const shift = present.length ? present[0][1] : 0;
    for (const [key, delay, dur] of present) this.scramble(key, delay - shift, dur);
    this.caretKey = present.length ? present[present.length - 1][0] : "l2";
    this.scramble("reply", 1040, 420);
    this.scramble("videos", 1120, 360);
    this.scramble("followers", 1200, 360);
    this.scramble("guides", 1280, 360);
    this.scramble("price", 1760, 360);
    if (this.del) this.later(() => this.setState({ struck: true }), 1260);
  }

  private scramble(key: string, delay: number, dur: number) {
    this.jobs[key] = { start: performance.now() + delay, dur, text: this.TEXT[key] ?? "" };
  }

  private noise(text: string) {
    let out = "";
    for (let i = 0; i < text.length; i++) out += text[i] === " " ? " " : NOISE[Math.floor(Math.random() * NOISE.length)];
    return out;
  }

  // ---------------------------------------------------------------- grid setup

  /** Two-pass chamfer distance transform (cell rows are 1.58x taller than columns are wide). */
  private chamfer(mask: Uint8Array) {
    const { cols, rows } = this;
    const n = cols * rows;
    const dist = new Float32Array(n);
    for (let i = 0; i < n; i++) dist[i] = mask[i] ? 0 : 1e6;
    const kernel: [number, number, number][] = [[-1, 0, 1], [0, -1, 1.58], [-1, -1, 1.87], [1, -1, 1.87]];
    const relax = (idx: number, x: number, y: number, dir: number) => {
      for (const [dx, dy, cost] of kernel) {
        const nx = x + dx * dir;
        const ny = y + dy * dir;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const d = dist[ny * cols + nx] + cost;
        if (d < dist[idx]) dist[idx] = d;
      }
    };
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) relax(y * cols + x, x, y, 1);
    for (let y = rows - 1; y >= 0; y--) for (let x = cols - 1; x >= 0; x--) relax(y * cols + x, x, y, -1);
    return dist;
  }

  private begin() {
    const grid = this.grid;
    if (!grid) return;
    const { cols, rows, g, f, o } = grid;
    const n = cols * rows;
    this.cols = cols;
    this.rows = rows;
    this.base = new Uint8Array(n);
    this.fig = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const figure = f.charCodeAt(i) - 48;
      this.fig[i] = figure ? 1 : 0;
      this.base[i] = figure || g.charCodeAt(i) - 48;
    }
    // cells touching the figure stay clear so the photo always shows around it
    this.near = this.fig.slice();
    for (let i = 0; i < n; i++) {
      if (!this.fig[i]) continue;
      if (i % cols) this.near[i - 1] = 1;
      if (i % cols < cols - 1) this.near[i + 1] = 1;
      if (i >= cols) this.near[i - cols] = 1;
      if (i < n - cols) this.near[i + cols] = 1;
    }
    this.cur = this.base.slice();
    this.lvl = new Uint8Array(n).fill(2);
    this.rest = new Uint8Array(n);
    this.luck = new Float32Array(n);
    this.jit = new Float32Array(n);

    // seeded mulberry32, same seed as the source so the dither is stable
    let seed = 7;
    const rand = () => {
      let t = Math.imul((seed = (seed + 0x6d2b79f5) | 0) ^ (seed >>> 15), 1 | seed);
      return (((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const [seamTop, seamBottom] = grid.seam ?? DEFAULT_SEAM;
    this.band = [];
    for (let i = 0; i < n; i++) {
      const fx = (i % cols) / cols;
      const h = clamp01((Math.floor(i / cols) / rows - 0.4) / 0.14);
      const edge = seamTop + (seamBottom - seamTop) * h;
      const width = 0.05 + 0.07 * h;
      this.luck[i] = rand();
      this.jit[i] = rand() - 0.5;
      this.rest[i] = this.near[i] || this.luck[i] < this.chance(fx, edge, width) ? 0 : 1;
      if (!this.near[i] && Math.abs(fx - edge) < width + 0.05) this.band.push({ i, fx, edge, width });
    }
    this.far = this.chamfer(this.fig);
    this.deep = this.chamfer(this.fig.map((v) => 1 - v));

    let sx = 0;
    let sy = 0;
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (!this.fig[i]) continue;
      sx += i % cols;
      sy += Math.floor(i / cols);
      count += 1;
    }
    this.cx = count ? sx / count : cols / 2;
    this.cy = count ? sy / count : rows / 2;

    const half = Math.floor(o.length / 2);
    this.arcs = [o.slice(0, half), o.slice(half).reverse()];
    // asymmetric breath: 42% inhale, 58% exhale
    for (let i = 0; i < 256; i++) {
      const p = i / 256;
      const phase = p < 0.42 ? (p / 0.42) * 0.5 : 0.5 + ((p - 0.42) / 0.58) * 0.5;
      this.lung[i] = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
    }
    this.parseArt();
    this.t0 = performance.now();
    this.build();
    this.intro();
    this.setState({ ready: true });
  }

  private chance(fx: number, edge: number, width: number) {
    return Math.pow(clamp01((fx - edge) / width + 0.5), 1.6);
  }

  /** Sizes the canvas and pre-renders the glyph atlas: 10 glyphs × LEVELS brightness rows + 1 lit row. */
  private build() {
    const canvas = this.canvas;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (!w || !h || !this.cols) return;
    this.sizeW = w;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    this.ctx = canvas.getContext("2d");
    this.xs = [];
    this.ys = [];
    for (let i = 0; i <= this.cols; i++) this.xs.push(Math.round((i * canvas.width) / this.cols));
    for (let i = 0; i <= this.rows; i++) this.ys.push(Math.round((i * canvas.height) / this.rows));
    const cw = Math.ceil(canvas.width / this.cols);
    const ch = Math.ceil(canvas.height / this.rows);
    this.cw = cw;
    this.ch = ch;

    const atlas = document.createElement("canvas");
    atlas.width = 10 * cw;
    atlas.height = ch * (LEVELS + 1);
    const actx = atlas.getContext("2d");
    if (!actx) return;
    actx.fillStyle = INK;
    actx.fillRect(0, 0, atlas.width, atlas.height);
    actx.font = `500 ${Math.round(0.82 * ch)}px ${this.mono}`;
    actx.textAlign = "center";
    actx.textBaseline = "middle";
    for (let gi = 1; gi < 10; gi++) {
      // grey ramp matched to the luminance of the source's green ramp (82 + 140e)
      const tone = 82 + 140 * (gi / 9);
      for (let lv = 0; lv < LEVELS; lv++) {
        const s = 0.58 + (0.72 * lv) / (LEVELS - 1);
        const c = Math.min(255, Math.round(tone * s));
        actx.fillStyle = `rgb(${c},${c},${c})`;
        actx.fillText(GLYPHS[gi], gi * cw + cw / 2, lv * ch + ch / 2);
      }
      actx.fillStyle = LIT;
      actx.fillText(GLYPHS[gi], gi * cw + cw / 2, LEVELS * ch + ch / 2);
    }
    this.atlas = atlas;
    this.buildArt();
  }

  private parseArt() {
    const sprite = this.grid?.p;
    if (!sprite) return;
    const { x, y, w, h, v } = sprite;
    const cells: ArtCell[] = [];
    for (let row = 0, k = 0; row < h; row++) {
      for (let col = 0; col < w; col++, k++) {
        const code = v.charCodeAt(k);
        if (code === 48) continue;
        const edge = code > 96;
        const idx = edge ? code - 96 : code - 48;
        const d = (row / h) * 1.1 + 0.1 * Math.random();
        cells.push({ col: x + col, row: y + row, idx, edge, order: edge ? 0.7 * d - 0.08 : d + 0.1 });
      }
    }
    this.artCells = cells;
    this.artLevel = new Uint8Array(cells.length);
    this.artOn = 0;
  }

  private buildArt() {
    const sprite = this.grid?.p;
    if (!sprite) return;
    const art = this.art;
    const scale = sprite.s;
    art.width = this.canvas.width;
    art.height = this.canvas.height;
    this.brush = art.getContext("2d");
    const tw = Math.ceil(art.width / (this.cols * scale));
    const th = Math.ceil(art.height / (this.rows * scale));
    const tiles = document.createElement("canvas");
    tiles.width = 10 * tw;
    tiles.height = 2 * th;
    const tctx = tiles.getContext("2d");
    if (!tctx) return;
    tctx.font = `500 ${Math.max(5, Math.round(0.98 * th))}px ${this.mono}`;
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    for (let edgeRow = 0; edgeRow < 2; edgeRow++) {
      for (let gi = 1; gi < 10; gi++) {
        tctx.fillStyle = "rgba(0,0,0,0.5)";
        tctx.fillRect(gi * tw, edgeRow * th, tw, th);
        const c = Math.round(120 + 125 * (gi / 9));
        tctx.fillStyle = `rgb(${c},${c},${c})`;
        // edge cells always use the heavy glyphs (> = #) so the outline reads
        tctx.fillText(GLYPHS[edgeRow ? Math.max(gi, 7) : gi], gi * tw + tw / 2, edgeRow * th + th / 2);
      }
    }
    this.tiles = tiles;
    this.tw = tw;
    this.th = th;
    this.artLevel.fill(0);
  }

  /** Paints the figure sprite in top-down as the breath rises, fading it as it falls. */
  private stepArt(breath: number) {
    const brush = this.brush;
    const tiles = this.tiles;
    const sprite = this.grid?.p;
    if (!brush || !tiles || !sprite) return;
    this.artOn = Math.min(1, this.artOn + 0.012);
    const reach = breath * this.artOn * 0.86;
    const sx = this.art.width / (this.cols * sprite.s);
    const sy = this.art.height / (this.rows * sprite.s);
    const { artCells, artLevel, tw, th } = this;
    for (let k = 0; k < artCells.length; k++) {
      const cell = artCells[k];
      const level = Math.max(0, Math.min(5, Math.floor(((reach - cell.order) / 0.3) * 5)));
      if (level === artLevel[k]) continue;
      artLevel[k] = level;
      const x0 = Math.round(cell.col * sx);
      const y0 = Math.round(cell.row * sy);
      const x1 = Math.round((cell.col + 1) * sx);
      const y1 = Math.round((cell.row + 1) * sy);
      brush.clearRect(x0, y0, x1 - x0, y1 - y0);
      if (level) {
        brush.globalAlpha = (level / 5) * ART_MAX;
        brush.drawImage(tiles, cell.idx * tw, (cell.edge ? 1 : 0) * th, tw, th, x0, y0, x1 - x0, y1 - y0);
      }
    }
  }

  private clearArt() {
    if (!this.brush) return;
    this.brush.clearRect(0, 0, this.art.width, this.art.height);
    this.artLevel.fill(0);
    this.artOn = 0;
  }

  // ---------------------------------------------------------------- cell drawing

  private drawCell(i: number, glyph: number, level: number) {
    const ctx = this.ctx;
    const atlas = this.atlas;
    if (!ctx || !atlas) return;
    const col = i % this.cols;
    const row = Math.floor(i / this.cols);
    const x = this.xs[col];
    const y = this.ys[row];
    ctx.drawImage(atlas, glyph * this.cw, level * this.ch, this.cw, this.ch, x, y, this.xs[col + 1] - x, this.ys[row + 1] - y);
  }

  private clearCell(i: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const col = i % this.cols;
    const row = Math.floor(i / this.cols);
    const x = this.xs[col];
    const y = this.ys[row];
    ctx.clearRect(x, y, this.xs[col + 1] - x, this.ys[row + 1] - y);
  }

  private restore(i: number) {
    if (this.rest[i]) this.drawCell(i, this.cur[i], this.lvl[i]);
    else this.clearCell(i);
  }

  private paintRest() {
    for (let i = 0; i < this.rest.length; i++) this.restore(i);
  }

  /** Covers the stage, then schedules the pen outline, the interior fill and the clearing queue. */
  private intro() {
    const n = this.rest.length;
    const [cxFrac, cyFrac] = this.grid?.c ?? DEFAULT_CENTRE;
    const ox = cxFrac * this.cols;
    const oy = cyFrac * this.rows;
    for (let i = 0; i < n; i++) this.drawCell(i, this.fig[i] ? 0 : this.cur[i], this.lvl[i]);
    this.pen = { start: performance.now() + 120, dur: 980, n: [0, 0] };
    this.fill = [];
    this.queue = [];
    let maxFar = 0;
    for (let i = 0; i < n; i++) if (this.far[i] > maxFar) maxFar = this.far[i];
    for (let i = 0; i < n; i++) {
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      if (this.fig[i]) {
        const dist = Math.hypot(col - ox, (row - oy) * 1.58) / 80;
        this.fill.push({ i, d: 620 + 16 * this.deep[i] + 130 * Math.random() });
        this.queue.push({ i, d: 1360 + 360 * Math.min(1, dist) + 90 * Math.random() });
      } else if (!this.rest[i]) {
        this.queue.push({ i, d: 1560 + 1000 * Math.pow(this.far[i] / maxFar, 0.8) + 170 * Math.random() });
      }
    }
    this.fill.sort((a, b) => a.d - b.d);
    this.queue.sort((a, b) => a.d - b.d);
    this.fi = 0;
    this.qi = 0;
    this.t1 = performance.now();
    this.flashes = [];
    this.clearArt();
  }

  private resized() {
    this.deckPad = null;
    if (!this.ctx || this.canvas.offsetWidth === this.sizeW) return;
    this.build();
    this.pen = null;
    this.fi = this.fill.length;
    this.qi = this.queue.length;
    this.paintRest();
  }

  // ---------------------------------------------------------------- per-frame steps

  private readonly frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.visible) return;
    if (this.pendingAim) {
      this.aim(this.pendingAim);
      this.pendingAim = null;
    }
    this.stepText(now);
    this.stepPlaceholder(now);
    this.stepCard();
    if (this.ctx) this.stepCanvas(now);
  };

  private stepCard() {
    const t = this.tilt;
    const ease = (key: TiltKey, target: number, k: number) => {
      const delta = target - t[key];
      t[key] = Math.abs(delta) < 0.002 ? target : t[key] + delta * k;
      return delta !== 0;
    };
    const a = ease("rx", t.trx, 0.12);
    const b = ease("ry", t.try, 0.12);
    const c = ease("lit", t.tlit, 0.16);
    const d = ease("bx", t.tbx, 0.2);
    const e = ease("by", t.tby, 0.2);
    if (!a && !b && !c && !d && !e) return;
    const style = this.deck.style;
    style.setProperty("--rx", `${t.rx.toFixed(2)}deg`);
    style.setProperty("--ry", `${t.ry.toFixed(2)}deg`);
    style.setProperty("--sx", `${(-3 * t.ry).toFixed(1)}px`);
    style.setProperty("--sy", `${(3 * t.rx).toFixed(1)}px`);
    style.setProperty("--lit", t.lit.toFixed(3));
    style.setProperty("--bx", `${t.bx.toFixed(2)}px`);
    style.setProperty("--by", `${t.by.toFixed(2)}px`);
  }

  private stepText(now: number) {
    if (now - this.lastText < 40) return;
    this.lastText = now;
    const keys = Object.keys(this.jobs);
    if (!keys.length && !this.vanish) return;
    const texts = { ...this.state.t };
    const patch: Partial<HeroState> = { t: texts };
    for (const key of keys) {
      const job = this.jobs[key];
      const p = (now - job.start) / job.dur;
      if (p >= 1) {
        delete texts[key];
        delete this.jobs[key];
        if (key === this.caretKey) patch.caret = true;
        continue;
      }
      const shown = p <= 0 ? 0 : Math.floor(p * job.text.length);
      texts[key] = job.text.slice(0, shown) + this.noise(job.text.slice(shown));
    }
    if (this.vanish) {
      const v = this.vanish;
      const p = (now - v.start) / v.dur;
      if (p >= 1) {
        this.vanish = null;
        patch.idea = "";
        patch.sent = true;
        this.onIdeaSent(v.text);
        this.later(() => this.setState({ sent: false }), 2600);
      } else {
        patch.idea = this.noise(v.text.slice(0, Math.ceil((1 - p) * v.text.length)));
      }
    }
    this.setState(patch);
  }

  private stepPlaceholder(now: number) {
    if (now < this.phNext || this.focused || this.state.idea) return;
    const example = this.examples[this.phI];
    if (this.phDir > 0) {
      this.phN += 1;
      this.phNext = now + 46;
      if (this.phN >= example.length) {
        this.phDir = -1;
        this.phNext = now + 1900;
      }
    } else {
      this.phN -= 1;
      this.phNext = now + 22;
      if (this.phN <= 0) {
        this.phI = (this.phI + 1) % this.examples.length;
        this.phDir = 1;
        this.phNext = now + 340;
      }
    }
    this.setState({ ph: example.slice(0, Math.max(0, this.phN)) });
  }

  private stepPen(now: number) {
    const pen = this.pen;
    if (!pen) return;
    const p = clamp01((now - pen.start) / pen.dur);
    const eased = 1 - Math.pow(1 - p, 2);
    this.arcs.forEach((arc, k) => {
      const upto = Math.floor(eased * arc.length);
      for (let s = pen.n[k]; s < upto; s++) {
        const cell = arc[s];
        this.drawCell(cell, 9, LEVELS);
        this.flashes.push([cell, now + 170, Math.max(this.cur[cell], 7)]);
      }
      pen.n[k] = upto;
    });
    if (p >= 1) this.pen = null;
  }

  private stepCanvas(now: number) {
    const elapsed = now - this.t1;
    if (this.pen) this.stepPen(now);
    while (this.fi < this.fill.length && this.fill[this.fi].d <= elapsed) {
      const cell = this.fill[this.fi].i;
      this.fi += 1;
      if (this.deep[cell] >= 1.5) this.drawCell(cell, this.cur[cell], 5);
    }
    while (this.qi < this.queue.length && this.queue[this.qi].d <= elapsed) {
      const cell = this.queue[this.qi].i;
      this.qi += 1;
      if (Math.random() < 0.12) {
        this.drawCell(cell, Math.max(this.cur[cell], 4), LEVELS);
        this.flashes.push([cell, now + 80, 0]);
      } else {
        this.clearCell(cell);
      }
    }
    if (this.flashes.length) {
      this.flashes = this.flashes.filter(([cell, until, glyph]) => {
        if (now < until) return true;
        if (glyph) this.drawCell(cell, glyph, 5);
        else this.restore(cell);
        return false;
      });
    }
    this.stepBreath(now);
  }

  /** The idle loop: every remaining glyph cell breathes outward from the figure, plus impact and pointer glow. */
  private stepBreath(now: number) {
    if (now - this.lastBreath < 33) return;
    this.lastBreath = now;
    const { cols, rows, base, cur, lvl, rest, jit, far, lung, cx, cy, glow } = this;
    const phase = ((now - this.t0) % CYCLE) / CYCLE;
    const impact = this.impact;
    const ip = impact ? (now - impact.start) / 1100 : 1;
    if (ip >= 1) this.impact = null;
    const glowAmt = glow ? Math.max(0, 1 - (now - glow.at) / 900) : 0;
    let idx = 0;
    for (let row = 0; row < rows; row++) {
      // lower rows breathe harder
      const weight = 0.38 + 0.62 * clamp01((row / rows - 0.4) / 0.16);
      for (let col = 0; col < cols; col++, idx++) {
        if (!rest[idx]) continue;
        let wave = phase - 0.0042 * far[idx];
        wave -= Math.floor(wave);
        const breath = lung[Math.floor(256 * wave)];
        // sample the base grid slightly zoomed around the figure centroid (the "lung" swell)
        const zoom = 1 - 0.03 * (breath - 0.5);
        const sxp = Math.max(0, Math.min(cols - 1.001, cx + (col - cx) * zoom));
        const syp = Math.max(0, Math.min(rows - 1.001, cy + (row - cy) * zoom));
        const x0 = Math.floor(sxp);
        const y0 = Math.floor(syp);
        const fx = sxp - x0;
        const fy = syp - y0;
        const k = y0 * cols + x0;
        const top = base[k] + (base[k + 1] - base[k]) * fx;
        const bottom = base[k + cols] + (base[k + cols + 1] - base[k + cols]) * fx;
        const sampled = top + (bottom - top) * fy;
        let boost = 0;
        if (impact && ip < 1) {
          const ring = Math.hypot(col - impact.col, (row - impact.row) * 1.58) - 72 * ip;
          boost = Math.exp((-ring * ring) / 60) * (1 - ip) * (1 - ip);
        }
        if (glow && glowAmt) {
          const dx = col - glow.col;
          const dy = (row - glow.row) * 1.58;
          const d2 = dx * dx + dy * dy;
          if (d2 < 144) boost += (1 - d2 / 144) * 0.42 * glowAmt;
        }
        const glyph = Math.max(0, Math.min(9, Math.round(
          sampled * (0.82 + 0.36 * breath * weight) + (breath - 0.46) * 1.15 * weight + 0.7 * jit[idx] + 3 * boost,
        )));
        const level = Math.max(0, Math.min(LEVELS - 1, Math.floor(
          (0.12 + 0.76 * breath * (0.45 + 0.55 * weight) + 0.5 * boost) * LEVELS + jit[idx],
        )));
        if (glyph !== cur[idx] || level !== lvl[idx]) {
          cur[idx] = glyph;
          lvl[idx] = level;
          this.drawCell(idx, glyph, level);
        }
      }
    }
    if (this.qi < this.queue.length) return;
    // the seam edge drifts with the breath once the intro has finished
    const drift = 0.022 * (lung[Math.floor(256 * phase)] - 0.5);
    for (const cell of this.band) {
      const on = this.luck[cell.i] < this.chance(cell.fx, cell.edge + drift, cell.width) ? 0 : 1;
      if (on !== rest[cell.i]) {
        rest[cell.i] = on;
        this.restore(cell.i);
      }
    }
    this.stepArt(lung[Math.floor(256 * phase)]);
  }

  // ---------------------------------------------------------------- pointer + card

  private aim(e: PointerEvent) {
    const t = this.tilt;
    const rect = this.deck.getBoundingClientRect();
    const padTop = (this.deckPad ??= parseFloat(getComputedStyle(this.deck).paddingTop) || 0);
    const top = rect.top + padTop;
    const height = rect.height - padTop;
    const nx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (top + height / 2)) / (height / 2)));
    const dist = Math.hypot(
      Math.max(rect.left - e.clientX, 0, e.clientX - rect.right),
      Math.max(top - e.clientY, 0, e.clientY - rect.bottom),
    );
    const near = Math.max(0, 1 - dist / 160);
    t.trx = -(2.4 * ny) * near;
    t.try = 3 * nx * near;
    t.tlit = Math.max(0, 1 - dist / 120);
    this.deck.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(0)}px`);
    this.deck.style.setProperty("--my", `${(e.clientY - top).toFixed(0)}px`);
    const go = this.goEl.getBoundingClientRect();
    const overGo = e.clientX > go.left - 40 && e.clientX < go.right + 40 && e.clientY > go.top - 32 && e.clientY < go.bottom + 32;
    t.tbx = overGo ? Math.max(-2, Math.min(2, (e.clientX - (go.left + go.width / 2)) * 0.01)) : 0;
    t.tby = overGo ? Math.max(-1, Math.min(1, (e.clientY - (go.top + go.height / 2)) * 0.03)) : 0;
  }

  private land() {
    if (!this.ctx) return;
    const stage = this.canvas.getBoundingClientRect();
    const deck = this.deck.getBoundingClientRect();
    this.impact = {
      start: performance.now(),
      col: ((deck.left + deck.width / 2 - stage.left) / stage.width) * this.cols,
      row: ((deck.top + deck.height / 2 - stage.top) / stage.height) * this.rows,
    };
  }

  private hover(key: string, dur: number) {
    if (!this.hovers[key]) this.hovers[key] = () => this.scramble(key, 0, dur);
    return this.hovers[key];
  }

  // ---------------------------------------------------------------- event handlers

  private readonly onMove = (e: PointerEvent) => {
    if (!this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    this.glow = {
      col: ((e.clientX - rect.left) / rect.width) * this.cols,
      row: ((e.clientY - rect.top) / rect.height) * this.rows,
      at: performance.now(),
    };
    if (e.pointerType !== "touch") this.pendingAim = e; // measured once per frame, in frame()
  };

  private readonly onLeave = () => {
    const t = this.tilt;
    t.trx = 0;
    t.try = 0;
    t.tlit = 0;
    t.tbx = 0;
    t.tby = 0;
  };

  private readonly onSend = (e: Event) => {
    e.preventDefault();
    const now = performance.now();
    const idea = this.state.idea.trim();
    if (idea && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.vanish = { start: now, dur: 560, text: idea };
    } else {
      this.setState({ idea: "", sent: true });
      this.later(() => this.onIdeaSent(idea), 260);
      this.later(() => this.setState({ sent: false }), 2600);
    }
    this.land();
  };

  private readonly onIdea = () => {
    this.setState({ idea: this.field.value });
  };

  private readonly onFocus = () => {
    this.focused = true;
    const example = this.examples[this.phI];
    this.phN = example.length;
    this.phDir = -1;
    this.phNext = performance.now() + 1900;
    this.setState({ ph: example });
  };

  private readonly onBlur = () => {
    this.focused = false;
  };

  private readonly replay = (e: Event) => {
    e.preventDefault();
    this.titles();
    if (this.ctx) this.intro();
  };
}
