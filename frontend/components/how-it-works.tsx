"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Upload, Lock, Share2, Eye, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Establish your decentralized identity with a BlockDAG-compatible wallet.",
  },
  {
    icon: Upload,
    title: "Upload Document",
    description: "Upload your legal documents. They are encrypted locally before transmission.",
  },
  {
    icon: Lock,
    title: "Store Hash On-Chain",
    description: "Document hash and metadata are recorded on BlockDAG for immutable proof of ownership.",
  },
  {
    icon: Share2,
    title: "Share with Permissions",
    description: "Generate access links with granular permissions. You remain in complete control.",
  },
  {
    icon: Eye,
    title: "Track Access",
    description: "Every view, download, and action is logged immutably on the BlockDAG ledger.",
  },
  {
    icon: CheckCircle,
    title: "Verify & Sign",
    description: "Signatures are verified on-chain through wallet cryptography for legal validity.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">How LegalBox Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              A seamless workflow from document upload to verified signatures
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="border-border relative">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">Step {index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-2 border-border bg-background" />
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
