// Renders the Project Modula cover loop frame by frame from Modula's own hand-built V8: its model, stage, lights and
// exploder, with no interface and no cursor, recoloured in browser.js (white parts, near-black joints, the site's green
// on the accent parts, neutral lights, black void). Every frame is a pure function of its index, so the loop is smooth
// and frame 360 equals frame 0 (`--wrap` saves it as wrap.png to check).
//
// The Modula checkout is only read: Vite serves it with no config file and keeps its dependency cache in the system
// temp folder; browser.js is injected into dev-reel.html, a dev page whose own reel never starts.
//
//   node scripts/modula-cover/render.mjs <outDir> [--wrap] [--from i] [--count n] [--step k] [--cfg '{"az0":30}']
//   node scripts/modula-cover/render.mjs <outDir> --probe '[{"name":"x","i":0,"e":1,"az":0,"phase":0}]'
//
// MODULA_DIR points at the checkout (default: ../project-modula next to this repo). make.sh runs the whole pipeline.
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const MODULA = process.env.MODULA_DIR ?? path.resolve(HERE, "../../../project-modula");
const { createServer } = await import(pathToFileURL(path.join(MODULA, "node_modules/vite/dist/node/index.js")).href);
const { chromium } = await import(pathToFileURL(path.join(MODULA, "node_modules/playwright/index.mjs")).href);

const [, , out = path.join(tmpdir(), "modula-cover/frames"), ...rest] = process.argv;
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : fallback;
};

// 12 s at 30 fps, 1200×800 rendered at 2× (grade.py halves it). The camera makes one full turn; the engine turns at a
// steady 180°/s, three four-stroke cycles per loop, so the crank, cams and valves come back exactly where they began.
const CFG = {
  w: 1200,
  h: 800,
  pr: 2,
  T: 12,
  fps: 30,
  // film clock (s): together until 2.2, apart by 4.8, held to 7.6, together again by 10.2; frame 0 sits mid-hold, so
  // the poster (frame 0) is the exploded view
  explode: [2.2, 4.8, 7.6, 10.2],
  offset: 6.2,
  az0: 15,
  orbit: 360,
  azSway: 0,
  swayPhase: 0,
  el0: 22,
  elAmp: 4,
  elPhase: 0,
  // aim at the engine's centre when together and at the spread parts' centre when apart (world bounds at explode 0, 1)
  target: [0, 0.33, 0],
  targetApart: [-0.017, 0.5, 0.033],
  dist: 2.2,
  dolly: 0.42,
  fov: 30,
  phase0: 0,
  phi: 2160,
  spread: 1.1,
  accentGlow: 0.35,
  exposure: 0.78,
};
const cfg = { ...CFG, ...JSON.parse(opt("cfg", "{}")) };
const from = Number(opt("from", "0"));
const count = Number(opt("count", "Infinity"));
const step = Number(opt("step", "1"));
const probe = opt("probe", "");

mkdirSync(out, { recursive: true });
const server = await createServer({
  configFile: false,
  root: MODULA,
  cacheDir: path.join(tmpdir(), "modula-cover/vite-cache"),
  server: { port: 0, host: "127.0.0.1", fs: { allow: [MODULA] } },
  logLevel: "silent",
});
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, "");
const browser = await chromium.launch({ args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (error) => console.error("pageerror:", error.message));
page.on("console", (message) => (message.type() === "error" ? console.error("console:", message.text().slice(0, 300)) : null));
await page.goto(`${base}/dev-reel.html?mode=none&m=v8`);
await page.waitForFunction(() => !!window.__reel, null, { timeout: 120000 });
await page.addScriptTag({ type: "module", path: path.join(HERE, "browser.js") });
await page.waitForFunction(() => !!window.__loop, null, { timeout: 30000 });
const info = await page.evaluate((c) => window.__loop.init(c), cfg);
console.log(`${info.frames} frames at ${info.fps} fps; loop fixes ${JSON.stringify(info.fixes)}`);
const save = (name, url) => writeFileSync(path.join(out, name), Buffer.from(url.slice(url.indexOf(",") + 1), "base64"));

const started = Date.now();
if (probe) {
  for (const p of JSON.parse(probe)) {
    save(`${p.name}.png`, await page.evaluate(([i, o]) => window.__loop.frame(i, o), [p.i ?? 0, p]));
    console.log("saved", p.name, JSON.stringify(await page.evaluate(() => window.__loop.bounds())));
  }
} else {
  const last = Math.min(info.frames, from + count * step);
  let n = 0;
  for (let i = from; i < last; i += step) {
    save(`f${String(i).padStart(5, "0")}.png`, await page.evaluate((k) => window.__loop.frame(k), i));
    if (n++ % 60 === 0) console.log(`frame ${i}/${info.frames} · ${((Date.now() - started) / 1000).toFixed(0)} s`);
  }
  console.log(`saved ${n} frames to ${out}`);
  if (rest.includes("--wrap")) save("wrap.png", await page.evaluate((k) => window.__loop.frame(k), info.frames));
}
await browser.close();
await server.close();
