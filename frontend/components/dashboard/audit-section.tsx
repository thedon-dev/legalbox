"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { logsApi } from "@/lib/api";

interface AuditLog {
  id: string;
  action: "upload" | "view" | "share" | "revoke" | "sign" | "download";
  actor: string;
  document: string;
  timestamp: string;
  txHash: string;
  details: string;
}

const dummyAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "sign",
    actor: "You (0x742d...8f2a)",
    document: "Contract_Agreement_2024.pdf",
    timestamp: "2024-10-22 14:32:15",
    txHash: "0x9f2a...5c1d",
    details: "Document signed with wallet signature",
  },
  {
    id: "2",
    action: "share",
    actor: "You (0x742d...8f2a)",
    document: "Contract_Agreement_2024.pdf",
    timestamp: "2024-10-22 10:15:42",
    txHash: "0x3e1b...8f4a",
    details: "Shared with john.doe@example.com (Download permission)",
  },
  {
    id: "3",
    action: "view",
    actor: "john.doe@example.com",
    document: "Contract_Agreement_2024.pdf",
    timestamp: "2024-10-21 16:45:30",
    txHash: "0x7c2d...1e9b",
    details: "Document viewed",
  },
  {
    id: "4",
    action: "upload",
    actor: "You (0x742d...8f2a)",
    document: "Contract_Agreement_2024.pdf",
    timestamp: "2024-10-20 09:22:18",
    txHash: "0x5a3f...2c7e",
    details: "Document uploaded and hashed on BlockDAG",
  },
  {
    id: "5",
    action: "download",
    actor: "jane.smith@example.com",
    document: "NDA_Confidential.pdf",
    timestamp: "2024-10-19 13:10:05",
    txHash: "0x8d4e...6f3a",
    details: "Document downloaded",
  },
  {
    id: "6",
    action: "share",
    actor: "You (0x742d...8f2a)",
    document: "NDA_Confidential.pdf",
    timestamp: "2024-10-18 11:30:22",
    txHash: "0x1c7a...9e2b",
    details: "Shared with jane.smith@example.com (View Only permission)",
  },
];

const actionColors: Record<AuditLog["action"], string> = {
  upload: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  view: "bg-green-500/10 text-green-700 dark:text-green-400",
  share: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  revoke: "bg-red-500/10 text-red-700 dark:text-red-400",
  sign: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  download: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
};

const actionLabels: Record<AuditLog["action"], string> = {
  upload: "Upload",
  view: "View",
  share: "Share",
  revoke: "Revoke",
  sign: "Sign",
  download: "Download",
};

export function AuditSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { address } = useAccount();

  useEffect(() => {
    loadAuditLogs();
  }, [address]);

  const loadAuditLogs = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const auditLogs = await logsApi.get({ limit: 50 });
      setLogs(auditLogs);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesSearch =
      log.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
        <p className="text-muted-foreground mt-1">
          Immutable record of all document actions on BlockDAG
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Actions</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {logs.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Uploads</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {logs.filter((l) => l.action === "upload").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Shares</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {logs.filter((l) => l.action === "share").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Signatures</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {logs.filter((l) => l.action === "sign").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by document or actor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="upload">Upload</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="share">Share</SelectItem>
            <SelectItem value="download">Download</SelectItem>
            <SelectItem value="sign">Sign</SelectItem>
            <SelectItem value="revoke">Revoke</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audit Log Timeline */}
      <div className="space-y-3">
        {filteredLogs.map((log, index) => (
          <Card
            key={log.id}
            className="p-4 border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex gap-4">
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    actionColors[log.action]
                  }`}
                >
                  <span className="text-xs font-bold">
                    {actionLabels[log.action][0]}
                  </span>
                </div>
                {index < filteredLogs.length - 1 && (
                  <div className="w-0.5 h-12 bg-border mt-2" />
                )}
              </div>

              {/* Log Details */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={actionColors[log.action]}>
                        {actionLabels[log.action]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="font-medium text-foreground mt-2">
                      {log.document}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.details}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Actor:
                      </span>
                      <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                        {log.actor}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">TX:</span>
                      <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                        {log.txHash}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyHash(log.txHash, log.id)}
                        className="h-6 w-6"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="p-8 text-center border-border">
          <p className="text-muted-foreground">
            No audit logs found matching your filters
          </p>
        </Card>
      )}
    </div>
  );
}
