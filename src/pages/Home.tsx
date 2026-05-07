import AcademicLayout from "@/components/layout/AcademicLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import profilePhoto from "@/assets/pfp_B&W.png";

const f = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  } as const);

const fw = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: "easeOut" },
  } as const);

export default function Home() {
  return (
    <AcademicLayout>

      {/* ═══════════════════════════════════════
          HERO — Full bleed, photo + giant name
      ═══════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "95vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>

        {/* Photo — aligned under nav social icons, blends into background */}
        <div style={{
          position: "absolute",
          top: 0,
          right: "max(2rem, calc((100vw - 1100px) / 2))",
          width: "clamp(480px, 62vw, 760px)",
          height: "80vh",
          zIndex: 0,
          overflow: "hidden",
          background: "#000",
        }}>
          <img
            src={profilePhoto}
            alt="Shawn Yan"
            style={{
              position: "absolute",
              top: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              height: "84%",
              width: "auto",
              maxWidth: "none",
              display: "block",
            }}
          />
          {/* Left blend — strongest, fades into page bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }} />
          {/* Bottom blend */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.3) 42%, transparent 68%)",
          }} />
          {/* Top blend */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%)",
          }} />
          {/* Right edge blend */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to left, rgba(0,0,0,0.4) 0%, transparent 18%)",
          }} />
        </div>

        {/* Content overlay */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 2rem 5rem" }}>

          <motion.p {...f(0.1)} style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#888", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Portfolio · {new Date().getFullYear()}
          </motion.p>

          <motion.h1
            {...f(0.2)}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              fontWeight: 700,
              lineHeight: 0.9,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            SHAWN<br />
            <span style={{ color: "#555", fontStyle: "italic", fontWeight: 400 }}>Yan</span>
          </motion.h1>

          <motion.p
            {...f(0.3)}
            style={{ fontSize: "0.95rem", color: "#aaa", maxWidth: "34rem", lineHeight: 1.7, marginBottom: "2.5rem" }}
          >
            High school freshman exploring the intersection of engineering,
            computer science, economics, and political science. Research-driven.
            Quantitatively minded. Class of 2029.
          </motion.p>

          <motion.div {...f(0.4)} style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem" }}>
            {[
              { n: "14",   l: "Projects" },
              { n: "4",    l: "Activities" },
              { n: "3",    l: "Honors" },
              { n: "2029", l: "Grad. Year" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: "0.65rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "2rem", right: "2rem", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #444)" }} />
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "#444", writingMode: "vertical-rl", textTransform: "uppercase" }}>Scroll</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATUS — New / Currently / Upcoming
      ═══════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ borderTop: "1px solid #1C1C1C", paddingTop: "3rem" }}>

          <motion.p {...fw()} style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: "3rem" }}>
            Status
          </motion.p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "3rem" }}>

            {/* New */}
            <motion.div {...fw(0)}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#fff", textTransform: "uppercase", marginBottom: "1.25rem", borderBottom: "1px solid #1C1C1C", paddingBottom: "0.75rem" }}>
                New
              </p>
              {[
                { label: "Autonomous Researcher", to: "/project/autonomous-researcher", internal: true },
                { label: "AI Web Researcher", to: "/project/web-researcher", internal: true },
                { label: "Local RAG Chatbot", to: "/project/rag-chatbot", internal: true },
              ].map(item => (
                <div key={item.label} style={{ paddingBottom: "0.75rem", marginBottom: "0.75rem", borderBottom: "1px solid #141414" }}>
                  {item.internal ? (
                    <Link to={item.to!} style={{ fontSize: "0.85rem", color: "#888", textDecoration: "none", transition: "color 150ms" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#888"}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={(item as { href?: string }).href} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "0.85rem", color: "#888", textDecoration: "none", transition: "color 150ms" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#888"}>
                      {item.label} ↗
                    </a>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Currently */}
            <motion.div {...fw(0.06)}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#fff", textTransform: "uppercase", marginBottom: "1.25rem", borderBottom: "1px solid #1C1C1C", paddingBottom: "0.75rem" }}>
                Currently
              </p>
              {[
                "IIT Research Intern — Materials Science",
                "Fox Valley Robotics — Competition Season",
                "StudentVue MCP Server",
              ].map(item => (
                <p key={item} style={{ fontSize: "0.85rem", color: "#777", paddingBottom: "0.75rem", marginBottom: "0.75rem", borderBottom: "1px solid #141414" }}>
                  {item}
                </p>
              ))}
            </motion.div>

            {/* Upcoming */}
            <motion.div {...fw(0.12)}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#fff", textTransform: "uppercase", marginBottom: "1.25rem", borderBottom: "1px solid #1C1C1C", paddingBottom: "0.75rem" }}>
                Upcoming
              </p>
              {[
                "AMC 10/12 — November 2026",
                "Cornell Economics Research — Summer 2026",
              ].map(item => (
                <p key={item} style={{ fontSize: "0.85rem", color: "#777", paddingBottom: "0.75rem", marginBottom: "0.75rem", borderBottom: "1px solid #141414" }}>
                  {item}
                </p>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INTERESTS — editorial grid
      ═══════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div style={{ borderTop: "1px solid #1C1C1C", paddingTop: "3rem", marginBottom: "3rem" }}>
          <motion.p {...fw()} style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>
            Areas of Interest
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0" }}>
          {[
            { n: "01", title: "Engineering & Applied Sciences", sub: "Materials science, aerospace systems, complex physical design" },
            { n: "02", title: "Computer Science", sub: "Algorithms, software development, modeling & simulation" },
            { n: "03", title: "Economics & Quantitative Analysis", sub: "Statistical modeling, econometrics, social-science methods" },
            { n: "04", title: "Political Science", sub: "Evidence-based analysis informing community decision-making" },
          ].map((item, i) => (
            <motion.div
              key={item.n}
              {...fw(i * 0.07)}
              style={{
                padding: "2.5rem 2rem",
                borderLeft: i === 0 ? "1px solid #1C1C1C" : "none",
                borderRight: "1px solid #1C1C1C",
                borderBottom: "1px solid #1C1C1C",
                borderTop: "1px solid #1C1C1C",
                transition: "background 200ms",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#0D0D0D"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <p style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>{item.n}</p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: "1rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#777", lineHeight: 1.6 }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BACKGROUND — two-column editorial
      ═══════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div style={{ borderTop: "1px solid #1C1C1C", paddingTop: "3rem", marginBottom: "3rem" }}>
          <motion.p {...fw()} style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>
            Background
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <motion.div {...fw(0)}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Education</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.9rem", color: "#ccc", fontWeight: 500 }}>Freshman High School</p>
                <p style={{ fontSize: "0.8rem", color: "#444" }}>2029</p>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#777", lineHeight: 1.7 }}>
                IB Global Politics · DE Calculus 1 · AP Chinese · AP CS Principles · AP Human Geography
              </p>
            </motion.div>

            <motion.div {...fw(0.06)}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Honors</p>
              {[
                "AIME Qualifier (2023, 2024)",
                "Cornell Summer Scholars — Economics Research",
                "NASA Dream With Us — Final Qualifier",
              ].map(h => (
                <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ color: "#333", marginTop: 2 }}>—</span>
                  <p style={{ fontSize: "0.85rem", color: "#888" }}>{h}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fw(0.1)}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Technical Skills</p>
            {[
              { label: "Languages",  value: "Python · Java · JS/TS · R · MATLAB · SQL" },
              { label: "Frameworks", value: "React · Tkinter · NumPy · Pandas · Matplotlib" },
              { label: "Tools",      value: "Git · LaTeX · Excel · CAD (Onshape/SolidWorks)" },
              { label: "Methods",    value: "Statistical analysis · Regression · Data visualization" },
            ].map(({ label, value }) => (
              <div key={label} style={{ paddingBottom: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #141414" }}>
                <p style={{ fontSize: "0.65rem", color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</p>
                <p style={{ fontSize: "0.85rem", color: "#777", lineHeight: 1.6 }}>{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EXPLORE — minimal text links
      ═══════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 8rem" }}>
        <div style={{ borderTop: "1px solid #1C1C1C" }}>
          {[
            { to: "/projects",   label: "Projects",   sub: "13 software projects" },
            { to: "/engagement", label: "Engagement", sub: "Research & academic activities" },
            { to: "/skills",     label: "Skills",     sub: "Technical & analytical" },
          ].map((link, i) => (
            <motion.div key={link.to} {...fw(i * 0.06)}>
              <Link to={link.to} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2rem 0",
                    borderBottom: "1px solid #1C1C1C",
                    transition: "padding-left 200ms",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.paddingLeft = "1rem";
                    (e.currentTarget.querySelector(".lbl") as HTMLElement | null)!.style.color = "#fff";
                    (e.currentTarget.querySelector(".arr") as HTMLElement | null)!.style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                    (e.currentTarget.querySelector(".lbl") as HTMLElement | null)!.style.color = "#444";
                    (e.currentTarget.querySelector(".arr") as HTMLElement | null)!.style.opacity = "0";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "2rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.1em" }}>0{i + 1}</span>
                    <span className="lbl" style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      fontWeight: 500,
                      color: "#444",
                      transition: "color 200ms",
                    }}>
                      {link.label}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#333" }}>{link.sub}</span>
                  </div>
                  <span className="arr" style={{ fontSize: "1.5rem", color: "#fff", opacity: 0, transition: "opacity 200ms" }}>↗</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </AcademicLayout>
  );
}
