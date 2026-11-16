// Downloads all binary assets referenced by https://www.murphmaxxing.com/ into public/
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
const ORIGIN = "https://www.murphmaxxing.com";
const assets = [
  ["/home/paris-night.webp", "public/images/original/paris-night.webp"],
  ["/home/paris-code.webp", "public/images/original/paris-code.webp"],
  ["/covers/second-brain-notes-pdfs.webp", "public/images/covers/second-brain-notes-pdfs.webp"],
  ["/covers/20-pen-test-attacks-vibecoded-app.webp", "public/images/covers/20-pen-test-attacks-vibecoded-app.webp"],
  ["/covers/fable-5-2-7-projects.webp", "public/images/covers/fable-5-2-7-projects.webp"],
  ["/covers/senior-dev-security-prompts.webp", "public/images/covers/senior-dev-security-prompts.webp"],
  ["/covers/20-ways-vibecoded-app-banned-app-store.webp", "public/images/covers/20-ways-vibecoded-app-banned-app-store.webp"],
  ["/favicon.ico", "public/seo/original-favicon.ico"],
  ["/apple-touch-icon.png", "public/seo/original-apple-touch-icon.png"],
  ["/icon-m.svg", "public/seo/original-icon-m.svg"],
  ["/_next/static/media/5c309f01fb81f005-s.p.woff2", "public/fonts/switzer-variable.woff2"],
  ["/_next/static/media/bb3ef058b751a6ad-s.p.woff2", "public/fonts/jetbrains-mono-latin.woff2"],
  ["/_next/static/media/939c4f875ee75fbb-s.woff2", "public/fonts/jetbrains-mono-latin-ext.woff2"],
];
async function get([path, out]) {
  const res = await fetch(ORIGIN + path, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log("ok", out);
}
for (let i = 0; i < assets.length; i += 4) {
  await Promise.all(assets.slice(i, i + 4).map(a => get(a).catch(e => console.error("FAIL", e.message))));
}
