// Post-build SEO pass: writes per-route HTML shells with unique meta tags,
// generates sitemap.xml, and creates the 404.html SPA fallback.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://sheng-yan.com";
const DIST = new URL("../dist", import.meta.url).pathname;

const HOME_DESC =
  "Sheng Yan (Shawn Yan) — CEO & Co-Founder of MailZoo, NASA Dream with Us finals qualifier, and Wharton Investment Competition team leader. Engineering, CS, and business.";

const routes = {
  "": { title: "Sheng Yan — CEO & Co-Founder of MailZoo", desc: HOME_DESC },
  projects: {
    title: "Projects — Sheng Yan",
    desc: "13 software projects by Sheng Yan (Shawn Yan), CEO of MailZoo — AI agents, MCP servers, quant finance tools, and local-first LLM applications.",
  },
  engagement: {
    title: "Engagement — Sheng Yan",
    desc: "Activities and competitions of Sheng Yan, MailZoo CEO — Wharton Investment Competition, NASA Dream with Us, Y Combinator Startup School, Cornell, robotics, and research.",
  },
  "engagement/mailzoo": {
    title: "MailZoo — CEO & Co-Founder | Sheng Yan",
    desc: "Sheng Yan is the CEO and Co-Founder of MailZoo, an LLC building personalized AI ecosystems for enterprise with a 40+ person team and 10+ NYC clients.",
  },
  "engagement/yc-startup-school": {
    title: "Y Combinator Startup School 2026 | Sheng Yan",
    desc: "Invited attendee at YC's Startup School conference in San Francisco, featuring Jensen Huang and Sam Altman.",
  },
  "engagement/wharton-investment": {
    title: "Wharton Investment Competition — Team Leader | Sheng Yan",
    desc: "Leading a six-person team in the Wharton Global High School Investment Competition — a $300,000 simulated fund managed in real time on the Wharton Investment Simulator.",
  },
  "engagement/econometrics": {
    title: "Cornell Business Simulation — 1st Place | Sheng Yan",
    desc: "1st place in the Cornell Business Simulation Competition at Cornell SC Johnson College of Business summer programs.",
  },
  "engagement/nasa-dream-with-us": {
    title: "NASA Dream with Us — Finals Qualifier | Sheng Yan",
    desc: "Finals qualifier in NASA Aeronautics' 2025–2026 Dream with Us Design Challenge, designing an agricultural drone as a solo competitor.",
  },
  "engagement/iit-research": {
    title: "IIT Materials Science Research Internship | Sheng Yan",
    desc: "Research assistant investigating mechanical properties of composite materials under varying thermal conditions.",
  },
  "engagement/robotics": {
    title: "Fox Valley Robotics — Lead Programmer | Sheng Yan",
    desc: "Lead programmer developing control systems and autonomous routines for competition robots.",
  },
  "engagement/math-competition": {
    title: "Math Competition Team | Sheng Yan",
    desc: "AMC, AIME, and math olympiad preparation — two-time AIME qualifier (2024, 2025).",
  },
  "project/eval-guard": {
    title: "EvalGuard v1 — LLM Contamination Auditor | Sheng Yan",
    desc: "Contamination auditor for LLM evaluations — estimates benchmark score inflation from training-data leakage with a four-matcher ensemble and CI-gate CLI.",
  },
  "project/video-to-text": {
    title: "Video-to-Text MCP Server | Sheng Yan",
    desc: "Token-budgeted MCP server that lets Claude watch video without blowing its context — cuts a 10-minute clip from ~150k tokens to ~5k.",
  },
  "project/school-mcp": {
    title: "StudentVue MCP Server | Sheng Yan",
    desc: "19-tool MCP server giving Claude natural-language access to a StudentVue gradebook — grades, GPA, attendance, and live grade simulation.",
  },
  "project/autonomous-researcher": {
    title: "Autonomous Research Agent | Sheng Yan",
    desc: "Agentic research tool that plans sub-questions, searches the web, evaluates sources, and synthesizes cited reports — entirely local via Ollama.",
  },
  "project/quant-platform": {
    title: "Quant Research Platform | Sheng Yan",
    desc: "Bloomberg Terminal–style quant finance platform: React frontend, FastAPI backend, Monte Carlo risk engine, and Black-Scholes options pricing.",
  },
  "project/web-researcher": {
    title: "AI Web Researcher | Sheng Yan",
    desc: "Local-first AI research assistant — live search results synthesized into streaming markdown reports via Ollama.",
  },
  "project/rag-chatbot": {
    title: "Local RAG Chatbot | Sheng Yan",
    desc: "100% local Retrieval-Augmented Generation chatbot — upload any PDF and get answers grounded in the document, via Ollama.",
  },
  "project/mcp-server": {
    title: "Personal AI MCP Server | Sheng Yan",
    desc: "Custom MCP server suite connecting Claude to Gmail, Google Calendar, Notion, Spotify, and GitHub.",
  },
  "project/note-app": {
    title: "AI Note-Taking App | Sheng Yan",
    desc: "Notability-style app with AI flashcards, quizzes, and chat generated from your own notes using Claude.",
  },
  "project/csv-stock-visualizer": {
    title: "CSV Stock Visualizer | Sheng Yan",
    desc: "Interactive web app that parses CSV stock data into dynamic price charts, volume graphs, and key statistics.",
  },
  "project/portfolio-website": {
    title: "Academic Portfolio Website | Sheng Yan",
    desc: "The design and engineering behind sheng-yan.com.",
  },
  "project/expense-tracker": {
    title: "Personal Expense Tracker | Sheng Yan",
    desc: "Tool to categorize and visualize personal spending with data structures and basic analysis.",
  },
  "project/task-management": {
    title: "Task Management Application | Sheng Yan",
    desc: "Productivity tool to organize tasks, track progress, and practice database-style data management.",
  },
};

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const base = readFileSync(join(DIST, "index.html"), "utf8");

function pageHtml(path, { title, desc }) {
  const url = `${SITE}/${path}`;
  return base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
}

for (const [path, meta] of Object.entries(routes)) {
  if (path === "") {
    writeFileSync(join(DIST, "index.html"), pageHtml("", meta));
    continue;
  }
  const dir = join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), pageHtml(path, meta));
}

// SPA fallback for unknown routes
writeFileSync(join(DIST, "404.html"), pageHtml("", routes[""]));

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(routes)
  .map(
    (p) =>
      `  <url>\n    <loc>${SITE}/${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  )
  .join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`SEO pass done: ${Object.keys(routes).length} routes, sitemap.xml, 404.html`);
