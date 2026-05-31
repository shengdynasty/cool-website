import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import AcademicLayout from "@/components/layout/AcademicLayout";
import expense from "@/assets/expense.svg";
import task from "@/assets/taskmanagement.svg";
import turtle from "@/assets/turtle-art.svg";
import port from "@/assets/portfolio.svg";
import tttImage from "@/assets/ttt-ss.svg";
import calculatorImage from "@/assets/calculator-app.svg";
import stockImage from "@/assets/stock-visualizer.svg";
import noteImage from "@/assets/note-app.svg";
import mcpImage from "@/assets/mcp-server.svg";
import ragImage from "@/assets/rag-chatbot.svg";
import webResearcherImage from "@/assets/web-researcher.svg";
import schoolMcpImage from "@/assets/school-mcp.svg";
import quantPlatformImage from "@/assets/quant-platform.svg";
import autonomousResearcherImage from "@/assets/autonomous-researcher.svg";
import videoToTextImage from "@/assets/video-to-text.svg";
import vttTokenFormula from "@/assets/vtt-token-formula.svg";
import vttLazyLoad from "@/assets/vtt-lazy-load.svg";
import vttContactSheet from "@/assets/vtt-contact-sheet.svg";

const GH = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface ProjectData {
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  github: string;
  live?: string;
  image: string | null;
  video?: string;
  codeSnippet: string;
  features: string[];
  language?: string;
  diagrams?: { src: string; title: string; caption: string }[];
}

const projectsData: Record<string, ProjectData> = {
  "video-to-text": {
    title: "Video-to-Text MCP Server",
    description: "Token-budgeted MCP server that lets Claude watch video without blowing its context — pixel-cost projection, lazy frame manifests, and contact-sheet montages cut a 10-min clip from ~150k tokens to ~5k.",
    fullDescription: `An MCP (Model Context Protocol) server that gives Claude the ability to "watch" video — extracting frames, transcribing audio, and building searchable timelines — while keeping a tight leash on the one thing that makes vision expensive: tokens. Naively feeding a 10-minute clip to a vision model can cost ~150,000 tokens; this server delivers the same understanding for roughly 5,000 by treating token budget as a first-class constraint at every stage of the pipeline.

The core insight is that vision cost is driven by pixels, not file size. Anthropic's vision models price an image at roughly (width × height) / 750 tokens, with the long edge auto-capped at 1568px. A raw 1920×1080 frame costs ~2,765 tokens; the same frame resized to 512×288 costs ~196 — a 14× reduction with no loss of the semantic content a model actually needs. The server exposes estimate_frame_tokens() and compute_affordable_frames() so Claude can project the cost of a request before spending a single token, then resize frames to fit a target dimension via _scale_to_fit().

Seven tools form the pipeline: probe_video (ffprobe metadata), extract_frames (fps-sampled, perceptually deduplicated frame extraction that returns a lightweight JSON manifest — not pixels), get_contact_sheet (tiles N frames into one montage image, ~40% cheaper than sending them individually), get_frames (loads specific frames on demand), transcribe (faster-whisper audio→text with timestamps), build_timeline (merges visual + audio events into a unified searchable timeline), and cleanup (purges the job cache). Frames are written to a per-job cache directory with a 24-hour TTL, so extraction happens once and Claude can inspect, re-inspect, and transcribe without re-decoding the video. Lazy loading means the manifest is cheap to read and pixels are only paid for when explicitly requested.`,
    technologies: ["Python", "FastMCP", "ffmpeg", "faster-whisper", "Pillow"],
    github: "https://github.com/shengdynasty/video-to-text-mcp",
    image: videoToTextImage,
    language: "python",
    diagrams: [
      {
        src: vttTokenFormula,
        title: "Token Cost Model",
        caption: "Vision cost scales with pixels, not file size: tokens ≈ (w × h) / 750. Resizing a 1920×1080 frame to 512×288 turns ~2,765 tokens into ~196 — a 14× saving that drops a 10-minute clip from ~150k to ~5k tokens.",
      },
      {
        src: vttLazyLoad,
        title: "Lazy Loading & Job Lifecycle",
        caption: "extract_frames() returns a lightweight JSON manifest — not pixels — written to a per-job cache (~/.cache/video-to-text-mcp/<job_id>/) with a 24h TTL. Pixels are only paid for when get_contact_sheet or get_frames is explicitly called.",
      },
      {
        src: vttContactSheet,
        title: "Contact Sheet vs Per-Frame",
        caption: "Tiling 12 frames into a single montage costs ~1,440 tokens versus ~2,350 sent individually — roughly 40% fewer tokens for the same visual coverage, because per-image overhead is paid once instead of twelve times.",
      },
    ],
    features: [
      "7 MCP tools: probe_video, extract_frames, get_contact_sheet, get_frames, transcribe, build_timeline, cleanup",
      "Pixel-cost projection: estimate_frame_tokens() and compute_affordable_frames() price a request before spending tokens",
      "Token formula tokens ≈ (w × h) / 750 with long-edge auto-cap at 1568px baked into every cost estimate",
      "Frame resizing via _scale_to_fit(): a 1920×1080 frame drops from ~2,765 to ~196 tokens (14× cheaper)",
      "Lazy manifests: extract_frames() returns JSON metadata, not pixels — pixels loaded only on demand",
      "Contact-sheet montages tile N frames into one image, ~40% cheaper than sending frames individually",
      "Perceptual deduplication skips near-identical frames so the token budget is spent on distinct content",
      "fps sampling + token_budget ceiling: 10-min clip drops from ~150k to ~5k tokens",
      "faster-whisper transcription with timestamps merged into a unified searchable timeline",
      "Per-job cache directory with 24h TTL — extract once, inspect and transcribe repeatedly without re-decoding",
    ],
    codeSnippet: `# Token-budget core — project vision cost before spending a single token
# Anthropic vision pricing: ~ (width x height) / 750 tokens per image,
# with the long edge auto-capped at 1568px.

TOKENS_PER_PIXEL_DIVISOR = 750
MAX_LONG_EDGE = 1568


def estimate_frame_tokens(width: int, height: int) -> int:
    """Project the token cost of a single frame at the given resolution."""
    w, h = _scale_to_fit(width, height, MAX_LONG_EDGE)
    return round((w * h) / TOKENS_PER_PIXEL_DIVISOR)


def _scale_to_fit(width: int, height: int, max_dim: int) -> tuple[int, int]:
    """Scale (w, h) down so the long edge <= max_dim, preserving aspect ratio."""
    long_edge = max(width, height)
    if long_edge <= max_dim:
        return width, height
    scale = max_dim / long_edge
    return round(width * scale), round(height * scale)


def compute_affordable_frames(
    width: int,
    height: int,
    token_budget: int,
    max_dimension: int = 512,
) -> int:
    """How many resized frames fit inside a token budget?"""
    w, h = _scale_to_fit(width, height, max_dimension)
    per_frame = max(1, round((w * h) / TOKENS_PER_PIXEL_DIVISOR))
    return token_budget // per_frame


# A 10-min clip sampled at fps=0.5 -> ~25 frames.
# Naive (full-res, every frame):  25 * 2765  ~= 150,000 tokens
# Budgeted (resized to 512px):     25 *  196  ~=   5,000 tokens`,
  },
  "autonomous-researcher": {
    title: "Autonomous Research Agent",
    description: "Agentic research tool that plans its own sub-questions, searches the web, evaluates sources, retries bad results, and synthesizes a cited Markdown report — entirely local via Ollama. No API keys.",
    fullDescription: `A fully local, zero-API-key autonomous research agent built in TypeScript and React. Unlike a one-shot search tool, this agent runs a four-stage loop that mirrors how a human researcher actually works: it first asks "what do I need to know?", then searches, reads and evaluates every source, discards low-quality pages, and only writes the final report once it has gathered enough credible evidence.

Stage 1 (Plan): given any topic, the local Ollama LLM generates four targeted sub-questions that together give a comprehensive view. Stage 2 (Search): each sub-question is sent to DuckDuckGo via HTML scraping — no API key, no rate limits for personal use. Stage 3 (Scrape + Evaluate): for each result, the page is fetched with axios, cleaned with cheerio, and scored 0–10 by the LLM for relevance. If the score falls below 5, the agent refines the search query and retries — up to three attempts per sub-question. Stage 4 (Synthesize): once sufficient high-quality sources are collected, the LLM writes a 500–700 word Markdown report with inline citations, saved to ./reports/*.md with a date-stamped filename.

The Express backend streams every agent decision to the React frontend via Server-Sent Events (SSE), producing a real-time terminal-style log — color-coded by stage (PLAN / SRCH / FETCH / EVAL / SYNC). The frontend's ReportViewer tab shows the finished report with full Markdown rendering, and a Saved Reports panel lets you browse all past research sessions.`,
    technologies: ["TypeScript", "Node.js", "Ollama", "React", "Express", "SSE"],
    github: "https://github.com/shengdynasty/autonomous-researcher",
    image: autonomousResearcherImage,
    video: "/autonomous-researcher-demo.mp4",
    language: "typescript",
    features: [
      "4-stage autonomous loop: Plan → Search → Scrape → Evaluate → Synthesize",
      "LLM-powered planner breaks any topic into 4 targeted search sub-questions",
      "DuckDuckGo HTML scraping via axios + cheerio — no API keys, no rate limits",
      "Per-source relevance scoring: LLM rates each page 0–10, discards below threshold",
      "Self-correcting retry logic: refines the search query and retries up to 3× per question",
      "Synthesizer writes 500–700 word Markdown reports with inline [1],[2] citations",
      "Server-Sent Events (SSE): every agent decision streams live to the UI",
      "Color-coded terminal log: PLAN / SRCH / FETCH / EVAL / SYNC stages",
      "Reports persisted to ./reports/*.md with date-stamped filenames",
      "Model selector for any locally installed Ollama model (llama3.2, mistral, etc.)",
    ],
    codeSnippet: `// Agent orchestrator — 4-stage autonomous loop with self-correction
export async function runResearchLoop(topic, model, onLog) {
  // Stage 1: LLM breaks topic into 4 targeted sub-questions
  onLog({ stage: 'plan', message: \`Planning research for: "\${topic}"...\` });
  const subQuestions = await planResearch(topic, model);

  const goodPages = [];

  for (const sq of subQuestions) {
    onLog({ stage: 'search', message: \`Searching: "\${sq.searchQuery}"\` });
    let results = await search(sq.searchQuery);
    let foundGood = false;

    // Self-correcting retry loop — up to 3 attempts per sub-question
    for (let attempt = 0; attempt < 3 && !foundGood; attempt++) {
      for (const result of results.slice(0, 4)) {
        const content = await scrapeUrl(result.url);
        const { score, reason } = await evaluatePage(content, sq.question, model);

        if (score >= 5) {  // threshold: discard low-relevance pages
          onLog({ stage: 'evaluate', message: \`✓ \${score}/10 — \${reason}\` });
          goodPages.push({ question: sq.question, content, url: result.url });
          foundGood = true;
          break;
        }
      }
      if (!foundGood) {
        // Refine query and search again
        results = await search(\`\${sq.searchQuery} explained guide\`);
        onLog({ stage: 'search', message: \`Retrying with refined query...\` });
      }
    }
  }

  // Stage 4: synthesize all sources into a cited Markdown report
  onLog({ stage: 'synthesize', message: \`Writing report from \${goodPages.length} sources...\` });
  return synthesize(topic, goodPages, model);
}`,
  },
  "web-researcher": {
    title: "AI Web Researcher",
    description: "Local-first AI research assistant — type any topic, get live DuckDuckGo search results synthesized into a streaming markdown report via Ollama. No API keys.",
    fullDescription: "A fully local, zero-API-key research tool built in React + TypeScript (Vite). The user enters any research topic, the app proxies a query through Vite's dev server to DuckDuckGo's Instant Answer API to retrieve real search results, then feeds those results as structured context into a local Ollama model (default: llama3.2). The LLM synthesizes a structured markdown report using the streaming endpoint, so the text appears word-by-word in real time. A model selector dropdown auto-populates from Ollama's /api/tags, a depth toggle switches between Quick (3–5 sections) and Deep Dive (6–10 sections), and a collapsible panel exposes the raw search results used as context. The finished report can be exported to PDF via window.print() with dedicated print CSS.",
    technologies: ["React", "TypeScript", "Ollama", "Vite"],
    github: "https://github.com/shengdynasty/web-researcher",
    image: webResearcherImage,
    language: "typescript",
    features: [
      "Live DuckDuckGo web search via Vite proxy — no CORS, no API key",
      "Ollama streaming endpoint: report text appears token-by-token in real time",
      "Model selector auto-populated from Ollama's /api/tags endpoint",
      "Quick (3–5 sections) vs Deep Dive (6–10 sections) depth toggle",
      "Collapsible sources panel showing raw search results used as context",
      "Full GFM markdown rendering — tables, code blocks, headers, lists",
      "PDF export via window.print() with print CSS stripping all UI chrome",
      "Amber-on-ink 'Archival Intelligence' dark theme with streaming cursor",
    ],
    codeSnippet: `// Ollama streaming generator — yields tokens as they arrive
export async function* streamReport(
  model: string,
  topic: string,
  formattedResults: string,
  depth: 'quick' | 'deep',
): AsyncGenerator<string> {
  const prompt = \`You are a professional research assistant.
Based on the following search results, write a structured
research report on the topic: "\${topic}"

Search Results:
\${formattedResults}

Instructions:
- Synthesize the information — do not just summarize each result
- Identify conflicting information or debates
- Format in clean markdown with headers and bullet points
- End with a ## Sources section listing URLs
- \${depth === 'quick' ? 'Write 3-5 focused sections.' : 'Write 6-10 comprehensive sections.'}\`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: true }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      try {
        const chunk = JSON.parse(line);
        if (chunk.response) yield chunk.response;
        if (chunk.done) return;
      } catch { /* skip */ }
    }
  }
}`,
  },
  "rag-chatbot": {
    title: "Local RAG Chatbot",
    description: "100% local Retrieval-Augmented Generation chatbot — upload any PDF, ask questions, get answers grounded in your document. No API keys. Runs via Ollama.",
    fullDescription: "A fully local Retrieval-Augmented Generation chatbot that lets you upload any PDF and immediately have a conversation with its content — no cloud API keys, no external services. Built in Node.js with LangChain.js and served via Express, the system extracts text from uploaded PDFs, splits it into 512-token overlapping chunks, embeds them using Ollama's llama3.2 model running locally, and stores the vectors as JSON for instant reloading. At query time, the user's question is embedded, semantically matched against the stored vectors, and the top-3 most relevant chunks are injected into a grounded prompt sent to the local LLM — eliminating hallucination entirely. The drag-and-drop web UI shows live ingestion status, switches between upload and chat modes seamlessly, and allows hot-swapping documents without restarting the server.",
    technologies: ["Node.js", "LangChain.js", "Ollama", "Express"],
    github: "https://github.com/shengdynasty/rag-chatbot",
    image: ragImage,
    language: "javascript",
    features: [
      "Drag-and-drop PDF upload directly in the browser — no CLI required",
      "Text extraction with pypdf, split into 512-token chunks with 128-token overlap",
      "Local embeddings via Ollama llama3.2 — no API keys or internet connection",
      "Pure-JS MemoryVectorStore with JSON persistence — no native C++ modules",
      "Top-3 semantic retrieval using cosine similarity at query time",
      "LLM constrained to document context — says \"I don't know\" if out of scope",
      "Hot-swap documents via \"Upload new PDF\" without restarting the server",
      "LangChain.js orchestration: createRetrievalChain + createStuffDocumentsChain",
    ],
    codeSnippet: `const { ChatOllama } = require('@langchain/ollama');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { createRetrievalChain } = require('langchain/chains/retrieval');

async function buildChain(retriever) {
  // Local LLM — runs entirely on your machine via Ollama
  const llm = new ChatOllama({
    model: 'llama3.2',
    baseUrl: 'http://127.0.0.1:11434',
  });

  // Inline prompt — no hub.pull(), no API key needed
  // System message constrains LLM to only use retrieved context
  const prompt = ChatPromptTemplate.fromMessages([
    ['system',
      'You are a helpful assistant. Answer using ONLY the context below. ' +
      'If the answer is not in the context, say ' +
      '"I don\\'t know based on the provided document."\\n\\nContext: {context}'],
    ['human', '{input}'],
  ]);

  // Stuff chain: concatenates top-k chunks into {context}, sends to LLM
  const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });

  // Retrieval chain: embed query → cosine search → stuff → LLM → { answer }
  return createRetrievalChain({ retriever, combineDocsChain });
}`,
  },
  "mcp-server": {
    title: "Personal AI MCP Server",
    description: "Custom MCP server suite connecting Claude to Gmail, Google Calendar, Notion, Spotify, GitHub — natural-language control of real-world tools.",
    fullDescription: "A personal MCP (Model Context Protocol) server that acts as a bridge between Claude and a suite of everyday services. Built in TypeScript and running locally, it exposes tools for Gmail (read, search, send), Google Calendar (events, today's agenda, create), Notion (search, query, create pages), Spotify (now playing, recent, top artists), GitHub (profile, contributions), iMessage, and more. With 42+ registered tools, Claude can answer questions like \"What's on my calendar today?\", \"Send an email to X\", or \"What have I been listening to?\" entirely through natural conversation — no UI required.",
    technologies: ["TypeScript", "MCP", "Claude AI", "Node.js"],
    github: "https://github.com/shengdynasty",
    image: mcpImage,
    features: [
      "42+ tools across 10+ services registered via MCP protocol",
      "Gmail integration: read inbox, search messages, send emails",
      "Google Calendar: fetch today's events, query by date, create events",
      "Notion: search pages, query databases, create and append blocks",
      "Spotify: now playing, recent tracks, and top artists",
      "GitHub: profile stats and contribution history",
      "iMessage: read recent chats, search conversations, send messages",
      "Tool call latency logging and uptime monitoring",
      "Single Claude chat interface for all services",
    ],
    codeSnippet: `import Anthropic from "@anthropic-ai/sdk";
import { McpClient } from "@anthropic-ai/mcp-client";

const anthropic = new Anthropic();
const mcp = new McpClient({ serverUrl: "http://localhost:3000" });

async function chat(userMessage: string) {
  // Fetch all registered tools from the MCP server
  const { tools } = await mcp.listTools();

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    tools,
    messages: [{ role: "user", content: userMessage }],
  });

  // Handle tool use blocks from Claude's response
  for (const block of response.content) {
    if (block.type === "tool_use") {
      const result = await mcp.callTool({
        name: block.name,
        arguments: block.input as Record<string, unknown>,
      });
      console.log(\`Tool: \${block.name} →\`, result);
    }
  }
}

chat("What's on my calendar today and who emailed me this morning?");`,
  },
  "turtle-art": {
    title: "Interactive Turtle Art Generator",
    description: "Procedural graphics exploration demonstrating fundamental programming concepts through visual, interactive output.",
    fullDescription: "Interactive Turtle Art Generator is a creative graphics application using Python's Turtle module to generate colorful patterns, shapes, and artistic designs with procedural generation algorithms. The application allows users to create unique visual art through keyboard controls and features save/load functionality for designs.",
    technologies: ["Python", "Turtle Graphics", "JSON"],
    github: "https://github.com/shengdynasty",
    image: turtle,
    features: [
      "Multiple artistic pattern generators (spirals, flowers, geometric shapes)",
      "Procedural generation with random color selection",
      "Keyboard controls for interactive drawing",
      "Save and load design functionality",
      "Surprise Me feature for random art generation",
    ],
    codeSnippet: `import turtle
import random
import json

screen = turtle.Screen()
screen.title("Interactive Turtle Art Generator")
screen.bgcolor("white")
screen.setup(width=800, height=800)

artist = turtle.Turtle()
artist.speed(0)
artist.width(2)

colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]

def random_color():
    return random.choice(colors)

def draw_shape(shape_type, size, color, x, y):
    artist.penup()
    artist.goto(x, y)
    artist.pendown()
    artist.color(color)

    if shape_type == "circle":
        artist.begin_fill()
        artist.circle(size)
        artist.end_fill()
    elif shape_type == "square":
        artist.begin_fill()
        for _ in range(4):
            artist.forward(size)
            artist.right(90)
        artist.end_fill()

screen.mainloop()`,
  },
  "calculator": {
    title: "Scientific Calculator",
    description: "Functional calculator with a graphical interface to practice GUI development and event handling in Python.",
    fullDescription: "Cool Calculator is designed for addition (+), subtraction (−), multiplication (×), and division (÷). It features a numeric keypad (0–9), decimal point, and function keys for each operation, along with an 'equals' button to compute results. The UI uses a built-in package in the Python library called Tkinter.",
    technologies: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    image: calculatorImage,
    features: [
      "Basic arithmetic operations (add, subtract, multiply, divide)",
      "Clean graphical user interface",
      "Error handling for division by zero",
      "Clear screen functionality",
      "Responsive button layout",
    ],
    codeSnippet: `import tkinter as tk

def click_button(value):
    current = entry.get()
    entry.delete(0, tk.END)
    entry.insert(0, current + value)

def clear_screen():
    entry.delete(0, tk.END)

def calculate():
    try:
        result = str(eval(entry.get()))
        entry.delete(0, tk.END)
        entry.insert(0, result)
    except ZeroDivisionError:
        entry.delete(0, tk.END)
        entry.insert(0, "can't divide by 0")
    except Exception:
        entry.delete(0, tk.END)
        entry.insert(0, "error")

root = tk.Tk()
root.title("Cool Calculator")
root.geometry("300x400")

entry = tk.Entry(root, width=20, font=("Arial", 18),
                 borderwidth=5, relief="ridge", justify="right")
entry.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

buttons = [
    ("7", 1, 0), ("8", 1, 1), ("9", 1, 2), ("/", 1, 3),
    ("4", 2, 0), ("5", 2, 1), ("6", 2, 2), ("*", 2, 3),
    ("1", 3, 0), ("2", 3, 1), ("3", 3, 2), ("-", 3, 3),
    ("0", 4, 0), (".", 4, 1), ("+", 4, 2), ("=", 4, 3),
]

for (text, row, col) in buttons:
    if text == "=":
        tk.Button(root, text=text, width=5, height=2,
                  command=calculate).grid(row=row, column=col)
    else:
        tk.Button(root, text=text, width=5, height=2,
                  command=lambda t=text: click_button(t)).grid(row=row, column=col)

root.mainloop()`,
  },
  "task-management": {
    title: "Task Management Application",
    description: "Productivity tool to organize tasks, track progress, and practice database-like data management.",
    fullDescription: "Smart Task Manager is a productivity application designed for organizing and tracking tasks efficiently. It features a simple interface allowing users to add, delete, and view tasks with checkbox functionality for tracking completion status.",
    technologies: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    image: task,
    features: [
      "Add and delete tasks dynamically",
      "Checkbox-based completion tracking",
      "View all tasks in a dialog",
      "Input validation for empty tasks",
      "Clean and intuitive interface",
    ],
    codeSnippet: `import tkinter as tk
from tkinter import messagebox

tasks = []

def add_task():
    task_text = task_entry.get().strip()
    if task_text:
        var = tk.BooleanVar()
        cb = tk.Checkbutton(task_frame, text=task_text,
                            variable=var, anchor="w")
        cb.pack(fill="x", padx=5, pady=2)
        tasks.append((task_text, var, cb))
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Please enter a task.")

def delete_task():
    to_remove = [t for t in tasks if t[1].get()]
    if not to_remove:
        messagebox.showwarning("Selection Error",
                               "No task selected to delete.")
        return
    for task_text, var, cb in to_remove:
        cb.destroy()
        tasks.remove((task_text, var, cb))

root = tk.Tk()
root.title("Cool To-Do List")
root.geometry("400x450")

task_entry = tk.Entry(root, width=30)
task_entry.pack(pady=10)

add_button = tk.Button(root, text="Add Task", command=add_task)
add_button.pack(pady=5)

task_frame = tk.Frame(root)
task_frame.pack(pady=10, fill="both", expand=True)

root.mainloop()`,
  },
  "tic-tac-toe": {
    title: "Tic Tac Toe Game",
    description: "Classic two-player game implementing game logic, turn-based systems, and win-condition detection.",
    fullDescription: "Classic Tic Tac Toe Game is a two-player strategy game built using Python's Tkinter library. The game features a clean 3×3 grid interface where players alternate between X and O markers. It includes win detection for rows, columns, and diagonals, tie game detection, and automatic game reset functionality.",
    technologies: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    image: tttImage,
    features: [
      "Two-player turn-based gameplay",
      "Win detection for rows, columns, and diagonals",
      "Tie game recognition",
      "Visual feedback with colored squares",
      "Automatic game reset functionality",
    ],
    codeSnippet: `import tkinter as tk
from tkinter import messagebox

window = tk.Tk()
window.title("Tic Tac Toe")

player = "X"
board = [[None, None, None],
         [None, None, None],
         [None, None, None]]

def check_winner():
    for r in range(3):
        if board[r][0]["text"] == board[r][1]["text"] == board[r][2]["text"] != "":
            return True
    for c in range(3):
        if board[0][c]["text"] == board[1][c]["text"] == board[2][c]["text"] != "":
            return True
    if board[0][0]["text"] == board[1][1]["text"] == board[2][2]["text"] != "":
        return True
    if board[0][2]["text"] == board[1][1]["text"] == board[2][0]["text"] != "":
        return True
    return False

def handle_click(r, c):
    global player
    if board[r][c]["text"] == "":
        board[r][c]["text"] = player
        if check_winner():
            messagebox.showinfo("Game Over", "Player " + player + " wins!")
            reset_game()
        else:
            player = "O" if player == "X" else "X"

for r in range(3):
    for c in range(3):
        board[r][c] = tk.Button(window, text="", width=10, height=3,
                                font=("Arial", 20),
                                command=lambda row=r, col=c: handle_click(row, col))
        board[r][c].grid(row=r, column=c)

window.mainloop()`,
  },
  "expense-tracker": {
    title: "Personal Expense Tracker",
    description: "Tool to categorize and visualize personal spending, applying data structures and basic data analysis.",
    fullDescription: "Personal Expense Tracker is a financial management tool that helps users categorize and track their spending habits. It applies data structures for organizing expenses and includes basic data visualization capabilities for spending analysis.",
    technologies: ["Python", "Tkinter", "Data Visualization"],
    github: "https://github.com/shengdynasty",
    image: expense,
    features: [
      "Add and categorize expenses",
      "Track spending by category",
      "View expense history",
      "Basic data visualization",
      "Persistent data storage",
    ],
    codeSnippet: `import tkinter as tk
from tkinter import ttk, messagebox

expenses = []
categories = ["Food", "Transport", "Entertainment", "Bills", "Other"]

def add_expense():
    amount = amount_entry.get()
    category = category_combo.get()
    description = desc_entry.get()

    if not amount or not category:
        messagebox.showwarning("Error", "Please fill all fields")
        return

    try:
        amount = float(amount)
        expenses.append({
            "amount": amount,
            "category": category,
            "description": description
        })
        update_list()
        clear_entries()
    except ValueError:
        messagebox.showwarning("Error", "Invalid amount")

def update_list():
    expense_list.delete(0, tk.END)
    total = 0
    for exp in expenses:
        text = "$" + str(exp['amount']) + " - " + exp['category']
        expense_list.insert(tk.END, text)
        total += exp['amount']
    total_label.config(text="Total: $" + str(total))

root = tk.Tk()
root.title("Expense Tracker")
root.geometry("400x500")

amount_entry = tk.Entry(root)
category_combo = ttk.Combobox(root, values=categories)
desc_entry = tk.Entry(root)

root.mainloop()`,
  },
  "note-app": {
    title: "AI Note-Taking App",
    description: "Notability-style app with AI flashcards, quizzes, fill-in-the-blank, and chat generated from your own notes using Claude.",
    fullDescription: "A full-featured note-taking web app inspired by Notability, built entirely in the browser with no backend. Write notes on a drawing canvas with pen, highlighter, and text tools, record audio with live transcription, and import PDFs. The standout feature is the AI Learn panel powered by Claude: open any note to instantly generate a Smart Notes summary, Quizlet-style flashcards with Know/Still Learning tracking, multiple-choice quizzes with per-question explanations, fill-in-the-blank practice, and a multi-turn chat grounded in your note content.",
    technologies: ["React", "TypeScript", "Vite", "Claude AI"],
    github: "https://github.com/shengdynasty/note-app",
    live: "https://shengdynasty.github.io/note-app",
    image: noteImage,
    features: [
      "Freehand drawing canvas with pen, highlighter, eraser, and shape tools",
      "Audio recording with AI-powered transcription via Claude",
      "PDF import and annotation support",
      "Smart Notes — AI-generated summary and key terms from your notes",
      "Quizlet-style flashcards with Know it / Still Learning progress tracking",
      "Multiple-choice quiz with per-question explanations and results review",
      "Fill-in-the-blank cloze practice generated from note content",
      "Multi-turn AI chat grounded in the active note",
      "Multiple themes and local persistence — no account required",
    ],
    codeSnippet: `// Claude generates study materials from raw note text
async function callClaude(prompt: string, apiKey: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

// Generate Quizlet-style flashcards
const flashcardPrompt = \`
  Given these notes, generate 8 flashcards as JSON:
  [{ "term": "...", "definition": "..." }]
  Notes: \${noteText}
\`;
const raw = await callClaude(flashcardPrompt, apiKey);
const cards = JSON.parse(raw.replace(/\`\`\`json|\\n|\`\`\`/g, "").trim());`,
  },
  "csv-stock-visualizer": {
    title: "CSV Stock Visualizer",
    description: "Interactive web app that parses CSV stock data into dynamic price charts, volume graphs, and key statistics.",
    fullDescription: "CSV Stock Visualizer is an interactive web application that transforms raw CSV stock data into clear, readable charts and statistics. Users can upload any CSV file containing OHLCV data and instantly see price history plotted as a line chart alongside volume bars. The app computes key metrics such as 52-week high/low, average volume, and daily percentage change.",
    technologies: ["React", "TypeScript", "CSV Parsing", "Data Viz"],
    github: "https://github.com/shengdynasty",
    live: "https://stock-data-visualizer-v1.lovable.app/",
    image: stockImage,
    features: [
      "CSV file upload and real-time parsing",
      "Interactive line chart with price history",
      "Volume bar graph with color-coded gain/loss",
      "Key statistics panel (open, high, low, close, volume)",
      "52-week high/low and average volume calculations",
      "Daily percentage change display",
    ],
    codeSnippet: `import { useState } from "react";

interface StockRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function parseCSV(text: string): StockRow[] {
  const lines = text.trim().split("\\n");
  const headers = lines[0].toLowerCase().split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return {
      date:   values[headers.indexOf("date")],
      open:   parseFloat(values[headers.indexOf("open")]),
      high:   parseFloat(values[headers.indexOf("high")]),
      low:    parseFloat(values[headers.indexOf("low")]),
      close:  parseFloat(values[headers.indexOf("close")]),
      volume: parseFloat(values[headers.indexOf("volume")]),
    };
  });
}

export default function App() {
  const [rows, setRows] = useState<StockRow[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  };

  const latest = rows[rows.length - 1];
  const prev   = rows[rows.length - 2];
  const change = latest && prev
    ? ((latest.close - prev.close) / prev.close) * 100
    : 0;

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFile} />
      {latest && (
        <div>
          <span>\${latest.close.toFixed(2)}</span>
          <span>{change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
}`,
  },
  "school-mcp": {
    title: "StudentVue MCP Server",
    description: "19-tool MCP server that gives Claude natural-language access to your StudentVue gradebook — grades, GPA, attendance, schedule, missing work, and grade simulation.",
    fullDescription: `A fully local Model Context Protocol (MCP) server written in TypeScript that bridges Claude Desktop to the StudentVue / Synergy school information system used by thousands of US school districts. Every aspect of a student's academic record becomes conversationally accessible: ask Claude "what's my current GPA?", "which assignments am I missing in AP Calc?", or "what score do I need on the final to get an A?" and the server fetches live data, computes the answer, and responds in plain English.

The 19 registered tools span three categories. Grade Analysis tools (7) — get_gradebook, get_grade_summary, get_grade_details, get_grade_needed, simulate_grade_scenario, get_low_grades, get_category_breakdown — parse the raw Points[] arrays from the Synergy SOAP API, compute weighted averages, project hypothetical scores, and convert percentages to letter grades via percentToLetter(). Academic Info tools (6) — get_student_info, get_school_info, get_schedule, get_calendar, get_documents, get_report_cards — surface every piece of institutional data StudentVue exposes. Smart Insights tools (6) — get_gpa, get_assignments_due, get_missing_assignments, ask_about_grades, get_attendance, get_messages — implement a full 4.0-scale GPA calculator, a missing-work detector, and a comprehensive context dump that feeds all course data to Claude for open-ended analysis.

Architecturally, the server uses the @modelcontextprotocol/sdk McpServer class with a StdioServerTransport, communicating over JSON-RPC 2.0 via stdin/stdout. All tool inputs are validated with Zod schemas before execution. A singleton StudentVue client (src/client.ts) lazily authenticates once and reuses the session across all 19 tools, avoiding repeated SOAP handshakes. A custom errFrom() utility handles the studentvue library's unusual behavior of throwing plain JavaScript objects rather than Error instances, serializing them to JSON for readable error messages in Claude.`,
    technologies: ["TypeScript", "MCP", "Node.js", "Zod", "StudentVue API"],
    github: "https://github.com/shengdynasty/school-mcp",
    image: schoolMcpImage,
    language: "typescript",
    features: [
      "19 tools registered via McpServer + StdioServerTransport (JSON-RPC 2.0 over stdin/stdout)",
      "Grade simulation: project hypothetical assignment scores to see grade impact before submitting",
      "GPA calculator: 4.0-scale weighted GPA across all scored courses with letterToGpa() mapping",
      "Missing assignment detector: flags any Score that is blank, 'Not Graded', or contains 'missing'",
      "ask_about_grades: full context dump of all courses, assignments, and priorities for AI analysis",
      "Grade needed calculator: computes exact score required on next assignment to hit target grade",
      "Singleton client pattern: one authenticated StudentVue session shared across all 19 tools",
      "Custom errFrom() serializer: handles plain-object throws from the studentvue npm library",
      "Zod input validation on all tool schemas with typed argument destructuring",
      "Category breakdown: per-category weighted averages (Homework, Tests, Quizzes, etc.)",
    ],
    codeSnippet: `// Grade simulation tool — core logic
async ({ courseName, hypotheticalScores }) => {
  const client = await getClient();          // singleton
  const gradebook = await client.gradebook(0);
  const courses = extractCourses(gradebook);
  const course = findCourse(courses, courseName);

  // Tally current earned / total points
  let earnedPoints = 0, totalPoints = 0;
  for (const a of extractAssignments(extractMarks(course)[0])) {
    const parts = a.Points?.split('/') ?? [];
    if (parts.length !== 2) continue;
    const possible = parsePoints(parts[1]);
    const earned  = parsePoints(a.Score);
    if (possible === null || earned === null) continue;
    earnedPoints += earned;
    totalPoints  += possible;
  }

  // Add hypothetical assignments
  let simEarned = earnedPoints, simTotal = totalPoints;
  for (const h of hypotheticalScores) {
    simEarned += h.score;
    simTotal  += h.outOf;
  }

  const currentPct   = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : null;
  const projectedPct = simTotal   > 0 ? (simEarned   / simTotal)    * 100 : null;

  return ok({
    currentGrade:    currentPct   !== null ? Math.round(currentPct   * 100) / 100 : null,
    projectedGrade:  projectedPct !== null ? Math.round(projectedPct * 100) / 100 : null,
    projectedLetter: projectedPct !== null ? percentToLetter(projectedPct) : 'N/A',
    change: currentPct !== null && projectedPct !== null
      ? Math.round((projectedPct - currentPct) * 100) / 100 : null,
  });
}`,
  },
  "quant-platform": {
    title: "Quant Research Platform",
    description: "Full-stack quantitative finance platform with a 7-module React frontend, FastAPI backend, automated data pipeline via APScheduler, SQLite storage, and a local Ollama AI analyst.",
    fullDescription: `A Bloomberg Terminal–inspired quantitative research platform built entirely from scratch with Python and React. It provides institutional-grade equity analysis tools in a fully local environment — no cloud API keys required beyond optional data sources, no subscription fees, and complete data privacy since everything runs on your own machine.

The React frontend is organized into seven specialized modules, each backed by a dedicated FastAPI endpoint. The Dashboard displays portfolio overview, live price charts (Recharts), and active alerts via a WebSocket connection. The Stock Screener accepts 50+ filter criteria — P/E range, RSI bounds, minimum volume, sector, EPS growth — and returns a ranked list processed server-side via Pandas DataFrames. The Research Panel pulls fundamental data (income statement, balance sheet, cash flow) from yfinance and FRED economic indicators, presenting P/E, EBITDA, ROE, and debt ratios side-by-side. The Risk Calculator runs a Monte Carlo simulation (10,000 paths via NumPy) to compute 95% Value-at-Risk, Sharpe ratio, beta against the S&P 500, and maximum drawdown. The Portfolio Tracker manages a holdings ledger in SQLite, calculating real-time P&L and allocation percentages as prices update. The Options Pricing module implements Black-Scholes from first principles using SciPy's normal CDF, outputting fair value and the full Greeks (Δ, Γ, Θ, Vega, Rho) for any call or put. The AI Analyst module submits a structured prompt containing the stock's key metrics to a local Ollama llama3.2 model and streams the response token-by-token back to the UI.

The data pipeline is automated by APScheduler with three background jobs: a 1-minute interval job fetches live OHLCV data via yfinance and writes to the price_history table; an hourly job refreshes fundamentals and FRED indicators; a nightly 2am job runs the full Monte Carlo risk computation and caches results in the analysis_cache table. Five SQLite tables (stocks, price_history, portfolio, analysis_cache, alerts) form the persistence layer, with INSERT OR REPLACE semantics to handle deduplication automatically.`,
    technologies: ["Python", "FastAPI", "React", "TypeScript", "SQLite", "Ollama", "NumPy", "yfinance"],
    github: "https://github.com/shengdynasty/quant-platform",
    image: quantPlatformImage,
    language: "python",
    features: [
      "7-module React frontend: Dashboard, Screener, Research, Risk, Portfolio, Options, AI Analyst",
      "FastAPI backend with 8 routes: GET, POST, and WebSocket endpoints for live streaming",
      "Stock Screener: 50+ filter criteria processed via Pandas DataFrame on the server",
      "Black-Scholes options pricing from scratch: fair value + full Greeks (Δ Γ Θ Vega Rho)",
      "Monte Carlo VaR: 10,000 simulation paths via NumPy for 95% confidence risk metrics",
      "APScheduler: 3 background jobs — 1min live prices, 1hr fundamentals, 02:00 risk metrics",
      "5 SQLite tables: stocks, price_history, portfolio, analysis_cache, alerts",
      "Ollama AI Analyst: llama3.2 streaming analysis with bull/bear/risk breakdown, fully local",
      "FRED API integration: CPI, Fed Funds Rate, GDP, unemployment alongside equity data",
      "Alert system: threshold-based triggers (PRICE_ABOVE, PRICE_BELOW, RSI) pushed via WebSocket",
    ],
    codeSnippet: `# Black-Scholes options pricing — core implementation
from scipy.stats import norm
import numpy as np

def black_scholes(S, K, T, r, sigma, option_type="call"):
    """
    S: spot price  K: strike  T: time to expiry (years)
    r: risk-free rate  sigma: implied volatility
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
        delta = norm.cdf(d1)
    else:
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
        delta = -norm.cdf(-d1)

    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
    theta = (-(S * norm.pdf(d1) * sigma) / (2 * np.sqrt(T))
             - r * K * np.exp(-r * T) * norm.cdf(d2)) / 365
    vega  = S * norm.pdf(d1) * np.sqrt(T) / 100
    rho   = K * T * np.exp(-r * T) * norm.cdf(d2) / 100

    return {"price": round(price, 4), "delta": round(delta, 4),
            "gamma": round(gamma, 6), "theta": round(theta, 4),
            "vega":  round(vega,  4), "rho":   round(rho,   4)}`,
  },
  "portfolio-website": {
    title: "Academic Portfolio Website",
    description: "Professional web presence to communicate academic interests and projects to university admissions.",
    fullDescription: "A personal portfolio website showcasing projects, skills, and experience. Built with React and Tailwind CSS, featuring smooth animations, responsive design, and optimized performance for fast loading times.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/shengdynasty",
    live: "https://sheng-yan.lovable.app",
    image: port,
    features: [
      "Responsive design for all devices",
      "Smooth Framer Motion animations",
      "Dark theme with editorial aesthetic",
      "Project showcase with detail pages",
      "Optimized performance",
    ],
    codeSnippet: `import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
    >
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
        >
          <Link to={project.detailPage}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};`,
  },
};

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Prism.highlightAll();
  }, [projectId]);

  const project = projectId ? projectsData[projectId] : null;

  if (!project) {
    return (
      <AcademicLayout>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
          <p style={{ color: "#555", marginBottom: "2rem" }}>Project not found.</p>
          <button
            onClick={() => navigate("/projects")}
            style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.85rem" }}
          >
            ← Back to Projects
          </button>
        </div>
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* Back */}
        <motion.button
          onClick={() => navigate("/projects")}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
            marginBottom: "4rem",
            padding: 0,
            transition: "color 150ms",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#444"}
        >
          ← PROJECTS
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "3rem" }}
        >
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            marginBottom: "1.5rem",
          }}>
            {project.title}
          </h1>

          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75, maxWidth: "52rem", marginBottom: "1.75rem" }}>
            {project.fullDescription}
          </p>

          {/* Tags + links row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
              {project.technologies.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.9rem",
                  border: "1px solid #2A2A2A",
                  borderRadius: 2,
                  color: "#666",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  transition: "color 150ms, border-color 150ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#ccc";
                  (e.currentTarget as HTMLElement).style.borderColor = "#555";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#666";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A";
                }}
              >
                <GH /> code
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.9rem",
                    background: "#fff",
                    borderRadius: 2,
                    color: "#080808",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ccc"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                >
                  ↗ live
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Cover image */}
        {project.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              aspectRatio: "16/7",
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid #1C1C1C",
              marginBottom: project.video ? "2rem" : "4rem",
              background: "#0D0D0D",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }}
            />
          </motion.div>
        )}

        {/* Video demo */}
        {project.video && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{ marginBottom: "4rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Demo
              </p>
              <div style={{ flex: 1, height: "1px", background: "#1C1C1C" }} />
            </div>
            <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #1C1C1C", background: "#000" }}>
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                controls
                style={{ width: "100%", display: "block" }}
              />
            </div>
          </motion.div>
        )}

        {/* How It Works — diagrams gallery */}
        {project.diagrams && project.diagrams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            style={{ marginBottom: "4rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                How It Works
              </p>
              <div style={{ flex: 1, height: "1px", background: "#1C1C1C" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              {project.diagrams.map((d, i) => (
                <div key={i}>
                  <div style={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid #1C1C1C",
                    background: "#07070f",
                  }}>
                    <img
                      src={d.src}
                      alt={d.title}
                      style={{ width: "100%", display: "block" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginTop: "1rem" }}>
                    <span style={{ color: "#333", fontFamily: "var(--font-mono)", fontSize: "0.65rem", flexShrink: 0, marginTop: "0.2rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p style={{ fontSize: "0.82rem", color: "#aaa", fontWeight: 600, marginBottom: "0.4rem" }}>
                        {d.title}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.65, maxWidth: "48rem" }}>
                        {d.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{ marginBottom: "4rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Key Features
            </p>
            <div style={{ flex: 1, height: "1px", background: "#1C1C1C" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 0 }}>
            {project.features.map((feature, i) => (
              <div key={i} style={{
                padding: "1rem 0",
                borderBottom: "1px solid #141414",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}>
                <span style={{ color: "#333", fontFamily: "var(--font-mono)", fontSize: "0.65rem", flexShrink: 0, marginTop: "0.1rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.83rem", color: "#666", lineHeight: 1.55 }}>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Code Showcase
            </p>
            <div style={{ flex: 1, height: "1px", background: "#1C1C1C" }} />
          </div>

          <div style={{ border: "1px solid #1C1C1C", borderRadius: 4, overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{
              background: "#0D0D0D",
              borderBottom: "1px solid #1C1C1C",
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#2A2A2A", "#2A2A2A", "#2A2A2A"].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#444", letterSpacing: "0.06em" }}>
                {project.language === "javascript" ? "chain.js" : project.technologies[0] === "React" || project.technologies[0] === "TypeScript" ? "component.tsx" : "main.py"}
              </span>
            </div>

            {/* Code block */}
            <div className="vscode-theme" style={{ background: "#0A0A0A" }}>
              <pre style={{ margin: 0, padding: "1.5rem", overflowX: "auto" }}>
                <code
                  className={`language-${
                    project.language ?? (
                      project.technologies.includes("React") || project.technologies.includes("TypeScript")
                        ? "typescript"
                        : "python"
                    )
                  }`}
                  style={{ fontSize: "0.78rem", lineHeight: 1.65 }}
                >
                  {project.codeSnippet}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

      </div>
    </AcademicLayout>
  );
}
