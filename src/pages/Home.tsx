import AcademicLayout from "@/components/layout/AcademicLayout";
import { User, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <AcademicLayout>
      {/* Hero Section - Two Column Layout */}
      <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start min-h-[60vh]">
        {/* Left Column - Text */}
        <div className="flex-1 space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              hey, i'm sheng <span className="inline-block animate-pulse">👋</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              High school freshman exploring the intersection of{" "}
              <span className="text-foreground font-medium">engineering</span>,{" "}
              <span className="text-foreground font-medium">computer science</span>,{" "}
              <span className="text-foreground font-medium">economics</span>, and{" "}
              <span className="text-foreground font-medium">public policy</span>.
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-xl">
            I'm drawn to research-driven problem-solving and the application of 
            quantitative methods to real-world challenges. Currently focused on 
            learning foundational principles and developing depth in areas that 
            genuinely interest me.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:contact@example.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Right Column - Profile Picture */}
        <div className="order-1 lg:order-2 flex-shrink-0">
          <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
            {/* Replace src with your profile image */}
            <img 
              src="/placeholder.svg" 
              alt="Sheng Yan" 
              className="w-full h-full object-cover hidden" 
            />
            <User className="w-24 h-24 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border my-16" />

      {/* Core Interests Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">
          what i'm interested in
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Engineering & Applied Sciences</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Materials science, aerospace systems, and the design of solutions to 
              complex physical problems. Interested in how theoretical principles 
              translate into practical engineering applications.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Computer Science</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Computational thinking, algorithm design, and software development. 
              Exploring how programming can be used as a tool for modeling, 
              simulation, and data analysis.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Economics & Quantitative Analysis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Statistical modeling, econometrics, and the use of data to understand 
              economic systems. Drawn to the rigor of quantitative approaches in 
              social sciences.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Public Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The intersection of technical expertise and governance. How can 
              evidence-based analysis inform decision-making on issues affecting 
              communities and societies?
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border my-16" />

      {/* Quick Links */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">explore</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link 
            to="/projects" 
            className="group p-6 border border-border rounded-sm hover:border-foreground transition-colors"
          >
            <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors">projects</h3>
            <p className="text-sm text-muted-foreground">CS and data projects I've built</p>
          </Link>
          <Link 
            to="/explorations" 
            className="group p-6 border border-border rounded-sm hover:border-foreground transition-colors"
          >
            <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors">explorations</h3>
            <p className="text-sm text-muted-foreground">Research topics I'm exploring</p>
          </Link>
          <Link 
            to="/cv" 
            className="group p-6 border border-border rounded-sm hover:border-foreground transition-colors"
          >
            <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors">cv</h3>
            <p className="text-sm text-muted-foreground">Academic background and experience</p>
          </Link>
        </div>
      </section>
    </AcademicLayout>
  );
};

export default Home;
