import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, interesting projects, 
            or just having a chat about technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">shengyan555@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">Naperville, IL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="w-12 h-12">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center md:text-left space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to work together?
            </h3>
            <p className="text-muted-foreground">
              Whether you have a project in mind or just want to chat about 
              technology, I'd love to hear from you.
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 shadow-glow transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;