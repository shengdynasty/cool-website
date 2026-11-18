import type { Metadata } from "next";

// Per-route titles and descriptions, carried over verbatim from the previous site's scripts/postbuild-seo.mjs
// so search results, canonicals and social previews stay the same across the redesign.
export const SITE_URL = "https://sheng-yan.com";
export const OG_IMAGE = "/og-image.png";

const HOME_DESC =
  "Sheng Yan (Shawn Yan) — CEO & Co-Founder of MailZoo, NASA Dream with Us finals qualifier, and Wharton Investment Competition team leader. Engineering, CS, and business.";

export const routes: Record<string, { title: string; description: string }> = {
  "": { title: "Sheng Yan — CEO & Co-Founder of MailZoo", description: HOME_DESC },
  projects: {
    title: "Projects — Sheng Yan",
    description: "13 software projects by Sheng Yan (Shawn Yan), CEO of MailZoo — AI agents, MCP servers, quant finance tools, and local-first LLM applications.",
  },
  engagement: {
    title: "Engagement — Sheng Yan",
    description: "Activities and competitions of Sheng Yan, MailZoo CEO — Wharton Investment Competition, NASA Dream with Us, Y Combinator Startup School, Cornell, robotics, and research.",
  },
  "engagement/mailzoo": {
    title: "MailZoo — CEO & Co-Founder | Sheng Yan",
    description: "MailZoo is an LLC founded and led by CEO Sheng Yan, building personalized AI ecosystems for large enterprises — a custom intelligence layer per client that learns the company's operations, handles conversations, qualifies leads, and runs top-of-funnel around the clock. 40+ team members from Cornell, NYU, and Columbia; 10+ enterprise clients in NYC.",
  },
  "engagement/yc-startup-school": {
    title: "Y Combinator Startup School 2026 | Sheng Yan",
    description: "Invited attendee at YC's Startup School conference in San Francisco, featuring Jensen Huang and Sam Altman.",
  },
  "engagement/wharton-investment": {
    title: "Wharton Investment Competition — Team Leader | Sheng Yan",
    description: "Leading a six-person team in the Wharton Global High School Investment Competition — a $300,000 simulated fund managed in real time on the Wharton Investment Simulator.",
  },
  "engagement/econometrics": {
    title: "Cornell Business Simulation — 1st Place | Sheng Yan",
    description: "1st place in the Cornell Business Simulation Competition at Cornell SC Johnson College of Business summer programs.",
  },
  "engagement/nasa-dream-with-us": {
    title: "NASA Dream with Us — Finals Qualifier | Sheng Yan",
    description: "Finals qualifier in NASA Aeronautics' 2025–2026 Dream with Us Design Challenge, designing an agricultural drone as a solo competitor.",
  },
  "engagement/iit-research": {
    title: "IIT Materials Science Research Internship | Sheng Yan",
    description: "Research assistant investigating mechanical properties of composite materials under varying thermal conditions.",
  },
  "engagement/robotics": {
    title: "Fox Valley Robotics — Lead Programmer | Sheng Yan",
    description: "Lead programmer developing control systems and autonomous routines for competition robots.",
  },
  "engagement/math-competition": {
    title: "Math Competition Team | Sheng Yan",
    description: "AMC, AIME, and math olympiad preparation — two-time AIME qualifier (2024, 2025).",
  },
  "project/eval-guard": {
    title: "EvalGuard v1 — LLM Contamination Auditor | Sheng Yan",
    description: "Contamination auditor for LLM evaluations — estimates benchmark score inflation from training-data leakage with a four-matcher ensemble and CI-gate CLI.",
  },
  "project/planet-x": {
    title: "Planet X — SPHEREx Parallax Search | Sheng Yan",
    description: "NASA Space Apps Challenge 2026 entry: a browser app that searches SPHEREx's infrared sky survey for the parallax a distant planet cannot hide, checked against JPL and Gaia.",
  },
  "project/reelix": {
    title: "Project Reelix — Understand Any Topic Visually | Sheng Yan",
    description: "Ask about a topic or upload notes, slides, a PDF or a spreadsheet, and watch a narrated, animated explanation made in your browser with OCR, Wikipedia and a neural voice. No API key, free.",
  },
  "project/video-to-text": {
    title: "Video-to-Text MCP Server | Sheng Yan",
    description: "Token-budgeted MCP server that lets Claude watch video without blowing its context — cuts a 10-minute clip from ~150k tokens to ~5k.",
  },
  "project/school-mcp": {
    title: "StudentVue MCP Server | Sheng Yan",
    description: "19-tool MCP server giving Claude natural-language access to a StudentVue gradebook — grades, GPA, attendance, and live grade simulation.",
  },
  "project/autonomous-researcher": {
    title: "Autonomous Research Agent | Sheng Yan",
    description: "Agentic research tool that plans sub-questions, searches the web, evaluates sources, and synthesizes cited reports — entirely local via Ollama.",
  },
  "project/quant-platform": {
    title: "Quant Research Platform | Sheng Yan",
    description: "Bloomberg Terminal–style quant finance platform: React frontend, FastAPI backend, Monte Carlo risk engine, and Black-Scholes options pricing.",
  },
  "project/web-researcher": {
    title: "AI Web Researcher | Sheng Yan",
    description: "Local-first AI research assistant — live search results synthesized into streaming markdown reports via Ollama.",
  },
  "project/rag-chatbot": {
    title: "Local RAG Chatbot | Sheng Yan",
    description: "100% local Retrieval-Augmented Generation chatbot — upload any PDF and get answers grounded in the document, via Ollama.",
  },
  "project/mcp-server": {
    title: "Personal AI MCP Server | Sheng Yan",
    description: "Custom MCP server suite connecting Claude to Gmail, Google Calendar, Notion, Spotify, and GitHub.",
  },
  "project/note-app": {
    title: "AI Note-Taking App | Sheng Yan",
    description: "Notability-style app with AI flashcards, quizzes, and chat generated from your own notes using Claude.",
  },
  "project/csv-stock-visualizer": {
    title: "CSV Stock Visualizer | Sheng Yan",
    description: "Interactive web app that parses CSV stock data into dynamic price charts, volume graphs, and key statistics.",
  },
  "project/portfolio-website": {
    title: "Academic Portfolio Website | Sheng Yan",
    description: "The design and engineering behind sheng-yan.com.",
  },
  "project/expense-tracker": {
    title: "Personal Expense Tracker | Sheng Yan",
    description: "Tool to categorize and visualize personal spending with data structures and basic analysis.",
  },
  "project/task-management": {
    title: "Task Management Application | Sheng Yan",
    description: "Productivity tool to organize tasks, track progress, and practice database-style data management.",
  },
};

/** Canonical URL for a route key: trailing slashes, as the previous site's sitemap and canonicals used. */
export const canonicalUrl = (route: string) => (route === "" ? `${SITE_URL}/` : `${SITE_URL}/${route}/`);

/** Metadata for a route key, falling back to a generated title/description for anything not in the map. */
export function routeMetadata(route: string, fallback?: { title: string; description: string }): Metadata {
  const entry = routes[route] ?? (fallback ? { title: `${fallback.title} | Sheng Yan`, description: fallback.description } : routes[""]);
  const url = canonicalUrl(route);
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url },
    openGraph: { title: entry.title, description: entry.description, url, type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.description, images: [OG_IMAGE] },
  };
}

/** schema.org Person, carried over from the previous site's <head>. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sheng Yan",
  alternateName: "Shawn Yan",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}${OG_IMAGE}`,
  jobTitle: "CEO & Co-Founder",
  worksFor: {
    "@type": "Organization",
    name: "MailZoo",
    url: "https://www.mailzoo.net",
    founder: "Sheng Yan",
    foundingDate: "2026",
    description:
      "MailZoo is a formally incorporated LLC building personalized AI ecosystems for large enterprises, founded and led by CEO Sheng Yan. Rather than shipping one-size-fits-all software, MailZoo designs and deploys a custom intelligence layer for each client — an AI that learns the company's operations, handles its conversations, qualifies its leads, books its meetings, and runs its top-of-funnel around the clock. Think of it as a Jarvis built to order: no two deployments are the same, because each is architected around how that specific company works. MailZoo's 40+ person team is recruited from Cornell, NYU, and Columbia, spanning engineering, design, sales, and operations, operating out of MailZoo's headquarters — a dedicated office designed around engineering-heavy execution and in-person collaboration. MailZoo has contracted and delivered custom AI systems for 10+ enterprise clients in New York City, managing the full lifecycle for each engagement — discovery of the client's operational surface area, architecture of the bespoke agent stack, deployment, and ongoing optimization.",
  },
  description:
    "Sheng Yan (Shawn Yan) is the CEO and Co-Founder of MailZoo, a NASA Dream with Us finals qualifier, and Wharton Investment Competition team leader.",
  sameAs: ["https://github.com/shengdynasty", "https://www.linkedin.com/in/sheng-yan-b54305386/"],
} as const;
