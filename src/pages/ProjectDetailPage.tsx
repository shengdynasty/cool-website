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
  codeSnippet: string;
  features: string[];
  language?: string;
}

const projectsData: Record<string, ProjectData> = {
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

        {/* Image */}
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
              marginBottom: "4rem",
              background: "#0D0D0D",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8)",
              }}
            />
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
