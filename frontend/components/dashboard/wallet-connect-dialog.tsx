"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

interface WalletConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (wallet: string) => void
}

const walletProviders = [
  { name: "MetaMask", icon: "🦊", id: "metamask" },
  { name: "WalletConnect", icon: "🔗", id: "walletconnect" },
  { name: "Coinbase Wallet", icon: "💙", id: "coinbase" },
  { name: "Ledger", icon: "📱", id: "ledger" },
]

export function WalletConnectDialog({ open, onOpenChange, onConnect }: WalletConnectDialogProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnect = (providerId: string) => {
    setConnecting(providerId)
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress =
        "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
      setWalletAddress(mockAddress)
      setConnected(true)
      setConnecting(null)
      onConnect(mockAddress)
    }, 1500)
  }

  const handleDisconnect = () => {
    setConnected(false)
    setWalletAddress("")
    setConnecting(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your BlockDAG-compatible wallet to establish your identity on LegalBox
          </DialogDescription>
        </DialogHeader>

        {!connected ? (
          <div className="space-y-3">
            {walletProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent"
                onClick={() => handleConnect(provider.id)}
                disabled={connecting !== null}
              >
                <span className="text-xl">{provider.icon}</span>
                <span className="flex-1 text-left">{provider.name}</span>
                {connecting === provider.id && <span className="text-xs text-muted-foreground">Connecting...</span>}
              </Button>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Your wallet will be used to sign documents and prove ownership on the BlockDAG ledger.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Connected Wallet</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono font-bold text-foreground">{walletAddress}</code>
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(walletAddress)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Wallet Status</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Connected to BlockDAG network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Identity established</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Ready to sign documents</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
