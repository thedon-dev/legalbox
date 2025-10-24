import { Button } from "../components/ui/button";
import { Shield, Lock, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/20 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">
              BlockDAG-Powered Legal Tech
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Privacy-First Legal
            <br />
            <span className="text-gradient">Document Collaboration</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            End-to-end encrypted document sharing with blockchain-powered audit
            trails. Complete data sovereignty for lawyers, clients, and
            institutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              variant="hero"
              size="lg"
              className="text-base"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              className="text-base"
              onClick={() => navigate("/verify")}
            >
              Verify Document
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              <span>NIST Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-accent" />
              <span>ISO 27001 Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Web3 Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};

export default Hero;
