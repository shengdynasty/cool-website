import AcademicLayout from "@/components/layout/AcademicLayout";
import { Separator } from "@/components/ui/separator";
import { ImageIcon } from "lucide-react";

const engagements = [
  {
    title: "Research Internship — Materials Science Laboratory",
    role: "Research Assistant",
    timeCommitment: "Summer 2024 • 8 weeks, 30 hours/week",
    work: `Contributed to a research project investigating the mechanical properties of 
    composite materials under varying thermal conditions. Responsibilities included 
    sample preparation, data collection using testing equipment, and preliminary 
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
    image: "/placeholder.svg" // Replace with actual activity photo
  },
  {
    title: "Robotics Team — Design and Programming",
    role: "Lead Programmer",
    timeCommitment: "2022–Present • 10 hours/week during competition season",
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
    image: "/placeholder.svg"
  },
  {
    title: "Model United Nations — Economic Affairs Committee",
    role: "Delegate and Committee Chair",
    timeCommitment: "2021–Present • 5 hours/week",
    work: `Researched and represented country positions on international economic 
    issues including trade policy, development finance, and sustainable investment. 
    As committee chair, designed topics, wrote background guides, and facilitated 
    substantive debate among delegates.`,
    learned: `Developed research skills for complex policy topics requiring synthesis 
    of economic, political, and historical perspectives. Improved public speaking 
    and diplomatic negotiation abilities. Gained experience in leadership and 
    event organization as a committee chair.`,
    relevance: `Model UN connects my interest in economics with real-world policy 
    applications. It has exposed me to the complexities of international governance 
    and the role that quantitative analysis can play in policy debates.`,
    image: "/placeholder.svg"
  },
  {
    title: "Summer Program — Introduction to Econometrics",
    role: "Participant",
    timeCommitment: "Summer 2023 • 3 weeks intensive",
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
    image: "/placeholder.svg"
  },
  {
    title: "Math Competition Team",
    role: "Team Member",
    timeCommitment: "2020–Present • 4 hours/week",
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
    image: "/placeholder.svg"
  },
];

const Engagement = () => {
  return (
    <AcademicLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-medium text-foreground">
            Engagement
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            A curated selection of academic and intellectual activities that have 
            shaped my learning. Each entry reflects meaningful engagement rather 
            than superficial participation.
          </p>
        </section>

        <div className="space-y-12">
          {engagements.map((engagement, index) => (
            <article key={engagement.title} className="space-y-4">
              {/* Activity Image */}
              <div className="aspect-video w-full max-w-sm bg-muted border border-border rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={engagement.image} 
                  alt={`${engagement.title} photo`}
                  className="w-full h-full object-cover hidden"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Activity Photo</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium text-foreground">
                  {engagement.title}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                  <span>{engagement.role}</span>
                  <span className="text-muted-foreground/40">|</span>
                  <span>{engagement.timeCommitment}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">What I Worked On</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {engagement.work}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">What I Learned</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {engagement.learned}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Why It Matters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {engagement.relevance}
                  </p>
                </div>
              </div>

              {index < engagements.length - 1 && (
                <Separator className="mt-6" />
              )}
            </article>
          ))}
        </div>
      </div>
    </AcademicLayout>
  );
};

export default Engagement;
