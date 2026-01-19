import AcademicLayout from "@/components/layout/AcademicLayout";
import { Separator } from "@/components/ui/separator";

const explorations = [
  {
    title: "Advanced Materials in Aerospace Engineering",
    summary: `The development of next-generation aircraft and spacecraft depends critically on 
    materials that can withstand extreme conditions while minimizing weight. My exploration 
    of this field began with composite materials—specifically carbon fiber reinforced polymers—
    and expanded to include ceramic matrix composites used in high-temperature applications.
    
    I have been particularly drawn to the trade-offs engineers face: strength versus weight, 
    cost versus performance, and manufacturability versus optimal design. Reading technical 
    papers on topics like thermal protection systems for reentry vehicles helped me appreciate 
    how materials science connects physics, chemistry, and mechanical engineering. This 
    exploration also introduced me to the concept of multi-objective optimization, which 
    appears throughout engineering and economics.`,
  },
  {
    title: "Statistical Modeling and Inference",
    summary: `Statistics provides the language for reasoning under uncertainty. My interest 
    in this area developed through coursework and self-study of topics including probability 
    distributions, hypothesis testing, and regression analysis. I have explored how these 
    methods apply to diverse fields—from clinical trials to economic forecasting.
    
    Recently, I have been studying Bayesian approaches to inference and how they differ 
    philosophically from frequentist methods. The idea that prior beliefs can be formally 
    incorporated into analysis feels both intuitive and powerful. I am also interested in 
    causal inference: the challenge of distinguishing correlation from causation in 
    observational data, which has profound implications for policy evaluation.`,
  },
  {
    title: "Computational Thinking and Algorithm Design",
    summary: `Programming is not merely about writing code; it is a way of thinking about 
    problems. My explorations in this area focus on algorithmic problem-solving: how to 
    decompose complex tasks, design efficient solutions, and analyze their computational 
    complexity. I have studied classic algorithms for sorting, searching, and graph traversal, 
    as well as dynamic programming techniques.
    
    Beyond algorithms, I am interested in how computational approaches can model real-world 
    systems. Simulation methods—Monte Carlo techniques, agent-based models—offer ways to 
    understand phenomena that resist analytical solutions. This connects to my interest 
    in economics, where computational economics has emerged as a distinct field.`,
  },
  {
    title: "Economic Policy and Quantitative Analysis",
    summary: `Economics provides frameworks for understanding how individuals, firms, and 
    governments make decisions under scarcity. My exploration of this field emphasizes 
    the quantitative side: econometric methods, cost-benefit analysis, and the use of 
    data to evaluate policy interventions.
    
    I have been particularly interested in market failures and the conditions under which 
    government intervention might improve outcomes. Environmental economics—carbon pricing, 
    cap-and-trade systems, the economics of renewable energy—represents an area where 
    rigorous analysis can inform pressing policy debates. I am drawn to research that 
    combines economic theory with empirical methods to address real-world questions.`,
  },
  {
    title: "Systems Thinking and Complex Systems",
    summary: `Many of the most important challenges—climate change, urbanization, public 
    health—involve systems with interconnected components and emergent behavior. My 
    exploration of systems thinking began with an interest in feedback loops and 
    unintended consequences in engineering and policy.
    
    I have read about complexity science and how concepts like network effects, tipping 
    points, and resilience apply across disciplines. This perspective influences how I 
    approach problems: looking for connections, considering second-order effects, and 
    questioning assumptions about linearity and predictability. Understanding systems 
    requires combining insights from multiple fields—which aligns with my broader 
    academic interests.`,
  },
];

const Explorations = () => {
  return (
    <AcademicLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-medium text-foreground">
            Explorations
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            High-level reflections on research topics and concepts I have been exploring. 
            These summaries describe the areas that have captured my intellectual interest 
            and shaped my academic direction.
          </p>
        </section>

        <div className="space-y-12">
          {explorations.map((exploration, index) => (
            <article key={exploration.title} className="space-y-4">
              <h2 className="text-xl font-medium text-foreground">
                {exploration.title}
              </h2>
              <div className="prose-academic">
                {exploration.summary.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-sm leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
              {index < explorations.length - 1 && (
                <Separator className="mt-8" />
              )}
            </article>
          ))}
        </div>
      </div>
    </AcademicLayout>
  );
};

export default Explorations;
