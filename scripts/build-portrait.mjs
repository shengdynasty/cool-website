// Builds the status section's ASCII-portrait input from the portrait photo + its Vision person mask.
//   public/home/portrait-cutout.webp  900×600 RGBA: grey photo in RGB, person mask in alpha
//   public/home/portrait.webp         plain grey photo (no-JS fallback)
// The hair touches the photo's top edge, so the mask is feathered to nothing over the top band:
// otherwise the glyph engine draws its outline ring straight across the cut.
import sharp from "sharp";

const SRC = "public/images/sheng-portrait.jpg";
const MASK = "docs/research/masks/portrait-mask.png";
const W = 900, H = 600;
const FEATHER_ROWS = Math.round(H * 0.11); // alpha ramps 0 → 1 over the top 11%

const grey = await sharp(SRC).resize(W, H, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
const mask = await sharp(MASK).resize(W, H, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  const t = Math.min(1, y / FEATHER_ROWS);
  const feather = t * t * (3 - 2 * t); // smoothstep
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const g = grey.data[i * grey.info.channels];
    out[i * 4] = g;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = g;
    out[i * 4 + 3] = Math.round(mask.data[i * mask.info.channels] * feather);
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 90 }).toFile("public/home/portrait-cutout.webp");
await sharp(SRC).resize(1086, 724).greyscale().webp({ quality: 84 }).toFile("public/home/portrait.webp");
await sharp("public/home/portrait-cutout.webp").flatten({ background: "#000" }).resize(600).png().toFile("docs/research/masks/portrait-cutout-preview.png");
console.log(`portrait cutout written (feathered over the top ${FEATHER_ROWS}px)`);
