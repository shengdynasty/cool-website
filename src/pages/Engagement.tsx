import AcademicLayout from "@/components/layout/AcademicLayout";
import { ImageIcon, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const engagements = [
  {
    id: "research-internship",
    title: "Research Internship — Materials Science Laboratory",
    role: "Research Assistant",
    period: "Summer 2024",
    commitment: "8 weeks, 30 hours/week",
    description: "Contributed to research investigating mechanical properties of composite materials under varying thermal conditions. Responsibilities included sample preparation, data collection, and preliminary data analysis.",
    image: "/placeholder.svg"
  },
  {
    id: "robotics-team",
    title: "Robotics Team — Design and Programming",
    role: "Lead Programmer",
    period: "2022–Present",
    commitment: "10 hours/week",
    description: "Developing control systems and autonomous routines for competition robots. Work includes sensor integration, motion planning, and real-time debugging during competitions.",
    image: "/placeholder.svg"
  },
  {
    id: "model-un",
    title: "Model United Nations — Economic Affairs",
    role: "Delegate & Committee Chair",
    period: "2021–Present",
    commitment: "5 hours/week",
    description: "Researched and represented country positions on international economic issues including trade policy, development finance, and sustainable investment.",
    image: "/placeholder.svg"
  },
  {
    id: "econometrics-program",
    title: "Summer Program — Introduction to Econometrics",
    role: "Participant",
    period: "Summer 2023",
    commitment: "3 weeks intensive",
    description: "Completed rigorous coursework covering regression analysis, hypothesis testing, and causal inference methods. Final project involved analyzing a public dataset using R.",
    image: "/placeholder.svg"
  },
  {
    id: "math-competition",
    title: "Math Competition Team",
    role: "Team Member",
    period: "2020–Present",
    commitment: "4 hours/week",
    description: "Prepare for and compete in regional and national mathematics competitions including AMC, AIME, and math olympiad qualifiers.",
    image: "/placeholder.svg"
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
              {/* Activity Image */}
              <motion.div 
                className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={engagement.image} 
                  alt={`${engagement.title} photo`}
                  className="w-full h-full object-cover hidden"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-mono">photo</span>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Activity Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h2 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                    {engagement.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {engagement.role}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <motion.span 
                    className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-sm border border-border"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {engagement.period}
                  </motion.span>
                  <motion.span 
                    className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-sm border border-border"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {engagement.commitment}
                  </motion.span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {engagement.description}
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
