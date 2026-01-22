import AcademicLayout from "@/components/layout/AcademicLayout";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import calculatorImage from "@/assets/calculator-app.png";
import tttImage from "@/assets/ttt-ss.png";

const projects = [
  {
    id: "turtle-art",
    title: "Interactive Turtle Art Generator",
    description: "Procedural graphics exploration demonstrating fundamental programming concepts through visual, interactive output.",
    tools: ["Python", "Turtle Graphics", "JSON"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/turtle-art",
    image: null
  },
  {
    id: "calculator",
    title: "Scientific Calculator",
    description: "Functional calculator with a graphical interface to practice GUI development and event handling in Python.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/calculator",
    image: calculatorImage
  },
  {
    id: "task-management",
    title: "Task Management Application",
    description: "Productivity tool to organize tasks, track progress, and practice database-like data management.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/task-management",
    image: null
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe Game",
    description: "Classic two-player game implementing game logic, turn-based systems, and win-condition detection.",
    tools: ["Python", "Tkinter"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/tic-tac-toe",
    image: tttImage
  },
  {
    id: "expense-tracker",
    title: "Personal Expense Tracker",
    description: "Tool to categorize and visualize personal spending, applying data structures and basic data analysis.",
    tools: ["Python", "Tkinter", "Data Visualization"],
    github: "https://github.com/shengdynasty",
    detailPage: "/project/expense-tracker",
    image: null
  },
  {
    id: "portfolio-website",
    title: "Academic Portfolio Website",
    description: "Professional web presence to communicate academic interests and projects to university admissions.",
    tools: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/shengdynasty",
    live: "https://sheng-yan.lovable.app",
    detailPage: "/project/portfolio-website",
    image: null
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const Projects = () => {
  return (
    <AcademicLayout>
      <div className="space-y-12">
        {/* Header */}
        <motion.section 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">projects</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            A selection of programming and data projects. Each project addresses a 
            specific problem and reflects learning in computational thinking, 
            software design, and applied problem-solving.
          </p>
        </motion.section>

        {/* Project Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.article 
              key={project.id} 
              className="group border border-border rounded-sm overflow-hidden hover:border-foreground transition-colors"
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              {/* Project Image */}
              <Link to={project.detailPage}>
                <motion.div 
                  className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={`${project.title} screenshot`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-2xl font-mono">{project.title.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-mono">screenshot</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>

              {/* Project Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                    <Link 
                      to={project.detailPage}
                      className="hover:underline underline-offset-4"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <div className="flex gap-3 flex-shrink-0">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="View on GitHub"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github className="w-4 h-4" />
                      </motion.a>
                    )}
                    {project.live && (
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="View live project"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tools.map((tool) => (
                    <motion.span 
                      key={tool} 
                      className="text-xs font-mono px-2 py-1 bg-muted text-muted-foreground rounded-sm border border-border"
                      whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AcademicLayout>
  );
};

export default Projects;
