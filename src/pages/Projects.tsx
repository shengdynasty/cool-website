import AcademicLayout from "@/components/layout/AcademicLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

const GH = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const fw = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  } as const);

const projects = [
  {
    id: "school-mcp", n: "01",
    title: "StudentVue MCP Server",
    description: "19-tool MCP server giving Claude natural-language access to your StudentVue gradebook — grades, GPA, attendance, missing work, and live grade simulation.",
    tools: ["TypeScript", "MCP", "Node.js", "Zod"],
    github: "https://github.com/shengdynasty/school-mcp",
    detailPage: "/project/school-mcp",
    image: schoolMcpImage, featured: true,
  },
  {
    id: "quant-platform", n: "02",
    title: "Quant Research Platform",
    description: "Bloomberg Terminal–style quant finance platform: 7-module React frontend, FastAPI backend, Monte Carlo risk engine, Black-Scholes options pricing, and local Ollama AI analyst.",
    tools: ["Python", "FastAPI", "React", "SQLite", "Ollama"],
    github: "https://github.com/shengdynasty/quant-platform",
    detailPage: "/project/quant-platform",
    image: quantPlatformImage,
  },
  {
    id: "web-researcher", n: "03",
    title: "AI Web Researcher",
    description: "Local-first AI research assistant — type any topic, get live DuckDuckGo search results synthesized into a streaming markdown report via Ollama. No API keys.",
    tools: ["React", "TypeScript", "Ollama", "Vite"],
    github: "https://github.com/shengdynasty/web-researcher",
    detailPage: "/project/web-researcher",
    image: webResearcherImage,
  },
  {
    id: "rag-chatbot", n: "04",
    title: "Local RAG Chatbot",
    description: "100% local Retrieval-Augmented Generation chatbot — upload any PDF, ask questions, get answers grounded in your document. No API keys. Runs via Ollama.",
    tools: ["Node.js", "LangChain.js", "Ollama", "Express"],
    github: "https://github.com/shengdynasty/rag-chatbot",
    detailPage: "/project/rag-chatbot",
    image: ragImage,
  },
  {
    id: "mcp-server", n: "05",
    title: "Personal AI MCP Server",
    description: "Custom MCP server suite connecting Claude to Gmail, Google Calendar, Notion, Spotify, GitHub — natural-language control of real-world tools.",
    tools: ["TypeScript", "MCP", "Claude AI", "Node.js"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/mcp-server",
    image: mcpImage,
  },
  {
    id: "note-app", n: "06",
    title: "AI Note-Taking App",
    description: "Notability-style app with AI flashcards, quizzes, fill-in-the-blank, and chat generated from your own notes using Claude.",
    tools: ["React", "TypeScript", "Claude AI", "Vite"],
    github: "https://github.com/shengdynasty/note-app",
    live: "https://shengdynasty.github.io/note-app",
    detailPage: "/project/note-app", image: noteImage,
  },
  {
    id: "csv-stock-visualizer", n: "07",

    title: "CSV Stock Visualizer",
    description: "Interactive web app that parses CSV stock data into dynamic price charts, volume graphs, and key statistics.",
    tools: ["React", "TypeScript", "CSV Parsing", "Data Viz"],
    github: "https://github.com/shengdynasty",
    live: "https://stock-data-visualizer-v1.lovable.app/",
    detailPage: "/project/csv-stock-visualizer", image: stockImage,
  },
  {
    id: "portfolio-website", n: "08",
    title: "Academic Portfolio Website",
    description: "Professional web presence to communicate academic interests and projects to university admissions.",
    tools: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/shengdynasty",
    live: "https://sheng-yan.lovable.app",
    detailPage: "/project/portfolio-website", image: port,
  },
  {
    id: "expense-tracker", n: "09",
    title: "Personal Expense Tracker",
    description: "Tool to categorize and visualize personal spending, applying data structures and basic analysis.",
    tools: ["Python", "Tkinter", "Data Visualization"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/expense-tracker", image: expense,
  },
  {
    id: "task-management", n: "10",
    title: "Task Management Application",
    description: "Productivity tool to organize tasks, track progress, and practice database-like data management.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/task-management", image: task,
  },
  {
    id: "calculator", n: "11",
    title: "Scientific Calculator",
    description: "Functional calculator with a graphical interface to practice GUI development and event handling.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/calculator", image: calculatorImage,
  },
  {
    id: "turtle-art", n: "12",
    title: "Turtle Art Generator",
    description: "Procedural graphics demonstrating fundamental programming concepts through interactive visual output.",
    tools: ["Python", "Turtle Graphics", "JSON"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/turtle-art", image: turtle,
  },
  {
    id: "tic-tac-toe", n: "13",
    title: "Tic Tac Toe Game",
    description: "Classic two-player game implementing game logic, turn-based systems, and win-condition detection.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/tic-tac-toe", image: tttImage,
  },
];

const featured = projects.find(p => p.featured)!;
const rest = projects.filter(p => !p.featured);

export default function Projects() {
  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "5rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            13 Projects
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}>
            PROJECTS
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#555", maxWidth: "36rem", lineHeight: 1.7 }}>
            Software and data projects addressing specific problems — from AI tooling to data visualization.
            Each one reflects learning in computational thinking and applied problem-solving.
          </p>
        </motion.div>

        {/* ── Featured ── */}
        <motion.div {...fw(0.1)} style={{ marginBottom: "5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#333", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Featured
          </p>
          <Link to={featured.detailPage} style={{ textDecoration: "none", display: "block" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                border: "1px solid #1C1C1C",
                transition: "border-color 200ms",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#444"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1C1C1C"}
            >
              {/* Image */}
              <div style={{ aspectRatio: "16/7", overflow: "hidden", background: "#0D0D0D" }}>
                <img
                  src={featured.image}
                  alt={featured.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)", transition: "transform 500ms, filter 500ms" }}
                  onMouseEnter={e => {
                    (e.target as HTMLImageElement).style.transform = "scale(1.03)";
                    (e.target as HTMLImageElement).style.filter = "brightness(0.75)";
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLImageElement).style.transform = "scale(1)";
                    (e.target as HTMLImageElement).style.filter = "brightness(0.6)";
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.4) 50%, transparent 100%)" }} />
              </div>

              {/* Content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
                  {featured.tools.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 600, color: "#fff", marginBottom: "0.75rem" }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#888", maxWidth: "36rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {featured.description}
                </p>
                <span style={{ fontSize: "0.8rem", color: "#ccc", letterSpacing: "0.05em" }}>
                  View project →
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Table-style list ── */}
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#333", textTransform: "uppercase", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #1C1C1C" }}>
            All Projects
          </p>

          {rest.map((p, i) => (
            <motion.div key={p.id} {...fw(i * 0.04)}>
              <Link to={p.detailPage} style={{ textDecoration: "none", display: "block" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.5rem 5.5rem 1fr auto",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "1.25rem 0",
                    borderBottom: "1px solid #141414",
                    transition: "padding-left 200ms, background 200ms",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.paddingLeft = "0.75rem";
                    (e.currentTarget as HTMLElement).style.background = "#0D0D0D";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {/* Number */}
                  <p style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>{p.n}</p>

                  {/* Thumbnail */}
                  <div style={{
                    width: "5.5rem",
                    height: "3.5rem",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #1C1C1C",
                    background: "#0D0D0D",
                    flexShrink: 0,
                  }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms" }}
                      onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.07)"}
                      onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"}
                    />
                  </div>

                  {/* Title + tools */}
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "#ccc", marginBottom: "0.3rem", lineHeight: 1.2 }}>
                      {p.title}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {p.tools.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#444", transition: "color 150ms", cursor: "pointer" }}
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#444"}>
                        <GH />
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.75rem", color: "#444", textDecoration: "none", transition: "color 150ms", cursor: "pointer" }}
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#444"}>
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </AcademicLayout>
  );
}
