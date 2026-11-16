// Renders public/home/hero-code.webp: the steady-state hero (photo + glyph field) used as the
// pre-JS poster and no-JS fallback. Mirrors the engine's atlas colours and seam logic.
// Run:  FONTCONFIG_FILE=$PWD/scripts/fonts.conf node scripts/render-hero-poster.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const grid = JSON.parse(await readFile("public/home/hero-grid.json", "utf8"));
const { cols, rows, g, f, p } = grid;
const W = 2400, H = 1500, cw = W / cols, ch = H / rows;
const GLYPHS = " .:/{}<>=#", LEVELS = 6, ART_MAX = 0.5;
const [SEAM_TOP, SEAM_BOTTOM] = grid.seam ?? [0.405, 0.335];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const chance = (t, e, i) => Math.pow(clamp((t - e) / i + 0.5), 1.6);
const n = cols * rows;
const fig = new Uint8Array(n), base = new Uint8Array(n);
for (let i = 0; i < n; i++) { const e = f.charCodeAt(i) - 48; fig[i] = e ? 1 : 0; base[i] = e || g.charCodeAt(i) - 48; }
const near = fig.slice();
for (let e = 0; e < n; e++) if (fig[e]) { if (e % cols) near[e - 1] = 1; if (e % cols < cols - 1) near[e + 1] = 1; if (e >= cols) near[e - cols] = 1; if (e < n - cols) near[e + cols] = 1; }
let a = 7;
const rnd = () => { let t = Math.imul((a = (a + 0x6d2b79f5) | 0) ^ (a >>> 15), 1 | a); return (((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) ^ (t >>> 14)) >>> 0) / 4294967296; };
const rest = new Uint8Array(n);
for (let i = 0; i < n; i++) {
  const s = (i % cols) / cols, h = clamp((Math.floor(i / cols) / rows - 0.4) / 0.14), r = SEAM_TOP + (SEAM_BOTTOM - SEAM_TOP) * h, w = 0.05 + 0.07 * h;
  const luck = rnd(); rnd();
  rest[i] = near[i] || luck < chance(s, r, w) ? 0 : 1;
}
// atlas colour at level 2 (steady breathing sits around 1-3): ink #000 → grey ramp (82+140e matches the luminance of the source greens)
const glyphColor = (idx, lvl) => { const v = 82 + 140 * (idx / 9), s = 0.58 + 0.72 * lvl / (LEVELS - 1); const c = Math.min(255, Math.round(v * s)); return `rgb(${c},${c},${c})`; };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let rects = "", texts = "";
const fs = Math.round(0.82 * ch * 10) / 10;
for (let r = 0; r < rows; r++) {
  let run = -1;
  for (let c = 0; c <= cols; c++) {
    const i = r * cols + c, on = c < cols && rest[i];
    if (on && run < 0) run = c;
    if (!on && run >= 0) { rects += `<rect x="${(run * cw).toFixed(1)}" y="${(r * ch).toFixed(1)}" width="${((c - run) * cw).toFixed(1)}" height="${(ch + 0.5).toFixed(1)}"/>`; run = -1; }
    if (on && base[i]) texts += `<text x="${(c * cw + cw / 2).toFixed(1)}" y="${(r * ch + ch / 2 + 0.36 * fs).toFixed(1)}" fill="${glyphColor(base[i], 2)}">${esc(GLYPHS[base[i]])}</text>`;
  }
}
// art sprite (2x cells over the figure) at half opacity, like the engine's steady state
const tw = cw / p.s, th = ch / p.s, afs = Math.round(Math.max(5, 0.98 * th) * 10) / 10;
let art = "";
for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
  const code = p.v.charCodeAt(y * p.w + x); if (code === 48) continue;
  const edge = code > 96, idx = edge ? code - 96 : code - 48, gi = edge ? Math.max(idx, 7) : idx;
  const cx = (p.x + x) * tw, cy = (p.y + y) * th, cv = Math.round(120 + 125 * idx / 9);
  art += `<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" fill="rgba(0,0,0,0.5)"/><text x="${(cx + tw / 2).toFixed(1)}" y="${(cy + th / 2 + 0.36 * afs).toFixed(1)}" fill="rgb(${cv},${cv},${cv})">${esc(GLYPHS[gi])}</text>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><g fill="#000">${rects}</g><g font-family="JetBrains Mono" font-weight="500" font-size="${fs}" text-anchor="middle">${texts}</g><g opacity="${ART_MAX}" font-family="JetBrains Mono" font-weight="500" font-size="${afs}" text-anchor="middle">${art}</g></svg>`;
await sharp("public/home/hero-photo.webp").composite([{ input: Buffer.from(svg) }]).webp({ quality: 82 }).toFile("public/home/hero-code.webp");
await sharp("public/home/hero-code.webp").resize(1200).jpeg({ quality: 72 }).toFile("docs/research/masks/hero-code-preview.jpg");
console.log(`poster rendered: ${rects.length + texts.length + art.length} bytes of svg, rest cells ${rest.reduce((s, v) => s + v, 0)}`);
