"use client"

import { useState } from "react"
import { Copy, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName: string
}

interface SharedRecipient {
  id: string
  email: string
  permission: "view" | "download"
  sharedAt: string
}

export function ShareDialog({ open, onOpenChange, documentName }: ShareDialogProps) {
  const [recipients, setRecipients] = useState<SharedRecipient[]>([
    { id: "1", email: "john.doe@example.com", permission: "download", sharedAt: "2024-10-20" },
    { id: "2", email: "jane.smith@example.com", permission: "view", sharedAt: "2024-10-19" },
  ])
  const [newEmail, setNewEmail] = useState("")
  const [permission, setPermission] = useState<"view" | "download">("view")
  const [accessLink, setAccessLink] = useState("https://legalbox.io/access/0x7f3a2b8c9d1e4f5a")
  const [copied, setCopied] = useState(false)

  const handleAddRecipient = () => {
    if (newEmail) {
      const newRecipient: SharedRecipient = {
        id: String(recipients.length + 1),
        email: newEmail,
        permission,
        sharedAt: new Date().toISOString().split("T")[0],
      }
      setRecipients([...recipients, newRecipient])
      setNewEmail("")
    }
  }

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(accessLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Access Link */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Access Link</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Share this link with anyone to grant access to {documentName}
            </p>
            <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
              <Input value={accessLink} readOnly className="border-0 bg-transparent text-xs" />
              <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Add Recipient */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Share with Wallet/Email</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter wallet address or email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={permission} onValueChange={(v) => setPermission(v as "view" | "download")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddRecipient}>Share</Button>
            </div>
          </div>

          {/* Recipients List */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Shared With ({recipients.length})</h3>
            <div className="space-y-2">
              {recipients.map((recipient) => (
                <Card key={recipient.id} className="p-3 flex items-center justify-between bg-secondary border-border">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{recipient.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {recipient.permission === "view" ? "View Only" : "Download"} • Shared {recipient.sharedAt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
