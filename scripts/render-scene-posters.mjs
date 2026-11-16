// Renders the still poster of every isometric project scene (src/components/sheng/iso-engine.ts) to
// public/images/projects/<id>.webp: what the card and the detail header show before the script runs, under
// reduced motion, and in link previews. The frame is the scene's `poster` time.
// Run:  npm run posters   (FONTCONFIG_FILE=scripts/fonts.conf so the SVG text is set in JetBrains Mono)
import sharp from "sharp";
import { SCENES, renderSvg } from "../src/components/sheng/iso-engine.ts";

const W = 1200;
const H = 800;
for (const scene of Object.values(SCENES)) {
  const svg = renderSvg(scene, W, H);
  const out = `public/images/projects/${scene.id}.webp`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  console.log(`${out}: ${scene.id} at t=${scene.poster}s`);
}
