import AcademicLayout from "@/components/layout/AcademicLayout";
import { motion } from "framer-motion";

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

const categories = [
  {
    n: "01",
    title: "Programming Languages",
    skills: [
      { name: "Python",                   level: "Proficient",    w: 80 },
      { name: "JavaScript / TypeScript",  level: "Intermediate",  w: 58 },
      { name: "Java",                     level: "Intermediate",  w: 52 },
      { name: "R",                        level: "Intermediate",  w: 50 },
      { name: "MATLAB",                   level: "Familiar",      w: 30 },
      { name: "SQL",                      level: "Familiar",      w: 30 },
    ],
  },
  {
    n: "02",
    title: "Frameworks & Libraries",
    skills: [
      { name: "React",          level: "Intermediate", w: 58 },
      { name: "Tkinter",        level: "Proficient",   w: 80 },
      { name: "NumPy / Pandas", level: "Intermediate", w: 55 },
      { name: "Matplotlib",     level: "Intermediate", w: 55 },
    ],
  },
  {
    n: "03",
    title: "Quantitative & Analytical",
    skills: [
      { name: "Statistical Analysis",         level: "Intermediate", w: 55 },
      { name: "Regression Modeling",          level: "Intermediate", w: 55 },
      { name: "Data Visualization",           level: "Proficient",   w: 80 },
      { name: "Hypothesis Testing",           level: "Intermediate", w: 50 },
      { name: "Excel / Spreadsheet Modeling", level: "Proficient",   w: 80 },
    ],
  },
  {
    n: "04",
    title: "Engineering & Technical",
    skills: [
      { name: "CAD (Onshape / SolidWorks)", level: "Familiar",     w: 30 },
      { name: "Laboratory Techniques",      level: "Familiar",     w: 30 },
      { name: "Technical Documentation",    level: "Proficient",   w: 80 },
      { name: "Version Control (Git)",      level: "Intermediate", w: 58 },
    ],
  },
  {
    n: "05",
    title: "Research & Communication",
    skills: [
      { name: "Literature Review",          level: "Intermediate", w: 55 },
      { name: "Technical Writing",          level: "Proficient",   w: 80 },
      { name: "Data Collection & Analysis", level: "Intermediate", w: 55 },
      { name: "Presentation Skills",        level: "Proficient",   w: 80 },
      { name: "LaTeX",                      level: "Familiar",     w: 30 },
    ],
  },
];

const totalSkills = categories.reduce((acc, c) => acc + c.skills.length, 0);

const levels = [
  {
    label: "Proficient",
    desc: "Regular, confident use",
    bar: "#999",
    text: "#bbb",
    dot: "rgba(255,255,255,0.7)",
    dim: "#444",
    skills: categories.flatMap(c => c.skills.filter(s => s.level === "Proficient").map(s => s.name)),
  },
  {
    label: "Intermediate",
    desc: "Solid working knowledge",
    bar: "#484848",
    text: "#777",
    dot: "rgba(255,255,255,0.25)",
    dim: "#333",
    skills: categories.flatMap(c => c.skills.filter(s => s.level === "Intermediate").map(s => s.name)),
  },
  {
    label: "Familiar",
    desc: "Basic competence, developing",
    bar: "#282828",
    text: "#555",
    dot: "rgba(255,255,255,0.08)",
    dim: "#2A2A2A",
    skills: categories.flatMap(c => c.skills.filter(s => s.level === "Familiar").map(s => s.name)),
  },
];

export default function Skills() {
  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* ══════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════ */}
        <motion.div {...f(0)} style={{ marginBottom: "5rem" }}>

          <p style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#444",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            Technical Profile
          </p>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            marginBottom: "1.75rem",
          }}>
            SKILLS
          </h1>

          <p style={{ fontSize: "0.9rem", color: "#555", maxWidth: "36rem", lineHeight: 1.7, marginBottom: "3rem" }}>
            An honest assessment of technical and analytical capabilities developed
            through coursework, independent projects, and extracurricular research.
          </p>

          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            justifyContent: "start",
            gap: "0",
            borderTop: "1px solid #1C1C1C",
            borderLeft: "1px solid #1C1C1C",
          }}>
            {[
              { n: String(totalSkills), l: "Total Skills" },
              { n: String(categories.length), l: "Domains" },
              { n: "3", l: "Proficiency Levels" },
            ].map(({ n, l }) => (
              <div key={l} style={{
                padding: "1.5rem 2.5rem",
                borderRight: "1px solid #1C1C1C",
                borderBottom: "1px solid #1C1C1C",
              }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}>
                  {n}
                </p>
                <p style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            INVENTORY — three-column level overview
        ══════════════════════════════════════════ */}
        <motion.section {...fw(0.1)} style={{ marginBottom: "6rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Inventory
            </p>
            <div style={{ flex: 1, height: 1, background: "#1C1C1C" }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid #1C1C1C",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            {levels.map((lv, i) => (
              <div
                key={lv.label}
                style={{
                  padding: "1.75rem 1.5rem",
                  borderLeft: i > 0 ? "1px solid #1C1C1C" : "none",
                  background: i === 0 ? "#0A0A0A" : i === 1 ? "#080808" : "#060606",
                }}
              >
                {/* Level header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #1C1C1C",
                }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: lv.dot,
                    border: "1px solid #333",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "#666",
                    textTransform: "uppercase",
                    flex: 1,
                  }}>
                    {lv.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "#333",
                  }}>
                    {lv.skills.length}
                  </span>
                </div>

                <p style={{ fontSize: "0.65rem", color: "#333", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                  {lv.desc}
                </p>

                {/* Skill list */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {lv.skills.map((name, si) => (
                    <motion.li
                      key={name}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.15 + si * 0.04, ease: "easeOut" }}
                      style={{
                        fontSize: "0.8rem",
                        color: lv.text,
                        padding: "0.45rem 0",
                        borderBottom: `1px solid ${lv.dim}`,
                        lineHeight: 1.3,
                        transition: "color 150ms",
                        cursor: "default",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = lv.text}
                    >
                      {name}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════
            DETAILED BREAKDOWN — two-column sections
        ══════════════════════════════════════════ */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0",
          }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              By Domain
            </p>
            <div style={{ flex: 1, height: 1, background: "#1C1C1C" }} />
          </div>

          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              {...fw(ci * 0.06)}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(160px, 24%, 240px) 1fr",
                gap: "3.5rem",
                padding: "3.5rem 0",
                borderTop: "1px solid #1C1C1C",
              }}
            >
              {/* Left — index + title */}
              <div style={{ paddingTop: "0.25rem" }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                  fontWeight: 700,
                  color: "#111",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.25rem",
                  userSelect: "none",
                }}>
                  {cat.n}
                </p>
                <h2 style={{
                  fontSize: "0.85rem",
                  color: "#bbb",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  marginBottom: "0.5rem",
                }}>
                  {cat.title}
                </h2>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "#333",
                  letterSpacing: "0.08em",
                }}>
                  {cat.skills.length} skills
                </p>
              </div>

              {/* Right — skill rows */}
              <div>
                {cat.skills.map((skill, si) => {
                  const barColor =
                    skill.level === "Proficient"   ? "#999" :
                    skill.level === "Intermediate" ? "#484848" : "#2A2A2A";
                  const textColor =
                    skill.level === "Proficient"   ? "#ccc" :
                    skill.level === "Intermediate" ? "#777" : "#555";

                  return (
                    <div
                      key={skill.name}
                      style={{
                        padding: "0.9rem 0.75rem",
                        marginLeft: "-0.75rem",
                        marginRight: "-0.75rem",
                        borderBottom: "1px solid #141414",
                        borderRadius: 3,
                        transition: "background 180ms ease",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#0D0D0D"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      {/* Name + level badge */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.55rem",
                      }}>
                        <span style={{ fontSize: "0.85rem", color: textColor }}>
                          {skill.name}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.53rem",
                          letterSpacing: "0.1em",
                          color: "#333",
                          textTransform: "uppercase",
                          padding: "0.18rem 0.5rem",
                          border: "1px solid #222",
                          borderRadius: 2,
                        }}>
                          {skill.level}
                        </span>
                      </div>

                      {/* Bar */}
                      <div style={{
                        height: 3,
                        background: "#141414",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}>
                        <motion.div
                          style={{ height: "100%", background: barColor, borderRadius: 2 }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.w}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.1,
                            delay: 0.1 + si * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Bottom rule */}
          <div style={{ borderTop: "1px solid #1C1C1C" }} />
        </div>

      </div>
    </AcademicLayout>
  );
}
