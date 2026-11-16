// Builds the home page's experience accordion images from the portfolio repo's assets.
//   public/images/experience/<id>-bg.<ext>   panel background (photos resized to 1400px wide, SVG illustrations copied)
//   public/images/experience/<id>-logo.png   the white badge's emblem (cropped from the portfolio's logos)
// Run: node scripts/build-experience-assets.mjs [path to cool-website]
import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SOURCE = process.argv[2] ?? process.env.PORTFOLIO_SRC ?? "/Users/shengyan/cool-website";
const A = (f) => path.join(SOURCE, "src/assets", f);
const OUT = path.join(ROOT, "public/images/experience");
await mkdir(OUT, { recursive: true });

/** Bounding box of pixels matching `test` in an image rendered to raw RGB. */
async function bbox(input, options, test) {
  const { data, info } = await sharp(input, options).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (test(data[i], data[i + 1], data[i + 2])) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const photo = (from, to) => sharp(from).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(to);
const badge = (input, options, region, to) =>
  sharp(input, options).extract(region).resize(256, 256, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" }).png().toFile(to);

// backgrounds
await photo(A("mailzoo-office.jpg"), path.join(OUT, "mailzoo-bg.jpg"));
await photo(A("wharton.avif"), path.join(OUT, "wharton-investment-bg.jpg"));
await photo(A("nasa-dream-with-us.jpg"), path.join(OUT, "nasa-dream-with-us-bg.jpg"));
for (const [id, file] of [["econometrics", "cornell.svg"], ["yc-startup-school", "yc-startup-school.svg"], ["iit-research", "iit-research.svg"], ["robotics", "robotics.svg"], ["math-competition", "math-competition.svg"]]) {
  await copyFile(A(file), path.join(OUT, `${id}-bg.svg`));
}

// badges
await badge(A("mailzoo-office.jpg"), {}, { left: 530, top: 130, width: 290, height: 290 }, path.join(OUT, "mailzoo-logo.png")); // the frog's face on the office sign
await badge(A("wharton.avif"), {}, { left: 470, top: 380, width: 220, height: 250 }, path.join(OUT, "wharton-investment-logo.png"));
const yc = await bbox(A("yc-startup-school.svg"), { density: 192 }, (r, g, b) => r > 200 && g > 70 && g < 140 && b < 70); // the orange Y square
await badge(A("yc-startup-school.svg"), { density: 192 }, yc, path.join(OUT, "yc-startup-school-logo.png"));
await badge(A("cornell.png"), {}, { left: 0, top: 0, width: 225, height: 225 }, path.join(OUT, "econometrics-logo.png"));
const iit = await bbox(A("download.png"), {}, (r, g, b) => r > 170 && g < 110 && b < 110); // IIT's red triangle
await badge(A("download.png"), {}, { left: iit.left + 1, top: Math.max(0, iit.top - 2), width: iit.width + 2, height: iit.height + 4 }, path.join(OUT, "iit-research-logo.png"));
await badge(path.join(ROOT, "scripts/assets/nasa-logo.svg"), { density: 300 }, { left: 0, top: 0, width: 458, height: 383 }, path.join(OUT, "nasa-dream-with-us-logo.png"));
await badge(A("fox.png"), {}, { left: 0, top: 0, width: 246, height: 205 }, path.join(OUT, "robotics-logo.png"));
await badge(A("math.jpg"), {}, { left: 0, top: 4, width: 124, height: 124 }, path.join(OUT, "math-competition-logo.png")); // MAA icosahedron
console.log(`yc square ${JSON.stringify(yc)}; iit triangle ${JSON.stringify(iit)}`);
console.log("experience assets written to public/images/experience");
