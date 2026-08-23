import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AcademicLayout from "@/components/layout/AcademicLayout";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import IIT from "@/assets/download.png";
import fox from "@/assets/fox.png";
import math from "@/assets/math.jpg";
import uni from "@/assets/cornell.png";
import mailzooOffice from "@/assets/mailzoo-office.jpg";
import ycLogo from "@/assets/yc-startup-school.svg";

const engagementsData: Record<
  string,
  {
    title: string;
    role: string;
    period: string;
    timeCommitment: string;
    work: string;
    learned: string;
    relevance: string;
    image: string | null;
  }
> = {
  "iit-research": {
    title: "Research Internship — IIT Materials Science Laboratory",
    role: "Research Assistant",
    period: "September 2025 – May 2026",
    timeCommitment: "6+ weeks, 30 hours/week",
    work: `Contributed to a research project investigating the mechanical properties of composite materials under varying thermal conditions. Responsibilities included data organization, data collection using testing equipment, and preliminary data analysis. Participated in weekly lab meetings and presented findings to the research group.`,
    learned: `Gained hands-on experience with experimental methodology and the iterative nature of scientific research. Developed skills in data documentation, statistical analysis of experimental results, and technical communication. Learned to navigate uncertainty and troubleshoot when experiments did not produce expected outcomes.`,
    relevance: `This experience solidified my interest in pursuing research at the undergraduate level. It demonstrated how theoretical concepts from physics and chemistry apply to practical engineering problems and introduced me to the collaborative nature of academic research.`,
    image: IIT,
  },
  robotics: {
    title: "Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2024 – 2026",
    timeCommitment: "10 hours/week during competition season",
    work: `Responsible for developing control systems and autonomous routines for competition robots. Work includes sensor integration, motion planning, and real-time debugging during competitions. Collaborate with mechanical and electrical subteams to ensure software meets hardware constraints.`,
    learned: `Applied programming skills to physical systems, understanding the challenges of real-time computing and sensor noise. Developed project management skills through deadline-driven competition cycles. Learned to communicate technical concepts to teammates with different areas of expertise.`,
    relevance: `Robotics provides a unique environment for applied learning where abstract programming concepts meet physical reality. This experience has deepened my interest in systems engineering and the integration of software with hardware.`,
    image: fox,
  },
  econometrics: {
    title: "Summer Programs — Cornell SC Johnson College of Business",
    role: "1st Place — Business Simulation Competition",
    period: "July 2026",
    timeCommitment: "3 weeks intensive, on-campus",
    work: `Completed an on-campus summer program at Cornell's SC Johnson College of Business. The highlight was the Cornell Business Simulation Competition, where I led my team to 1st place — as team leader, I set our overall strategy and coordinated decisions as we managed a simulated firm across multiple rounds, making pricing, marketing, production, and finance calls against competing teams. Coursework alongside the competition covered regression analysis, hypothesis testing, and causal inference methods, with a final project analyzing a public dataset to investigate an economic question.`,
    learned: `Winning the simulation competition sharpened my ability to make strategic decisions under uncertainty and time pressure, interpret market feedback quantitatively, and lead a team toward a shared strategy — delegating decisions while owning the final call. Also gained foundational knowledge in econometric methods, learned to use statistical software (R) for data analysis, and developed the ability to critically evaluate empirical research.`,
    relevance: `Taking 1st place in the business simulation validated my interest in the intersection of economics, strategy, and quantitative analysis. The program's blend of competition and rigorous coursework directly informs my exploration of economic and policy questions, and provides a foundation for future undergraduate study in business and economics.`,
    image: uni,
  },
  "math-competition": {
    title: "Math Competition Team",
    role: "Team Member",
    period: "2022 – 2026",
    timeCommitment: "4 hours/week",
    work: `Prepare for and compete in regional and national mathematics competitions including AMC, AIME, and math olympiad qualifiers. Regular practice involves problem-solving sessions, proof writing, and learning advanced topics beyond the standard curriculum.`,
    learned: `Developed problem-solving strategies and mathematical maturity through exposure to challenging, non-routine problems. Learned to approach problems systematically and persist through difficulty. Built foundational skills in areas like combinatorics and number theory.`,
    relevance: `Competition mathematics has strengthened my quantitative reasoning abilities, which support work across my areas of interest. The discipline required for consistent practice has also been valuable for academic development more broadly.`,
    image: math,
  },
  "yc-startup-school": {
    title: "Y Combinator Startup School 2026 — San Francisco",
    role: "Invited Attendee — Founder Conference",
    period: "June 2026",
    timeCommitment: "Invite-only · In-person · San Francisco",
    work: `Attended Y Combinator's Startup School 2026 in San Francisco — YC's flagship in-person conference bringing together founders from around the world for two days of keynotes, fireside conversations, and workshops with the operators, investors, and researchers shaping the current wave of AI and technology companies. Attendance is invite-only: seats are allocated directly by YC to a limited group of founders, and admission is not open to the general public. Sessions included talks and fireside conversations from Jensen Huang (NVIDIA), Sam Altman (OpenAI), and a broader lineup of founders, investors, and researchers from across the AI and startup ecosystem. Attended as an early-stage founder actively running MailZoo, using the conference to pressure-test our positioning and roadmap against the frontier of what's currently possible with generative AI, and to talk directly with other founders solving adjacent problems in enterprise AI, agents, and infrastructure.`,
    learned: `The recurring theme across the sessions was that the ceiling on what a small team can build is now higher than at any prior moment in the industry — and the founders who compound in the next five years will be the ones moving fastest at the intersection of model capability and real customer workflows. Jensen Huang's framing of compute as the new infrastructure layer, Sam Altman's arguments about where value accrues around foundation models, and repeated hallway conversations with early-stage founders all reinforced how important it is to build with a clear thesis about which parts of the stack will commoditize versus compound. Also came away with concrete tactical notes on hiring, distribution, and pricing that I've fed directly into MailZoo's operating plan.`,
    relevance: `Being in the room for these conversations at this age is not something I take for granted. For a high school founder running an early-stage company, direct exposure to the operators actually setting the direction of the AI industry compresses years of pattern-matching into a weekend. It has directly influenced how I think about MailZoo's positioning, the pace we need to move at, and what kind of company I'm trying to build over the next decade.`,
    image: ycLogo,
  },
  mailzoo: {
    title: "MailZoo — Personalized AI Ecosystems for Enterprise",
    role: "CEO & Co-Founder",
    period: "2026 – Present",
    timeCommitment: "Full-time · LLC",
    work: `Co-founded and lead MailZoo, a formally incorporated LLC building personalized AI ecosystems for large enterprises. Rather than shipping one-size-fits-all software, MailZoo designs and deploys a custom intelligence layer for each client — an AI that learns the company's operations, handles its conversations, qualifies its leads, books its meetings, and runs its top-of-funnel around the clock. Think of it as a Jarvis built to order: no two deployments are the same, because each is architected around how that specific company works. As CEO, responsible for company direction, team leadership, and product strategy. Built and manage a 40+ person team recruited from Cornell, NYU, and Columbia, spanning engineering, design, sales, and operations, operating out of MailZoo's headquarters — a dedicated office designed around engineering-heavy execution and in-person collaboration. Contracted and delivered custom AI systems for 10+ enterprise clients in New York City. Managing the full lifecycle for each engagement — discovery of the client's operational surface area, architecture of the bespoke agent stack, deployment, and ongoing optimization — while setting the technical direction and go-to-market strategy for the company overall.`,
    learned: `Running a company as a high school student has demanded rapid development across every dimension of business leadership — hiring and managing a team, setting technical direction, negotiating and delivering enterprise contracts, and balancing bespoke client engagements with building a repeatable delivery model. Learned firsthand how to structure an LLC, manage payroll-equivalent responsibilities across a 40+ person team, and maintain operational discipline while shipping custom AI systems on client timelines. The university networks across Cornell, NYU, and Columbia have been central to building the team, reinforcing the value of academic community as a talent pipeline. Deploying tailored intelligence layers for 10+ NYC enterprises has sharpened project management, stakeholder communication, and the discipline of designing around each client's actual operations rather than a generic playbook.`,
    relevance: `MailZoo is the direct application of every academic and technical thread I have pursued — the business strategy and quantitative thinking from Cornell SC Johnson, the software engineering from a decade of programming projects, and the analytical rigor from mathematics competitions and research. Running a company at this stage is not something most people my age have the opportunity to do, and it has made every classroom concept immediate and concrete. It has also clarified what I want to study and build: the intersection of technology, business strategy, and systems thinking at scale.`,
    image: mailzooOffice,
  },
};

const sidebarSections = [
  { id: "work", label: "What I Worked On" },
  { id: "learned", label: "What I Learned" },
  { id: "relevance", label: "Why It Matters" },
];

function Section({ id, label, body }: { id: string; label: string; body: string }) {
  return (
    <div
      id={id}
      style={{
        paddingTop: "2.5rem",
        borderTop: "1px solid #1C1C1C",
        scrollMarginTop: "6rem",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: "0.9rem", color: "#777", lineHeight: 1.85, maxWidth: "52rem" }}>
        {body}
      </p>
    </div>
  );
}

function Sidebar({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: "6rem",
        alignSelf: "flex-start",
        paddingLeft: "2.5rem",
        borderLeft: "1px solid #1A1A1A",
      }}
    >
      <p
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          color: "#555",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        Contents
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {sidebarSections.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                color: isActive ? "#CCC" : "#444",
                transition: "color 200ms",
                lineHeight: 1.5,
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = "#888";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = "#444";
              }}
            >
              {isActive && (
                <span style={{ marginRight: "0.4rem", color: "#555" }}>—</span>
              )}
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default function EngagementDetail() {
  const { engagementId } = useParams();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const [activeSection, setActiveSection] = useState("work");

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const showSidebar = width >= 1024;

  useEffect(() => {
    document.title = `${engagement?.title ?? "Engagement"} — Sheng Yan`;
  }, [engagement?.title]);

  useEffect(() => {
    const handleScroll = () => {
      for (const { id } of [...sidebarSections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("work");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!engagement) {
    return (
      <AcademicLayout>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "5rem 2rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#555", marginBottom: "2rem" }}>Engagement not found.</p>
          <button
            onClick={() => navigate("/engagement")}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            ← Back to Engagement
          </button>
        </div>
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* Back */}
        <motion.button
          onClick={() => navigate("/engagement")}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
            marginBottom: "4rem",
            padding: 0,
            transition: "color 150ms",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ccc")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#444")}
        >
          ← ENGAGEMENT
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "3rem" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: "#999",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "1.25rem",
              padding: "0.25rem 0.6rem",
              border: "1px solid #2A2A2A",
              borderRadius: 2,
            }}
          >
            {engagement.role}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
            }}
          >
            {engagement.title}
          </h1>

          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.05em" }}>
              {engagement.period}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.05em" }}>
              {engagement.timeCommitment}
            </span>
          </div>
        </motion.div>

        {/* Image */}
        {engagement.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              aspectRatio: "16/6",
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid #1C1C1C",
              marginBottom: "4rem",
              background: "#0D0D0D",
            }}
          >
            <img
              src={engagement.image}
              alt={engagement.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.75)",
              }}
            />
          </motion.div>
        )}

        {/* Content + Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={
            showSidebar
              ? { display: "grid", gridTemplateColumns: "1fr 200px", gap: "0" }
              : {}
          }
        >
          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <Section id="work" label="What I Worked On" body={engagement.work} />
            <Section id="learned" label="What I Learned" body={engagement.learned} />
            <Section id="relevance" label="Why It Matters" body={engagement.relevance} />
          </div>

          {/* Sticky sidebar */}
          {showSidebar && <Sidebar activeSection={activeSection} />}
        </motion.div>

      </div>
    </AcademicLayout>
  );
}
