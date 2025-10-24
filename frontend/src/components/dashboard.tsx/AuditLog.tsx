import { Shield, Eye, Share2, Upload, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

type AuditEntry = {
  id: string;
  action: "upload" | "view" | "share" | "download" | "revoke";
  user: string;
  timestamp: string;
  txHash: string;
};

const dummyAuditLog: AuditEntry[] = [
  {
    id: "1",
    action: "upload",
    user: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    timestamp: "2024-01-15T10:30:00Z",
    txHash:
      "0x9b5e2f8a3c1d6e4f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  },
  {
    id: "2",
    action: "share",
    user: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    timestamp: "2024-01-15T11:20:00Z",
    txHash:
      "0x8a4d24fb28637469a11c872b35ce7195a09e24f1d9ab13ec9cf8c19b4d5f4b7e",
  },
  {
    id: "3",
    action: "view",
    user: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    timestamp: "2024-01-15T14:45:00Z",
    txHash:
      "0x7c6a90d48f15bc2e5d77a05f8cc9f81a5e53e5e5bc7f5a8e3d1e2f3a4b5c6d7e",
  },
  {
    id: "4",
    action: "download",
    user: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    timestamp: "2024-01-15T15:30:00Z",
    txHash:
      "0x6b5a80c38d04ab2f4c66a15e7dc8e90f4d42d4d4ab6e4a7d2c0d1e2f3a4b5c6d",
  },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case "upload":
      return <Upload className="w-4 h-4" />;
    case "view":
      return <Eye className="w-4 h-4" />;
    case "share":
      return <Share2 className="w-4 h-4" />;
    case "download":
      return <Download className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "upload":
      return "text-primary";
    case "view":
      return "text-blue-400";
    case "share":
      return "text-accent";
    case "download":
      return "text-green-400";
    default:
      return "text-muted-foreground";
  }
};

const AuditLog = ({ documentId }: { documentId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Immutable Audit Trail
        </CardTitle>
        <CardDescription>
          Every action is recorded on the BlockDAG ledger and cannot be altered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyAuditLog.map((entry, index) => (
            <div
              key={entry.id}
              className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div
                className={`p-2 rounded-lg bg-card ${getActionColor(
                  entry.action
                )}`}
              >
                {getActionIcon(entry.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium capitalize">{entry.action}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {entry.user.slice(0, 10)}...{entry.user.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <code className="text-xs bg-card px-2 py-1 rounded font-mono block truncate">
                    TX: {entry.txHash}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
