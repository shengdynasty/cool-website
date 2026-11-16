/**
 * ASCII portrait engine, framework-free so the static artifact build can run it without React.
 * Port of murphmaxxing.com's `UltraMark` (page chunk, webpack module 246): an ASCII cell grid that sweeps in
 * left to right, then breathes with slow colour waves. Same engine, but the per-cell layers are derived from
 * Sheng's portrait cutout instead of a rendered word, and the palette is black and white.
 */

type Rgb = readonly [number, number, number];
type ColorRamp = readonly (readonly [position: number, color: Rgb])[];

/**
 * Fill cells (source: 6-stop pastel ramp). Kept a step below white: the hover wave and the ambient pulse
 * work by mixing cells toward white, so near-white greys would hide them.
 */
const FILL_RAMP: ColorRamp = [
  [0, [218, 216, 210]],
  [0.25, [200, 198, 193]],
  [0.5, [224, 222, 216]],
  [0.75, [194, 192, 187]],
  [1, [218, 216, 210]],
];
/** Outline ring around the silhouette (source: 8-stop rainbow ramp). */
const OUTLINE_RAMP: ColorRamp = [
  [0, [44, 169, 66]],
  [0.5, [127, 217, 143]],
  [1, [44, 169, 66]],
]; // MailZoo green edge, like the source's coloured outline
/** Drop-shadow cells pulse between these two greys. */
const SHADOW_DARK: Rgb = [34, 34, 34];
const SHADOW_LIGHT: Rgb = [64, 64, 64];
const FILL_TINT: Rgb = [118, 118, 118];
const GLYPH_LAYER_COLOR = "#F5F2EA";
const GLYPHS = "{}[]<>/=#:;+*";

const SWEEP_MS = 1700;
const SWEEP_DELAY_MS = 250;
const WAVE_MS = 1100;
const AMBIENT_PERIOD_S = 8.2;
/** Frames are spaced at least this far apart (about 60fps, also on 120Hz displays). */
const MIN_FRAME_GAP_MS = 16;
/** While sweeping, every cell's glyph re-rolls at this interval. */
const GLYPH_TICK_MS = 70;
/** Layer values below this are treated as empty. */
const MIN_LAYER = 0.04;

/** Looks a colour up on a ramp, wrapping `position` into [0, 1) so ramps can scroll forever; written into `out`
 * so the per-frame cell loop allocates nothing. */
function sampleRampInto(ramp: ColorRamp, position: number, out: Float64Array): void {
  const wrapped = position - Math.floor(position);
  for (let stop = 1; stop < ramp.length; stop++) {
    if (wrapped <= ramp[stop][0]) {
      const fromAt = ramp[stop - 1][0], from = ramp[stop - 1][1];
      const toAt = ramp[stop][0], to = ramp[stop][1];
      const amount = (wrapped - fromAt) / (toAt - fromAt);
      out[0] = from[0] + (to[0] - from[0]) * amount;
      out[1] = from[1] + (to[1] - from[1]) * amount;
      out[2] = from[2] + (to[2] - from[2]) * amount;
      return;
    }
  }
  const last = ramp[ramp.length - 1][1];
  out[0] = last[0];
  out[1] = last[1];
  out[2] = last[2];
}

/** Deterministic per-cell noise in [0, 1) (the classic sin-fract hash). */
const hash = (x: number, y: number) => {
  const value = 43758.5453 * Math.sin(127.1 * x + 311.7 * y);
  return value - Math.floor(value);
};
const glyphAt = (x: number, y: number) => GLYPHS[Math.floor(hash(x, y) * GLYPHS.length)];
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export interface PortraitMarkOptions {
  /** RGBA cutout: grey photo in RGB, Vision person mask in alpha (3:2). */
  src: string;
  /** CSS font-family string for JetBrains Mono. */
  mono: string;
}

/**
 * Animates `canvas` as an ASCII portrait. The sweep-in plays the first time the canvas is on screen
 * (the source started it on page load, which below the fold meant nobody saw it). Returns a cleanup function.
 */
export function initPortraitMark(canvas: HTMLCanvasElement, { src, mono }: PortraitMarkOptions): () => void {
  const ctx = canvas.getContext("2d");
  // Static glyph layer, composited at half alpha over the colour cells once the sweep is done.
  const glyphLayer = document.createElement("canvas");
  const glyphCtx = glyphLayer.getContext("2d");
  // One pixel per cell: the cutout is resampled here and read back as the cell layers.
  const sampler = document.createElement("canvas");
  const samplerCtx = sampler.getContext("2d", { willReadFrequently: true });
  // One pixel per cell again, for drawing: each frame's cell colours are written into this image and blitted
  // up to the canvas with smoothing off, so a frame costs one putImageData and one drawImage instead of a
  // fillRect (and a colour string) per cell.
  const cells = document.createElement("canvas");
  const cellsCtx = cells.getContext("2d");
  if (!ctx || !glyphCtx || !samplerCtx || !cellsCtx) return () => {};
  let cellImage: ImageData | null = null;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let portrait: HTMLImageElement | null = null;
  let cols = 0;
  let rows = 0;
  let cellWidth = 0;
  let cellHeight = 0;
  let pixelRatio = 1;
  let fill = new Float32Array(0);
  let outline = new Float32Array(0);
  let shadow = new Float32Array(0);
  /** When each cell appears during the sweep (0–1 across the grid, jittered per cell); static per layout. */
  let revealAt = new Float32Array(0);
  const ramp = new Float64Array(3);
  let frameId = 0;
  let lastFrameAt = 0;
  let visible = false;
  let loaded = false;
  let started = false;
  let sweepStart = 0;
  let waveStart = -1e9;
  let disposed = false;

  // Sizes the backing store, picks the cell grid, and rebuilds the cell layers and the static glyph layer.
  const layout = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height || !portrait) return;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    cellWidth = width < 400 ? 2.6 : 3.4;
    cellHeight = 1.6 * cellWidth;
    cols = Math.floor(width / cellWidth);
    rows = Math.floor(height / cellHeight);

    // Draw the cutout stretched to one pixel per cell (cells are 1:1.6, so this keeps the photo's aspect).
    sampler.width = cols;
    sampler.height = rows;
    samplerCtx.drawImage(portrait, 0, 0, cols, rows);
    const pixels = samplerCtx.getImageData(0, 0, cols, rows).data;
    const cellCount = cols * rows;
    const mask = new Float32Array(cellCount);
    fill = new Float32Array(cellCount);
    for (let index = 0; index < cellCount; index++) {
      const alpha = pixels[4 * index + 3] / 255; // person mask
      // Grey luminance. Canvas data is un-premultiplied on read, so fully transparent pixels read 0 here,
      // which is harmless because alpha is 0 there too.
      const luminance = pixels[4 * index] / 255;
      mask[index] = alpha;
      // Dark areas keep a 16% floor so hair and clothing still read as part of the figure.
      fill[index] = alpha * (0.16 + 0.84 * smoothstep(0.06, 0.78, luminance));
    }

    // The source's second pass (word filled and stroked) becomes the mask dilated by one cell (3×3 max).
    const stroke = new Float32Array(cellCount);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let peak = 0;
        for (let y = Math.max(0, row - 1); y <= Math.min(rows - 1, row + 1); y++) {
          for (let x = Math.max(0, col - 1); x <= Math.min(cols - 1, col + 1); x++) {
            peak = Math.max(peak, mask[y * cols + x]);
          }
        }
        stroke[row * cols + col] = peak;
      }
    }
    outline = new Float32Array(cellCount);
    shadow = new Float32Array(cellCount);
    revealAt = new Float32Array(cellCount);
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) revealAt[row * cols + col] = 0.22 * hash(col, row) + 0.78 * (col / cols);
    for (let index = 0; index < cellCount; index++) {
      // Outline: the one-cell ring the dilation adds around the silhouette.
      outline[index] = Math.max(0, stroke[index] - mask[index]);
      // Drop shadow: stroke coverage from 1–2 rows above that this cell's own stroke doesn't cover.
      let above = 0;
      for (let lift = 1; lift <= 2; lift++) {
        const aboveIndex = index - lift * cols;
        if (aboveIndex >= 0) above = Math.max(above, stroke[aboveIndex]);
      }
      shadow[index] = Math.max(0, above - stroke[index]);
    }

    cells.width = cols;
    cells.height = rows;
    cellImage = cellsCtx.createImageData(cols, rows);

    glyphLayer.width = canvas.width;
    glyphLayer.height = canvas.height;
    glyphCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    glyphCtx.font = `700 ${1.02 * cellHeight}px ${mono}`;
    glyphCtx.textAlign = "center";
    glyphCtx.textBaseline = "middle";
    glyphCtx.fillStyle = GLYPH_LAYER_COLOR;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const alpha = Math.min(1, fill[index] + 0.9 * outline[index] + 0.35 * shadow[index]);
        if (alpha < MIN_LAYER) continue;
        glyphCtx.globalAlpha = alpha;
        glyphCtx.fillText(glyphAt(col, row), col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
      }
    }
  };

  // Draws the frame for time `now`; returns whether the animation should keep running.
  const paint = (now: number) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    if (!cellImage) return false;
    const sweepProgress = reducedMotion ? 1 : clamp01((now - sweepStart) / SWEEP_MS);
    const sweeping = sweepProgress < 1;
    // Reveal front; it overshoots to 1.04 so the most-jittered cells on the right still land.
    const front = 1.04 * easeOutCubic(sweepProgress);
    // Seconds since the sweep ended, and an ambient strength that eases in from 0 towards 1.
    const ambientSeconds = reducedMotion ? 0 : Math.max(0, (now - sweepStart - SWEEP_MS) / 1000);
    const ambient = 1 - Math.exp(-ambientSeconds);
    // The outline ramp scrolls in with the sweep, then keeps drifting slowly.
    const rampShift = (1 - easeOutCubic(sweepProgress)) * 1.2 - (ambientSeconds - ambient) / 22;
    const waveProgress = (now - waveStart) / WAVE_MS;
    const waveActive = waveProgress >= 0 && waveProgress < 1;
    const glyphTick = sweeping ? Math.floor(now / GLYPH_TICK_MS) : 0;
    const px = cellImage.data;
    px.fill(0);
    // While sweeping, each painted layer also draws its glyph over the cell (as the source did); collected
    // here and drawn after the blocks so they sit on top.
    const glyphs: { x: number; y: number; css: string; alpha: number; glyph: string }[] = [];

    // Composites one layer onto the current cell (source-over, like the fillRect it replaces).
    let cellR = 0, cellG = 0, cellB = 0, cellA = 0;
    const paintCell = (col: number, row: number, r: number, g: number, b: number, glyphWhiten: number, alpha: number, glyph: string) => {
      const a = 0.9 * alpha;
      const outA = a + cellA * (1 - a);
      if (outA > 0) {
        const keep = (cellA * (1 - a)) / outA;
        cellR = (r * a) / outA + cellR * keep;
        cellG = (g * a) / outA + cellG * keep;
        cellB = (b * a) / outA + cellB * keep;
        cellA = outA;
      }
      if (sweeping) {
        const css = `rgb(${(r + (255 - r) * glyphWhiten) | 0},${(g + (255 - g) * glyphWhiten) | 0},${(b + (255 - b) * glyphWhiten) | 0})`;
        glyphs.push({ x: col * cellWidth + cellWidth / 2, y: row * cellHeight + cellHeight / 2, css, alpha, glyph });
      }
    };

    for (let row = 0; row < rows; row++) {
      const rowFraction = row / rows;
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const fillAlpha = fill[index];
        const outlineAlpha = outline[index];
        const shadowAlpha = shadow[index];
        if (fillAlpha < MIN_LAYER && outlineAlpha < MIN_LAYER && shadowAlpha < MIN_LAYER) continue;
        const colFraction = col / cols;
        // A cell appears once the front passes its column, jittered per cell.
        const appears = revealAt[index];
        if (appears > front) continue;
        const glyph = sweeping ? glyphAt(col + glyphTick, row) : "";
        // Distance to the slanted pointerenter wave, which travels from -0.2 to 1.2 across the grid.
        const waveDistance = waveActive ? Math.abs(colFraction + 0.06 * rowFraction - (1.4 * waveProgress - 0.2)) : 1;
        // Cells on the sweep's leading edge, or under the wave, flash towards white.
        const highlight = sweeping && front - appears < 0.04 ? 1 : clamp01(1 - waveDistance / 0.09) ** 2;
        const pulse =
          ambient * (0.5 + 0.5 * Math.sin((ambientSeconds * Math.PI * 2) / AMBIENT_PERIOD_S - 3.2 * colFraction - 0.8 * rowFraction));
        cellR = cellG = cellB = cellA = 0;
        if (shadowAlpha > MIN_LAYER) {
          // mix(SHADOW_DARK, SHADOW_LIGHT, 0.5 * pulse)
          const m = 0.5 * pulse;
          paintCell(col, row, SHADOW_DARK[0] + (SHADOW_LIGHT[0] - SHADOW_DARK[0]) * m, SHADOW_DARK[1] + (SHADOW_LIGHT[1] - SHADOW_DARK[1]) * m, SHADOW_DARK[2] + (SHADOW_LIGHT[2] - SHADOW_DARK[2]) * m, 0.18, shadowAlpha, glyph);
        }
        if (outlineAlpha > MIN_LAYER) {
          const wobble = 0.035 * ambient * Math.sin(0.7 * ambientSeconds + 5 * rowFraction);
          sampleRampInto(OUTLINE_RAMP, 0.92 * colFraction + 0.05 * rowFraction + rampShift + wobble, ramp);
          // mix(rampColor, WHITE, highlight)
          paintCell(col, row, ramp[0] + (255 - ramp[0]) * highlight, ramp[1] + (255 - ramp[1]) * highlight, ramp[2] + (255 - ramp[2]) * highlight, 0.45, Math.min(1, 1.25 * outlineAlpha), glyph);
        }
        if (fillAlpha > MIN_LAYER) {
          const drift = 0.09 * ambient * Math.sin(0.42 * ambientSeconds + 5 * colFraction + 1.5 * rowFraction);
          sampleRampInto(FILL_RAMP, 0.999 * clamp01(colFraction + drift), ramp);
          // lifted = mix(ramp, WHITE, lift); then mix(lifted, FILL_TINT, tint)
          const lift = clamp01(0.2 * (1 - rowFraction) + 0.16 * pulse + 0.7 * highlight);
          const tint = 0.1 + (1 - pulse) * ambient * 0.06;
          const lr = ramp[0] + (255 - ramp[0]) * lift, lg = ramp[1] + (255 - ramp[1]) * lift, lb = ramp[2] + (255 - ramp[2]) * lift;
          paintCell(col, row, lr + (FILL_TINT[0] - lr) * tint, lg + (FILL_TINT[1] - lg) * tint, lb + (FILL_TINT[2] - lb) * tint, 0.5, fillAlpha, glyph);
        }
        const at = index * 4;
        px[at] = cellR;
        px[at + 1] = cellG;
        px[at + 2] = cellB;
        px[at + 3] = cellA * 255;
      }
    }

    // Blit the cell image up to the grid. Drawn at cols×cellWidth by rows×cellHeight (not the canvas size) so
    // every cell edge lands on the same device pixel the per-cell rectangles used to snap to.
    cellsCtx.putImageData(cellImage, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cells, 0, 0, cols * cellWidth, rows * cellHeight);
    if (glyphs.length) {
      ctx.font = `700 ${1.02 * cellHeight}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of glyphs) {
        ctx.globalAlpha = g.alpha;
        ctx.fillStyle = g.css;
        ctx.fillText(g.glyph, g.x, g.y);
      }
    }
    if (!sweeping) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(glyphLayer, 0, 0, width, height);
    }
    ctx.globalAlpha = 1;
    return !reducedMotion;
  };

  const frame = (now: number) => {
    frameId = 0;
    if (disposed || !visible || !started) return;
    if (now - lastFrameAt < MIN_FRAME_GAP_MS) {
      frameId = requestAnimationFrame(frame);
      return;
    }
    lastFrameAt = now;
    if (paint(now)) frameId = requestAnimationFrame(frame);
  };
  const requestFrame = () => {
    if (!frameId && !disposed) frameId = requestAnimationFrame(frame);
  };
  // Starts the sweep once the cutout is ready and the canvas is on screen (reduced motion: as soon as it's ready).
  const maybeStart = () => {
    if (started || !loaded || (!visible && !reducedMotion)) return;
    started = true;
    sweepStart = performance.now() + SWEEP_DELAY_MS;
    requestFrame();
  };
  const onPointerEnter = () => {
    if (!started || reducedMotion || performance.now() - sweepStart < SWEEP_MS) return;
    waveStart = performance.now();
    requestFrame();
  };
  const onResize = () => {
    layout();
    requestFrame();
  };

  // Wait for the cutout and the mono font, then lay out and start the sweep a beat later.
  const start = async () => {
    const image = new Image();
    image.src = src;
    await Promise.all([image.decode(), document.fonts?.ready]);
    if (disposed) return;
    portrait = image;
    layout();
    loaded = true;
    maybeStart();
  };
  start().catch(() => {
    // The cutout failed to load or decode: leave the canvas blank rather than throw.
  });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) return;
    if (started) requestFrame();
    else maybeStart();
  });
  observer.observe(canvas);
  canvas.addEventListener("pointerenter", onPointerEnter);
  window.addEventListener("resize", onResize);
  return () => {
    disposed = true;
    observer.disconnect();
    cancelAnimationFrame(frameId);
    canvas.removeEventListener("pointerenter", onPointerEnter);
    window.removeEventListener("resize", onResize);
  };
}
