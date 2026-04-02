import AcademicLayout from "@/components/layout/AcademicLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import IIT from "@/assets/download.png";
import fox from "@/assets/fox.png";
import math from "@/assets/math.jpg";
import uni from "@/assets/cornell.png";

const fw = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  } as const);

const engagements = [
  {
    id: "iit-research",
    n: "01",
    title: "Research Internship — IIT Materials Science Laboratory",
    role: "Research Assistant",
    period: "2025 – present",
    commitment: "6+ weeks · 30 hrs/week",
    summary: "Contributed to a research project investigating the mechanical properties of composite materials under varying thermal conditions.",
    image: IIT,
  },
  {
    id: "econometrics",
    n: "02",
    title: "Cornell University Summer Program — On-Campus Econometrics Research",
    role: "Participant",
    period: "Summer 2026",
    commitment: "3 weeks intensive",
    summary: "Rigorous coursework on New York Main Campus covering regression analysis, hypothesis testing, and elective coursework.",
    image: uni,
  },
  {
    id: "robotics",
    n: "03",
    title: "Fox Valley Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2024 – Present",
    commitment: "10 hrs/week during competition season",
    summary: "Responsible for developing control systems and autonomous routines for competition robots.",
    image: fox,
  },
  {
    id: "math-competition",
    n: "04",
    title: "Math Competition Team",
    role: "Team Member",
    period: "2022 – Present",
    commitment: "4 hrs/week",
    summary: "Prepare for and compete in regional and national mathematics competitions including AMC, AIME, and math olympiad qualifiers.",
    image: math,
  },
];

export default function Engagement() {
  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "5rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {engagements.length} Activities
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}>
            ENGAGEMENT
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#555", maxWidth: "36rem", lineHeight: 1.7 }}>
            A curated selection of academic and intellectual activities that have shaped my learning.
            Each entry reflects meaningful engagement rather than superficial participation.
          </p>
        </motion.div>

        {/* ── Entries ── */}
        <div>
          {engagements.map((item, i) => (
            <motion.div key={item.id} {...fw(i * 0.07)} style={{ marginBottom: "1px" }}>
              <Link to={`/engagement/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    border: "1px solid #1C1C1C",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                    transition: "border-color 200ms",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#444"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1C1C1C"}
                >
                  {/* Image strip */}
                  <div style={{ position: "relative", aspectRatio: "16/5", overflow: "hidden", background: "#0D0D0D" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.72)",
                        transition: "transform 500ms, filter 500ms",
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLImageElement).style.transform = "scale(1.03)";
                        (e.target as HTMLImageElement).style.filter = "brightness(0.9)";
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLImageElement).style.transform = "scale(1)";
                        (e.target as HTMLImageElement).style.filter = "brightness(0.72)";
                      }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.7) 0%, transparent 60%)" }} />

                    {/* Number overlay */}
                    <span style={{
                      position: "absolute",
                      top: "1.5rem",
                      left: "1.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: "#555",
                      letterSpacing: "0.08em",
                    }}>
                      {item.n}
                    </span>

                    {/* Role pill overlay */}
                    <span style={{
                      position: "absolute",
                      bottom: "1.5rem",
                      left: "1.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: "#888",
                      textTransform: "uppercase",
                      padding: "0.25rem 0.6rem",
                      border: "1px solid #333",
                      borderRadius: 2,
                      background: "rgba(8,8,8,0.6)",
                    }}>
                      {item.role}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.75rem 2rem", background: "#0A0A0A" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        fontWeight: 600,
                        color: "#ccc",
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                      }}>
                        {item.title}
                      </h2>
                      <span style={{ fontSize: "0.8rem", color: "#555", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0 }}>
                        View →
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: "56rem" }}>
                      {item.summary}
                    </p>

                    <div style={{ display: "flex", gap: "2rem", borderTop: "1px solid #141414", paddingTop: "1rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "#444", letterSpacing: "0.05em" }}>{item.period}</span>
                      <span style={{ fontSize: "0.7rem", color: "#333", letterSpacing: "0.05em" }}>{item.commitment}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </AcademicLayout>
  );
}
