import AcademicLayout from "@/components/layout/AcademicLayout";

const Home = () => {
  return (
    <AcademicLayout>
      <div className="space-y-12">
        {/* Introduction */}
        <section className="space-y-6">
          <h1 className="text-3xl font-medium text-foreground">
            Sheng Yan
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            High school student exploring the intersection of engineering, computer science, 
            economics, and public policy. I am drawn to research-driven problem-solving and 
            the application of quantitative methods to real-world challenges.
          </p>
        </section>

        {/* Core Interests */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">
            Core Interests
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Engineering & Applied Sciences</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Materials science, aerospace systems, and the design of solutions to 
                complex physical problems. Interested in how theoretical principles 
                translate into practical engineering applications.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Computer Science</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Computational thinking, algorithm design, and software development. 
                Exploring how programming can be used as a tool for modeling, 
                simulation, and data analysis.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Economics & Quantitative Analysis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Statistical modeling, econometrics, and the use of data to understand 
                economic systems. Drawn to the rigor of quantitative approaches in 
                social sciences.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Public Policy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The intersection of technical expertise and governance. How can 
                evidence-based analysis inform decision-making on issues affecting 
                communities and societies?
              </p>
            </div>
          </div>
        </section>

        {/* Academic Philosophy */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium text-foreground">
            Approach to Learning
          </h2>
          <div className="prose-academic">
            <p>
              My academic work is guided by curiosity and a commitment to understanding 
              foundational principles. Rather than pursuing surface-level familiarity 
              with many topics, I prefer to develop depth in areas that genuinely 
              interest me.
            </p>
            <p>
              I believe that meaningful learning occurs at the boundaries between 
              disciplines. The most interesting problems—from sustainable energy 
              to urban planning—require insights from multiple fields. This conviction 
              shapes how I choose research topics and extracurricular activities.
            </p>
            <p>
              I am particularly interested in applied problem-solving: taking abstract 
              concepts from coursework and using them to address concrete challenges. 
              Whether through computational projects, research explorations, or 
              policy analysis, I seek opportunities to connect theory with practice.
            </p>
          </div>
        </section>
      </div>
    </AcademicLayout>
  );
};

export default Home;
