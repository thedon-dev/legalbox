"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Zap, Layers } from "lucide-react"

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Military-grade encryption ensures only authorized parties can access documents.",
    details: ["AES-256 encryption", "Local encryption before upload", "Zero-knowledge architecture"],
  },
  {
    icon: Layers,
    title: "BlockDAG Immutability",
    description: "Tamper-proof audit trails recorded on distributed ledger technology.",
    details: ["Immutable records", "Parallel processing", "Scalable infrastructure"],
  },
  {
    icon: Shield,
    title: "Compliance Standards",
    description: "Meets enterprise security requirements and regulatory standards.",
    details: ["NIST cybersecurity", "ISO 27001 certified", "SOC 2 compliant"],
  },
  {
    icon: Zap,
    title: "Wallet-Based Control",
    description: "Complete ownership and control through decentralized wallet management.",
    details: ["Self-sovereign identity", "Cryptographic verification", "No central authority"],
  },
]

export function Security() {
  return (
    <section id="security" className="border-b border-border py-20 md:py-32 bg-secondary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Security & Compliance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Enterprise-grade security with complete transparency and accountability
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
