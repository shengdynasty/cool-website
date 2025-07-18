import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Shawn <span className="text-accent">Yan</span>
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
          Full-Stack Developer
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/80 leading-relaxed">
          I craft beautiful, functional web applications with modern technologies. 
          Passionate about clean code, user experience, and innovative solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 shadow-glow transition-all duration-300 hover:shadow-glow hover:scale-105"
          >
            View My Work
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 transition-all duration-300 hover:scale-105"
          >
            Download Resume
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;