// Project covers and the experience-panel photos, from the photographs listed in src/content/covers.json
// (that file is also the source of the /credits page).
//   projects    → public/images/projects/<id>.webp      1200×800: three-tone dither in the site's palette (black, grey,
//                                                       cream), with the brightest 1.5% of each photo in MailZoo green
//   experience  → public/images/experience/<id>-bg.jpg  1400px wide, natural colour like the other panels
// Source photos are kept out of git: they download to docs/research/downloads/covers/<id>.jpg when missing.
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const SOURCES = path.join(ROOT, "docs/research/downloads/covers");
const manifest = JSON.parse(await readFile(path.join(ROOT, "src/content/covers.json"), "utf8"));

const BLACK = [0, 0, 0], GREY = [64, 64, 64], CREAM = [245, 242, 234], GREEN = [44, 169, 66];
const W = 1200, H = 800;
const GRAIN = 2; // dither at half size and scale up with nearest-neighbour, so each dot is a 2×2 block
const KEY = 0.3; // target mean luminance of a cover before dithering (dark, like the site)

async function source(entry) {
  const file = path.join(SOURCES, `${entry.id}.jpg`);
  try {
    await access(file);
  } catch {
    console.log(`downloading ${entry.id} from ${entry.url}`);
    const res = await fetch(entry.url, { headers: { "user-agent": "sheng-yan.com build script" } });
    if (!res.ok) throw new Error(`${entry.id}: download failed (${res.status})`);
    await mkdir(SOURCES, { recursive: true });
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

/** Floyd–Steinberg error diffusion to `levels` grey levels; returns a level index per pixel. */
function diffuse(lum, w, h, levels) {
  const err = Float32Array.from(lum);
  const idx = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = err[i];
      const q = Math.round(Math.min(1, Math.max(0, old)) * (levels - 1));
      idx[i] = q;
      const e = old - q / (levels - 1);
      if (x + 1 < w) err[i + 1] += (e * 7) / 16;
      if (y + 1 < h) {
        if (x > 0) err[i + w - 1] += (e * 3) / 16;
        err[i + w] += (e * 5) / 16;
        if (x + 1 < w) err[i + w + 1] += e / 16;
      }
    }
  }
  return idx;
}

async function cover(entry, from, to) {
  const w = W / GRAIN, h = H / GRAIN;
  const position = entry.focus === "attention" ? sharp.strategy.attention : "centre";
  const grey = sharp(from).rotate().resize(w, h, { fit: "cover", position }).grayscale().normalise();
  const { data } = await grey.clone().blur(0.4).raw().toBuffer({ resolveWithObject: true });
  const soft = (await grey.clone().blur(5).raw().toBuffer()); // local average, for picking out highlights
  // Every cover lands on the same dark key (mean luminance ≈ KEY) so the set reads as one series on the black site.
  let mean = 0;
  for (let i = 0; i < data.length; i++) mean += data[i];
  mean /= data.length * 255;
  const gamma = entry.gamma ?? Math.min(2.8, Math.max(0.7, Math.log(KEY) / Math.log(Math.max(0.05, mean))));
  const contrast = entry.contrast ?? 1.15;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (Math.pow(data[i] / 255, gamma) - 0.5) * contrast + 0.5));
  const idx = diffuse(lum, w, h, 3);
  // MailZoo green goes on small bright details that stand out from their surroundings (lamps, specular edges,
  // label holders), never on flat bright areas: brightest 3% of the frame AND well above the local average,
  // capped at 1.5% of the pixels.
  const sorted = Float32Array.from(lum).sort();
  const bright = sorted[Math.floor(0.97 * (sorted.length - 1))];
  const candidates = [];
  for (let i = 0; i < lum.length; i++) {
    const pop = lum[i] - Math.pow(soft[i] / 255, gamma);
    if (lum[i] >= bright && pop >= 0.12) candidates.push([pop, i]);
  }
  candidates.sort((a, b) => b[0] - a[0]);
  for (const [, i] of candidates.slice(0, Math.floor(0.015 * lum.length))) idx[i] = 3;
  const palette = [BLACK, GREY, CREAM, GREEN];
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0; i < idx.length; i++) {
    const c = palette[idx[i]];
    rgb[i * 3] = c[0];
    rgb[i * 3 + 1] = c[1];
    rgb[i * 3 + 2] = c[2];
  }
  await sharp(rgb, { raw: { width: w, height: h, channels: 3 } }).resize(W, H, { kernel: "nearest" }).webp({ lossless: true, effort: 6 }).toFile(to);
}

const panel = (from, to) => sharp(from).rotate().resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(to);

for (const entry of manifest) {
  const from = await source(entry);
  if (entry.kind === "project") await cover(entry, from, path.join(ROOT, "public/images/projects", `${entry.id}.webp`));
  else await panel(from, path.join(ROOT, "public/images/experience", `${entry.id}-bg.jpg`));
}
console.log(`${manifest.length} images written`);
