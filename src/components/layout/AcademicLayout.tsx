import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface AcademicLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "HOME",       href: "/" },
  { name: "ENGAGEMENT", href: "/engagement" },
  { name: "PROJECTS",   href: "/projects" },
  { name: "SKILLS",     href: "/skills" },
];

const GH = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LI = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

export default function AcademicLayout({ children }: AcademicLayoutProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const socials = [
    { href: "https://github.com/shengdynasty", label: "GitHub", Icon: GH },
    { href: "https://www.linkedin.com/in/sheng-yan-b54305386/", label: "LinkedIn", Icon: LI },
    { href: "mailto:shengyan555@gmail.com", label: "Email", Icon: MailIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#F2F2F2" }}>

      {/* ── NAV ── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 300ms, border-color 300ms",
          background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid #1C1C1C" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Wordmark */}
            <Link
              to="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
            >
              SY<span style={{ color: "#555" }}>.</span>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
              {navigation.map(({ name, href }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={name}
                    to={href}
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      fontWeight: 500,
                      color: active ? "#fff" : "#555",
                      textDecoration: "none",
                      borderBottom: active ? "1px solid #fff" : "1px solid transparent",
                      transition: "color 150ms, border-color 150ms",
                      paddingBottom: 4,
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#555"; }}
                  >
                    {name}
                  </Link>
                );
              })}
            </nav>

            {/* Socials — desktop */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ padding: 8, color: "#555", display: "flex", transition: "color 150ms", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#555"}
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              style={{ padding: 8, color: "#888", background: "none", border: "none", cursor: "pointer" }}
              aria-label="Toggle menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div style={{ background: "#0D0D0D", borderTop: "1px solid #1C1C1C" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: 4 }}>
              {navigation.map(({ name, href }) => (
                <Link
                  key={name}
                  to={href}
                  style={{
                    padding: "10px 0",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    fontWeight: 500,
                    color: location.pathname === href ? "#fff" : "#666",
                    textDecoration: "none",
                    borderBottom: "1px solid #1C1C1C",
                  }}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── CONTENT ── */}
      <main style={{ paddingTop: 56 }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #1C1C1C", marginTop: "8rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, color: "#fff", marginBottom: "0.25rem" }}>
                Shawn Yan
              </p>
              <p style={{ fontSize: "0.75rem", color: "#444", letterSpacing: "0.06em" }}>
                Engineering · CS · Economics · Political Science
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ padding: 10, color: "#444", display: "flex", transition: "color 150ms", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#444"}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #141414", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
            <p style={{ fontSize: "0.7rem", color: "#333", maxWidth: "38rem", lineHeight: 1.6 }}>
              All research descriptions are high-level and reflective. Technical details, data, and unpublished work remain confidential.
            </p>
            <p style={{ fontSize: "0.7rem", color: "#333" }}>© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
