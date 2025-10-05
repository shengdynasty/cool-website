import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Code, Image, FileText } from "lucide-react";
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

const TaskManagementDetail = () => {
  const navigate = useNavigate();
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  const project = {
    title: "Task Management App",
    description: "A comprehensive task management application with drag-and-drop functionality",
    fullDescription: "Smart Task Manager is a productivity application designed for organizing and tracking tasks efficiently. It features a Kanban-style board with drag-and-drop functionality, allowing users to move tasks between different status columns (To Do, In Progress, Done). The application includes task creation, editing, priority levels, due dates, and real-time updates. Built with React and modern web technologies for a smooth user experience.",
    technologies: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    live: "https://github.com/shengdynasty",
    codeSnippet: `import tkinter as tk
from tkinter import messagebox

tasks = []  # list 

def add_task():
    task_text = task_entry.get().strip()
    if task_text:
        var = tk.BooleanVar()
        cb = tk.Checkbutton(task_frame, text=task_text, variable=var, anchor="w")
        cb.pack(fill="x", padx=5, pady=2)
        tasks.append((task_text, var, cb))
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Please enter a task.")

def delete_task():
    to_remove = [t for t in tasks if t[1].get()]  # tasks with checkbox
    if not to_remove:
        messagebox.showwarning("Selection Error", "No task selected to delete.")
        return
    for task_text, var, cb in to_remove:
        cb.destroy()
        tasks.remove((task_text, var, cb))
    messagebox.showinfo("Task Deleted", f"Deleted {len(to_remove)} task(s).")

def view_tasks():
    if not tasks:
        messagebox.showinfo("My Tasks", "No tasks yet.")
        return
    task_list = "\\n".join(
        [f"[{'x' if var.get() else ' '}] {task_text}" for task_text, var, _ in tasks]
    )
    messagebox.showinfo("My Tasks", task_list)

def exit_app():
    root.destroy()

root = tk.Tk()
root.title("Cool To-Do List")
root.geometry("400x450")

# Entry field and add button
task_entry = tk.Entry(root, width=30)
task_entry.pack(pady=10)

add_button = tk.Button(root, text="Add Task", command=add_task)
add_button.pack(pady=5)

# Frame
task_frame = tk.Frame(root)
task_frame.pack(pady=10, fill="both", expand=True)

# Buttons
delete_button = tk.Button(root, text="Delete Selected Task(s)", command=delete_task)
delete_button.pack(pady=5)

view_button = tk.Button(root, text="View All Tasks", command=view_tasks)
view_button.pack(pady=5)

exit_button = tk.Button(root, text="Exit", command=exit_app)
exit_button.pack(pady=5)

root.mainloop()
`
  };

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
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(project.github, "_blank")}
            >
              <Github className="w-4 h-4" />
              View Code
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(project.live, "_blank")}
            >
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
            <div className="flex justify-center">
              <div className="w-full max-w-2xl aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Task Management Interface</p>
                  </div>
                </div>
              </div>
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
                <li>• Drag-and-drop Kanban board interface</li>
                <li>• Task creation and editing capabilities</li>
                <li>• Priority levels and due date management</li>
                <li>• Real-time status updates</li>
                <li>• Responsive design for all devices</li>
                <li>• Task filtering and search functionality</li>
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
              Python tkinter implementation of the task management application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="vscode-theme rounded-lg overflow-hidden">
              <div className="bg-[#1e1e1e] px-4 py-2 text-white text-sm flex items-center gap-2 border-b border-[#2d2d30]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
                </div>
                <span className="ml-4 text-gray-300">task_manager.py</span>
              </div>
              <div className="bg-[#1e1e1e] p-4 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code 
                    ref={codeRef}
                    className="language-python"
                  >
                    {project.codeSnippet}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskManagementDetail;