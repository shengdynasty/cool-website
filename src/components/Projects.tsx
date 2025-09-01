import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  
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

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <Card key={project.title} className="group bg-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <CardTitle 
                  className="text-xl text-foreground group-hover:text-accent transition-colors duration-300 cursor-pointer hover:underline"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    Code
                  </Button>
                  <Button size="sm" className="flex items-center gap-2 bg-accent hover:bg-accent/90">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Projects */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
            Other Projects
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {otherProjects.map((project, index) => (
              <Card key={project.title} className="group bg-card border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle 
                      className="text-lg text-foreground group-hover:text-accent transition-colors duration-300 cursor-pointer hover:underline"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      {project.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
