import AcademicLayout from "@/components/layout/AcademicLayout";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    id: "turtle-art",
    title: "Interactive Turtle Art Generator",
    problem: "Create an engaging way to explore procedural graphics and demonstrate fundamental programming concepts through visual, interactive output.",
    tools: ["Python", "Turtle Graphics", "JSON"],
    lessons: [
      "Event-driven programming with keyboard bindings for real-time user interaction",
      "Procedural generation techniques for creating varied, randomized visual output",
      "File I/O operations for persisting and loading user-created designs",
      "Modular function design for maintainable, extensible code structure"
    ],
    github: "https://github.com/shengdynasty",
    detailPage: "/turtle-art"
  },
  {
    id: "calculator",
    title: "Scientific Calculator",
    problem: "Build a functional calculator with a graphical interface to practice GUI development and event handling in Python.",
    tools: ["Python", "Tkinter"],
    lessons: [
      "GUI layout management using grid and pack systems",
      "Handling user input and maintaining application state",
      "Implementing mathematical operations with proper order of precedence",
      "Error handling for edge cases like division by zero"
    ],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/calculator"
  },
  {
    id: "task-management",
    title: "Task Management Application",
    problem: "Develop a productivity tool to organize tasks, track progress, and practice database-like data management in a desktop application.",
    tools: ["Python", "Tkinter"],
    lessons: [
      "CRUD operations and data persistence strategies",
      "User interface design for productivity applications",
      "State management in GUI applications",
      "Implementing filtering and sorting functionality"
    ],
    github: "https://github.com/shengdynasty",
    detailPage: "/task-management"
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe Game",
    problem: "Implement a classic two-player game to practice game logic, turn-based systems, and win-condition detection algorithms.",
    tools: ["Python", "Tkinter"],
    lessons: [
      "Game state management and turn-based logic",
      "Win condition detection using iteration and conditionals",
      "Designing intuitive game interfaces",
      "Reset and replay functionality implementation"
    ],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/ai-chat-application"
  },
  {
    id: "expense-tracker",
    title: "Personal Expense Tracker",
    problem: "Create a tool to categorize and visualize personal spending, applying data structures and basic data analysis.",
    tools: ["Python", "Tkinter", "Data Visualization"],
    lessons: [
      "Data categorization and aggregation techniques",
      "Basic data visualization principles",
      "Input validation and data integrity",
      "Building summary statistics from raw data"
    ],
    github: "https://github.com/shengdynasty",
    detailPage: "/expense-tracker"
  },
  {
    id: "portfolio-website",
    title: "Academic Portfolio Website",
    problem: "Design and build a professional web presence to communicate academic interests and projects to university admissions and mentors.",
    tools: ["React", "TypeScript", "Tailwind CSS"],
    lessons: [
      "Component-based architecture and reusability",
      "Responsive design for cross-device compatibility",
      "Modern frontend development practices",
      "Content organization for academic communication"
    ],
    github: "https://github.com/shengdynasty",
    live: "https://sheng-yan.lovable.app"
  },
];

const Projects = () => {
  return (
    <AcademicLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-medium text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            A selection of programming and data projects. Each project addresses a 
            specific problem and reflects learning in computational thinking, 
            software design, and applied problem-solving.
          </p>
        </section>

        <div className="space-y-10">
          {projects.map((project, index) => (
            <article key={project.id} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-medium text-foreground">
                  {project.detailPage ? (
                    <Link 
                      to={project.detailPage}
                      className="hover:text-muted-foreground transition-colors"
                    >
                      {project.title}
                    </Link>
                  ) : (
                    project.title
                  )}
                </h2>
                <div className="flex gap-2 flex-shrink-0">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="View live project"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Problem</h3>
                  <p className="text-sm text-muted-foreground">{project.problem}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Tools</h3>
                  <p className="text-sm text-muted-foreground">{project.tools.join(", ")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Key Lessons</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {project.lessons.map((lesson, lIndex) => (
                      <li key={lIndex} className="flex gap-2">
                        <span className="text-muted-foreground/60">•</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {index < projects.length - 1 && (
                <Separator className="mt-6" />
              )}
            </article>
          ))}
        </div>
      </div>
    </AcademicLayout>
  );
};

export default Projects;
