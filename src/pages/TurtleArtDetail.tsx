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

def draw_spiral_pattern():
    screen = turtle.Screen()
    screen.bgcolor("black")
    screen.title("Turtle Art - Spiral Pattern")
    
    t = turtle.Turtle()
    t.speed(0)
    t.width(2)
    
    colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
              "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"]
    
    for i in range(360):
        t.color(random.choice(colors))
        t.forward(i * 2)
        t.left(59)
    
    t.hideturtle()
    screen.mainloop()

def draw_geometric_flower():
    screen = turtle.Screen()
    screen.bgcolor("white")
    screen.title("Turtle Art - Geometric Flower")
    
    t = turtle.Turtle()
    t.speed(0)
    
    colors = ["red", "purple", "blue", "green", "orange", "yellow"]
    
    for i in range(36):
        t.color(colors[i % 6])
        t.circle(100)
        t.left(10)
    
    t.hideturtle()
    screen.mainloop()

def draw_rainbow_square():
    screen = turtle.Screen()
    screen.bgcolor("black")
    screen.title("Turtle Art - Rainbow Squares")
    
    t = turtle.Turtle()
    t.speed(0)
    t.width(3)
    
    colors = ["red", "orange", "yellow", "green", 
              "blue", "indigo", "violet"]
    
    for i in range(180):
        t.color(colors[i % 7])
        t.forward(i * 2)
        t.right(91)
    
    t.hideturtle()
    screen.mainloop()

# Run one of the patterns
draw_spiral_pattern()
# draw_geometric_flower()
# draw_rainbow_square()`;

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
