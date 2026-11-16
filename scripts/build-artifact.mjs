// Builds a self-contained static version of the whole site for a claude.ai Artifact.
//
// The Artifact host wraps the main page (a fragment) in its own <!doctype><head><body> skeleton and enforces a
// CSP (no external assets except a few script CDNs, fonts only as data: URIs, no form posts, unreliable mailto:).
// Other pages are published alongside it as full HTML documents. React hydration can't survive that, but nothing
// here needs React at runtime: the markup is static and all motion lives in framework-free engines. So per page:
//   markup  ← Next's prerendered HTML (.next/server/app/**.html), from the skip link to the footer
//   links   ← internal routes rewritten to flat files (/projects → projects.html, /project/x → project-x.html)
//   styles  ← the page's compiled CSS, font URLs inlined as data: URIs
//   assets  ← images inlined as data: URIs, the hero grid inlined as JSON
//   scripts ← the engines transpiled with the TypeScript compiler, plus a small bootstrap per page type
//
// Run after `npm run build`:   node scripts/build-artifact.mjs
// Output: artifact/index.html (the main page) + artifact/*.html, and artifact/preview.html (main page in a local
// skeleton). Publish index.html with every other artifact/*.html (except preview.html) passed as `files`.
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import ts from "typescript";

const ROOT = new URL("..", import.meta.url).pathname;
const at = (p) => join(ROOT, p);
const APP = at(".next/server/app");
const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".avif": "image/avif", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const dataUriCache = new Map();
const dataUri = async (file) => {
  if (!dataUriCache.has(file)) dataUriCache.set(file, `data:${MIME[extname(file)]};base64,${(await readFile(file)).toString("base64")}`);
  return dataUriCache.get(file);
};
const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} KB`;

if (!existsSync(join(APP, "index.html"))) throw new Error("Run `npm run build` first (.next/server/app/index.html not found)");

// ---------------------------------------------------------------- routes
const idsIn = async (dir) =>
  existsSync(join(APP, dir)) ? (await readdir(join(APP, dir))).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5)).sort() : [];
const projectIds = await idsIn("project");
const engagementIds = await idsIn("engagement");
const routes = [
  { path: "/", src: "index.html", out: "index.html", kind: "home" },
  { path: "/projects", src: "projects.html", out: "projects.html", kind: "sub" },
  { path: "/engagement", src: "engagement.html", out: "engagement.html", kind: "sub" },
  ...projectIds.map((id) => ({ path: `/project/${id}`, src: `project/${id}.html`, out: `project-${id}.html`, kind: "sub" })),
  ...engagementIds.map((id) => ({ path: `/engagement/${id}`, src: `engagement/${id}.html`, out: `engagement-${id}.html`, kind: "sub" })),
];
const outFor = new Map(routes.map((r) => [r.path, r.out]));

// ---------------------------------------------------------------- shared script modules
const transpile = async (file) => {
  const source = await readFile(at(file), "utf8");
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, removeComments: true },
    fileName: file,
  });
  if (/\brequire\(/.test(out.outputText)) throw new Error(`${file} has runtime imports; the artifact bundle can't resolve them`);
  return out.outputText;
};
const moduleFiles = {
  heroEngine: "src/components/sheng/hero-engine.ts",
  restEffects: "src/components/sheng/rest-effects.ts",
  portrait: "src/components/sheng/portrait-engine.ts",
  subpage: "src/components/sheng/subpage-effects.ts",
  homeExtras: "src/components/sheng/home-extras.ts",
  isoEngine: "src/components/sheng/iso-engine.ts",
  content: "src/content/home.ts",
};
const moduleCode = {};
for (const [name, file] of Object.entries(moduleFiles)) {
  moduleCode[name] = `(function (exports) {\n${await transpile(file)}\n})(__mods.${name} = {});\n`;
}
const RESET_SCROLL = `
function resetScroll() {
  if (location.hash) return;
  try { history.scrollRestoration = "manual"; } catch (error) {}
  var top = function () { window.scrollTo(0, 0); };
  top();
  window.addEventListener("load", function () { top(); requestAnimationFrame(top); });
}
`;
const bundle = (names) => RESET_SCROLL + "var __mods = {};\n" + names.map((n) => moduleCode[n]).join("");

const grid = JSON.parse(await readFile(at("public/home/hero-grid.json"), "utf8"));
const portraitSrc = await dataUri(at("public/home/portrait-cutout.webp"));

const homeBootstrap = `
(function () {
  var home = document.querySelector(".home");
  if (!home) return;
  resetScroll();
  home.classList.add("js");
  var heroEl = home.querySelector(".hero");
  var restEl = home.querySelector(".rest");
  var portraitCanvas = home.querySelector(".ultra.ascii-portrait canvas");
  var mono = getComputedStyle(home).getPropertyValue("--mono").trim();
  var content = __mods.content;
  var GRID = ${JSON.stringify(grid)};
  var PORTRAIT = ${JSON.stringify(portraitSrc)};
  var EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  var use = window.claude && typeof window.claude.use === "function" ? function (name) { return window.claude.use(name); } : null;

  // ---- the hero card's note flow ------------------------------------------------------------------
  // Validates before the engine's own submit handler (capture on an ancestor), copies the note inside the
  // gesture as a fallback, then saves it to the artifact's database when this viewer may write there.
  var heroForm = heroEl.querySelector("#hero-form");
  var ideaField = heroEl.querySelector("#idea-code");
  var emailField = heroEl.querySelector("#idea-email");
  var statusLine = heroEl.querySelector("#idea-status");
  function say(text, ok) { statusLine.textContent = text; statusLine.classList.toggle("ok", !!ok); }
  heroEl.addEventListener("submit", function (event) {
    if (event.target !== heroForm) return;
    var message = ideaField.value.trim(), address = emailField.value.trim();
    if (!message) { event.preventDefault(); event.stopImmediatePropagation(); say("Write a few words first."); ideaField.focus(); return; }
    if (!EMAIL.test(address)) { event.preventDefault(); event.stopImmediatePropagation(); say("Add your email so I can reply."); emailField.focus(); return; }
    say("Sending…");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("To: " + content.site.email + "\\nSubject: " + content.hero.mailSubject + "\\n\\n" + message + "\\n\\nReply to: " + address).catch(function () {});
      }
    } catch (error) {}
  }, true);
  function saveNote(message, address) {
    if (!use) return Promise.reject(new Error("no database here"));
    return Promise.all([use("db"), use("user")]).then(function (caps) {
      var db = caps[0], user = caps[1];
      if (!db || !user) throw new Error("no database here");
      return user.id().then(function (id) {
        if (!id) throw new Error("no identity here");
        var ref = db.doc("notes/" + id);
        return ref.get().then(function (snap) {
          var data = snap.exists ? snap.data() || {} : {};
          var items = Array.isArray(data.items) ? data.items.slice(-49) : [];
          items.push({ at: new Date().toISOString(), message: message, email: address });
          return ref.set({ email: address, items: items, updatedAt: new Date().toISOString() });
        });
      });
    });
  }
  function onIdeaSent(message) {
    var address = emailField.value.trim();
    saveNote(message, address).then(
      function () { emailField.value = ""; say("Sent. I'll reply within a few days.", true); },
      function () { say("Couldn't send from here, so the note was copied. Paste it into an email to " + content.site.email + "."); }
    );
  }

  // ---- the owner's inbox ---------------------------------------------------------------------------
  if (use) {
    Promise.all([use("db"), use("user")]).then(function (caps) {
      var db = caps[0], user = caps[1];
      if (!db || !user) return;
      return user.isOwner().then(function (owner) {
        if (!owner) return;
        var section = document.createElement("section");
        section.className = "night pad inbox";
        section.id = "inbox";
        section.innerHTML = '<p class="inbox-label">Notes sent through this page · only you see this</p><ol class="inbox-list"></ol><p class="inbox-empty">No notes yet.</p>';
        restEl.insertBefore(section, restEl.firstChild);
        var list = section.querySelector(".inbox-list"), empty = section.querySelector(".inbox-empty");
        db.collection("notes").onSnapshot(function (snap) {
          var rows = [];
          snap.docs.forEach(function (doc) {
            var data = doc.data() || {};
            (Array.isArray(data.items) ? data.items : []).forEach(function (item) {
              rows.push({ at: String(item.at || ""), message: String(item.message || ""), email: String(item.email || data.email || "") });
            });
          });
          rows.sort(function (x, y) { return y.at.localeCompare(x.at); });
          list.textContent = "";
          rows.forEach(function (row) {
            var li = document.createElement("li"), p = document.createElement("p"), meta = document.createElement("span");
            p.textContent = row.message;
            meta.textContent = row.email + (row.at ? " · " + new Date(row.at).toLocaleString() : "");
            li.appendChild(p); li.appendChild(meta); list.appendChild(li);
          });
          empty.hidden = rows.length > 0;
        }, function () {});
      });
    }).catch(function () {});
  }

  var engine = new __mods.heroEngine.HeroEngine(heroEl, {
    mono: mono,
    grid: GRID,
    examples: content.hero.card.examples,
    sentNote: content.hero.card.sent,
    onIdeaSent: onIdeaSent
  });
  engine.start();
  __mods.restEffects.initRestEffects(restEl, mono, { markText: content.footer.mark });
  __mods.homeExtras.initExperience(home, mono);
  __mods.homeExtras.wireContactLinks(document.body, "#idea-code");
  if (portraitCanvas) __mods.portrait.initPortraitMark(portraitCanvas, { src: PORTRAIT, mono: mono });
})();
`;
const subBootstrap = `
(function () {
  resetScroll();
  var mono = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim();
  __mods.restEffects.initRestEffects(document.body, mono, { markText: __mods.content.footer.mark });
  __mods.subpage.initSubpageEffects(document.body);
  __mods.isoEngine.initIsoScenes(document.body, mono);
})();
`;

// ---------------------------------------------------------------- per-page transforms
const cssCache = new Map();
async function pageCss(html) {
  // webpack builds emit static/css/*.css, Turbopack builds emit static/chunks/*.css
  const hrefs = [...html.matchAll(/<link rel="stylesheet" href="(\/_next\/static\/(?:css|chunks)\/[^"]+\.css)"/g)].map((m) => m[1]);
  if (!hrefs.length) throw new Error("No compiled CSS found in a prerendered page");
  const key = hrefs.join("|");
  if (cssCache.has(key)) return cssCache.get(key);
  let css = "";
  for (const href of hrefs) css += (await readFile(at(`.next${href.replace("/_next", "")}`), "utf8")) + "\n";
  // font URLs are either absolute (/_next/static/media/x.woff2) or relative to the CSS chunk (../media/x.woff2)
  const fontUrls = [...new Set([...css.matchAll(/url\(((?:\/_next\/static|\.\.)\/media\/[^)]+)\)/g)].map((m) => m[1]))];
  if (!fontUrls.length) throw new Error("No font URLs found in the compiled CSS");
  for (const url of fontUrls) css = css.split(`url(${url})`).join(`url(${await dataUri(at(`.next/static/media/${url.split("/media/")[1]}`))})`);
  // the site commits to one dark look; the host skeleton pins color-scheme: light on :root
  css += "\n:root{color-scheme:dark}html,body{background:#000}\n";
  cssCache.set(key, css);
  return css;
}

function extractMarkup(html, route) {
  const start = html.indexOf('<a class="skip"');
  const endMain = html.lastIndexOf("</main>") + "</main>".length;
  const endFooter = html.lastIndexOf("</footer>") + "</footer>".length;
  const end = Math.max(endMain, endFooter);
  if (start < 0 || end < start) throw new Error(`${route.src}: could not find the skip link / </main>`);
  return html.slice(start, end);
}

function rewriteLinks(markup, route) {
  return markup.replace(/href="(\/(?!\/)[^"#]*)(#[^"]*)?"/g, (_, path, hash = "") => {
    if (route.kind === "home" && path === "/" && hash) return `href="${hash}"`; // "/#ask" on the home page
    const out = outFor.get(path);
    if (!out) throw new Error(`${route.src}: no artifact page for link ${path}`);
    return `href="${out}${hash}"`;
  });
}

async function inlineImages(markup) {
  const srcs = [...new Set([...markup.matchAll(/src="(\/(?:home|images)\/[^"]+)"/g)].map((m) => m[1]))];
  for (const src of srcs) markup = markup.split(`src="${src}"`).join(`src="${await dataUri(at(`public${src}`))}"`);
  // lazy-loading only delays the cover reveals inside the frame
  return { markup: markup.replace(/\sloading="lazy"/g, ""), images: srcs.length };
}

function cleanForms(markup) {
  // the host can't submit forms; the engines handle submit. Drop the mailto-only no-JS fallbacks.
  return markup
    .replace(/\saction="mailto:[^"]*"/g, "")
    .replace(/\smethod="get"/g, "")
    .replace(/<input type="hidden" name="subject" value="[^"]*"\/?>/g, "");
}

function rootAttrs(html) {
  const tag = html.match(/<html[^>]*>/)?.[0] ?? "";
  const classes = (tag.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean);
  const mono = (tag.match(/style="--mono:([^"]*)"/)?.[1] ?? "").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
  if (!classes.length || !mono) throw new Error("No next/font classes or --mono on <html>");
  return { classes, mono };
}
const titleOf = (html) => (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Sheng Yan").replace(/&amp;/g, "&");

// ---------------------------------------------------------------- build
await rm(at("artifact"), { recursive: true, force: true });
await mkdir(at("artifact"), { recursive: true });
let total = 0;
for (const route of routes) {
  const html = await readFile(join(APP, route.src), "utf8");
  const css = await pageCss(html);
  const { classes, mono } = rootAttrs(html);
  let markup = cleanForms(rewriteLinks(extractMarkup(html, route), route));
  const inlined = await inlineImages(markup);
  markup = inlined.markup;
  const strays = [...markup.matchAll(/(?:href|src)="\/(?!\/)[^"]*"/g)].map((m) => m[0]);
  if (strays.length) throw new Error(`${route.src}: root-relative URLs left: ${strays.slice(0, 5).join(", ")}`);

  let page;
  if (route.kind === "home") {
    // main page: a fragment the host wraps; next/font classes and --mono go onto the host's <html> by script
    const head = [
      "<title>Sheng Yan</title>",
      `<script>(function(d){d.classList.add(${["js", ...classes].map((c) => JSON.stringify(c)).join(",")});d.style.setProperty("--mono",${JSON.stringify(mono)})})(document.documentElement)</script>`,
      `<style>\n${css}\n</style>`,
    ].join("\n");
    page = `${head}\n${markup}\n<script>\n${bundle(["heroEngine", "restEffects", "portrait", "homeExtras", "content"])}\n${homeBootstrap}\n</script>\n`;
    await writeFile(
      at("artifact/preview.html"),
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>\n${page}</body></html>`,
    );
  } else {
    // other pages are served as-is: a complete document of their own
    page = `<!doctype html>
<html lang="en" class="${["js", ...classes].join(" ")}" style="--mono:${mono.replace(/"/g, "&quot;")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titleOf(html).replace(/</g, "&lt;")}</title>
<style>
${css}
img{max-width:100%}[hidden]{display:none!important}
</style>
</head>
<body>
${markup}
<script>
${bundle(["restEffects", "subpage", "content"])}
${subBootstrap}
</script>
</body>
</html>
`;
  }
  // A page whose script fails to parse ships as a dead page (black hero, no canvases), so refuse to write it.
  for (const [, script] of page.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    try {
      new Function(script);
    } catch (error) {
      throw new Error(`${route.out}: emitted script does not parse: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  await writeFile(at(`artifact/${route.out}`), page);
  total += Buffer.byteLength(page);
  console.log(`${route.out.padEnd(44)} ${kb(page).padStart(8)}  (${inlined.images} images)`);
}
console.log(`${routes.length} pages, ${(total / 1024 / 1024).toFixed(1)} MB total`);
