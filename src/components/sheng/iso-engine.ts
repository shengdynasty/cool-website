/**
 * Isometric scene engine for the project visuals (design after aumsuthar.com's project cards, in this site's
 * palette): low-poly parts drawn as flat-shaded faces with cream edges on black, an orthographic isometric camera,
 * labels anchored to points in the scene, and a caption for each beat of a looping storyboard.
 *
 * In the browser each `[data-scene]` cover gets a Canvas 2D player (`initIsoScenes`): it animates only while in
 * view, at 30 fps, and shows one still frame under reduced motion. The same frame renders to SVG for the build-time
 * posters (`renderSvg`, used by scripts/render-scene-posters.mjs). The scenes live at the bottom of this file, so
 * neither the artifact bundle nor the poster script needs a cross-module import.
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

/** Fits the scene's bounds into the canvas, leaving a band at the bottom for the caption. */
function fitCamera(scene: Scene, w: number, h: number): Camera {
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
  const padBottom = 0.17 * h;
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
  circle(x: number, y: number, r: number, stroke: string, width: number, dash?: readonly number[]): void;
  text(x: number, y: number, text: string, color: string, size: number, align: Align): void;
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

  circle(x: number, y: number, r: number, stroke: string, width: number, dash: readonly number[] = []): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.setLineDash(dash as number[]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  text(x: number, y: number, text: string, color: string, size: number, align: Align): void {
    const { ctx } = this;
    ctx.font = `500 ${size}px ${this.mono}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.14em";
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

/** Collects the frame as SVG markup (the build-time poster). */
export class SvgPainter implements Painter {
  private readonly font: string;
  private readonly parts: string[] = [];

  constructor(font: string) {
    this.font = font;
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

  circle(x: number, y: number, r: number, stroke: string, width: number, dash?: readonly number[]): void {
    const d = dash && dash.length ? ` stroke-dasharray="${dash.map(num).join(" ")}"` : "";
    this.parts.push(`<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="none" stroke="${stroke}" stroke-width="${num(width)}"${d}/>`);
  }

  text(x: number, y: number, text: string, color: string, size: number, align: Align): void {
    const anchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
    this.parts.push(
      `<text x="${num(x)}" y="${num(y)}" fill="${color}" font-family="${escapeXml(this.font)}" font-weight="500" font-size="${num(size)}" letter-spacing="${num(size * 0.14)}" text-anchor="${anchor}" dominant-baseline="central" stroke="${BG}" stroke-width="${num(Math.max(2, size * 0.3))}" stroke-linejoin="round" paint-order="stroke">${escapeXml(text)}</text>`,
    );
  }

  toString(w: number, h: number): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(w)}" height="${num(h)}" viewBox="0 0 ${num(w)} ${num(h)}">${this.parts.join("")}</svg>`;
  }
}

// ---------------------------------------------------------------- drawing a frame
/** The caption in force at `t`. */
export function captionAt(scene: Scene, t: number): string {
  let caption = scene.beats[0]?.caption ?? "";
  for (const beat of scene.beats) if (t >= beat.at) caption = beat.caption;
  return caption;
}

/** Draws the scene at time `t` into a `w`×`h` canvas (CSS pixels). `caption` overrides the beat's text (scrambles). */
export function drawFrame(painter: Painter, scene: Scene, w: number, h: number, t: number, caption?: string): void {
  painter.clear(w, h, BG);
  const cam = fitCamera(scene, w, h);
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
  const labelPx = fontPx * 0.92;
  for (const label of frame.labels) {
    const [x, y] = toScreen(cam, label.at);
    painter.text(x + ((label.dx ?? 0) * labelPx) / 10, y + ((label.dy ?? 0) * labelPx) / 10, label.text, label.color ?? LABEL, labelPx, label.align ?? "center");
  }
  painter.text(w * 0.045, h - fontPx * 1.6, caption ?? captionAt(scene, t), CAPTION, fontPx, "left");
}

/** The scene at time `t` as an SVG document (the poster). */
export function renderSvg(scene: Scene, w: number, h: number, t = scene.poster, font = "JetBrains Mono"): string {
  const painter = new SvgPainter(font);
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
  private readonly scene: Scene;
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

  constructor(canvas: HTMLCanvasElement, scene: Scene, ctx: CanvasRenderingContext2D, mono: string) {
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

/** Every scene by id; a project's `cover.scene` names one. */
export const SCENES: Record<string, Scene> = { [planetX.id]: planetX };
