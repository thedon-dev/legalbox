import { Upload, Key, FileSignature, Eye } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload & Encrypt",
    description:
      "Upload legal documents through your wallet. Files are encrypted end-to-end before storage.",
  },
  {
    icon: Key,
    title: "Grant Access",
    description:
      "Control who can view your documents. Only explicitly granted wallets can decrypt and access files.",
  },
  {
    icon: FileSignature,
    title: "Sign Documents",
    description:
      "Cryptographic signatures are verified on-chain, creating legally binding and tamper-proof records.",
  },
  {
    icon: Eye,
    title: "Audit Trail",
    description:
      "Every action is immutably recorded on the BlockDAG ledger for complete transparency and accountability.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient">LegalBox</span> Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Four simple steps to secure, compliant document collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Number Badge */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
