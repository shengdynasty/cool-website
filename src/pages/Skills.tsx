import AcademicLayout from "@/components/layout/AcademicLayout";

const skillCategories = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Python", level: "Proficient" },
      { name: "Java", level: "Intermediate" },
      { name: "JavaScript/TypeScript", level: "Intermediate" },
      { name: "R", level: "Intermediate" },
      { name: "MATLAB", level: "Familiar" },
      { name: "SQL", level: "Familiar" },
    ]
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", level: "Intermediate" },
      { name: "Tkinter", level: "Proficient" },
      { name: "NumPy/Pandas", level: "Intermediate" },
      { name: "Matplotlib", level: "Intermediate" },
    ]
  },
  {
    title: "Quantitative & Analytical",
    skills: [
      { name: "Statistical Analysis", level: "Intermediate" },
      { name: "Regression Modeling", level: "Intermediate" },
      { name: "Data Visualization", level: "Proficient" },
      { name: "Hypothesis Testing", level: "Intermediate" },
      { name: "Excel/Spreadsheet Modeling", level: "Proficient" },
    ]
  },
  {
    title: "Engineering & Technical",
    skills: [
      { name: "CAD (Onshape/SolidWorks)", level: "Familiar" },
      { name: "Laboratory Techniques", level: "Familiar" },
      { name: "Technical Documentation", level: "Proficient" },
      { name: "Version Control (Git)", level: "Intermediate" },
    ]
  },
  {
    title: "Research & Communication",
    skills: [
      { name: "Literature Review", level: "Intermediate" },
      { name: "Technical Writing", level: "Proficient" },
      { name: "Data Collection & Analysis", level: "Intermediate" },
      { name: "Presentation Skills", level: "Proficient" },
      { name: "LaTeX", level: "Familiar" },
    ]
  },
];

const levelDescriptions: Record<string, string> = {
  "Proficient": "Regular, confident use",
  "Intermediate": "Solid working knowledge",
  "Familiar": "Basic competence, continuing to develop"
};

const Skills = () => {
  return (
    <AcademicLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-medium text-foreground">
            Skills
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            An honest assessment of technical and analytical skills developed 
            through coursework, projects, and extracurricular activities.
          </p>
          
          {/* Level Legend */}
          <div className="flex flex-wrap gap-6 text-sm pt-2">
            {Object.entries(levelDescriptions).map(([level, description]) => (
              <div key={level} className="flex items-center gap-2">
                <span className="font-medium text-foreground">{level}</span>
                <span className="text-muted-foreground">— {description}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map((category) => (
            <section key={category.title} className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
                {category.title}
              </h2>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AcademicLayout>
  );
};

export default Skills;
