"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, FileCheck, Zap, Eye, Share2, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Every document is encrypted locally. Only wallets with explicit permission can access your files.",
  },
  {
    icon: FileCheck,
    title: "On-Chain Verification",
    description: "Document hashes stored on BlockDAG create tamper-proof proof of ownership and authenticity.",
  },
  {
    icon: Zap,
    title: "Instant Sharing",
    description: "Share documents with granular permissions—View Only or Download—without losing control.",
  },
  {
    icon: Eye,
    title: "Immutable Audit Trail",
    description: "Every action (upload, access, share, revoke) is recorded on-chain for complete transparency.",
  },
  {
    icon: Share2,
    title: "Wallet-Based Access",
    description: "Decentralized identity through blockchain wallets. No passwords, no central authority.",
  },
  {
    icon: BarChart3,
    title: "Compliance Ready",
    description: "Meets NIST and ISO 27001 cybersecurity standards for enterprise and institutional use.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-b border-border py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Enterprise-Grade Security</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Built for lawyers, clients, and institutions who demand complete data sovereignty
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
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
