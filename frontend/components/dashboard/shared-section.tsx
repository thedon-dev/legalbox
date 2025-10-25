"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useAccount } from "wagmi";
import { sharedApi } from "@/lib/api";

interface SharedDocument {
  id: string;
  name: string;
  owner: string;
  permission: "view" | "download";
  sharedAt: string;
  hash: string;
}

const dummySharedDocuments: SharedDocument[] = [
  {
    id: "1",
    name: "Client_Proposal_2024.pdf",
    owner: "Alice Johnson",
    permission: "download",
    sharedAt: "2024-10-22",
    hash: "0x3f2a...9c1d",
  },
  {
    id: "2",
    name: "Merger_Agreement_Draft.docx",
    owner: "Bob Smith",
    permission: "view",
    sharedAt: "2024-10-20",
    hash: "0x8e4b...5f2a",
  },
  {
    id: "3",
    name: "IP_Assignment.pdf",
    owner: "Carol White",
    permission: "download",
    sharedAt: "2024-10-18",
    hash: "0x1c7d...3e9b",
  },
];

export function SharedSection() {
  const [sharedDocs, setSharedDocs] = useState<SharedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { address } = useAccount();

  useEffect(() => {
    loadSharedDocuments();
  }, [address]);

  const loadSharedDocuments = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const sharedDocs = await sharedApi.getSharedWithMe();
      setSharedDocs(sharedDocs);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load shared documents"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading shared documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shared with Me</h1>
        <p className="text-muted-foreground mt-1">
          Documents shared by other users
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Total Shared Documents
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {sharedDocs.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Download Access</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {sharedDocs.filter((d) => d.permission === "download").length}
          </p>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sharedDocs.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No shared documents found.
          </div>
        ) : (
          sharedDocs.map((doc) => (
            <Card
              key={doc.id}
              className="p-4 border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shared by {doc.owner}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </DropdownMenuItem>
                    {doc.permission === "download" && (
                      <DropdownMenuItem className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Hash</p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                    {doc.hash}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Shared {doc.sharedAt}
                  </p>
                  <Badge
                    variant={
                      doc.permission === "download" ? "default" : "secondary"
                    }
                  >
                    {doc.permission === "view" ? "View Only" : "Download"}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
