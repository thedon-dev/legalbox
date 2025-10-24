import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Shield,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import DashboardLayout from "../components/dashboard.tsx/DashboardLayout";
import AuditLog from "../components/dashboard.tsx/AuditLog";
import ShareDialog from "../components/dashboard.tsx/ShareDialog";
import VersionHistory from "../components/dashboard.tsx/VersionHistory";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";

// Dummy data
const dummyDocument = {
  id: "doc-001",
  name: "Contract Agreement.pdf",
  hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  uploadedAt: "2024-01-15T10:30:00Z",
  size: "2.4 MB",
  status: "verified",
  sharedWith: 3,
  version: 2,
  owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  blockdagTxHash:
    "0x9b5e2f8a3c1d6e4f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  description:
    "Annual partnership contract agreement with terms and conditions.",
};

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const copyToClipboard = (text: string, type: "hash" | "tx") => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
    toast({
      title: "Copied to clipboard",
      description: `${
        type === "hash" ? "Document hash" : "Transaction hash"
      } copied successfully`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-primary mt-1" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{dummyDocument.name}</h1>
                  <p className="text-muted-foreground mt-1">
                    {dummyDocument.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  {dummyDocument.status === "verified" ? "Verified" : "Pending"}
                </Badge>
                <Badge variant="secondary">
                  Version {dummyDocument.version}
                </Badge>
                <Badge variant="secondary">{dummyDocument.size}</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={() => setShareDialogOpen(true)}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Document Hash
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-3 rounded flex-1 break-all font-mono">
                  {dummyDocument.hash}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(dummyDocument.hash, "hash")}
                >
                  {copiedHash ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                SHA-256 hash stored on BlockDAG ledger
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-accent" />
              BlockDAG Transaction
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-3 rounded flex-1 break-all font-mono">
                  {dummyDocument.blockdagTxHash}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(dummyDocument.blockdagTxHash, "tx")
                  }
                >
                  {copiedTx ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                View transaction on BlockDAG explorer
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="audit">
              <Clock className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="versions">
              <FileText className="w-4 h-4 mr-2" />
              Version History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-4">
            <AuditLog documentId={id || ""} />
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            <VersionHistory documentId={id || ""} />
          </TabsContent>
        </Tabs>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        document={dummyDocument}
      />
    </DashboardLayout>
  );
};

export default DocumentDetails;
