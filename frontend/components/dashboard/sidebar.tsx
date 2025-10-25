"use client"

import { FileText, Share2, Clock, Settings, LogOut, Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WalletConnectDialog } from "./wallet-connect-dialog"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [walletOpen, setWalletOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x742d...8f2a")

  const menuItems = [
    { id: "documents", label: "My Documents", icon: FileText },
    { id: "shared", label: "Shared with Me", icon: Share2 },
    { id: "audit", label: "Audit Trail", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LB</span>
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">LegalBox</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Wallet & Logout */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={() => setWalletOpen(true)}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm">{walletAddress}</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Disconnect</span>
          </Button>
        </div>
      </aside>

      <WalletConnectDialog
        open={walletOpen}
        onOpenChange={setWalletOpen}
        onConnect={(address) => setWalletAddress(address)}
      />
    </>
  )
}
