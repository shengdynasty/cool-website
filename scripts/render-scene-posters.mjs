// Renders the still poster of every scene (src/components/sheng/iso-engine.ts) to public/images/projects/<id>.webp:
// what the card, the detail header or the figure shows before the script runs, under reduced motion, and in link
// previews. The frame is the scene's `poster` time. Text is rendered as glyph outlines of the site's JetBrains Mono
// (opentype.js), so the stills don't depend on the fonts the SVG rasteriser can see.
// Run:  npm run posters
import sharp from "sharp";
import opentype from "opentype.js";
import { SCENES, renderSvg } from "../src/components/sheng/iso-engine.ts";

const font = opentype.loadSync("scripts/fonts/JetBrainsMono-Medium.ttf");
const capHeight = (font.tables.os2?.sCapHeight || font.unitsPerEm * 0.7) / font.unitsPerEm;
const toPath = (text, x, y, size, align, spacing) => {
  const options = { kerning: false, letterSpacing: spacing };
  const width = font.getAdvanceWidth(text, size, options);
  const x0 = align === "center" ? x - width / 2 : align === "right" ? x - width : x;
  return font.getPath(text, x0, y + (capHeight * size) / 2, size, options).toPathData(2);
};

const W = 1200;
const H = 800;
for (const scene of Object.values(SCENES)) {
  const svg = renderSvg(scene, W, H, scene.poster, "JetBrains Mono", toPath);
  const out = `public/images/projects/${scene.id}.webp`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  console.log(`${out}: ${scene.id} at t=${scene.poster}s`);
}
