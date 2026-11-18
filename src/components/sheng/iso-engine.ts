/**
 * Isometric scene engine for the project visuals (design after aumsuthar.com's project cards, in this site's
 * palette): low-poly parts drawn as flat-shaded faces with cream edges on black, an orthographic isometric camera,
 * labels anchored to points in the scene, and a caption for each beat of a looping storyboard.
 *
 * In the browser each `[data-scene]` cover gets a Canvas 2D player (`initIsoScenes`): it animates only while in
 * view, at 30 fps, and shows one still frame under reduced motion. The same frame renders to SVG for the build-time
 * posters (`renderSvg`, used by scripts/render-scene-posters.mjs). The scenes live at the bottom of this file, so
 * neither the artifact bundle nor the poster script needs a cross-module import.
 *
 * Besides the isometric scenes there are flat scenes (`FlatScene`): 2D explainers drawn with the same painters in a
 * 600×400 design space (the detail pages' "how it works" figures).
 */

export type Vec3 = readonly [number, number, number];
export type Rgb = readonly [number, number, number];
export type Point = readonly [number, number];

export interface Face {
  /** Corners in scene units, counter-clockwise seen from outside (that order gives the outward normal). */
  pts: readonly Vec3[];
  color: Rgb;
  /** Edge colour; null for no edge. Default: the cream edge. */
  edge?: string | null;
  alpha?: number;
}
export interface Shape {
  faces: Face[];
  /** Painter's-order key: the smallest x + y + z the part reaches. Larger keys draw later (nearer the viewer). */
  depth: number;
}
export interface Line3 {
  pts: readonly Vec3[];
  color: string;
  /** In card pixels (scaled up on the poster). */
  width?: number;
  dash?: readonly number[];
  depth?: number;
}
/** A ring drawn flat on the screen around a point in the scene; `r` in scene units. */
export interface Mark {
  at: Vec3;
  r: number;
  color: string;
  width?: number;
  dash?: readonly number[];
  depth?: number;
}
export interface Label {
  at: Vec3;
  text: string;
  color?: string;
  /** Offsets in tenths of the label font size. */
  dx?: number;
  dy?: number;
  align?: "left" | "center" | "right";
}
export interface Frame {
  shapes: Shape[];
  lines: Line3[];
  marks: Mark[];
  labels: Label[];
}
export interface Beat {
  at: number;
  caption: string;
}
export interface Scene {
  id: string;
  /** Loop length, seconds. */
  duration: number;
  /** The time of the still frame: the poster, and what reduced motion shows. */
  poster: number;
  /** The box of scene units the camera fits into the canvas. */
  bounds: { min: Vec3; max: Vec3 };
  beats: Beat[];
  frame(t: number): Frame;
}
/** A 2D explainer: draws itself in a FLAT_W × FLAT_H design space, scaled to the canvas. */
export interface FlatScene {
  id: string;
  duration: number;
  poster: number;
  draw(p: Painter, t: number): void;
}
export type AnyScene = Scene | FlatScene;
const isFlat = (scene: AnyScene): scene is FlatScene => "draw" in scene;
export const FLAT_W = 600;
export const FLAT_H = 400;

// ---------------------------------------------------------------- palette
export const BG = "#000000";
export const CREAM: Rgb = [245, 242, 234];
export const GREEN: Rgb = [44, 169, 66];
export const SLATE: Rgb = [46, 46, 49];
export const DARK: Rgb = [26, 26, 28];
export const EDGE = "rgba(245, 242, 234, 0.55)";
export const EDGE_SOFT = "rgba(245, 242, 234, 0.26)";
export const GREEN_EDGE = "rgba(44, 169, 66, 0.95)";
const LABEL = "rgba(245, 242, 234, 0.8)";
const CAPTION = "#F5F2EA";
const NOISE = ".:/{}<>=#";

// ---------------------------------------------------------------- maths
export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
/** 0 before `a`, 1 after `b`, linear in between. */
export const span = (t: number, a: number, b: number): number => clamp01((t - a) / (b - a));
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
/** Deterministic pseudo-random value in [0, 1) (classic sin hash). */
export const hash2 = (x: number, y: number): number => {
  const v = 43758.5453 * Math.sin(127.1 * x + 311.7 * y);
  return v - Math.floor(v);
};

const COS30 = Math.sqrt(3) / 2;
/** Isometric camera: x runs to the lower right, y to the lower left, z up; one scene unit is one screen unit. */
const project = (p: Vec3): Point => [(p[0] - p[1]) * COS30, (p[0] + p[1]) * 0.5 - p[2]];

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}
function normalOf(pts: readonly Vec3[]): Vec3 {
  const [a, b, c] = pts;
  const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const w: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  return normalize([u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]);
}
const sum = (p: Vec3): number => p[0] + p[1] + p[2];
const minSum = (pts: readonly Vec3[]): number => pts.reduce((m, p) => Math.min(m, sum(p)), Infinity);

const LIGHT = normalize([0.45, -0.25, 0.86]);
/** Flat shading: faces turned to the light are brightest, the lower-left faces darkest. */
function shade(color: Rgb, n: Vec3, alpha: number): string {
  const lambert = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
  const k = 0.42 + 0.58 * lambert;
  const r = Math.min(255, Math.round(color[0] * k));
  const g = Math.min(255, Math.round(color[1] * k));
  const b = Math.min(255, Math.round(color[2] * k));
  return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------- parts
/** An axis-aligned box from (x0, y0, z0) to (x1, y1, z1). Only its top, +x and +y faces can face the camera. */
export function box(
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  color: Rgb,
  edge?: string | null,
  alpha = 1,
): Shape {
  const faces: Face[] = [
    { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], color, edge, alpha },
    { pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], color, edge, alpha },
    { pts: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], color, edge, alpha },
  ];
  return { faces, depth: x0 + y0 + z0 };
}

/** The points of a horizontal circle, closed (first point repeated). */
export function circle(cx: number, cy: number, z: number, r: number, n: number): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
  }
  return pts;
}

/** A cone section standing on z0: radius r0 at the bottom, r1 at the top, n sides; the top is an open, dark mouth. */
export function frustum(cx: number, cy: number, z0: number, r0: number, z1: number, r1: number, n: number, color: Rgb): Shape {
  const lo = circle(cx, cy, z0, r0, n);
  const hi = circle(cx, cy, z1, r1, n);
  const faces: Face[] = [];
  for (let i = 0; i < n; i++) faces.push({ pts: [lo[i], lo[i + 1], hi[i + 1], hi[i]], color, edge: EDGE_SOFT });
  faces.push({ pts: hi.slice(0, n), color: [14, 14, 16], edge: EDGE });
  return { faces, depth: cx - r1 + cy - r1 + z0 };
}

/** A square outline lying flat at height z. */
export function square(cx: number, cy: number, z: number, half: number): Vec3[] {
  return [
    [cx - half, cy - half, z],
    [cx + half, cy - half, z],
    [cx + half, cy + half, z],
    [cx - half, cy + half, z],
    [cx - half, cy - half, z],
  ];
}

// ---------------------------------------------------------------- camera
interface Camera {
  scale: number;
  ox: number;
  oy: number;
}

/** Fits the scene's bounds into the canvas, leaving a band at the bottom for the caption (none when compact). */
function fitCamera(scene: Scene, w: number, h: number, compact: boolean): Camera {
  const { min, max } = scene.bounds;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const x of [min[0], max[0]]) {
    for (const y of [min[1], max[1]]) {
      for (const z of [min[2], max[2]]) {
        const [sx, sy] = project([x, y, z]);
        x0 = Math.min(x0, sx);
        y0 = Math.min(y0, sy);
        x1 = Math.max(x1, sx);
        y1 = Math.max(y1, sy);
      }
    }
  }
  const padX = 0.04 * w;
  const padTop = 0.05 * h;
  const padBottom = (compact ? 0.06 : 0.17) * h;
  const scale = Math.min((w - 2 * padX) / (x1 - x0), (h - padTop - padBottom) / (y1 - y0));
  return {
    scale,
    ox: w / 2 - ((x0 + x1) / 2) * scale,
    oy: padTop + (h - padTop - padBottom) / 2 - ((y0 + y1) / 2) * scale,
  };
}

const toScreen = (cam: Camera, p: Vec3): Point => {
  const [x, y] = project(p);
  return [cam.ox + x * cam.scale, cam.oy + y * cam.scale];
};

// ---------------------------------------------------------------- painters
export type Align = "left" | "center" | "right";

export interface Painter {
  clear(w: number, h: number, color: string): void;
  polygon(pts: readonly Point[], fill: string, stroke: string | null, width: number): void;
  polyline(pts: readonly Point[], stroke: string, width: number, dash?: readonly number[]): void;
  circle(x: number, y: number, r: number, stroke: string | null, width: number, dash?: readonly number[], fill?: string): void;
  /** `spacing` is letter spacing in em (the labels' default is 0.14; terminal text uses 0). */
  text(x: number, y: number, text: string, color: string, size: number, align: Align, spacing?: number): void;
}

export class CanvasPainter implements Painter {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly mono: string;

  constructor(ctx: CanvasRenderingContext2D, mono: string) {
    this.ctx = ctx;
    this.mono = mono;
  }

  clear(w: number, h: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, w, h);
  }

  private path(pts: readonly Point[], close: boolean): void {
    const { ctx } = this;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (close) ctx.closePath();
  }

  polygon(pts: readonly Point[], fill: string, stroke: string | null, width: number): void {
    const { ctx } = this;
    this.path(pts, true);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.setLineDash([]);
      ctx.stroke();
    }
  }

  polyline(pts: readonly Point[], stroke: string, width: number, dash: readonly number[] = []): void {
    const { ctx } = this;
    this.path(pts, false);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.setLineDash(dash as number[]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  circle(x: number, y: number, r: number, stroke: string | null, width: number, dash: readonly number[] = [], fill?: string): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.setLineDash(dash as number[]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  text(x: number, y: number, text: string, color: string, size: number, align: Align, spacing = 0.14): void {
    const { ctx } = this;
    ctx.font = `500 ${size}px ${this.mono}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}em`;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, size * 0.3);
    ctx.strokeStyle = BG;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}

const escapeXml = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (v: number): string => (Math.round(v * 100) / 100).toString();
const pointList = (pts: readonly Point[]): string => pts.map(([x, y]) => `${num(x)},${num(y)}`).join(" ");

/** Turns a run of text into SVG path data, already positioned for `align` (the poster script supplies one from the font file). */
export type TextToPath = (text: string, x: number, y: number, size: number, align: Align, spacing: number) => string;

/** Collects the frame as SVG markup (the build-time poster). With `toPath`, text becomes glyph outlines, so the result
 * doesn't depend on the fonts the renderer can see. */
export class SvgPainter implements Painter {
  private readonly font: string;
  private readonly toPath: TextToPath | null;
  private readonly parts: string[] = [];

  constructor(font: string, toPath: TextToPath | null = null) {
    this.font = font;
    this.toPath = toPath;
  }

  clear(w: number, h: number, color: string): void {
    this.parts.push(`<rect width="${num(w)}" height="${num(h)}" fill="${color}"/>`);
  }

  polygon(pts: readonly Point[], fill: string, stroke: string | null, width: number): void {
    const edge = stroke ? ` stroke="${stroke}" stroke-width="${num(width)}" stroke-linejoin="round"` : "";
    this.parts.push(`<polygon points="${pointList(pts)}" fill="${fill}"${edge}/>`);
  }

  polyline(pts: readonly Point[], stroke: string, width: number, dash?: readonly number[]): void {
    const d = dash && dash.length ? ` stroke-dasharray="${dash.map(num).join(" ")}"` : "";
    this.parts.push(
      `<polyline points="${pointList(pts)}" fill="none" stroke="${stroke}" stroke-width="${num(width)}" stroke-linejoin="round" stroke-linecap="round"${d}/>`,
    );
  }

  circle(x: number, y: number, r: number, stroke: string | null, width: number, dash?: readonly number[], fill?: string): void {
    const d = dash && dash.length ? ` stroke-dasharray="${dash.map(num).join(" ")}"` : "";
    const edge = stroke ? ` stroke="${stroke}" stroke-width="${num(width)}"${d}` : "";
    this.parts.push(`<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${fill ?? "none"}"${edge}/>`);
  }

  text(x: number, y: number, text: string, color: string, size: number, align: Align, spacing = 0.14): void {
    const halo = `stroke="${BG}" stroke-width="${num(Math.max(2, size * 0.3))}" stroke-linejoin="round" paint-order="stroke"`;
    if (this.toPath) {
      this.parts.push(`<path d="${this.toPath(text, x, y, size, align, spacing)}" fill="${color}" ${halo}/>`);
      return;
    }
    const anchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
    this.parts.push(
      `<text x="${num(x)}" y="${num(y)}" fill="${color}" font-family="${escapeXml(this.font)}" font-weight="500" font-size="${num(size)}" letter-spacing="${num(size * spacing)}" text-anchor="${anchor}" dominant-baseline="central" xml:space="preserve" ${halo}>${escapeXml(text)}</text>`,
    );
  }

  toString(w: number, h: number): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(w)}" height="${num(h)}" viewBox="0 0 ${num(w)} ${num(h)}">${this.parts.join("")}</svg>`;
  }
}

/** Draws through another painter with every coordinate and size scaled: the flat scenes' design space. */
class ScaledPainter implements Painter {
  private readonly inner: Painter;
  private readonly s: number;

  constructor(inner: Painter, s: number) {
    this.inner = inner;
    this.s = s;
  }

  private pts(pts: readonly Point[]): Point[] {
    return pts.map(([x, y]) => [x * this.s, y * this.s]);
  }

  clear(w: number, h: number, color: string): void {
    this.inner.clear(w * this.s, h * this.s, color);
  }

  polygon(pts: readonly Point[], fill: string, stroke: string | null, width: number): void {
    this.inner.polygon(this.pts(pts), fill, stroke, Math.max(0.75, width * this.s));
  }

  polyline(pts: readonly Point[], stroke: string, width: number, dash?: readonly number[]): void {
    this.inner.polyline(this.pts(pts), stroke, Math.max(0.75, width * this.s), dash?.map((d) => d * this.s));
  }

  circle(x: number, y: number, r: number, stroke: string | null, width: number, dash?: readonly number[], fill?: string): void {
    this.inner.circle(x * this.s, y * this.s, r * this.s, stroke, Math.max(0.75, width * this.s), dash?.map((d) => d * this.s), fill);
  }

  text(x: number, y: number, text: string, color: string, size: number, align: Align, spacing?: number): void {
    this.inner.text(x * this.s, y * this.s, text, color, size * this.s, align, spacing);
  }
}

// ---------------------------------------------------------------- drawing a frame
/** The caption in force at `t` (flat scenes draw their own: none). */
export function captionAt(scene: AnyScene, t: number): string {
  if (isFlat(scene)) return "";
  let caption = scene.beats[0]?.caption ?? "";
  for (const beat of scene.beats) if (t >= beat.at) caption = beat.caption;
  return caption;
}

/** Below this width (the home page's rows) the scene plays without its labels and caption. */
const COMPACT_WIDTH = 220;

/** Draws the scene at time `t` into a `w`×`h` canvas (CSS pixels). `caption` overrides the beat's text (scrambles). */
export function drawFrame(painter: Painter, scene: AnyScene, w: number, h: number, t: number, caption?: string): void {
  painter.clear(w, h, BG);
  if (isFlat(scene)) {
    scene.draw(new ScaledPainter(painter, w / FLAT_W), t);
    return;
  }
  const compact = w < COMPACT_WIDTH;
  const cam = fitCamera(scene, w, h, compact);
  const frame = scene.frame(t);
  const fontPx = Math.min(30, Math.max(9, w / 42));
  const lineW = Math.max(1, w / 420);
  const items: { depth: number; draw: () => void }[] = [];
  for (const shape of frame.shapes) {
    items.push({
      depth: shape.depth,
      draw: () => {
        for (const face of shape.faces) {
          const n = normalOf(face.pts);
          if (n[0] + n[1] + n[2] <= 1e-6) continue;
          const pts = face.pts.map((p) => toScreen(cam, p));
          painter.polygon(pts, shade(face.color, n, face.alpha ?? 1), face.edge === undefined ? EDGE : face.edge, lineW);
        }
      },
    });
  }
  for (const line of frame.lines) {
    items.push({
      depth: line.depth ?? minSum(line.pts) + 0.01,
      draw: () => {
        const pts = line.pts.map((p) => toScreen(cam, p));
        painter.polyline(pts, line.color, (line.width ?? 1) * lineW, line.dash?.map((d) => d * lineW));
      },
    });
  }
  for (const mark of frame.marks) {
    items.push({
      depth: mark.depth ?? sum(mark.at) + 0.5,
      draw: () => {
        const [x, y] = toScreen(cam, mark.at);
        painter.circle(x, y, mark.r * cam.scale, mark.color, (mark.width ?? 1) * lineW, mark.dash?.map((d) => d * lineW));
      },
    });
  }
  items.sort((a, b) => a.depth - b.depth);
  for (const item of items) item.draw();
  if (compact) return;
  const labelPx = fontPx * 0.92;
  for (const label of frame.labels) {
    const [x, y] = toScreen(cam, label.at);
    painter.text(x + ((label.dx ?? 0) * labelPx) / 10, y + ((label.dy ?? 0) * labelPx) / 10, label.text, label.color ?? LABEL, labelPx, label.align ?? "center");
  }
  const text = caption ?? captionAt(scene, t);
  if (text) painter.text(w * 0.045, h - fontPx * 1.6, text, CAPTION, fontPx, "left");
}

/** The scene at time `t` as an SVG document (the poster). */
export function renderSvg(scene: AnyScene, w: number, h: number, t = scene.poster, font = "JetBrains Mono", toPath: TextToPath | null = null): string {
  const painter = new SvgPainter(font, toPath);
  drawFrame(painter, scene, w, h, t);
  return painter.toString(w, h);
}

// ---------------------------------------------------------------- the browser player
const FRAME_GAP_MS = 1000 / 30;
const SCRAMBLE_MS = 420;

/** A caption resolving left to right out of noise, like the page's decrypts. */
function scrambleText(text: string, progress: number, tick: number): string {
  const resolved = Math.floor(easeOut(progress) * text.length);
  let out = text.slice(0, resolved);
  for (let i = resolved; i < text.length; i++) out += text[i] === " " ? " " : NOISE[(i * 7 + tick) % NOISE.length];
  return out;
}

class IsoPlayer {
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: AnyScene;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly painter: CanvasPainter;
  private readonly still: boolean;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private frame = 0;
  private running = false;
  /** Scene time already played before the current run (seconds). */
  private played = 0;
  private runStart = 0;
  private lastPaint = 0;
  private beatCaption = "";
  private beatChangedAt = 0;
  private ticks = 0;
  private readonly resizer: ResizeObserver | null = null;
  private readonly watcher: IntersectionObserver | null = null;

  constructor(canvas: HTMLCanvasElement, scene: AnyScene, ctx: CanvasRenderingContext2D, mono: string) {
    this.canvas = canvas;
    this.scene = scene;
    this.ctx = ctx;
    this.painter = new CanvasPainter(ctx, mono);
    this.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.beatCaption = captionAt(scene, this.still ? scene.poster : 0);
    this.beatChangedAt = -Infinity;
    this.resize();
    if (this.still) {
      this.paint(scene.poster, performance.now());
      return;
    }
    if (typeof ResizeObserver === "function") {
      this.resizer = new ResizeObserver(() => {
        this.resize();
        if (!this.running) this.paint(this.played % scene.duration, performance.now());
      });
      this.resizer.observe(canvas);
    }
    this.watcher = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.start();
        else this.stop();
      },
      { rootMargin: "12% 0px" },
    );
    this.watcher.observe(canvas);
  }

  private resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = Math.max(1, Math.round(this.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.height * this.dpr));
  }

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.runStart = performance.now();
    this.lastPaint = 0;
    this.frame = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    if (!this.running) return;
    this.running = false;
    this.played += (performance.now() - this.runStart) / 1000;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);
    if (now - this.lastPaint < FRAME_GAP_MS - 1) return;
    this.lastPaint = now;
    const t = (this.played + (now - this.runStart) / 1000) % this.scene.duration;
    this.paint(t, now);
  };

  private paint(t: number, now: number): void {
    if (this.width === 0 || this.height === 0) return;
    const caption = captionAt(this.scene, t);
    if (caption !== this.beatCaption) {
      this.beatCaption = caption;
      this.beatChangedAt = now;
    }
    const progress = this.still ? 1 : clamp01((now - this.beatChangedAt) / SCRAMBLE_MS);
    this.ticks++;
    const shown = progress < 1 ? scrambleText(caption, progress, this.ticks) : caption;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    drawFrame(this.painter, this.scene, this.width, this.height, t, shown);
  }

  destroy(): void {
    this.stop();
    this.resizer?.disconnect();
    this.watcher?.disconnect();
  }
}

/** Starts a player on every `[data-scene]` cover under `root` that has a `canvas.iso`. */
export function initIsoScenes(root: ParentNode, mono: string): () => void {
  const players: IsoPlayer[] = [];
  for (const host of root.querySelectorAll<HTMLElement>("[data-scene]")) {
    const scene = SCENES[host.dataset.scene ?? ""];
    const canvas = host.querySelector<HTMLCanvasElement>("canvas.iso");
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !ctx) continue;
    players.push(new IsoPlayer(canvas, scene, ctx, mono));
  }
  return () => {
    for (const player of players) player.destroy();
  };
}

// ================================================================ scenes
const SLAB: Rgb = [36, 36, 39];
const STAR: Rgb = [150, 148, 142];
const GRID = "rgba(245, 242, 234, 0.09)";
const LABEL_DIM = "rgba(245, 242, 234, 0.5)";
const GREEN_LABEL = "#4CC866";
const SKY_TOP = 0.35;

/** Where the mover sits in pass 1 and in pass 2 (scene units on the cutout). */
const MOVER_A: Point = [-1.6, 1.1];
const MOVER_B: Point = [2.3, -2.3];
/** The catalogued stars: fixed positions, clear of the mover's two spots and of each other. */
const STARS: Point[] = (() => {
  const out: Point[] = [];
  for (let i = 0; out.length < 26 && i < 400; i++) {
    const x = -4.5 + 9 * hash2(i, 1.7);
    const y = -4.5 + 9 * hash2(i, 9.3);
    if (Math.hypot(x - MOVER_A[0], y - MOVER_A[1]) < 0.9 || Math.hypot(x - MOVER_B[0], y - MOVER_B[1]) < 0.9) continue;
    if (out.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 0.8)) continue;
    out.push([x, y]);
  }
  return out;
})();

/** SPHEREx: a bus with a solar panel, and the three nested photon-shield cones on top. */
function spacecraft(shapes: Shape[], lines: Line3[], sx: number, sy: number): void {
  const z0 = 2.5;
  const bus = box(sx - 0.7, sy - 0.7, z0, sx + 0.7, sy + 0.7, z0 + 0.9, SLATE);
  shapes.push(bus);
  shapes.push(box(sx + 0.7, sy - 0.07, z0 + 0.36, sx + 0.95, sy + 0.07, z0 + 0.44, SLATE, EDGE_SOFT));
  shapes.push(box(sx + 0.95, sy - 0.5, z0 + 0.34, sx + 3.6, sy + 0.5, z0 + 0.46, DARK));
  const cone = frustum(sx, sy, z0 + 0.9, 0.75, z0 + 2.2, 1.5, 14, SLATE);
  cone.depth = bus.depth + 0.5; // sits on the bus, so it paints after it whatever its wider mouth reaches
  shapes.push(cone);
  lines.push({ pts: circle(sx, sy, z0 + 2.02, 1.15, 14), color: EDGE, depth: cone.depth + 0.01 });
  lines.push({ pts: circle(sx, sy, z0 + 1.86, 0.85, 14), color: EDGE_SOFT, depth: cone.depth + 0.02 });
}

/**
 * Planet X: SPHEREx scans a 300″ patch of sky twice, six months apart. The catalogued stars stay put, one source
 * jumps (parallax), the catalogues don't know it, and it ends up as a candidate for a person to vet.
 */
const planetX: Scene = {
  id: "planet-x",
  duration: 16,
  poster: 1.9,
  bounds: { min: [-5.4, -5.4, 0], max: [5.4, 5.4, 5.0] },
  beats: [
    { at: 0, caption: "PASS 1 · SPHEREX SCANS THE PATCH" },
    { at: 4, caption: "PASS 2 · SIX MONTHS LATER, 2 AU AWAY" },
    { at: 8.2, caption: "THE STARS STAY PUT · ONE SOURCE JUMPED 825″" },
    { at: 11, caption: "CHECKED AGAINST GAIA DR3 AND JPL · NO MATCH" },
    { at: 13.5, caption: "A CANDIDATE TO VET · NEVER A DETECTION" },
  ],
  frame(t) {
    const shapes: Shape[] = [];
    const lines: Line3[] = [];
    const marks: Mark[] = [];
    const labels: Label[] = [];

    // the cutout: a slab of sky with its pixel grid
    shapes.push(box(-5, -5, 0, 5, 5, SKY_TOP, SLAB));
    for (let i = -4; i <= 4; i++) {
      lines.push({ pts: [[-5, i, SKY_TOP + 0.01], [5, i, SKY_TOP + 0.01]], color: GRID, depth: -5 + i + SKY_TOP });
      lines.push({ pts: [[i, -5, SKY_TOP + 0.01], [i, 5, SKY_TOP + 0.01]], color: GRID, depth: i - 5 + SKY_TOP });
    }
    labels.push({ at: [5, 5, 0], text: "300″ CUTOUT", dy: 14, color: LABEL_DIM });

    // SPHEREx crosses in pass 1, comes back the other way in pass 2, then is gone
    const sx = 0.8;
    const sy = t < 4.3 ? lerp(-8, 8, span(t, 0.2, 3.8)) : t < 8.4 ? lerp(8, -8, span(t, 4.8, 8)) : -12;
    const flying = Math.abs(sy) < 7.6;
    const lit = (y: number): number => (flying ? clamp01(1 - Math.abs(y - sy) / 0.7) : 0);

    // the stars brighten as the scan line passes over them
    for (const [x, y] of STARS) {
      const l = lit(y);
      const s = 0.1 + 0.06 * l;
      shapes.push(box(x - s, y - s, SKY_TOP, x + s, y + s, SKY_TOP + 2 * s, mix(STAR, CREAM, l), null));
    }
    if (flying && Math.abs(sy) < 5) shapes.push(box(-5, sy - 0.05, SKY_TOP, 5, sy + 0.05, SKY_TOP + 0.03, CREAM, null, 0.5));

    // the mover: at A through pass 1, jumps to B before pass 2
    const jump = easeInOut(span(t, 4.2, 5.3));
    const mx = lerp(MOVER_A[0], MOVER_B[0], jump);
    const my = lerp(MOVER_A[1], MOVER_B[1], jump);
    shapes.push(box(mx - 0.17, my - 0.17, SKY_TOP, mx + 0.17, my + 0.17, SKY_TOP + 0.34, mix(GREEN, [120, 225, 135], lit(my)), GREEN_EDGE));
    if (t >= 4.2 && t < 8.2) {
      lines.push({ pts: [[MOVER_A[0], MOVER_A[1], SKY_TOP + 0.02], [mx, my, SKY_TOP + 0.02]], color: "rgba(44,169,66,0.7)", dash: [3, 4], depth: 100 });
    }
    if (flying) {
      spacecraft(shapes, lines, sx, sy);
      labels.push({ at: [sx, sy, 5.1], text: "SPHEREX", dy: -6 });
    }

    // the comparison: where it was, where it is, and the jump between them
    if (t >= 8.2) {
      const a = easeOut(span(t, 8.2, 8.9));
      lines.push({ pts: square(MOVER_A[0], MOVER_A[1], SKY_TOP + 0.02, 0.25), color: `rgba(245,242,234,${0.75 * a})`, dash: [2, 3], depth: 100 });
      lines.push({
        pts: [[MOVER_A[0], MOVER_A[1], SKY_TOP + 0.02], [lerp(MOVER_A[0], MOVER_B[0], a), lerp(MOVER_A[1], MOVER_B[1], a), SKY_TOP + 0.02]],
        color: "rgba(44,169,66,0.85)",
        dash: [3, 4],
        depth: 100,
      });
      // the label gives way to the catalogue check's labels later on
      if (a > 0.99 && t < 11) labels.push({ at: [(MOVER_A[0] + MOVER_B[0]) / 2, (MOVER_A[1] + MOVER_B[1]) / 2, SKY_TOP], text: "PARALLAX · 825″", dy: -9, color: GREEN_LABEL });
    }

    // the catalogue check: every star is in Gaia DR3 or JPL's list; the mover matches nothing
    if (t >= 11) {
      STARS.forEach(([x, y], i) => {
        const a = easeOut(span(t, 11 + i * 0.06, 11.4 + i * 0.06));
        if (a > 0) marks.push({ at: [x, y, SKY_TOP + 0.1], r: 0.3 * a, color: `rgba(245,242,234,${0.5 * a})` });
      });
      labels.push({ at: [-5, -5, SKY_TOP], text: "GAIA DR3 · JPL", dy: -9, color: LABEL_DIM });
    }

    // the candidate
    if (t >= 13.5) {
      const a = easeOut(span(t, 13.5, 14));
      const pulse = 0.5 + 0.5 * Math.sin((t - 13.5) * 4);
      marks.push({ at: [MOVER_B[0], MOVER_B[1], SKY_TOP + 0.17], r: (0.46 + 0.08 * pulse) * a, color: `rgba(44,169,66,${0.95 * a})`, width: 1.5 });
      labels.push({ at: [MOVER_B[0], MOVER_B[1], SKY_TOP + 0.3], text: "CANDIDATE", dy: -11, color: GREEN_LABEL });
    }

    return { shapes, lines, marks, labels };
  },
};


/**
 * EvalGuard: a corpus and a benchmark. Four matchers sweep every benchmark item and light the ones the corpus already
 * contains, each with a line back to the document that leaks it; the panel reports the two numbers that come out.
 */
const DOC: Rgb = [168, 166, 158];
const TILE: Rgb = [54, 54, 58];
const BAR: Rgb = [150, 148, 142];
const DOCS = 10;
const DOC_STEP = 0.15;
const COLS = 6;
const ROWS = 4;
/** Benchmark items the corpus leaks (row-major index), and the document each one traces back to. */
const HITS = [2, 5, 9, 12, 14, 19, 22];
const hitDoc = (i: number): number => (i * 3) % DOCS;
const docAt = (i: number): Vec3 => [-3.6 + 0.3 * (hash2(i, 3.1) - 0.5), -2.1 + 0.3 * (hash2(i, 5.7) - 0.5), 0.3 + i * DOC_STEP];
const tileAt = (i: number): Point => [0.9 + (i % COLS) * 0.8, -1.2 + Math.floor(i / COLS) * 0.8];

const evalGuard: Scene = {
  id: "eval-guard",
  duration: 14,
  poster: 6.2,
  bounds: { min: [-6, -4.2, 0], max: [6, 4.2, 3] },
  beats: [
    { at: 0, caption: "A CORPUS AND A BENCHMARK" },
    { at: 3.4, caption: "FOUR MATCHERS SWEEP EVERY ITEM" },
    { at: 8, caption: "TWO NUMBERS OUT: RATE ρ AND INFLATION Δ" },
    { at: 11, caption: "EACH HIT WITH ITS EVIDENCE · NEVER FABRICATED" },
  ],
  frame(t) {
    const shapes: Shape[] = [];
    const lines: Line3[] = [];
    const marks: Mark[] = [];
    const labels: Label[] = [];
    shapes.push(box(-5.8, -4, 0, 5.8, 4, 0.3, SLAB));

    // the corpus: documents dropping onto a stack
    for (let i = 0; i < DOCS; i++) {
      const a = easeOut(span(t, 0.15 + i * 0.2, 0.55 + i * 0.2));
      if (a <= 0) continue;
      const [x, y, z] = docAt(i);
      const lift = (1 - a) * 1.2;
      shapes.push(box(x - 1.1, y - 0.8, z + lift, x + 1.1, y + 0.8, z + lift + 0.12, DOC, EDGE_SOFT));
    }
    if (t >= 2.4) labels.push({ at: [-3.6, -2.1, 0.3 + DOCS * DOC_STEP + 0.1], text: "CORPUS", dy: -6 });

    // the benchmark: a tray of items popping into place
    shapes.push(box(0.4, -1.7, 0.3, 5.4, 1.7, 0.4, DARK));
    if (t >= 1.2) labels.push({ at: [5.4, 1.7, 0.4], text: "BENCHMARK", dy: 8 });
    const sweeping = t >= 3.4;
    const gx = lerp(0.3, 5.5, easeInOut(span(t, 3.4, 7.6)));
    const pulse = t >= 11 ? 0.5 + 0.5 * Math.sin((t - 11) * 3) : 1;
    for (let i = 0; i < COLS * ROWS; i++) {
      const [tx, ty] = tileAt(i);
      const a = easeOut(span(t, 0.9 + ((i % COLS) + Math.floor(i / COLS)) * 0.1, 1.25 + ((i % COLS) + Math.floor(i / COLS)) * 0.1));
      if (a <= 0) continue;
      const lit = HITS.includes(i) && sweeping ? clamp01((gx - tx + 0.1) / 0.35) : 0;
      const s = 0.3 * a;
      const h = 0.18 * a + 0.08 * lit;
      shapes.push(box(tx - s, ty - s, 0.4, tx + s, ty + s, 0.4 + h, mix(TILE, GREEN, lit * (0.7 + 0.3 * pulse)), lit > 0.5 ? GREEN_EDGE : EDGE_SOFT));
      if (lit > 0) {
        // the evidence trail: the item back to the document that leaks it
        const [dx, dy, dz] = docAt(hitDoc(i));
        lines.push({ pts: [[tx, ty, 0.4 + h], [dx + 1.1, dy, dz + 0.06]], color: `rgba(44,169,66,${0.75 * lit * (0.6 + 0.4 * pulse)})`, dash: [3, 4], depth: 100 });
      }
    }

    // the gantry: four matcher heads on a bar that sweeps the tray, then parks at its end
    if (sweeping) {
      const bar = box(gx - 0.15, -2.05, 1.3, gx + 0.15, 2.05, 1.45, SLATE);
      shapes.push(box(gx - 0.12, -2.05, 0.3, gx + 0.12, -1.85, 1.45, SLATE));
      for (const hy of [-1.35, -0.45, 0.45, 1.35]) {
        const head = box(gx - 0.15, hy - 0.15, 0.95, gx + 0.15, hy + 0.15, 1.3, SLATE, GREEN_EDGE);
        head.depth = bar.depth - 0.01; // hangs under the bar, which hides its top
        shapes.push(head);
      }
      shapes.push(bar);
      shapes.push(box(gx - 0.12, 1.85, 0.3, gx + 0.12, 2.05, 1.45, SLATE));
      if (t < 8) labels.push({ at: [gx, 0, 1.55], text: "4 MATCHERS", dy: -6 });
    }

    // the panel: contamination rate and score inflation
    shapes.push(box(2.2, -3.7, 0.3, 5.6, -3.5, 2.6, DARK));
    lines.push({ pts: [[2.5, -3.44, 1.9], [5.3, -3.44, 1.9]], color: EDGE_SOFT, depth: 100 });
    lines.push({ pts: [[2.5, -3.44, 1], [5.3, -3.44, 1]], color: EDGE_SOFT, depth: 100 });
    const rho = 0.55 * easeOut(span(t, 8.2, 9.6));
    const delta = 0.35 * easeOut(span(t, 8.6, 10));
    if (rho > 0) shapes.push(box(2.5, -3.5, 1.9, 2.5 + 2.8 * rho, -3.38, 2.15, GREEN, GREEN_EDGE));
    if (delta > 0) shapes.push(box(2.5, -3.5, 1, 2.5 + 2.8 * delta, -3.38, 1.25, BAR, EDGE_SOFT));
    if (t >= 8.2) {
      labels.push({ at: [2.5, -3.4, 2.02], text: "ρ", dx: -4, align: "right" });
      labels.push({ at: [2.5, -3.4, 1.12], text: "Δ", dx: -4, align: "right" });
    }
    if (t >= 11) {
      const [tx, ty] = tileAt(HITS[0]);
      const [dx, dy, dz] = docAt(hitDoc(HITS[0]));
      labels.push({ at: [(tx + dx + 1.1) / 2, (ty + dy) / 2, (0.66 + dz) / 2], text: "EVIDENCE", dy: -8, color: GREEN_LABEL });
    }
    return { shapes, lines, marks, labels };
  },
};


/**
 * Project Reelix: a question comes in, Wikipedia fills it in with a credited photo, a director raises one 3D world of
 * set pieces, the camera flies through them while the narrator speaks, and the browser saves the video as an MP4.
 */
const PROMPT = "WHY IS THE SKY BLUE?";
/** The set pieces in the order the camera visits them, and what each one holds. */
const PIECES: Point[] = [[-0.6, -1.6], [1.2, -1.2], [3.0, -0.6], [4.8, 0.2]];
const PIECE_NAMES = ["TITLE", "CHART", "PHOTO", "KIT MODEL"];
const PLINTH_TOP = 0.45;
const CAM_Z = 2.3;
/** The camera's place on its flight through the pieces, `k` from 0 (first piece) to 1 (last), easing at each stop. */
const cameraAt = (k: number): Point => {
  const s = k * (PIECES.length - 1);
  const i = Math.min(PIECES.length - 2, Math.floor(s));
  const f = easeInOut(s - i);
  return [lerp(PIECES[i][0], PIECES[i + 1][0], f), lerp(PIECES[i][1], PIECES[i + 1][1], f)];
};

const reelix: Scene = {
  id: "reelix",
  duration: 16,
  poster: 11.6,
  bounds: { min: [-6, -4.2, 0], max: [6, 4.2, 3] },
  beats: [
    { at: 0, caption: "ASK ANYTHING · OR UPLOAD A FILE" },
    { at: 3, caption: "WIKIPEDIA FILLS IN · FREE PHOTOS, CREDITED" },
    { at: 6, caption: "A DIRECTOR RAISES ONE 3D WORLD" },
    { at: 9.4, caption: "THE CAMERA FLIES · THE NARRATOR SPEAKS" },
    { at: 13.4, caption: "SAVED AS A 1080P MP4 · ALL IN THE BROWSER" },
  ],
  frame(t) {
    const shapes: Shape[] = [];
    const lines: Line3[] = [];
    const marks: Mark[] = [];
    const labels: Label[] = [];
    shapes.push(box(-5.8, -4, 0, 5.8, 4, 0.3, SLAB));

    // the question, typed into the one box
    shapes.push(box(-5.4, 2.7, 0.3, -1.4, 3.5, 0.5, DARK));
    const typed = PROMPT.slice(0, Math.round(PROMPT.length * span(t, 0.3, 2.4)));
    if (typed) labels.push({ at: [-3.4, 3.1, 0.5], text: typed + (t < 2.6 && Math.floor(t * 3) % 2 === 0 ? "_" : ""), dy: -6 });

    // Wikipedia's pages drop onto a stack; a freely licensed photo stands beside them with its credit
    for (let i = 0; i < 3; i++) {
      const a = easeOut(span(t, 3 + i * 0.25, 3.5 + i * 0.25));
      if (a <= 0) continue;
      const z = 0.3 + i * 0.14 + (1 - a) * 1.2;
      shapes.push(box(-5.1, -1.3, z, -3.4, 0.9, z + 0.1, DOC, EDGE_SOFT));
    }
    if (t >= 3.8) labels.push({ at: [-5.1, 0.9, 0.75], text: "WIKIPEDIA", dy: -6, align: "right" });
    const photo = easeOut(span(t, 4.2, 5));
    if (photo > 0) {
      shapes.push(box(-2.75, -2.1, 0.3, -2.6, -0.5, 0.3 + 1.3 * photo, mix(DOC, CREAM, 0.35), GREEN_EDGE));
      if (photo > 0.95) labels.push({ at: [-2.6, -2.1, 0.3], text: "PHOTO · CC BY", dy: 12, color: GREEN_LABEL });
    }

    // the world: a plinth per scene rises along the path, each holding what its scene shows
    const fly = span(t, 9.4, 13);
    const flying = t >= 9.2;
    PIECES.forEach(([x, y], i) => {
      const a = easeOut(span(t, 6 + i * 0.55, 6.7 + i * 0.55));
      if (a <= 0) return;
      const visit = flying ? clamp01(1 - Math.abs(fly * (PIECES.length - 1) - i) * 1.6) : 0;
      const top = 0.3 + (PLINTH_TOP - 0.3) * a;
      shapes.push(box(x - 0.6, y - 0.6, 0.3, x + 0.6, y + 0.6, top, mix(SLATE, GREEN, 0.55 * visit), visit > 0.5 ? GREEN_EDGE : EDGE_SOFT));
      const glow = mix(SLATE, GREEN, 0.25 + 0.75 * visit);
      if (i === 0) shapes.push(box(x - 0.28, y - 0.28, top, x + 0.28, y + 0.28, top + 0.56 * a, glow, GREEN_EDGE));
      if (i === 1)
        [0.35, 0.7, 1.05].forEach((h, k) => shapes.push(box(x - 0.42 + k * 0.3, y - 0.12, top, x - 0.22 + k * 0.3, y + 0.12, top + h * a, k === 2 ? glow : BAR, k === 2 ? GREEN_EDGE : EDGE_SOFT)));
      if (i === 2) shapes.push(box(x - 0.06, y - 0.48, top, x + 0.06, y + 0.48, top + 0.8 * a, mix(DOC, CREAM, 0.35), visit > 0.5 ? GREEN_EDGE : EDGE_SOFT));
      if (i === 3) {
        // a kit's black hole: a dark core inside a glowing disk
        shapes.push(box(x - 0.14, y - 0.14, top + 0.35, x + 0.14, y + 0.14, top + 0.63, DARK, EDGE));
        lines.push({ pts: circle(x, y, top + 0.49, 0.5 * a, 20), color: `rgba(44,169,66,${0.55 + 0.45 * visit})`, width: 2, depth: x + y + top + 1 });
      }
      if (a > 0.95 && !flying) labels.push({ at: [x, y, top + 1.2], text: PIECE_NAMES[i], dy: -6, color: LABEL_DIM });
    });

    // the camera: lands on each piece in turn, leaving its path behind it
    if (flying) {
      const [cx, cy] = cameraAt(fly);
      const done = fly * (PIECES.length - 1);
      const trail: Vec3[] = PIECES.slice(0, Math.floor(done) + 1).map(([x, y]) => [x, y, CAM_Z + 0.2]);
      trail.push([cx, cy, CAM_Z + 0.2]);
      lines.push({ pts: trail, color: "rgba(44,169,66,0.7)", dash: [3, 4], depth: 100 });
      shapes.push(frustum(cx, cy, CAM_Z - 0.35, 0.1, CAM_Z, 0.22, 10, DARK));
      shapes.push(box(cx - 0.32, cy - 0.24, CAM_Z, cx + 0.32, cy + 0.24, CAM_Z + 0.42, SLATE, EDGE));
      labels.push({ at: [cx, cy, CAM_Z + 0.5], text: t < 13.2 ? "CAMERA · NARRATION" : "CAMERA", dy: -6 });
    }

    // the file: a 1080p MP4, rendered frame by frame
    shapes.push(box(4.9, -3.7, 0.3, 5.1, -1.0, 2.1, DARK));
    const save = easeOut(span(t, 13.4, 15.2));
    lines.push({ pts: [[5.11, -3.4, 1.2], [5.11, -1.3, 1.2]], color: EDGE_SOFT, depth: 100 });
    if (save > 0) shapes.push(box(5.1, -3.4, 1.1, 5.2, -3.4 + 2.1 * save, 1.3, GREEN, GREEN_EDGE));
    labels.push({ at: [5.1, -2.35, 2.1], text: save >= 1 ? "SAVED · 1080P MP4" : "MP4", dy: -6, color: save >= 1 ? GREEN_LABEL : LABEL_DIM });

    return { shapes, lines, marks, labels };
  },
};

// ================================================================ flat scenes (EvalGuard's "how it works" figures)
const PANEL = "rgb(16, 16, 18)";
const PANEL_LINE = "rgba(245, 242, 234, 0.25)";
const GREY_BAR = "rgb(52, 52, 56)";
const DIM_TEXT = "rgba(245, 242, 234, 0.5)";
const SOFT_TEXT = "rgba(245, 242, 234, 0.75)";
const GREEN_FILL = "rgb(44, 169, 66)";

const rect = (p: Painter, x: number, y: number, w: number, h: number, fill: string, stroke: string | null = null, width = 1): void =>
  p.polygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, stroke, width);
const line = (p: Painter, x0: number, y0: number, x1: number, y1: number, color: string, width = 1, dash?: readonly number[]): void =>
  p.polyline([[x0, y0], [x1, y1]], color, width, dash);
/** Small-caps style label with the site's letter spacing. */
const label = (p: Painter, x: number, y: number, text: string, color = LABEL, size = 10, align: Align = "left"): void =>
  p.text(x, y, text, color, size, align, 0.14);
/** Plain monospace text (terminal lines, numbers). */
const mono = (p: Painter, x: number, y: number, text: string, color = CAPTION, size = 11.5, align: Align = "left"): void =>
  p.text(x, y, text, color, size, align, 0);
/** Width of `n` characters of plain mono text at `size` (JetBrains Mono's 0.6em advance). */
const monoWidth = (n: number, size: number): number => n * size * 0.6;

// ---- two numbers out: ρ and Δ
const MATCHERS = ["n-gram", "tf-idf", "paraphrase", "answer-leak"];
/** The 14 of 50 benchmark items the (illustrative) corpus leaks. */
const LEAKED = [3, 7, 11, 14, 19, 22, 26, 29, 31, 36, 40, 43, 47, 49];
const numbersScene: FlatScene = {
  id: "eval-guard-numbers",
  duration: 12,
  poster: 8,
  draw(p, t) {
    const T0 = 1;
    const PER_ROW = 1.1;
    label(p, 30, 34, "BENCHMARK · 50 ITEMS", DIM_TEXT, 9.5);
    const hits: number[] = [];
    for (let i = 0; i < 50; i++) {
      const r = Math.floor(i / 10);
      const c = i % 10;
      const x = 30 + c * 28;
      const y = 54 + r * 28;
      const scanned = clamp01((t - (T0 + r * PER_ROW + c * 0.08)) / 0.25);
      const hot = LEAKED.includes(i) ? scanned : 0;
      if (hot >= 1) hits.push(i);
      const fill = hot > 0 ? `rgba(44,169,66,${0.25 + 0.75 * hot})` : scanned > 0 ? "rgb(46,46,50)" : "rgb(28,28,31)";
      rect(p, x, y, 22, 22, fill, hot > 0.5 ? GREEN_EDGE : "rgba(245,242,234,0.16)");
    }
    const rowF = (t - T0) / PER_ROW;
    if (rowF >= 0 && rowF < 5) {
      const y = 54 + rowF * 28;
      line(p, 30, y, 306, y, "rgba(245,242,234,0.6)");
    }
    const n = hits.length;
    mono(p, 30, 214, `ρ = ${String(n).padStart(2, " ")} / 50 = ${String(Math.round((n / 50) * 100)).padStart(2, " ")}%`, CAPTION, 13);
    label(p, 30, 234, "CONTAMINATION RATE", DIM_TEXT, 9);
    label(p, 30, 262, "EVIDENCE", DIM_TEXT, 9);
    hits.slice(-4).forEach((i, k) => {
      const a = (i * 7) % 40;
      mono(p, 30, 282 + k * 18, `item ${String(i).padStart(2, "0")} ← doc ${1000 + ((i * 37) % 900)} · ${MATCHERS[i % 4]} · ${a}–${a + 20 + (i % 9)}`, SOFT_TEXT, 10.5);
    });
    // the reported score, with the slice the leaked items account for
    const bx = 400;
    const bw = 70;
    const base = 330;
    const scale = 3;
    const reported = 71.4;
    const delta = 5.1 * (n / LEAKED.length);
    const top = base - reported * scale;
    label(p, bx + bw / 2, 34, "REPORTED SCORE", DIM_TEXT, 9.5, "center");
    line(p, 360, base, 570, base, "rgba(245,242,234,0.35)");
    rect(p, bx, top, bw, reported * scale, "rgb(40,40,43)", "rgba(245,242,234,0.35)");
    mono(p, bx + bw / 2, top - 12, reported.toFixed(1), CAPTION, 12, "center");
    if (delta > 0) {
      const h = delta * scale;
      rect(p, bx, top, bw, h, "rgba(44,169,66,0.3)", GREEN_EDGE);
      for (let k = 4; k < h; k += 5) line(p, bx, top + k, bx + bw, top + k, "rgba(44,169,66,0.5)");
      mono(p, bx + bw + 10, top + h / 2, `Δ = +${delta.toFixed(1)} pts`, GREEN_LABEL, 12);
      const honestY = base - (reported - delta) * scale;
      line(p, bx - 28, honestY, bx + bw, honestY, "rgba(245,242,234,0.6)", 1, [3, 3]);
      mono(p, bx - 32, honestY, (reported - delta).toFixed(1), SOFT_TEXT, 11, "right");
    }
    label(p, bx + bw / 2, base + 14, "SCORE INFLATION", DIM_TEXT, 9, "center");
    label(p, 30, 384, "ILLUSTRATIVE AUDIT · EVERY HIT CARRIES ITS SPAN", DIM_TEXT, 9.5);
  },
};

// ---- four matchers, one verdict
const LANES = [
  { name: "N-GRAM · MINHASH-LSH", fire: 3, note: "EXACT SPAN 12–58" },
  { name: "TF-IDF", fire: 4.3, note: "COSINE 0.91" },
  { name: "PARAPHRASE", fire: 5.8, note: "SAME MEANING, NEW WORDS" },
  { name: "ANSWER-LEAK", fire: 7.4, note: "ANSWER TOKEN IN TEXT" },
];
/** Ten corpus documents per lane, laid out with gaps; the sixth is the one that matches. */
const laneBlocks = (k: number): { x: number; w: number }[] => {
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let j = 0; j < 10; j++) {
    const w = 28 + 46 * hash2(k + 1, j + 1);
    out.push({ x, w });
    x += w + 12 + 10 * hash2(k + 3, j);
  }
  const m = out[5].x;
  return out.map((b) => ({ x: b.x - m, w: b.w }));
};
const matchersScene: FlatScene = {
  id: "eval-guard-matchers",
  duration: 12,
  poster: 8.8,
  draw(p, t) {
    const HX = 385;
    const SPEED = 42;
    label(p, 30, 30, "BENCHMARK ITEM 07", DIM_TEXT, 9.5);
    rect(p, 30, 40, 540, 46, "rgb(20,20,23)", PANEL_LINE);
    mono(p, 42, 57, "Which gas do plants take in from the air for photosynthesis?", CAPTION, 11.5);
    mono(p, 42, 74, "A) oxygen   B) carbon dioxide   C) nitrogen   D) argon", SOFT_TEXT, 11);
    if (t >= LANES[3].fire) line(p, 42 + monoWidth(15, 11), 81, 42 + monoWidth(29, 11), 81, GREEN_EDGE, 1.5);
    let fired = 0;
    LANES.forEach((lane, k) => {
      const y0 = 104 + k * 66;
      label(p, 30, y0 + 22, lane.name, LABEL, 9.5);
      rect(p, 200, y0, 370, 44, PANEL, "rgba(245,242,234,0.18)");
      const hot = clamp01((t - lane.fire) / 0.3);
      if (hot >= 1) fired++;
      const blocks = laneBlocks(k);
      const shift = HX - blocks[5].w / 2 + (lane.fire - Math.min(t, lane.fire)) * SPEED;
      blocks.forEach((b, j) => {
        const x0 = Math.max(200, shift + b.x);
        const x1 = Math.min(570, shift + b.x + b.w);
        if (x1 <= x0) return;
        const match = j === 5 && hot > 0;
        rect(p, x0, y0 + 12, x1 - x0, 20, match ? `rgba(44,169,66,${0.25 + 0.6 * hot})` : "rgb(44,44,48)", match ? GREEN_EDGE : null);
      });
      line(p, HX, y0 - 4, HX, y0 + 48, "rgba(245,242,234,0.5)", 1, [3, 3]);
      if (hot > 0) label(p, 570, y0 - 9, lane.note, GREEN_LABEL, 9, "right");
    });
    if (t >= 8.3) {
      mono(p, 30, 372, `${fired} OF 4 FIRED  →  CONTAMINATED`, GREEN_LABEL, 12.5);
      label(p, 570, 372, "WHICH MATCHER · THE SPAN · THE REASON", DIM_TEXT, 9, "right");
    } else {
      label(p, 30, 372, "FOUR INDEPENDENT MATCHERS · EACH HIT KEEPS ITS SPAN AND REASON", DIM_TEXT, 9.5);
    }
  },
};

// ---- the injection harness
const FORMS = [
  { row: 1, name: "verbatim" },
  { row: 3, name: "near-dup" },
  { row: 5, name: "paraphrase" },
  { row: 7, name: "answer leak" },
];
const harnessScene: FlatScene = {
  id: "eval-guard-harness",
  duration: 12,
  poster: 9.5,
  draw(p, t) {
    label(p, 30, 30, "CLEAN CORPUS", DIM_TEXT, 9.5);
    rect(p, 30, 40, 250, 250, PANEL, PANEL_LINE);
    const rowY = (r: number): number => 56 + r * 25;
    const sweepY = 44 + ((t - 3.6) / 2.8) * 246;
    const recoveredAt = (yc: number): number => 3.6 + ((yc - 44) / 246) * 2.8;
    for (let r = 0; r < 9; r++) {
      const w = 110 + 60 * hash2(r, 2);
      rect(p, 44, rowY(r), w, 8, GREY_BAR);
      const form = FORMS.findIndex((f) => f.row === r);
      if (form < 0) continue;
      const planted = easeOut(span(t, 0.6 + form * 0.6, 0.95 + form * 0.6));
      if (planted <= 0) continue;
      rect(p, 44 + w + 6, rowY(r), 56 * planted, 8, GREEN_FILL);
      mono(p, 35, rowY(r) + 4, "+", GREEN_LABEL, 11, "center");
      const yc = rowY(r) + 4;
      const found = easeOut(span(t, recoveredAt(yc), recoveredAt(yc) + 0.3));
      if (found > 0) p.circle(36, yc, 8 * found, form === 3 ? "rgba(44,169,66,0.6)" : GREEN_EDGE, 1, form === 3 ? [2, 2] : undefined);
    }
    if (t >= 3.6 && t <= 6.4) {
      line(p, 32, sweepY, 278, sweepY, "rgba(245,242,234,0.6)");
      label(p, 276, sweepY - 8, "DETECTOR", DIM_TEXT, 8.5, "right");
    }
    // what came back
    label(p, 310, 30, "RECOVERY ON REAL DATA", DIM_TEXT, 9.5);
    mono(p, 310, 46, "OpenBookQA × AG News", DIM_TEXT, 10.5);
    label(p, 310, 68, "FORM", DIM_TEXT, 9);
    label(p, 440, 68, "PRECISION", DIM_TEXT, 9, "center");
    label(p, 525, 68, "RECALL", DIM_TEXT, 9, "center");
    line(p, 310, 78, 570, 78, PANEL_LINE);
    FORMS.forEach((form, k) => {
      const y = 94 + k * 32;
      mono(p, 310, y, form.name, SOFT_TEXT, 11);
      const at = recoveredAt(rowY(form.row) + 4);
      const v = easeOut(span(t, at + 0.2, at + 1));
      const shown = t >= at;
      mono(p, 440, y, shown ? v.toFixed(2) : "—", shown && v >= 1 ? GREEN_LABEL : SOFT_TEXT, 11.5, "center");
      if (k < 3) mono(p, 525, y, shown ? v.toFixed(2) : "—", shown && v >= 1 ? GREEN_LABEL : SOFT_TEXT, 11.5, "center");
      else label(p, 525, y, shown ? "UNDER-REPORTS" : "—", DIM_TEXT, 8.5, "center");
    });
    const tests = Math.round(34 * easeOut(span(t, 7.6, 9)));
    mono(p, 310, 250, `${tests} / 34 TESTS PASSING`, tests === 34 ? GREEN_LABEL : SOFT_TEXT, 13);
    if (tests === 34) mono(p, 310 + monoWidth(21, 13) + 10, 250, "✓", GREEN_LABEL, 14);
    label(p, 310, 272, "PYTEST · CALIBRATION PER FORM", DIM_TEXT, 9);
    label(p, 30, 384, "PLANT KNOWN LEAKS, SCORE WHAT COMES BACK · UNDER-REPORTS, NEVER FABRICATES", DIM_TEXT, 9.5);
  },
};

// ---- the CI gate (a terminal)
type Segment = readonly [string, string];
interface TermLine {
  at: number;
  segments: Segment[];
  typed?: boolean;
  boxed?: boolean;
}
const TYPE_RATE = 48;
const matcherLine = (name: string, took: string): Segment[] => [[`  ${name.padEnd(23)}`, SOFT_TEXT], ["✓", GREEN_LABEL], [`   ${took}`, DIM_TEXT]];
const TERMINAL: TermLine[] = (() => {
  const runs = [
    {
      cmd: "evalguard audit --corpus train.jsonl --benchmark obqa --fail-above 0.05",
      result: [["ρ 2.8%   Δ +0.9 pts   evidence 14 spans → audit.json", CAPTION]] as Segment[],
      gate: { segments: [["gate  PASS   ρ under 5%   exit 0", GREEN_LABEL]] as Segment[], boxed: false },
    },
    {
      cmd: "evalguard audit --corpus train+scraped.jsonl --benchmark obqa --fail-above 0.05",
      result: [["ρ 12.0%   Δ +4.6 pts   evidence 60 spans → audit.json", CAPTION]] as Segment[],
      gate: { segments: [["gate  BLOCK  ρ over 5%   exit 1   promotion halted", CAPTION]] as Segment[], boxed: true },
    },
  ];
  const out: TermLine[] = [];
  let clock = 0.3;
  for (const run of runs) {
    out.push({ at: clock, segments: [["$ " + run.cmd, CAPTION]], typed: true });
    clock += run.cmd.length / TYPE_RATE + 0.45;
    const body: { segments: Segment[]; boxed?: boolean }[] = [
      { segments: [["scanning 48,212 docs × 500 items", DIM_TEXT]] },
      { segments: matcherLine("n-gram · minhash-lsh", "231 ms") },
      { segments: matcherLine("tf-idf", "1.2 s") },
      { segments: matcherLine("paraphrase", "3.8 s") },
      { segments: matcherLine("answer-leak", "410 ms") },
      { segments: run.result },
      run.gate,
    ];
    for (const item of body) {
      out.push({ at: clock, ...item });
      clock += 0.45;
    }
    clock += 0.7;
  }
  out.push({ at: clock, segments: [["$ ", CAPTION]], typed: true });
  return out;
})();
const gateScene: FlatScene = {
  id: "eval-guard-gate",
  duration: 14,
  poster: 13.2,
  draw(p, t) {
    rect(p, 30, 28, 540, 340, "rgb(14,14,16)", PANEL_LINE);
    for (const x of [46, 60, 74]) p.circle(x, 42, 3.5, null, 1, undefined, "rgb(60,60,64)");
    mono(p, 300, 42, "ci · promotion gate", DIM_TEXT, 10.5, "center");
    line(p, 30, 56, 570, 56, PANEL_LINE);
    const size = 11;
    let y = 72;
    let last: TermLine | undefined;
    for (const item of TERMINAL) {
      if (t < item.at) break;
      last = item;
      let x = 44;
      if (item.boxed) rect(p, 40, y - 9, monoWidth(item.segments[0][0].length, size) + 8, 18, "rgba(245,242,234,0.06)", "rgba(245,242,234,0.55)");
      for (const [text, color] of item.segments) {
        const shown = item.typed ? text.slice(0, 2 + Math.floor((t - item.at) * TYPE_RATE)) : text;
        mono(p, x, y, shown, color, size);
        x += monoWidth(shown.length, size);
      }
      const typing = item.typed && t - item.at < item.segments[0][0].length / TYPE_RATE;
      const prompt = item === TERMINAL[TERMINAL.length - 1];
      if ((typing || prompt) && Math.floor(t * 2) % 2 === 0) rect(p, x + 1, y - 6, 6, 12, "rgba(245,242,234,0.8)");
      y += 16;
    }
    if (!last) rect(p, 45, 66, 6, 12, "rgba(245,242,234,0.8)");
    label(p, 30, 386, "ILLUSTRATIVE RUNS · EXIT CODE 1 ABOVE THE THRESHOLD STOPS THE PIPELINE", DIM_TEXT, 9.5);
  },
};

// ================================================================ flat scenes (Project Reelix's "how it works" figures)
const OUTLINE = "rgba(0,0,0,0)";

// ---- from a question to a storyboard
const ARTICLE_LINES = 9;
/** The article's sentences the planner keeps, in order, and the scene each one becomes. */
const PICKS: { line: number; scene: string }[] = [
  { line: 0, scene: "TITLE · WHY IS THE SKY BLUE?" },
  { line: 1, scene: "DEFINITION · DIFFUSE SKY RADIATION" },
  { line: 3, scene: "KEY POINTS · 3 ITEMS" },
  { line: 4, scene: "STAT · 42% IS VISIBLE LIGHT" },
  { line: 6, scene: "CHART · SCATTERING BY COLOR" },
  { line: 8, scene: "IN SHORT · ONE LINE" },
];
const PICK_START = 3.6;
const PICK_STEP = 0.7;
const plannerScene: FlatScene = {
  id: "reelix-planner",
  duration: 12,
  poster: 9.5,
  draw(p, t) {
    const question = "why is the sky blue?";
    label(p, 30, 34, "THE QUESTION", DIM_TEXT, 9.5);
    rect(p, 30, 46, 230, 30, PANEL, PANEL_LINE);
    const typed = question.slice(0, Math.round(question.length * clamp01(t / 1.4)));
    mono(p, 42, 61, typed + (t < 1.6 && Math.floor(t * 3) % 2 === 0 ? "_" : ""), CAPTION, 12);
    label(p, 30, 102, "WIKIPEDIA · DIFFUSE SKY RADIATION", DIM_TEXT, 9.5);
    rect(p, 30, 112, 230, 248, PANEL, PANEL_LINE);
    for (let i = 0; i < ARTICLE_LINES; i++) {
      const a = clamp01((t - 1.6 - i * 0.12) / 0.3);
      if (a <= 0) continue;
      const pick = PICKS.findIndex((k) => k.line === i);
      const on = pick >= 0 ? clamp01((t - PICK_START - pick * PICK_STEP) / 0.35) : 0;
      const w = 160 + 40 * hash2(i, 2.2);
      const y = 128 + i * 26;
      rect(p, 44, y, w * a, 8, on > 0 ? `rgba(44,169,66,${0.35 + 0.65 * on})` : GREY_BAR, null);
      rect(p, 44, y + 11, (w - 60) * a, 5, "rgb(38,38,42)", null);
      if (on > 0) line(p, 44 + w, y + 4, 330, 66 + pick * 50, `rgba(44,169,66,${0.6 * on})`, 1, [3, 3]);
    }
    label(p, 330, 34, "THE STORYBOARD", DIM_TEXT, 9.5);
    PICKS.forEach((k, i) => {
      const on = clamp01((t - PICK_START - i * PICK_STEP) / 0.35);
      if (on <= 0) return;
      const y = 50 + i * 50;
      rect(p, 330 + (1 - on) * 20, y, 240, 32, PANEL, on >= 1 ? GREEN_EDGE : PANEL_LINE);
      mono(p, 344 + (1 - on) * 20, y + 16, k.scene, on >= 1 ? CAPTION : SOFT_TEXT, 10.5);
    });
    label(p, 30, 384, "A RULE BASED PLANNER IN THE BROWSER · NO API KEY", DIM_TEXT, 9.5);
  },
};

// ---- motion on the spoken word
const CUE_WORDS = ["Sunlight", "holds", "every", "color,", "air", "scatters", "blue", "most,", "and", "sunsets", "turn", "red."];
/** The items' key words (indexes into CUE_WORDS) and what each item shows. */
const CUE_AT = [0, 5, 9];
const CUE_ITEMS = ["SUNLIGHT", "SCATTERS BLUE", "SUNSETS"];
const cuesScene: FlatScene = {
  id: "reelix-cues",
  duration: 10,
  poster: 7.6,
  draw(p, t) {
    const x0 = 40;
    const x1 = 560;
    // each word gets room in proportion to its length, so the narration reads as one spaced line
    const room = CUE_WORDS.reduce((n, w) => n + w.length + 1.5, 0);
    const starts = CUE_WORDS.map((_, i) => x0 + ((x1 - x0) * CUE_WORDS.slice(0, i).reduce((n, w) => n + w.length + 1.5, 0)) / room);
    const centre = (i: number): number => starts[i] + ((x1 - x0) * (CUE_WORDS[i].length + 1.5)) / room / 2;
    const playX = x0 + (x1 - x0) * clamp01((t - 0.8) / 7.2);
    const cueX = (i: number): number => centre(CUE_AT[i]);
    label(p, 40, 34, "ON SCREEN", DIM_TEXT, 9.5);
    CUE_ITEMS.forEach((name, i) => {
      const since = playX - cueX(i);
      if (since <= 0) return;
      const a = clamp01(since / 18);
      const s = 1 + 0.25 * Math.sin(Math.PI * clamp01(since / 40));
      const cx = Math.max(64, cueX(i));
      rect(p, cx - 22 * s, 92 - 22 * s, 44 * s, 44 * s, `rgba(44,169,66,${0.3 + 0.5 * a})`, GREEN_EDGE);
      label(p, cx, 134, name, a >= 1 ? CAPTION : SOFT_TEXT, 10, "center");
    });
    label(p, 40, 170, "VOICE · KOKORO 82M IN WEB WORKERS", DIM_TEXT, 9.5);
    for (let k = 0; k < 104; k++) {
      const x = x0 + k * 5;
      const h = 4 + 26 * hash2(k, 4.4) * (0.4 + 0.6 * Math.sin(k * 0.47) ** 2);
      rect(p, x, 210 - h / 2, 3, h, x < playX ? "rgba(245,242,234,0.55)" : "rgb(52,52,56)", null);
    }
    CUE_WORDS.forEach((w, i) => {
      const x = centre(i);
      const spoken = playX >= starts[i];
      const cue = CUE_AT.includes(i);
      mono(p, x, 252, w, cue && spoken ? GREEN_LABEL : spoken ? CAPTION : DIM_TEXT, 10.5, "center");
      if (cue) {
        p.polygon([[x, 266], [x + 5, 271], [x, 276], [x - 5, 271]], spoken ? GREEN_FILL : "rgb(52,52,56)", GREEN_EDGE, 1);
        line(p, x, 238, x, 146, `rgba(44,169,66,${spoken ? 0.6 : 0.2})`, 1, [2, 3]);
      }
    });
    line(p, playX, 180, playX, 284, "rgba(245,242,234,0.85)", 1.5);
    label(p, 40, 306, "SOUND", DIM_TEXT, 9.5);
    CUE_AT.forEach((_, i) => {
      const x = cueX(i);
      const on = playX >= x;
      rect(p, x - 16, 316, 32, 16, on ? "rgba(44,169,66,0.35)" : PANEL, on ? GREEN_EDGE : PANEL_LINE);
      mono(p, x, 324, "POP", on ? CAPTION : DIM_TEXT, 9, "center");
    });
    label(p, 40, 360, "WORD TIMES FROM SYLLABLES, SNAPPED TO PAUSES", DIM_TEXT, 9.5);
    label(p, 40, 384, "EACH ENTRANCE LANDS WITHIN 150 MS OF ITS WORD", DIM_TEXT, 9.5);
  },
};

// ---- free photos, credited
/** Candidate photos: where each came from, its licence, why it is dropped (if it is), and its score for the scene. */
const CANDIDATES: { src: string; lic: string; drop: string; score: number }[] = [
  { src: "WIKIPEDIA", lic: "PUBLIC DOMAIN", drop: "", score: 0.9 },
  { src: "WIKIPEDIA", lic: "CC BY-NC 2.0", drop: "NC", score: 0 },
  { src: "WIKIPEDIA", lic: "CC0", drop: "DIAGRAM", score: 0 },
  { src: "COMMONS", lic: "CC BY-SA 4.0", drop: "", score: 0.5 },
  { src: "COMMONS", lic: "CC BY 4.0", drop: "", score: 0.75 },
  { src: "COMMONS", lic: "CC BY-ND 4.0", drop: "ND", score: 0 },
  { src: "OPENVERSE", lic: "CC BY 2.0", drop: "", score: 0.3 },
  { src: "OPENVERSE", lic: "UNKNOWN", drop: "?", score: 0 },
];
const PHOTO_SLOTS = [
  { name: "TITLE", pick: 0, credit: "PHOTO: NASA, PUBLIC DOMAIN" },
  { name: "DEFINITION", pick: 4, credit: "PHOTO: ESO, CC BY 4.0" },
];
const candidateAt = (i: number): Point => [30 + (i % 4) * 82, 50 + Math.floor(i / 4) * 124];
/** A stand-in photo: a dark frame with a few soft bands. */
const photoTile = (p: Painter, x: number, y: number, stroke: string): void => {
  rect(p, x, y, 70, 52, "rgb(40,40,44)", stroke);
  for (let k = 0; k < 3; k++) rect(p, x + 6, y + 10 + k * 12, 58 - k * 12, 6, "rgba(245,242,234,0.13)", null);
};
const photosScene: FlatScene = {
  id: "reelix-photos",
  duration: 12,
  poster: 9.6,
  draw(p, t) {
    label(p, 30, 34, "CANDIDATES", DIM_TEXT, 9.5);
    CANDIDATES.forEach((c, i) => {
      const [x, y] = candidateAt(i);
      if (t < 0.4 + i * 0.12) return;
      const dropped = c.drop !== "" && t >= 2.4 + i * 0.18;
      const moved = PHOTO_SLOTS.some((s, k) => s.pick === i && t >= 6.4 + k * 0.6);
      if (dropped) {
        rect(p, x, y, 70, 52, "rgb(22,22,24)", PANEL_LINE);
        line(p, x, y, x + 70, y + 52, "rgba(245,242,234,0.4)");
        line(p, x + 70, y, x, y + 52, "rgba(245,242,234,0.4)");
        mono(p, x + 35, y + 26, c.drop, CAPTION, 9.5, "center");
      } else if (moved) rect(p, x, y, 70, 52, OUTLINE, "rgba(245,242,234,0.2)", 1);
      else photoTile(p, x, y, PANEL_LINE);
      label(p, x, y + 66, c.src, DIM_TEXT, 8);
      mono(p, x, y + 80, c.lic, dropped ? "rgba(245,242,234,0.35)" : SOFT_TEXT, 9);
      const scored = clamp01((t - 4.6 - i * 0.1) / 0.5);
      if (c.drop === "" && scored > 0) rect(p, x, y + 92, 70 * c.score * scored, 5, GREEN_FILL, null);
    });
    label(p, 380, 34, "SCENES", DIM_TEXT, 9.5);
    PHOTO_SLOTS.forEach((s, k) => {
      const y = 50 + k * 124;
      rect(p, 380, y, 190, 110, PANEL, PANEL_LINE);
      label(p, 392, y + 14, s.name, DIM_TEXT, 8.5);
      const m = clamp01((t - 6.4 - k * 0.6) / 0.6);
      if (m <= 0) return;
      const [sx, sy] = candidateAt(s.pick);
      const e = easeInOut(m);
      const x = lerp(sx, 400, e);
      const y2 = lerp(sy, y + 34, e);
      // moving photos: the depth layers lift off the photo
      const depth = clamp01((t - 8.6) / 0.8);
      for (let d = 3; d >= 1 && depth > 0; d--) rect(p, x + d * 3 * depth, y2 - d * 3 * depth, 70, 52, OUTLINE, `rgba(44,169,66,${0.25 * depth})`, 1);
      photoTile(p, x, y2, GREEN_EDGE);
      if (m >= 1) mono(p, 475, y + 100, s.credit, GREEN_LABEL, 8.5, "center");
      if (depth > 0 && k === 1) label(p, 482, y2 + 20, "DEPTH", GREEN_LABEL, 8.5);
    });
    label(p, 30, 360, "ONLY PD, CC0, CC BY, CC BY-SA · NO DRAWINGS · ONE PER SCENE", DIM_TEXT, 9.5);
    label(p, 30, 384, "MOVING PHOTOS · DEPTH ANYTHING V2 RAISES THEM INTO RELIEF", DIM_TEXT, 9.5);
  },
};

// ---- any frame, any order
const FRAMES = 12;
/** The order the preview happens to visit the frames in, as a viewer scrubs. */
const SCRUB = [7, 2, 10, 4, 0, 9, 5, 11, 1, 6, 3, 8];
const CHECKS = [
  { frame: 3, t: "20.3", hash: "de4c967c" },
  { frame: 7, t: "47.3", hash: "9a10c2f5" },
  { frame: 10, t: "67.6", hash: "3be7d401" },
];
const exportScene: FlatScene = {
  id: "reelix-export",
  duration: 12,
  poster: 8,
  draw(p, t) {
    const x0 = 40;
    const cw = 43;
    label(p, 40, 34, "PREVIEW · SCRUBBED IN ANY ORDER · 1280×720", DIM_TEXT, 9.5);
    const seen = Math.floor(clamp01((t - 0.5) / 5.5) * FRAMES);
    for (let i = 0; i < FRAMES; i++) rect(p, x0 + i * cw, 50, cw - 6, 28, SCRUB.slice(0, seen).includes(i) ? "rgb(44,44,48)" : PANEL, PANEL_LINE);
    if (seen > 0 && t < 6.2) {
      const i = SCRUB[seen - 1];
      rect(p, x0 + i * cw, 50, cw - 6, 28, "rgba(245,242,234,0.15)", "rgba(245,242,234,0.85)", 1.5);
    }
    label(p, 40, 116, "EXPORT · EVERY FRAME IN ORDER · 1920×1080", DIM_TEXT, 9.5);
    const save = clamp01((t - 1) / 6);
    const done = save * FRAMES;
    for (let i = 0; i < FRAMES; i++) {
      const a = clamp01(done - i);
      rect(p, x0 + i * cw, 132, cw - 6, 28, a > 0 ? `rgba(44,169,66,${0.2 + 0.5 * a})` : PANEL, a >= 1 ? GREEN_EDGE : PANEL_LINE);
    }
    label(p, 40, 198, "THE SAME t GIVES THE SAME FRAME", DIM_TEXT, 9.5);
    CHECKS.forEach((c, k) => {
      if (done < c.frame + 1 || seen <= SCRUB.indexOf(c.frame)) return;
      // the matched frame, outlined in both rows
      rect(p, x0 + c.frame * cw - 2, 48, cw - 2, 32, OUTLINE, GREEN_EDGE, 1.5);
      rect(p, x0 + c.frame * cw - 2, 130, cw - 2, 32, OUTLINE, CAPTION, 1.5);
      mono(p, 40, 220 + k * 20, `t = ${c.t} s   preview ${c.hash}   export ${c.hash}   MATCH`, SOFT_TEXT, 10.5);
    });
    label(p, 40, 300, "MP4 · H.264 + AAC THROUGH WEBCODECS", DIM_TEXT, 9.5);
    mono(p, 540, 300, `${Math.round(save * 81)} / 81 S OF VIDEO`, save >= 1 ? GREEN_LABEL : SOFT_TEXT, 10, "right");
    rect(p, 40, 312, 500, 14, PANEL, PANEL_LINE);
    if (save > 0) rect(p, 40, 312, 500 * save, 14, "rgba(44,169,66,0.6)", null);
    if (save >= 1) mono(p, 40, 348, "SAVED · AN 81 S VIDEO IN 27 S, A THIRD OF REAL TIME", GREEN_LABEL, 10.5);
    label(p, 40, 384, "FRAME t IS A PURE FUNCTION OF t · EXPORT MATCHES PREVIEW", DIM_TEXT, 9.5);
  },
};

/** Every scene by id; a project's `cover.scene` or a figure's `scene` names one. */
export const SCENES: Record<string, AnyScene> = {
  [planetX.id]: planetX,
  [reelix.id]: reelix,
  [plannerScene.id]: plannerScene,
  [cuesScene.id]: cuesScene,
  [photosScene.id]: photosScene,
  [exportScene.id]: exportScene,
  [evalGuard.id]: evalGuard,
  [numbersScene.id]: numbersScene,
  [matchersScene.id]: matchersScene,
  [harnessScene.id]: harnessScene,
  [gateScene.id]: gateScene,
};
