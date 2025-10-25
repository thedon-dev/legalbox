"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Privacy-First Legal Collaboration</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                Secure Legal Documents on BlockDAG
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                End-to-end encrypted document collaboration with immutable audit trails. Own your data, control access,
                verify signatures—all on-chain.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent">
                Watch Demo
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <p className="text-sm text-muted-foreground">End-to-End Encrypted</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Immutable</div>
                <p className="text-sm text-muted-foreground">Audit Trails</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Web3</div>
                <p className="text-sm text-muted-foreground">Native</p>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-2xl border border-border bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">Secure Document Vault</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
