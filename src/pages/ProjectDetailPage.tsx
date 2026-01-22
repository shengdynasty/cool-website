import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import AcademicLayout from "@/components/layout/AcademicLayout";
import expense from "@/assets/expense.jpg";
import task from "@/assets/taskmanagement.jpg";
import turtle from "@/assets/pyturtle.jpg";
import port from "@/assets/portfolio.jpg";
import tttImage from "@/assets/ttt-ss.png";
import calculatorImage from "@/assets/calculator-app.png";

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
}

const projectsData: Record<string, ProjectData> = {
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
      "Surprise Me feature for random art generation"
    ],
    codeSnippet: `import turtle
import random
import json

# Setup screen
screen = turtle.Screen()
screen.title("Interactive Turtle Art Generator")
screen.bgcolor("white")
screen.setup(width=800, height=800)

# Create turtle
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

screen.mainloop()`
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
      "Responsive button layout"
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

root.mainloop()`
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
      "Clean and intuitive interface"
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

root.mainloop()`
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
      "Automatic game reset functionality"
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

window.mainloop()`
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
      "Persistent data storage"
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

root.mainloop()`
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
      "Dark theme with terminal aesthetic",
      "Project showcase with detail pages",
      "Optimized performance"
    ],
    codeSnippet: `import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Projects = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 gap-6"
    >
      {projects.map((project) => (
        <motion.article
          key={project.id}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          className="border border-border rounded-sm"
        >
          <Link to={project.detailPage}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </Link>
        </motion.article>
      ))}
    </motion.div>
  );
};`
  }
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Prism.highlightAll();
  }, [projectId]);

  const project = projectId ? projectsData[projectId] : null;

  if (!project) {
    return (
      <AcademicLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <button 
            onClick={() => navigate("/projects")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Projects
          </button>
        </div>
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          back to projects
        </motion.button>

        {/* Header */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <div className="flex gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm font-mono hover:border-foreground hover:bg-muted transition-colors"
              >
                <Github className="w-4 h-4" />
                code
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-sm text-sm font-mono hover:bg-foreground/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  live
                </a>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            {project.fullDescription}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span 
                key={tech} 
                className="text-xs font-mono px-2 py-1 bg-muted text-muted-foreground rounded-sm border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          className="aspect-video w-full bg-muted border border-border rounded-sm overflow-hidden mb-12 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                <span className="text-3xl font-mono">{project.title.charAt(0)}</span>
              </div>
              <span className="text-sm font-mono">project screenshot</span>
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
            Key Features
          </h2>
          <ul className="space-y-2">
            {project.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-foreground mt-1">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Code Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
            Code Showcase
          </h2>
          <div className="rounded-sm overflow-hidden border border-border">
            <div className="bg-muted px-4 py-2 border-b border-border">
              <span className="text-xs font-mono text-muted-foreground">
                {project.technologies[0] === "React" ? "component.tsx" : "main.py"}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto bg-[#1a1a1a]">
              <code className={`language-${project.technologies[0] === "React" ? "typescript" : "python"} text-sm`}>
                {project.codeSnippet}
              </code>
            </pre>
          </div>
        </motion.section>
      </motion.div>
    </AcademicLayout>
  );
};

export default ProjectDetailPage;
