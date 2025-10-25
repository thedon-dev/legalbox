"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, LogOut } from "lucide-react"

export function SettingsSection() {
  const [copied, setCopied] = useState(false)
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f8f2a")

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="organization" className="text-sm font-medium text-foreground">
              Organization
            </Label>
            <Input id="organization" defaultValue="Legal Associates LLC" className="mt-2" />
          </div>
          <Button className="mt-4">Save Changes</Button>
        </div>
      </Card>

      {/* Wallet Section */}
      <Card className="p-6 border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Wallet & Identity</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Connected Wallet</Label>
            <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
              <code className="text-sm font-mono text-foreground flex-1">{walletAddress}</code>
              <Button variant="ghost" size="icon" onClick={handleCopyWallet}>
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This wallet is used to sign documents and prove ownership on the BlockDAG ledger.
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Wallet Status</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Connected</Badge>
              <span className="text-sm text-muted-foreground">BlockDAG Network</span>
            </div>
          </div>

          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive bg-transparent">
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
          </Button>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6 border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <Input id="password" type="password" defaultValue="••••••••" className="mt-2" />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Two-Factor Authentication</Label>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">Not Enabled</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Enable 2FA to add an extra layer of security to your account.
            </p>
            <Button variant="outline" className="mt-3 bg-transparent">
              Enable 2FA
            </Button>
          </div>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-6 border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Privacy & Data</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">End-to-End Encryption</p>
              <p className="text-sm text-muted-foreground">All documents are encrypted locally</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Audit Trail Logging</p>
              <p className="text-sm text-muted-foreground">All actions recorded on BlockDAG</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Enabled</Badge>
          </div>
        </div>
      </Card>

      {/* Compliance Section */}
      <Card className="p-6 border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Compliance</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">NIST 800-171</Badge>
            <span className="text-sm text-muted-foreground">Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">ISO 27001</Badge>
            <span className="text-sm text-muted-foreground">Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">SOC 2 Type II</Badge>
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
