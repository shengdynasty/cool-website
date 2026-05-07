import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AcademicLayout from "@/components/layout/AcademicLayout";
import IIT from "@/assets/download.png";
import fox from "@/assets/fox.png";
import math from "@/assets/math.jpg";
import uni from "@/assets/cornell.png";

type Engagement = {
  id: string;
  n: string;
  title: string;
  role: string;
  period: string;
  commitment: string;
  summary: string;
  image: string;
};

const engagements: Engagement[] = [
  {
    id: "iit-research",
    n: "01",
    title: "Research Internship — IIT Materials Science Laboratory",
    role: "Research Assistant",
    period: "2025 – present",
    commitment: "6+ weeks · 30 hrs/week",
    summary:
      "Contributed to a research project investigating the mechanical properties of composite materials under varying thermal conditions.",
    image: IIT,
  },
  {
    id: "econometrics",
    n: "02",
    title: "Cornell University Summer Program — On-Campus Econometrics Research",
    role: "Participant",
    period: "Summer 2026",
    commitment: "3 weeks intensive",
    summary:
      "Rigorous coursework on New York Main Campus covering regression analysis, hypothesis testing, and elective coursework.",
    image: uni,
  },
  {
    id: "robotics",
    n: "03",
    title: "Fox Valley Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2024 – Present",
    commitment: "10 hrs/week during competition season",
    summary:
      "Responsible for developing control systems and autonomous routines for competition robots.",
    image: fox,
  },
  {
    id: "math-competition",
    n: "04",
    title: "Math Competition Team",
    role: "Team Member",
    period: "2022 – Present",
    commitment: "4 hrs/week",
    summary:
      "Prepare for and compete in regional and national mathematics competitions including AMC, AIME, and math olympiad qualifiers.",
    image: math,
  },
];

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const fw = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  } as const);

function FeaturedCard({ item, stacked }: { item: Engagement; stacked: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/engagement/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid",
          gridTemplateColumns: stacked ? "1fr" : "40% 1fr",
          minHeight: stacked ? undefined : 320,
          border: "1px solid",
          borderColor: hovered ? "#333" : "#1C1C1C",
          borderRadius: 6,
          overflow: "hidden",
          transition: "border-color 200ms, box-shadow 300ms",
          boxShadow: hovered ? "0 12px 48px rgba(0,0,0,0.7)" : "none",
          cursor: "pointer",
          background: "#0A0A0A",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#0D0D0D",
            aspectRatio: stacked ? "16/7" : undefined,
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: hovered ? "brightness(0.82)" : "brightness(0.62)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition:
                "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94), filter 400ms",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: stacked
                ? "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)"
                : "linear-gradient(to right, transparent 50%, rgba(10,10,10,0.95) 100%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.75rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "#888",
              letterSpacing: "0.12em",
            }}
          >
            {item.n}
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            padding: stacked ? "2rem" : "2.75rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#0A0A0A",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "#999",
                textTransform: "uppercase",
                padding: "0.2rem 0.6rem",
                border: "1px solid #2A2A2A",
                borderRadius: 2,
                marginBottom: "1.25rem",
              }}
            >
              {item.role}
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.25rem, 2.8vw, 1.85rem)",
                fontWeight: 700,
                color: "#E8E8E8",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                marginBottom: "1rem",
              }}
            >
              {item.title}
            </h2>

            <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: 1.8, maxWidth: "44rem" }}>
              {item.summary}
            </p>
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #161616",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "2rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#888", letterSpacing: "0.04em" }}>
                {item.period}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#666", letterSpacing: "0.04em" }}>
                {item.commitment}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                color: hovered ? "#D0D0D0" : "#555",
                letterSpacing: "0.08em",
                transition: "color 200ms",
                fontFamily: "var(--font-mono)",
              }}
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ item }: { item: Engagement }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/engagement/${item.id}`}
      style={{ textDecoration: "none", display: "flex", width: "100%", height: "100%" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: "1px solid",
          borderColor: hovered ? "#333" : "#1C1C1C",
          borderRadius: 6,
          overflow: "hidden",
          transition: "border-color 200ms, box-shadow 300ms",
          boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.6)" : "none",
          cursor: "pointer",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            overflow: "hidden",
            background: "#0D0D0D",
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: hovered ? "brightness(0.82)" : "brightness(0.6)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition:
                "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94), filter 400ms",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "#888",
              letterSpacing: "0.12em",
            }}
          >
            {item.n}
          </span>
          <span
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "#aaa",
              textTransform: "uppercase",
              padding: "0.18rem 0.5rem",
              border: "1px solid #333",
              borderRadius: 2,
              background: "rgba(10,10,10,0.75)",
            }}
          >
            {item.role}
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "1.25rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
              fontWeight: 600,
              color: "#CCC",
              lineHeight: 1.35,
              marginBottom: "0.6rem",
              flex: 1,
            }}
          >
            {item.title}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#555", lineHeight: 1.7, marginBottom: "1rem" }}>
            {item.summary}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.875rem",
              borderTop: "1px solid #141414",
            }}
          >
            <span style={{ fontSize: "0.68rem", color: "#777", letterSpacing: "0.04em" }}>
              {item.period}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                color: hovered ? "#ccc" : "#444",
                letterSpacing: "0.08em",
                transition: "color 200ms",
                fontFamily: "var(--font-mono)",
              }}
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Engagement() {
  const width = useWindowWidth();
  const featured = engagements[0];
  const rest = engagements.slice(1);

  const gridCols =
    width < 640 ? "1fr" : width < 960 ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "5rem" }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "#555",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            {engagements.length} Activities
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            ENGAGEMENT
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#666", maxWidth: "36rem", lineHeight: 1.7 }}>
            A curated selection of academic and intellectual activities that have shaped my learning.
            Each entry reflects meaningful engagement rather than superficial participation.
          </p>
        </motion.div>

        {/* Featured card — full-width horizontal */}
        <motion.div {...fw(0)} style={{ marginBottom: "1rem" }}>
          <FeaturedCard item={featured} stacked={width < 768} />
        </motion.div>

        {/* 3-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {rest.map((item, i) => (
            <motion.div
              key={item.id}
              {...fw((i + 1) * 0.08)}
              style={{ display: "flex" }}
            >
              <SmallCard item={item} />
            </motion.div>
          ))}
        </div>

      </div>
    </AcademicLayout>
  );
}
