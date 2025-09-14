import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Code, Image, FileText } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Sample project data - in a real app this would come from a database
  const projects = [
    {
      id: "calculator",
      title: "Calculator",
      description: "A basic four function calculator with a bacic UI",
      fullDescription: "Cool Calculator is a Calculator that's designed for addition (+), subtraction (−), multiplication (×), and division (÷). It features a numeric keypad (0–9), decimal point, and function keys for each operation, along with an “equals” button to compute results. The UI used a built-in package in the Python library called tkinder",
      technologies: ["python", "tkinter"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
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
root.resizable(False, False)
entry = tk.Entry(root, width=20, font=("Arial", 18), borderwidth=5, relief="ridge", justify="right")
entry.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

buttons = [
    ("7", 1, 0), ("8", 1, 1), ("9", 1, 2), ("/", 1, 3),
    ("4", 2, 0), ("5", 2, 1), ("6", 2, 2), ("*", 2, 3),
    ("1", 3, 0), ("2", 3, 1), ("3", 3, 2), ("-", 3, 3),
    ("0", 4, 0), (".", 4, 1), ("+", 4, 2), ("=", 4, 3),
]

for (text, row, col) in buttons:
    if text == "=":
        tk.Button(root, text=text, width=5, height=2, font=("Arial", 14),
                  command=calculate).grid(row=row, column=col, padx=5, pady=5)
    else:
        tk.Button(root, text=text, width=5, height=2, font=("Arial", 14),
                  command=lambda t=text: click_button(t)).grid(row=row, column=col, padx=5, pady=5)

tk.Button(root, text="C", width=23, height=2, font=("Arial", 14),
          command=clear_screen).grid(row=5, column=0, columnspan=4, padx=5, pady=5)

root.mainloop()`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "task management app",
      title: "Task Management App",
      description: "A comprehensive task management application with drag-and-drop functionality",
      fullDescription: "Smart Task Manager is a productivity application designed for organizing and tracking tasks efficiently. It features a Kanban-style board with drag-and-drop functionality, allowing users to move tasks between different status columns (To Do, In Progress, Done). The application includes task creation, editing, priority levels, due dates, and real-time updates. Built with React and modern web technologies for a smooth user experience.",
      technologies: ["React", "JavaScript", "CSS"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
      codeSnippet: `import React, { useState } from 'react';

const TaskList = ({ tasks, onUpdateTask }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask(draggedTask.id, { 
        status,
        updatedAt: new Date().toISOString()
      });
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="task-board">
      {['todo', 'in-progress', 'done'].map(status => (
        <div
          key={status}
          className="task-column"
          onDrop={(e) => handleDrop(e, status)}
          onDragOver={handleDragOver}
        >
          <h3 className="column-header">
            {status.replace('-', ' ').toUpperCase()}
            <span className="task-count">
              ({tasks.filter(task => task.status === status).length})
            </span>
          </h3>
          {tasks.filter(task => task.status === status).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={handleDragStart}
              draggable
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "weather-dashboard",
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and weather alerts using OpenWeather API.",
      fullDescription: "A modern weather application that provides real-time weather data, 7-day forecasts, and interactive weather maps. Built with React and integrated with the OpenWeather API for accurate, up-to-date weather information.",
      technologies: ["React", "Tailwind CSS", "OpenWeather API"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
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

def check_tie():
    for r in range(3):
        for c in range(3):
            if board[r][c]["text"] == "":
                return False
    return True

def handle_click(r, c):
    global player
    if board[r][c]["text"] == "":
        board[r][c]["text"] = player
        if check_winner():
            messagebox.showinfo("Game Over", f"Player {player} wins!")
            window.quit()
        elif check_tie():
            messagebox.showinfo("Game Over", "It's a tie!")
            window.quit()
        else:
            player = "O" if player == "X" else "X"

for r in range(3):
    for c in range(3):
        board[r][c] = tk.Button(window, text="",
                                width=10, height=3,
                                font=("Arial", 20),
                                command=lambda row=r, col=c: handle_click(row, col))
        board[r][c].grid(row=r, column=c)

window.mainloop()`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      description: "Responsive portfolio website built with modern web technologies, featuring smooth animations and optimized performance.",
      fullDescription: "A personal portfolio website showcasing projects, skills, and experience. Built with React and Tailwind CSS, featuring smooth animations, responsive design, and optimized performance for fast loading times.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
      codeSnippet: `const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navigation activeSection={activeSection} />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "ai-chat-application",
      title: "AI Chat Application",
      description: "Real-time chat application with AI integration, supporting multiple users, message history, and smart responses.",
      fullDescription: "An intelligent chat application that combines real-time messaging with AI-powered responses. Features include user authentication, message history, typing indicators, and integration with OpenAI's GPT API for smart, contextual responses.",
      technologies: ["React", "Node.js", "OpenAI API", "WebSocket"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
      codeSnippet: `const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('ws://localhost:3001');
    
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    socketRef.current.emit('message', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Get AI response
    const aiResponse = await getAIResponse(newMessage);
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    socketRef.current.emit('message', aiMessage);
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator />}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={sendMessage}
      />
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Personal finance management tool with budget tracking, expense categorization, and financial insights visualization.",
      fullDescription: "A comprehensive expense tracking application that helps users manage their personal finances. Features include expense categorization, budget setting, financial goal tracking, and detailed analytics with interactive charts and reports.",
      technologies: ["Vue.js", "Express.js", "MongoDB", "Chart.js"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
      codeSnippet: `const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: new Date()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  };

  const getRemainingBudget = () => {
    return budget - getTotalExpenses();
  };

  return (
    <div className="expense-tracker">
      <BudgetOverview
        budget={budget}
        totalExpenses={getTotalExpenses()}
        remaining={getRemainingBudget()}
      />
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
      <ExpenseChart data={getExpensesByCategory()} />
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    }
  ];

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              View Code
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {project.fullDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Images */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Project Screenshots
            </CardTitle>
            <CardDescription>
              Visual showcase of the {project.title} application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Screenshot {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Overview
            </CardTitle>
            <CardDescription>
              Detailed information about the project features and implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed mb-4">
                {project.fullDescription}
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-3">Key Features:</h3>
              <ul className="text-muted-foreground space-y-1 mb-6">
                <li>• Responsive design optimized for all devices</li>
                <li>• Modern user interface with smooth animations</li>
                <li>• Clean, maintainable code structure</li>
                <li>• Performance optimized for fast loading</li>
                <li>• Cross-browser compatibility</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mb-3">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Showcase
            </CardTitle>
            <CardDescription>
              Key code snippets demonstrating the implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-foreground">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;