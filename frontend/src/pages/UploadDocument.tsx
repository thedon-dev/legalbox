import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import DashboardLayout from "../components/dashboard.tsx/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";

const UploadDocument = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    if (!name) {
      setName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // Simulate upload with hash generation
    setTimeout(() => {
      const mockHash = "0x" + Math.random().toString(16).slice(2, 66);

      toast({
        title: "Document uploaded successfully",
        description: `Hash: ${mockHash.slice(0, 20)}...`,
      });

      setUploading(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
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
        <div>
          <h1 className="text-3xl font-bold text-gradient">Upload Document</h1>
          <p className="text-muted-foreground mt-2">
            Securely upload and encrypt your legal documents
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your document will be encrypted client-side before upload. The hash
            will be stored on BlockDAG for verification.
          </AlertDescription>
        </Alert>

        <div className="bg-card rounded-lg p-6 border border-border space-y-6">
          {/* File Upload Area */}
          <div>
            <Label>Document File</Label>
            <div
              className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drop your document here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (PDF, DOC, DOCX)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contract Agreement.pdf"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document..."
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>

          {/* Upload Process Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Upload Process:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Document is encrypted locally in your browser</li>
              <li>Encrypted file is uploaded to secure storage</li>
              <li>SHA-256 hash is generated from the original file</li>
              <li>Hash and metadata are recorded on BlockDAG</li>
              <li>You receive confirmation with transaction hash</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? (
                "Uploading & Hashing..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Record On-Chain
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
