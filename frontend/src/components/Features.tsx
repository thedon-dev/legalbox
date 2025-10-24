import {
  Shield,
  Lock,
  FileCheck,
  Users,
  CheckCircle,
  Globe,
} from "lucide-react";
import { Card } from "../components/ui/card";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Every document is encrypted before upload. Only wallets with explicit permission can access files.",
  },
  {
    icon: Shield,
    title: "BlockDAG Immutability",
    description:
      "All actions recorded on a tamper-proof BlockDAG ledger with parallel processing and scalability.",
  },
  {
    icon: FileCheck,
    title: "Cryptographic Signatures",
    description:
      "Wallet-based digital signatures verified on-chain ensure authenticity and non-repudiation.",
  },
  {
    icon: Users,
    title: "Complete Data Sovereignty",
    description:
      "Document ownership stays with the creating wallet. Access control is always in your hands.",
  },
  {
    icon: CheckCircle,
    title: "Compliance Ready",
    description:
      "Meets NIST and ISO 27001 cybersecurity standards with full audit trail transparency.",
  },
  {
    icon: Globe,
    title: "Web3 Architecture",
    description:
      "Decentralized infrastructure eliminates single points of failure and central data repositories.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for{" "}
            <span className="text-gradient">Security & Compliance</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            LegalBox replaces insecure cloud exchanges with a cryptographically
            secure and fully auditable platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
