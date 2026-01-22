import AcademicLayout from "@/components/layout/AcademicLayout";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const engagements = [
  {
    id: "iit-research",
    title: "Research Internship — IIT Materials Science Laboratory",
    role: "Research Assistant",
    period: "2025 Dec - present",
    timeCommitment: "6+ weeks, 30 hours/week",
    summary: "Contributed to a research project investigating the mechanical properties of composite materials under varying thermal conditions.",
    image: null
  },
  {
    id: "robotics",
    title: "Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2022–Present",
    timeCommitment: "10 hours/week during competition season",
    summary: "Responsible for developing control systems and autonomous routines for competition robots.",
    image: null
  },
  {
    id: "model-un",
    title: "Model United Nations — Economic Affairs Committee",
    role: "Delegate and Committee Chair",
    period: "2021–Present",
    timeCommitment: "5 hours/week",
    summary: "Researched and represented country positions on international economic issues including trade policy and development finance.",
    image: null
  },
  {
    id: "econometrics",
    title: "Summer Program — Introduction to Econometrics",
    role: "Participant",
    period: "Summer 2023",
    timeCommitment: "3 weeks intensive",
    summary: "Completed rigorous coursework covering regression analysis, hypothesis testing, and causal inference methods.",
    image: null
  },
  {
    id: "math-competition",
    title: "Math Competition Team",
    role: "Team Member",
    period: "2020–Present",
    timeCommitment: "4 hours/week",
    summary: "Prepare for and compete in regional and national mathematics competitions including AMC, AIME, and math olympiad qualifiers.",
    image: null
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const Engagement = () => {
  return (
    <AcademicLayout>
      <div className="space-y-12">
        {/* Header */}
        <motion.section 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">engagement</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            A curated selection of academic and intellectual activities that have 
            shaped my learning. Each entry reflects meaningful engagement rather 
            than superficial participation.
          </p>
        </motion.section>

        {/* Engagement Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {engagements.map((engagement) => (
            <motion.article 
              key={engagement.id} 
              className="group border border-border rounded-sm overflow-hidden hover:border-foreground transition-colors"
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              {/* Engagement Image */}
              <Link to={`/engagement/${engagement.id}`}>
                <motion.div 
                  className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {engagement.image ? (
                    <img 
                      src={engagement.image} 
                      alt={`${engagement.title} photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-2xl font-mono">{engagement.title.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-mono">photo</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>

              {/* Engagement Content */}
              <div className="p-5 space-y-3">
                <h2 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                  <Link 
                    to={`/engagement/${engagement.id}`}
                    className="hover:underline underline-offset-4"
                  >
                    {engagement.title}
                  </Link>
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{engagement.role}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {engagement.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {engagement.timeCommitment}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {engagement.summary}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AcademicLayout>
  );
};

export default Engagement;
