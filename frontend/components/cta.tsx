"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="border-b border-border py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-12 md:p-16 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Ready to Secure Your Legal Documents?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Join lawyers, clients, and institutions who trust LegalBox for secure, verifiable document collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
