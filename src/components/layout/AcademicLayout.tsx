import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AcademicLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Explorations", href: "/explorations" },
  { name: "Projects", href: "/projects" },
  { name: "Engagement", href: "/engagement" },
  { name: "Skills", href: "/skills" },
  { name: "CV", href: "/cv" },
];

const AcademicLayout = ({ children }: AcademicLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link 
              to="/" 
              className="text-lg font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Sheng Yan
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      location.pathname === item.href
                        ? "text-foreground font-medium"
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-xs text-muted-foreground leading-relaxed">
            All research descriptions are high-level and reflective. Technical details, data, and unpublished work remain confidential.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Sheng Yan
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AcademicLayout;
