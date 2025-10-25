"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Version {
  id: string
  version: number
  uploadedAt: string
  uploadedBy: string
  hash: string
  changes: string
}

interface VersionHistoryProps {
  documentName: string
  versions: Version[]
}

export function VersionHistory({ documentName, versions }: VersionHistoryProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Version History</h2>
        <p className="text-muted-foreground mt-1">{documentName}</p>
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card key={version.id} className="p-4 border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={index === 0 ? "default" : "secondary"}>v{version.version}</Badge>
                  <span className="text-sm text-muted-foreground">{version.uploadedAt}</span>
                </div>
                <p className="text-sm text-foreground mb-2">Uploaded by {version.uploadedBy}</p>
                <p className="text-xs text-muted-foreground mb-3">{version.changes}</p>
                <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{version.hash}</code>
              </div>
              {index === 0 && <Badge className="bg-primary">Current</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
