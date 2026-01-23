import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";

interface AcademicLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "home", href: "/" },
  { name: "engagement", href: "/engagement" },
  { name: "projects", href: "/projects" },
  { name: "skills", href: "/skills" },
];

const AcademicLayout = ({ children }: AcademicLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Terminal-style Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link 
              to="/" 
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-foreground">portfolio</span>
              <span className="text-muted-foreground">@shawn</span>
              <span className="text-foreground">:</span>
              <span className="text-muted-foreground"> $</span>
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      location.pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/shengdynasty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/sheng-yan-b54305386/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:shengyan555@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} Shawn Yan
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            All research descriptions are high-level and reflective. Technical details, data, and unpublished work remain confidential.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AcademicLayout;
