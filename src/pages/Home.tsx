import AcademicLayout from "@/components/layout/AcademicLayout";
import { User, Github, Linkedin, Mail, ArrowRight, Code, BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const interests = [
  {
    title: "Engineering & Applied Sciences",
    description: "Materials science, aerospace systems, and the design of solutions to complex physical problems.",
    icon: "🔧"
  },
  {
    title: "Computer Science",
    description: "Computational thinking, algorithm design, and software development for modeling and simulation.",
    icon: "💻"
  },
  {
    title: "Economics & Quantitative Analysis",
    description: "Statistical modeling, econometrics, and rigorous quantitative approaches in social sciences.",
    icon: "📊"
  },
  {
    title: "Public Policy",
    description: "Evidence-based analysis informing decision-making on issues affecting communities.",
    icon: "🏛️"
  }
];

const quickLinks = [
  {
    to: "/projects",
    title: "projects",
    description: "CS and data projects I've built",
    icon: Code
  },
  {
    to: "/explorations",
    title: "explorations",
    description: "Research topics I'm exploring",
    icon: BookOpen
  },
  {
    to: "/cv",
    title: "cv",
    description: "Academic background and experience",
    icon: FileText
  }
];

const Home = () => {
  return (
    <AcademicLayout>
      {/* Hero Section - Two Column Layout */}
      <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start min-h-[60vh]">
        {/* Left Column - Text */}
        <motion.div 
          className="flex-1 space-y-8 order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              hey, i'm shawn{" "}
              <motion.span 
                className="inline-block"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              High school freshman exploring the intersection of{" "}
              <span className="text-foreground font-medium hover:underline underline-offset-4 cursor-default transition-all">engineering</span>,{" "}
              <span className="text-foreground font-medium hover:underline underline-offset-4 cursor-default transition-all">computer science</span>,{" "}
              <span className="text-foreground font-medium hover:underline underline-offset-4 cursor-default transition-all">economics</span>, and{" "}
              <span className="text-foreground font-medium hover:underline underline-offset-4 cursor-default transition-all">public policy</span>.
            </motion.p>
          </div>

          <motion.p 
            className="text-muted-foreground leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            I'm drawn to research-driven problem-solving and the application of 
            quantitative methods to real-world challenges. Currently focused on 
            learning foundational principles and developing depth in areas that 
            genuinely interest me.
          </motion.p>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-5 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { href: "https://github.com/shengdynasty", icon: Github, label: "GitHub" },
              { href: "https://www.linkedin.com/in/sheng-yan-b54305386/", icon: Linkedin, label: "LinkedIn" },
              { href: "shengyan555@gmail.com", icon: Mail, label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Profile Picture */}
        <motion.div 
          className="order-1 lg:order-2 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted-foreground/20 via-transparent to-muted-foreground/10 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-1 rounded-full bg-background" />
            <div className="absolute inset-2 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
              {/* Replace src with your profile image */}
              <img 
                src="/placeholder.svg" 
                alt="Shawn"
                className="w-full h-full object-cover hidden" 
              />
              <User className="w-24 h-24 text-muted-foreground" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <motion.div 
        className="border-t border-border my-16"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Core Interests Section */}
      <motion.section 
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl font-bold tracking-tight"
          variants={fadeInUp}
        >
          what i'm interested in
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.title}
              className="group p-6 border border-border rounded-sm hover:border-foreground transition-all duration-300 hover:bg-muted/30"
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <span className="text-2xl mb-3 block">{interest.icon}</span>
              <h3 className="font-semibold text-foreground mb-2">{interest.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {interest.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Divider */}
      <motion.div 
        className="border-t border-border my-16"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Quick Links */}
      <motion.section 
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl font-bold tracking-tight"
          variants={fadeInUp}
        >
          explore
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <motion.div
              key={link.to}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link 
                to={link.to} 
                className="group flex flex-col p-6 border border-border rounded-sm hover:border-foreground transition-all duration-300 hover:bg-muted/30 h-full"
              >
                <link.icon className="w-5 h-5 mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors flex items-center gap-2">
                  {link.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </AcademicLayout>
  );
};

export default Home;
