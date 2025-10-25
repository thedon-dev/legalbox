"use client"

import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
