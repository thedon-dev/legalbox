"use client";

import { useState, useRef } from "react";
import { verifyApi, VerificationResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  Hash,
  Loader2,
  CheckCircle,
  XCircle,
  File,
} from "lucide-react";

interface VerifyDialogProps {
  children?: React.ReactNode;
}

export function VerifyDialog({ children }: VerifyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleFileVerify = async () => {
    if (!file) return;

    setIsVerifying(true);
    setError("");
    setResult(null);

    try {
      const verificationResult = await verifyApi.byFile(file);
      setResult(verificationResult);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHashVerify = async () => {
    if (!hash.trim()) return;

    setIsVerifying(true);
    setError("");
    setResult(null);

    try {
      const verificationResult = await verifyApi.byHash(hash.trim());
      setResult(verificationResult);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setHash("");
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  const getStatusBadge = (status: string) => {
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <FileCheck className="mr-2 h-4 w-4" />
            Verify Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Document</DialogTitle>
          <DialogDescription>
            Verify a document's authenticity by uploading it or providing its
            hash
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="hash">Enter Hash</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-file">Select File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="verify-file"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={isVerifying}
                    className="flex-1"
                  />
                  {file && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <File className="h-4 w-4" />
                      {file.name}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleFileVerify}
                disabled={!file || isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Verify File
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="hash" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hash">Document Hash</Label>
                <Input
                  id="hash"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Enter SHA256 hash"
                  disabled={isVerifying}
                />
              </div>

              <Button
                onClick={handleHashVerify}
                disabled={!hash.trim() || isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Hash className="mr-2 h-4 w-4" />
                    Verify Hash
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="space-y-3">
              <Alert variant={result.verified ? "default" : "destructive"}>
                {result.verified ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {result.verified
                    ? "Document is verified!"
                    : "Document verification failed"}
                </AlertDescription>
              </Alert>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>In Database:</span>
                  <Badge variant={result.match.inDb ? "default" : "secondary"}>
                    {result.match.inDb ? "Found" : "Not Found"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>BlockDAG Status:</span>
                  {getStatusBadge(result.match.blockdag.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span>BlockDAG Match:</span>
                  <Badge
                    variant={
                      result.match.blockdag.match ? "default" : "secondary"
                    }
                  >
                    {result.match.blockdag.match ? "Match" : "No Match"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isVerifying}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
