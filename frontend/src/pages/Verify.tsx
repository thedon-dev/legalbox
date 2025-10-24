import { useState } from "react";
import { Shield, CheckCircle, XCircle, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useNavigate } from "react-router-dom";

type VerificationResult = {
  verified: boolean;
  documentName: string;
  hash: string;
  owner: string;
  uploadedAt: string;
  blockdagTxHash: string;
} | null;

const Verify = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [hashInput, setHashInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const verifyDocument = () => {
    setVerifying(true);

    // Simulate verification
    setTimeout(() => {
      // Mock verification result
      const mockResult: VerificationResult = {
        verified: Math.random() > 0.3, // 70% chance of being verified
        documentName: file?.name || "Unknown Document",
        hash:
          hashInput ||
          "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        uploadedAt: "2024-01-15T10:30:00Z",
        blockdagTxHash:
          "0x9b5e2f8a3c1d6e4f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      };

      setResult(mockResult);
      setVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gradient">LegalBox</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Verify Document Authenticity
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check if a document has been registered on the BlockDAG ledger and
              verify its ownership and integrity
            </p>
          </div>

          {/* Verification Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Verification Method</CardTitle>
              <CardDescription>
                Upload a document or enter its hash to verify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="verify-file">Upload Document</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="verify-file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Hash Input */}
              <div className="space-y-2">
                <Label htmlFor="hash-input">Enter Document Hash</Label>
                <Input
                  id="hash-input"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa..."
                />
              </div>

              <Button
                onClick={verifyDocument}
                disabled={!file && !hashInput}
                className="w-full gap-2"
                size="lg"
              >
                {verifying ? (
                  "Verifying..."
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Verify Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {result && (
            <Card
              className={
                result.verified
                  ? "border-green-500/50"
                  : "border-destructive/50"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.verified ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Document Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-destructive" />
                      Document Not Found
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {result.verified
                    ? "This document exists on the BlockDAG ledger"
                    : "No matching hash found on the BlockDAG ledger"}
                </CardDescription>
              </CardHeader>
              {result.verified && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Document Name
                      </Label>
                      <p className="font-medium mt-1">{result.documentName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Uploaded At
                      </Label>
                      <p className="font-medium mt-1">
                        {new Date(result.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Document Hash
                    </Label>
                    <code className="block text-xs bg-muted p-3 rounded mt-1 break-all font-mono">
                      {result.hash}
                    </code>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Owner Wallet
                    </Label>
                    <code className="block text-xs bg-muted p-3 rounded mt-1 break-all font-mono">
                      {result.owner}
                    </code>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      BlockDAG Transaction
                    </Label>
                    <code className="block text-xs bg-muted p-3 rounded mt-1 break-all font-mono">
                      {result.blockdagTxHash}
                    </code>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      This document's authenticity and ownership have been
                      verified on the BlockDAG ledger. The hash matches the
                      on-chain record.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}
            </Card>
          )}

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Verification Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                <li>Upload your document or enter its hash</li>
                <li>System generates SHA-256 hash from the uploaded file</li>
                <li>Hash is compared against BlockDAG ledger records</li>
                <li>If match found, ownership and metadata are displayed</li>
                <li>Transaction hash proves the document's on-chain record</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Verify;
