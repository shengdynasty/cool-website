// Builds the hero stage assets from Sheng's skyline photo + Vision person mask.
//   public/home/hero-photo.webp   2400x1500 composite (whole square photo at stage height, faded edges)
//   public/home/hero-grid.json    { cols, rows, g, f, o, p } consumed by the hero engine
// Format mirrors murphmaxxing.com's /home/paris-grid.json (fitted from its data).
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const SRC = "public/images/sheng-skyline.jpg";
const MASK = "docs/research/masks/skyline-mask.png";
const OUT = "public/home";
const W = 2400, H = 1500, COLS = 200, ROWS = 78, S = 2;
// Zoomed-out framing: the whole square photo at stage height, so on a 1440×900 screen it shows at about
// its native size instead of 1.6× upscaled. The person sits ~56% across the stage (where the source put its
// subject) and the photo's side edges blend into black; the glyph field covers the left anyway.
const PHOTO = H;                 // square photo, 1500px tall inside the 2400×1500 stage
const PERSON_X = 0.535;          // person centre as a fraction of the photo width
const STAGE_PERSON_X = 0.56;     // where the person should sit on the stage
const OFFSET_X = Math.round(STAGE_PERSON_X * W - PERSON_X * PHOTO);
const FADE_L = 220, FADE_R = 320;

// deterministic RNG
let seed = 1337;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

await mkdir(OUT, { recursive: true });

const blank = () => sharp({ create: { width: W, height: H, channels: 3, background: "#000000" } });
const sideFade = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="1"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient><linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="1"/></linearGradient></defs><rect x="${OFFSET_X}" y="0" width="${FADE_L}" height="${H}" fill="url(#l)"/><rect x="${OFFSET_X + PHOTO - FADE_R}" y="0" width="${FADE_R}" height="${H}" fill="url(#r)"/></svg>`);
const photoSq = await sharp(SRC).resize(PHOTO, PHOTO, { kernel: "lanczos3" }).greyscale().sharpen({ sigma: 0.6 }).toColourspace("srgb").png().toBuffer();
const composite = await blank().composite([{ input: photoSq, left: OFFSET_X, top: 0 }, { input: sideFade }]).png().toBuffer();
const maskSq = await sharp(MASK).resize(PHOTO, PHOTO).greyscale().toColourspace("srgb").png().toBuffer();
const maskComposite = await blank().composite([{ input: maskSq, left: OFFSET_X, top: 0 }]).png().toBuffer();

const grey = async (buf, w, h) => {
  const { data, info } = await sharp(buf).greyscale().resize(w, h, { fit: "fill", kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = data[i * info.channels];
  return out;
};

// 1. final stage photo: the composite plus a top fade into the page background
const fade = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="1"/><stop offset="0.07" stop-color="#000" stop-opacity="0.92"/><stop offset="0.2" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);
await sharp(composite).composite([{ input: fade, blend: "over" }]).webp({ quality: 86 }).toFile(`${OUT}/hero-photo.webp`);
await sharp(`${OUT}/hero-photo.webp`).resize(1200).jpeg({ quality: 70 }).toFile("docs/research/masks/hero-photo-preview.jpg");

// 2. analysis buffers (all sampled from the composite so the grid lines up with the photo exactly)
const lum = await grey(composite, COLS, ROWS);
const mask = await grey(maskComposite, COLS, ROWS);
const HS = 4, HW = COLS * HS, HH = ROWS * HS;
const hi = await grey(composite, HW, HH);
const lum2 = await grey(composite, COLS * S, ROWS * S);
const mask2 = await grey(maskComposite, COLS * S, ROWS * S);

// sobel edge magnitude averaged per cell
const edge = new Float32Array(COLS * ROWS);
const px = (y, x) => hi[clamp(y, 0, HH - 1) * HW + clamp(x, 0, HW - 1)];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  let e = 0;
  for (let y = r * HS; y < (r + 1) * HS; y++) for (let x = c * HS; x < (c + 1) * HS; x++) {
    const gx = -px(y - 1, x - 1) - 2 * px(y, x - 1) - px(y + 1, x - 1) + px(y - 1, x + 1) + 2 * px(y, x + 1) + px(y + 1, x + 1);
    const gy = -px(y - 1, x - 1) - 2 * px(y - 1, x) - px(y - 1, x + 1) + px(y + 1, x - 1) + 2 * px(y + 1, x) + px(y + 1, x + 1);
    e += Math.hypot(gx, gy);
  }
  edge[r * COLS + c] = e / (HS * HS) / 8;
}

const fig = new Uint8Array(COLS * ROWS);
for (let i = 0; i < fig.length; i++) fig[i] = mask[i] > 128 ? 1 : 0;
const at = (r, c) => (r < 0 || c < 0 || r >= ROWS || c >= COLS) ? 0 : fig[r * COLS + c];

// 3. g: background density. flat → 1, detail → up to ~6, bright+detail → 9
let g = "", f = "";
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const i = r * COLS + c;
  const e = edge[i], L = lum[i];
  const gate = clamp((L - 18) / 45);
  const v = 1 + 4.5 * gate * (1 - Math.exp(-Math.max(0, e - 1.5) / 9)) + Math.max(0, (L - 90) / 15);
  g += String(clamp(Math.round(v), 1, 9));
  if (!fig[i]) { f += "0"; continue; }
  // figure: lifted luminance curve + dither; boundary cells boosted by contrast with outside
  let fv = 3 + 6 * Math.sqrt(clamp((L - 25) / 110)) + (rand() - 0.5) * 2.5;
  let contrast = 0;
  for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const rr = r + dr, cc = c + dc;
    if (rr < 0 || cc < 0 || rr >= ROWS || cc >= COLS) continue;
    if (!fig[rr * COLS + cc]) contrast = Math.max(contrast, Math.abs(L - lum[rr * COLS + cc]));
  }
  if (contrast) fv = Math.max(fv, 2 + 7 * clamp(contrast / 110));
  f += String(clamp(Math.round(fv), 1, 9));
}

// 4. o: outline path. left edge top→bottom, bottom row, right edge bottom→top. Horizontal runs interpolated.
const rowsWithFig = [];
for (let r = 0; r < ROWS; r++) { let l = -1, rt = -1; for (let c = 0; c < COLS; c++) if (fig[r * COLS + c]) { if (l < 0) l = c; rt = c; } if (l >= 0) rowsWithFig.push([r, l, rt]); }
const o = [];
const push = (r, c) => { const i = r * COLS + c; if (o[o.length - 1] !== i) o.push(i); };
const walk = (r, fromC, toC) => { const step = toC > fromC ? 1 : -1; for (let c = fromC; c !== toC + step; c += step) push(r, c); };
const [r0, l0, rt0] = rowsWithFig[0];
const mid = Math.floor((l0 + rt0) / 2);
walk(r0, mid, l0);
// left side
for (let k = 1; k < rowsWithFig.length; k++) { const [r, l] = rowsWithFig[k]; walk(r, rowsWithFig[k - 1][1], l); }
// bottom row (figure touches the frame bottom)
const [br, bl, brt] = rowsWithFig[rowsWithFig.length - 1];
walk(br, bl, brt);
// right side upward
for (let k = rowsWithFig.length - 2; k >= 0; k--) { const [r, , rt] = rowsWithFig[k]; walk(r, rowsWithFig[k + 1][2], rt); }
// top edge back toward the start so both pen arcs begin at the crown
walk(r0, rt0, mid + 1);

// 5. p: 2x-resolution sprite over the figure bbox. digits = fill, letters a-i = boundary cells.
const C2 = COLS * S, R2 = ROWS * S;
const fig2 = new Uint8Array(C2 * R2);
for (let i = 0; i < fig2.length; i++) fig2[i] = mask2[i] > 128 ? 1 : 0;
let x0 = C2, y0 = R2, x1 = -1, y1 = -1;
for (let y = 0; y < R2; y++) for (let x = 0; x < C2; x++) if (fig2[y * C2 + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
let v = "";
const l2 = (y, x) => lum2[clamp(y, 0, R2 - 1) * C2 + clamp(x, 0, C2 - 1)];
for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
  if (!fig2[y * C2 + x]) { v += "0"; continue; }
  let boundary = false, maxL = l2(y, x);
  for (const [dy, dx] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const yy = y + dy, xx = x + dx;
    if (yy < 0 || xx < 0 || yy >= R2 || xx >= C2) continue;
    if (!fig2[yy * C2 + xx]) boundary = true;
    maxL = Math.max(maxL, l2(yy, xx));
  }
  if (boundary) { const idx = clamp(Math.round(1 + 8 * clamp((maxL - 20) / 150)), 1, 9); v += String.fromCharCode(96 + idx); continue; }
  const fill = clamp(Math.round(2.5 + 6.5 * Math.sqrt(clamp((l2(y, x) - 25) / 120)) + (rand() - 0.5) * 2), 1, 9);
  v += String(fill);
}

// face centre: centroid of the top 7 figure rows (about the head at this zoom) (the engine clears figure cells outward from here)
let sx = 0, sy = 0, sn = 0;
for (const [r, l, rt] of rowsWithFig.slice(0, 7)) for (let c = l; c <= rt; c++) if (fig[r * COLS + c]) { sx += c; sy += r; sn++; }
const centre = [+(sx / sn / COLS).toFixed(3), +(sy / sn / ROWS).toFixed(3)];
// seam: where the glyph field dissolves (fraction of width) at the top rows and the lower rows.
// Source used 0.405 → 0.335, i.e. ~14 cols left of the crown and flush with the body's left edge at the bottom.
const headW = Math.max(...rowsWithFig.slice(0, 7).map(([, l, rt]) => rt - l + 1));
const seamOffset = Math.max(6, Math.round(0.64 * headW)); // the source sat its seam ~0.64 head-widths left of the crown
const seam = [+((l0 - seamOffset) / COLS).toFixed(3), +(rowsWithFig[rowsWithFig.length - 1][1] / COLS).toFixed(3)];
const grid = { cols: COLS, rows: ROWS, g, f, o, c: centre, seam, p: { x: x0, y: y0, w: pw, h: ph, s: S, v } };
await writeFile(`${OUT}/hero-grid.json`, JSON.stringify(grid));
console.log(`centre=${centre} seam=${seam}`);
console.log(`offset x=${OFFSET_X}; fig cells=${fig.reduce((a, b) => a + b, 0)}; o=${o.length}; sprite ${pw}x${ph} at ${x0},${y0}`);
console.log("--- g (every 2nd col/row) ---");
for (let r = 0; r < ROWS; r += 2) { let s = ""; for (let c = 0; c < COLS; c += 2) s += g[r * COLS + c]; console.log(s); }
console.log("--- f ---");
for (let r = 0; r < ROWS; r += 2) { let s = ""; for (let c = 0; c < COLS; c += 2) s += f[r * COLS + c]; console.log(s); }
console.log("o first", o.slice(0, 5).map(i => `(${Math.floor(i / COLS)},${i % COLS})`).join(" "), "last", o.slice(-5).map(i => `(${Math.floor(i / COLS)},${i % COLS})`).join(" "));
