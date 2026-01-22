import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import AcademicLayout from "@/components/layout/AcademicLayout";
import IIT from "@/assets/download.png";
import fox from "@/assets/fox.png";
import math from "@/assets/math.jpg";
import uni from "@/assets/cornell.png";


const engagementsData: Record<string, {
  title: string;
  role: string;
  period: string;
  timeCommitment: string;
  work: string;
  learned: string;
  relevance: string;
  image: string | null;
}> = {
  "iit-research": {
    title: "Research Internship — IIT Materials Science Laboratory",
    role: "Research Assistant",
    period: "2025 Dec - present",
    timeCommitment: "6+ weeks, 30 hours/week",
    work: `Contributed to a research project investigating the mechanical properties of 
    composite materials under varying thermal conditions. Responsibilities included 
    data organization, data collection using testing equipment, and preliminary 
    data analysis. Participated in weekly lab meetings and presented findings to 
    the research group.`,
    learned: `Gained hands-on experience with experimental methodology and the iterative 
    nature of scientific research. Developed skills in data documentation, statistical 
    analysis of experimental results, and technical communication. Learned to navigate 
    uncertainty and troubleshoot when experiments did not produce expected outcomes.`,
    relevance: `This experience solidified my interest in pursuing research at the 
    undergraduate level. It demonstrated how theoretical concepts from physics and 
    chemistry apply to practical engineering problems and introduced me to the 
    collaborative nature of academic research.`,
    image: IIT
  },
  "robotics": {
    title: "Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2022–Present",
    timeCommitment: "10 hours/week during competition season",
    work: `Responsible for developing control systems and autonomous routines for 
    competition robots. Work includes sensor integration, motion planning, and 
    real-time debugging during competitions. Collaborate with mechanical and 
    electrical subteams to ensure software meets hardware constraints.`,
    learned: `Applied programming skills to physical systems, understanding the 
    challenges of real-time computing and sensor noise. Developed project 
    management skills through deadline-driven competition cycles. Learned to 
    communicate technical concepts to teammates with different areas of expertise.`,
    relevance: `Robotics provides a unique environment for applied learning where 
    abstract programming concepts meet physical reality. This experience has 
    deepened my interest in systems engineering and the integration of software 
    with hardware.`,
    image: fox
  
  },
  "econometrics": {
    title: "Summer Program — Introduction to Econometrics",
    role: "Participant",
    period: "Summer 2023",
    timeCommitment: "3 weeks intensive",
    work: `Completed rigorous coursework covering regression analysis, hypothesis 
    testing, and causal inference methods. Final project involved analyzing a 
    public dataset to investigate an economic question using techniques learned 
    in the program.`,
    learned: `Gained foundational knowledge in econometric methods that complement 
    my programming skills. Learned to use statistical software (R) for data 
    analysis. Developed ability to critically evaluate empirical research and 
    understand the limitations of different methodological approaches.`,
    relevance: `This program confirmed my interest in quantitative approaches to 
    economics and social science. The skills acquired directly inform my 
    exploration of policy questions and provide a foundation for future 
    undergraduate coursework.`,
    image: uni
  },
  "math-competition": {
    title: "Math Competition Team",
    role: "Team Member",
    period: "2020–Present",
    timeCommitment: "4 hours/week",
    work: `Prepare for and compete in regional and national mathematics competitions 
    including AMC, AIME, and math olympiad qualifiers. Regular practice involves 
    problem-solving sessions, proof writing, and learning advanced topics beyond 
    the standard curriculum.`,
    learned: `Developed problem-solving strategies and mathematical maturity through 
    exposure to challenging, non-routine problems. Learned to approach problems 
    systematically and persist through difficulty. Built foundational skills in 
    areas like combinatorics and number theory.`,
    relevance: `Competition mathematics has strengthened my quantitative reasoning 
    abilities, which support work across my areas of interest. The discipline 
    required for consistent practice has also been valuable for academic development 
    more broadly.`,
    image: math
  }
};

const EngagementDetail = () => {
  const { engagementId } = useParams();
  const navigate = useNavigate();

  const engagement = engagementId ? engagementsData[engagementId] : null;

  if (!engagement) {
    return (
      <AcademicLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Engagement Not Found</h1>
          <button 
            onClick={() => navigate("/engagement")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Engagement
          </button>
        </div>
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/engagement")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          back to engagement
        </motion.button>

        {/* Header */}
        <motion.div
          className="space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {engagement.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{engagement.role}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {engagement.period}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {engagement.timeCommitment}
            </span>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          className="aspect-video w-full bg-muted border border-border rounded-sm overflow-hidden mb-12 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {engagement.image ? (
            <img 
              src={engagement.image} 
              alt={engagement.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                <span className="text-3xl font-mono">{engagement.title.charAt(0)}</span>
              </div>
              <span className="text-sm font-mono">activity photo</span>
            </div>
          )}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <section>
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">
              What I Worked On
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {engagement.work}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">
              What I Learned
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {engagement.learned}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">
              Why It Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {engagement.relevance}
            </p>
          </section>
        </motion.div>
      </motion.div>
    </AcademicLayout>
  );
};

export default EngagementDetail;
