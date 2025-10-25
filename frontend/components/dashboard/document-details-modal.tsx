"use client";

import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface DocumentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    hash: string;
    uploadedAt: string;
    size: string;
    permissions: string;
    sharedWith: number;
  } | null;
}

export function DocumentDetailsModal({
  open,
  onOpenChange,
  document,
}: DocumentDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Document Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">File Name</p>
                <p className="font-medium text-foreground">{document.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">File Size</p>
                <p className="font-medium text-foreground">{document.size}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Uploaded Date</p>
                <p className="font-medium text-foreground">
                  {document.uploadedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Hash */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Document Hash (BlockDAG)
            </h3>
            <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
              <code className="text-xs font-mono text-foreground flex-1 break-all">
                {document.hash}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyHash}>
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This hash proves ownership on the BlockDAG ledger
            </p>
          </div>

          {/* Sharing Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Sharing
            </h3>
            <Card className="p-4 bg-secondary border-border">
              <p className="text-sm text-foreground">
                Shared with{" "}
                <span className="font-bold text-primary">
                  {document.sharedWith}
                </span>{" "}
                recipient
                {document.sharedWith !== 1 ? "s" : ""}
              </p>
            </Card>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Your Permissions
            </h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {document.permissions === "owner"
                ? "Owner"
                : document.permissions === "download"
                ? "Download"
                : "View Only"}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>View Audit Trail</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
