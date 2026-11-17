// All copy for the home page. Facts come from github.com/shengdynasty/cool-website
// (src/pages/Home.tsx, Engagement.tsx, Projects.tsx, components/layout/AcademicLayout.tsx).
// Section order: hero → status → experience → ways → projects → footer (murphmaxxing.com's shell, with its
// "before you fill in the form" and "want yours built?" sections dropped and an aumsuthar.com-style experience row added).

export const site = {
  name: "Sheng Yan",
  wordmark: "shengyan",
  email: "shengyan555@gmail.com",
  github: "https://github.com/shengdynasty",
  linkedin: "https://www.linkedin.com/in/sheng-yan-b54305386/",
  portfolio: "https://sheng-yan.com",
  handle: "@shengdynasty",
  year: 2026,
} as const;

export const mailto = (subject: string, body = "") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

export interface NavLink {
  /** data-t key: the hero engine scrambles this text in on load and on hover */
  t: string;
  label: string;
  href: string;
  aria: string;
  external?: boolean;
}

export const nav: NavLink[] = [
  { t: "n0", label: "/projects", href: "/projects", aria: "Projects" },
  { t: "n1", label: "/engagement", href: "/engagement", aria: "Engagement" },
  { t: "n2", label: "/github", href: site.github, aria: "GitHub", external: true },
  { t: "n3", label: "/linkedin", href: site.linkedin, aria: "LinkedIn", external: true },
];

export const hero = {
  work: "get in touch",
  /** One line, scrambled in on load; the caret blinks after it. Keep it ≤ 12 characters for phones (nowrap). */
  title: "Sheng Yan",
  photoAlt: "Sheng Yan at a skyscraper window at night, looking out over the city lights. Black and white photo.",
  sub: "CEO & Co-Founder of MailZoo. Building at the intersection of engineering, computer science, and business strategy.",
  card: {
    label: "What do you want to talk about?",
    // keep each under ~34 characters so it fits the input without clipping (the source's longest is 33)
    examples: [
      "a startup idea to pressure-test",
      "an AI agent for your team",
      "a research collaboration",
      "an internship next summer",
    ],
    emailPlaceholder: "you@example.com",
    go: "Send me a note",
    price: "Class of 2029",
    note: "Two-minute note. I read every one",
    /** shown by the engine in the card foot right after a submit */
    sent: "Got it.",
    /** status line under the card */
    status: {
      needMessage: "Write a few words first.",
      needEmail: "Add your email so I can reply.",
      sending: "Sending…",
      sent: "Sent. I'll reply within a few days.",
      failed: "Couldn't send from here. Opening your email app instead.",
    },
  },
  status: {
    reply: "Replies within a few days",
    videos: "14 projects",
    followers: "8 activities",
    guides: "3 honors",
  },
  mailSubject: "Hello from sheng-yan.com",
} as const;

export const status = {
  portraitAlt: "Sheng Yan, black and white portrait, drawn in ASCII",
  headingWords: ["Building", "MailZoo."],
  /** index of the word drawn in MailZoo green */
  headingAccent: 1,
  headingAria: "Building MailZoo.",
  lede: "Personalized AI ecosystems for enterprise: a bespoke intelligence layer per client that learns the company's operations, handles conversations, qualifies leads, and runs top-of-funnel around the clock.",
  items: [
    { term: "Now · MailZoo", detail: "CEO & Co-Founder of a formal LLC. 40+ team members recruited from Cornell, NYU, and Columbia, 10+ contracted enterprise clients in NYC." },
    { term: "Now · Wharton", detail: "Team leader in the Global High School Investment Competition. Six people and a $300K simulated fund, synced to the live market." },
    { term: "Recent · YC Startup School", detail: "Invited to Y Combinator's founder conference in San Francisco, with sessions from Jensen Huang and Sam Altman." },
    { term: "Recent · Cornell", detail: "1st place in the Business Simulation Competition at the SC Johnson College of Business, July 2026." },
    { term: "Next", detail: "Wharton submission, the Conrad Challenge, Project Modula, and Project Reelix." },
  ],
  links: [
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: site.email, href: `mailto:${site.email}`, external: false },
  ],
  linksNote: "Open to internships, research, and interesting problems.",
  mailzoo: { href: "https://www.mailzoo.net", label: "mailzoo.net ↗" },
} as const;

export const ways = {
  headingWords: ["Two", "ways", "I", "build"],
  headingAria: "Two ways I build",
  a: {
    branch: "engineering",
    title: "I write the code",
    body: "Fourteen software projects: a NASA Space Apps tool that hunts a distant planet's parallax in SPHEREx sky maps, MCP servers that let Claude watch video and read a gradebook, local AI agents and RAG with no API keys, a Bloomberg-style quant platform. Plus robotics control systems and a NASA drone design.",
  },
  b: {
    branch: "business",
    title: "I lead the team",
    body: "MailZoo's 40-person team and its enterprise clients, and a six-person Wharton investment team. Strategy, hiring, client delivery, and the numbers behind them.",
  },
  shipsTitle: "Either way, the record so far",
  ships: [
    "AIME qualifier, 2024 and 2025",
    "NASA Dream with Us, finals qualifier",
    "1st place, Cornell Business Simulation",
    "Invited to YC Startup School 2026",
    "10+ enterprise clients at MailZoo",
  ],
  live: "still building",
} as const;

export const experience = {
  headingWords: ["Experience"],
  headingAria: "Experience",
} as const;

export interface ProjectCard {
  href: string;
  cover: string;
  /** an animated scene (iso-engine.ts) that plays over the cover where JS runs */
  scene?: string;
  title: string;
  meta: string;
}

export const projects = {
  headingWords: ["Projects,", "written", "up"],
  headingAria: "Projects, written up",
  all: { label: "All 14 projects", href: "/projects" },
  lead: {
    href: `/project/eval-guard`,
    cover: "/images/projects/eval-guard.webp",
    scene: "eval-guard",
    title: "EvalGuard: a contamination auditor for LLM evaluations",
    meta: "34 passing tests",
  } satisfies ProjectCard,
  rows: [
    { href: `/project/planet-x`, cover: "/images/projects/planet-x.webp", scene: "planet-x", title: "Planet X: hunting a distant planet's parallax in NASA's SPHEREx sky survey", meta: "NASA Space Apps 2026" },
    { href: `/project/video-to-text`, cover: "/images/projects/video-to-text.webp", title: "Video-to-Text MCP server: let Claude watch video without blowing its context", meta: "~150k → ~5k tokens" },
    { href: `/project/school-mcp`, cover: "/images/projects/school-mcp.webp", title: "StudentVue MCP server: your gradebook in natural language", meta: "19 tools" },
    { href: `/project/autonomous-researcher`, cover: "/images/projects/autonomous-researcher.webp", title: "Autonomous Research Agent: plans, searches, checks, and writes, all locally", meta: "no API keys" },
    { href: `/project/quant-platform`, cover: "/images/projects/quant-platform.webp", title: "Quant Research Platform: a Bloomberg-style terminal with an AI analyst", meta: "7 modules" },
  ] satisfies ProjectCard[],
  more: {
    text: "Want the rest? Eight activities, from NASA to Wharton, written up the same way.",
    links: [
      { label: "All engagement", href: "/engagement", external: false },
      { label: "GitHub", href: site.github, external: true },
    ],
    note: "Every project and activity has its own page.",
  },
} as const;

/** The CTA band that closes every subpage; its button goes to the home page's ask card. */
export const band = {
  headingWords: ["Want", "to", "work", "together?"],
  headingAria: "Want to work together?",
  lede: "A few sentences is plenty. If it's a fit, our first call starts with the work instead of an intro.",
  go: "Send me a note",
  price: "Class of 2029",
} as const;

export const footer = {
  tagline: "Engineering · CS · Economics · Political Science",
  nav: [
    { label: "/projects", href: "/projects", external: false },
    { label: "/engagement", href: "/engagement", external: false },
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: "email", href: `mailto:${site.email}`, external: false },
    { label: "get in touch", href: "/#contact", external: false },
  ],
  mark: { wide: ["shengyan"], narrow: ["sheng", "yan"] },
  legal: `© ${site.year} ${site.name}. All rights reserved.`,
  handle: site.handle,
} as const;
