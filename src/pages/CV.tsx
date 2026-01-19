import AcademicLayout from "@/components/layout/AcademicLayout";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const CV = () => {
  return (
    <AcademicLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium text-foreground">
                Curriculum Vitae
              </h1>
              <p className="text-muted-foreground mt-2">
                Academic résumé summarizing education, research, and activities.
              </p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </section>

        {/* CV Content */}
        <div className="space-y-8 max-w-2xl">
          {/* Header */}
          <header className="text-center pb-4 border-b border-border">
            <h2 className="text-2xl font-medium text-foreground">Sheng Yan</h2>
            <p className="text-sm text-muted-foreground mt-1">
              High School Student | Engineering • Computer Science • Economics
            </p>
          </header>

          {/* Education */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Education
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-foreground">High School</span>
                <span className="text-sm text-muted-foreground">Expected 2025</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Relevant coursework: AP Calculus BC, AP Physics C, AP Computer Science A, 
                AP Statistics, AP Microeconomics
              </p>
            </div>
          </section>

          <Separator />

          {/* Research Experience */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Research Experience
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-foreground">Research Assistant</span>
                <span className="text-sm text-muted-foreground">Summer 2024</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Materials Science Laboratory
              </p>
              <p className="text-sm text-muted-foreground">
                Investigated mechanical properties of composite materials. Conducted 
                experiments, collected data, and presented findings at weekly meetings.
              </p>
            </div>
          </section>

          <Separator />

          {/* Academic Programs */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Academic Programs
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">Introduction to Econometrics</span>
                  <span className="text-sm text-muted-foreground">Summer 2023</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Intensive 3-week program covering regression analysis, hypothesis testing, 
                  and causal inference methods.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Activities */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Selected Activities
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">Robotics Team — Lead Programmer</span>
                  <span className="text-sm text-muted-foreground">2022–Present</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Develop control systems and autonomous routines for competition robots.
                </p>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">Model United Nations — Committee Chair</span>
                  <span className="text-sm text-muted-foreground">2021–Present</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Research economic policy issues; design topics and facilitate debate as chair.
                </p>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">Math Competition Team</span>
                  <span className="text-sm text-muted-foreground">2020–Present</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compete in AMC, AIME, and regional competitions.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Skills Summary */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Technical Skills
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="text-foreground">Programming:</span> Python, Java, JavaScript/TypeScript, R, MATLAB, SQL</p>
              <p><span className="text-foreground">Frameworks:</span> React, Tkinter, NumPy, Pandas, Matplotlib</p>
              <p><span className="text-foreground">Tools:</span> Git, LaTeX, Excel, CAD (Onshape/SolidWorks)</p>
              <p><span className="text-foreground">Methods:</span> Statistical analysis, regression modeling, data visualization</p>
            </div>
          </section>

          <Separator />

          {/* Honors */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Honors & Recognition
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AIME Qualifier (2023, 2024)</li>
              <li>• National Merit Semifinalist</li>
              <li>• AP Scholar with Distinction</li>
            </ul>
          </section>
        </div>
      </div>
    </AcademicLayout>
  );
};

export default CV;
