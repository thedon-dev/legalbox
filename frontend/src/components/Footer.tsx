import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold">LegalBox</h3>
              <p className="text-sm text-muted-foreground">
                Privacy-First Legal Tech
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex gap-6 text-sm">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} LegalBox. Built on BlockDAG.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
