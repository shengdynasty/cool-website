import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectContent, setProjectContent] = useState({
    title: "",
    description: "",
    code: "",
    images: [] as string[]
  });

  // Sample project data - in a real app this would come from a database
  const projects = [
    {
      id: "e-commerce-platform",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: "task-management-app",
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, file attachments, and team collaboration features.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: "weather-dashboard",
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and weather alerts using OpenWeather API.",
      technologies: ["React", "Tailwind CSS", "OpenWeather API"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      description: "Responsive portfolio website built with modern web technologies, featuring smooth animations and optimized performance.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false
    },
    {
      id: "ai-chat-application",
      title: "AI Chat Application",
      description: "Real-time chat application with AI integration, supporting multiple users, message history, and smart responses.",
      technologies: ["React", "Node.js", "OpenAI API", "WebSocket"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Personal finance management tool with budget tracking, expense categorization, and financial insights visualization.",
      technologies: ["Vue.js", "Express.js", "MongoDB", "Chart.js"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a server
      toast("Image upload feature would be implemented here");
    }
  };

  const handleSave = () => {
    toast("Project content saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Content</CardTitle>
                <CardDescription>
                  Add and edit text content for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    placeholder="Enter project title"
                    value={projectContent.title}
                    onChange={(e) => setProjectContent(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Enter project description"
                    rows={6}
                    value={projectContent.description}
                    onChange={(e) => setProjectContent(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
                <CardDescription>
                  Upload and manage images for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop images here, or click to select files
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Placeholder for uploaded images */}
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No images yet</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Code</CardTitle>
                <CardDescription>
                  Add and edit code snippets for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-code">Code</Label>
                  <Textarea
                    id="project-code"
                    placeholder="Enter your code here..."
                    rows={12}
                    className="font-mono text-sm"
                    value={projectContent.code}
                    onChange={(e) => setProjectContent(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;