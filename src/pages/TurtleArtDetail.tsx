import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import Navigation from "@/components/Navigation";

const TurtleArtDetail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const technologies = ["Python", "Turtle Graphics"];

  const codeSnippet = `import turtle
import random
import json

# Setup screen
screen = turtle.Screen()
screen.title("Interactive Turtle Art Generator - Final Phase")
screen.bgcolor("white")
screen.setup(width=800, height=800)

# Create turtle
artist = turtle.Turtle()
artist.speed(0)
artist.width(2)

# Global settings
colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]
saved_designs = {}

# functions
def random_color():
    return random.choice(colors)

def random_position():
    return random.randint(-300, 300), random.randint(-300, 300)

def draw_random_shape():
    shape_type = random.choice(["circle", "square", "triangle", "star", "spiral"])
    color = random_color()
    size = random.randint(20, 100)
    x, y = random_position()
    draw_shape(shape_type, size, color, x, y)

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
    
    elif shape_type == "triangle":
        artist.begin_fill()
        for _ in range(3):
            artist.forward(size)
            artist.left(120)
        artist.end_fill()
    
    elif shape_type == "star":
        artist.begin_fill()
        for _ in range(5):
            artist.forward(size)
            artist.right(144)
        artist.end_fill()
    
    elif shape_type == "spiral":
        artist.begin_fill()
        for i in range(size):
            artist.forward(i)
            artist.right(30)
        artist.end_fill()

# Movement
def move_up():
    artist.setheading(90)
    artist.forward(20)

def move_down():
    artist.setheading(270)
    artist.forward(20)

def move_left():
    artist.setheading(180)
    artist.forward(20)

def move_right():
    artist.setheading(0)
    artist.forward(20)

# Color change
def change_color():
    artist.color(random_color())

# Clear the screen
def clear_screen():
    artist.clear()

# Save current screen to memory
def save_design():
    name = screen.textinput("Save Design", "Enter a name for this design:")
    if not name:
        return
    saved_designs[name] = screen.getcanvas().postscript()
    with open("saved_designs.json", "w") as f:
        json.dump(list(saved_designs.keys()), f)
    print(f"Design '{name}' saved successfully.")

# Load saved design names
def load_design():
    try:
        with open("saved_designs.json", "r") as f:
            saved_names = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        saved_names = []
    
    if not saved_names:
        print("No saved designs found.")
        return
    
    name = screen.textinput("Load Design", f"Available: {', '.join(saved_names)}")
    if name in saved_designs:
        print(f"Design '{name}' loaded (image not redrawn for simplicity).")

# Surprise pattern
def surprise_me():
    clear_screen()
    for _ in range(random.randint(10, 25)):
        draw_random_shape()

# Key bindings
screen.listen()
screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")
screen.onkey(change_color, "c")
screen.onkey(clear_screen, "space")
screen.onkey(save_design, "s")
screen.onkey(load_design, "l")
screen.onkey(surprise_me, "r")

# Instructions
print("Interactive Turtle Art Generator Controls:")
print("Arrow Keys - Move Turtle")
print("C - Change Color")
print("Space - Clear Screen")
print("S - Save Design")
print("L - Load Design")
print("R - Surprise Me (random art)")

screen.mainloop()`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Python Turtle Art
            </h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open("https://github.com/shengdynasty", "_blank")}
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Code
              </Button>
              <Button
                onClick={() => window.open("https://github.com/shengdynasty", "_blank")}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Button>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-4">
            Creative graphics application using Python's Turtle module to generate colorful patterns, 
            shapes, and artistic designs with procedural generation algorithms.
          </p>

          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8 bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Project Overview</CardTitle>
            <CardDescription>Key Features and Implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Key Features</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Multiple artistic pattern generators (spirals, flowers, geometric shapes)</li>
                <li>Procedural generation with random color selection</li>
                <li>Smooth animations with optimized turtle speed settings</li>
                <li>Customizable color palettes for different visual effects</li>
                <li>Interactive screen setup with custom backgrounds</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Technologies Used</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Python:</strong> Core programming language for logic and control flow</li>
                <li><strong>Turtle Graphics:</strong> Built-in Python library for creating graphics and animations</li>
                <li><strong>Random Module:</strong> Generates variety in colors and patterns</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Code Showcase */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Code Showcase</CardTitle>
            <CardDescription>turtle_art.py</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-lg overflow-x-auto bg-slate-900 p-4">
                <code className="language-python text-sm">
                  {codeSnippet}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TurtleArtDetail;
