"use client"

import { useState } from "react"
import { Upload, MoreVertical, Share2, Eye, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UploadDialog } from "./upload-dialog"
import { DocumentDetailsModal } from "./document-details-modal"
import { ShareDialog } from "./share-dialog"

interface Document {
  id: string
  name: string
  hash: string
  uploadedAt: string
  size: string
  permissions: "owner" | "view" | "download"
  sharedWith: number
}

const dummyDocuments: Document[] = [
  {
    id: "1",
    name: "Contract_Agreement_2024.pdf",
    hash: "0x7f3a...2b8c",
    uploadedAt: "2024-10-20",
    size: "2.4 MB",
    permissions: "owner",
    sharedWith: 3,
  },
  {
    id: "2",
    name: "NDA_Confidential.pdf",
    hash: "0x9e2d...5f1a",
    uploadedAt: "2024-10-18",
    size: "1.8 MB",
    permissions: "owner",
    sharedWith: 1,
  },
  {
    id: "3",
    name: "Partnership_Terms.docx",
    hash: "0x4c1b...8e3d",
    uploadedAt: "2024-10-15",
    size: "3.2 MB",
    permissions: "owner",
    sharedWith: 5,
  },
  {
    id: "4",
    name: "Shared_Legal_Brief.pdf",
    hash: "0x6a9f...1c7e",
    uploadedAt: "2024-10-12",
    size: "1.5 MB",
    permissions: "download",
    sharedWith: 0,
  },
]

export function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>(dummyDocuments)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const handleUpload = (file: File) => {
    const newDoc: Document = {
      id: String(documents.length + 1),
      name: file.name,
      hash: "0x" + Math.random().toString(16).slice(2, 8) + "..." + Math.random().toString(16).slice(2, 6),
      uploadedAt: new Date().toISOString().split("T")[0],
      size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      permissions: "owner",
      sharedWith: 0,
    }
    setDocuments([newDoc, ...documents])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
          <p className="text-muted-foreground mt-1">Manage and share your legal documents securely</p>
        </div>
        <Button className="gap-2" onClick={() => setUploadOpen(true)}>
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Documents</p>
          <p className="text-2xl font-bold text-foreground mt-1">{documents.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Shared Documents</p>
          <p className="text-2xl font-bold text-foreground mt-1">{documents.filter((d) => d.sharedWith > 0).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Shared With</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {documents.reduce((sum, d) => sum + d.sharedWith, 0)}
          </p>
        </Card>
      </div>

      {/* Documents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Document Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hash</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Uploaded</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shared With</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.permissions}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{doc.hash}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.size}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {doc.sharedWith} {doc.sharedWith === 1 ? "person" : "people"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            setSelectedDoc(doc)
                            setDetailsOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            setSelectedDoc(doc)
                            setShareOpen(true)
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onUpload={handleUpload} />
      <DocumentDetailsModal open={detailsOpen} onOpenChange={setDetailsOpen} document={selectedDoc} />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} documentName={selectedDoc?.name || ""} />
    </div>
  )
}
