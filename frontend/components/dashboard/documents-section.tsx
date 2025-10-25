"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  MoreVertical,
  Share2,
  Eye,
  Download,
  Trash2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadDialog } from "@/components/documents/upload-dialog";
import { ShareDialog } from "@/components/documents/share-dialog";
import { VerifyDialog } from "@/components/documents/verify-dialog";
import { DocumentDetailsModal } from "./document-details-modal";
import { useAuth } from "@/lib/auth";
import { useAccount } from "wagmi";
import { documentsApi, Document } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { address } = useAccount();

  useEffect(() => {
    loadDocuments();
  }, [address]);

  const loadDocuments = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const docs = await documentsApi.getByWallet(address);
      setDocuments(docs);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (newDocument: Document) => {
    setDocuments([newDocument, ...documents]);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-500">
            Confirmed
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage and share your legal documents securely
          </p>
        </div>
        <div className="flex gap-2">
          <VerifyDialog />
          <UploadDialog onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Documents</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {documents.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Public Documents</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {documents.filter((d) => d.isPublic).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">BlockDAG Confirmed</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {documents.filter((d) => d.blockdagStatus === "confirmed").length}
          </p>
        </Card>
      </div>

      {/* Documents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Document Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Hash
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Uploaded
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Visibility
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No documents found. Upload your first document to get
                    started.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {doc.name}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                        {doc.hash.slice(0, 8)}...{doc.hash.slice(-8)}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(doc.blockdagStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={doc.isPublic ? "default" : "secondary"}>
                        {doc.isPublic ? "Public" : "Private"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShareDialog
                          documentId={doc.id}
                          documentName={doc.name}
                        >
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </ShareDialog>
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
                                setSelectedDoc(doc);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() =>
                                window.open(doc.cloudUrl, "_blank")
                              }
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <DocumentDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        document={
          selectedDoc
            ? {
                id: selectedDoc.id,
                name: selectedDoc.name,
                hash: selectedDoc.hash,
                uploadedAt: selectedDoc.createdAt,
                size: "100 KB",
                permissions: "owner",
                sharedWith: 1,
              }
            : null
        }
      />
    </div>
  );
}
