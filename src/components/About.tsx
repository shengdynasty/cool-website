import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import profilePhoto from "@/assets/profile-photo.jpg";

const About = () => {
  const skills = [
    "Python", "Tkinter", "Node.js", "HTML", "CSS", "Javascript",
    "C++", "Data structure", "MongoDB", "Docker", "Git", "Tailwind CSS"
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div className="space-y-6 animate-slide-up">
            {/* Profile Picture */}
            <div className="flex justify-center md:justify-start mb-8">
              <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-elegant">
                <AvatarImage 
                  src={profilePhoto} 
                  alt="Shawn Yan" 
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                  SY
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a passionate full-stack developer with over 5 years of experience 
              building scalable web applications. I love turning complex problems 
              into simple, beautiful, and intuitive solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, 
              contributing to open-source projects, or hiking in the mountains. 
              I believe in continuous learning and staying up-to-date with the 
              latest industry trends.
            </p>
            
            {/* Experience Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">0.5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Skills */}
          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Technical Skills
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  className="bg-secondary/50 rounded-lg px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300 cursor-default"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;