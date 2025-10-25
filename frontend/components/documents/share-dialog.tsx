"use client";

import { useState } from "react";
import { shareApi, ShareLink } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Share, Copy, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  documentId: string;
  documentName: string;
  children?: React.ReactNode;
}

export function ShareDialog({
  documentId,
  documentName,
  children,
}: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expiresInSeconds, setExpiresInSeconds] = useState(7 * 24 * 60 * 60); // 7 days
  const [allowDownload, setAllowDownload] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleCreateShare = async () => {
    setIsCreating(true);
    setError("");

    try {
      const result = await shareApi.create({
        documentId,
        expiresInSeconds,
        allowDownload,
      });
      setShareLink(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create share link");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.shareUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    }
  };

  const handleOpenInNewTab = () => {
    if (shareLink) {
      window.open(shareLink.shareUrl, "_blank");
    }
  };

  const resetForm = () => {
    setExpiresInSeconds(7 * 24 * 60 * 60);
    setAllowDownload(true);
    setShareLink(null);
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  const formatExpiration = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return "Less than 1 hour";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Create a share link for "{documentName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!shareLink ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="expires">Expires in</Label>
                <select
                  id="expires"
                  value={expiresInSeconds}
                  onChange={(e) => setExpiresInSeconds(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  disabled={isCreating}
                >
                  <option value={60 * 60}>1 hour</option>
                  <option value={24 * 60 * 60}>1 day</option>
                  <option value={7 * 24 * 60 * 60}>7 days</option>
                  <option value={30 * 24 * 60 * 60}>30 days</option>
                  <option value={365 * 24 * 60 * 60}>1 year</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  Link will expire in {formatExpiration(expiresInSeconds)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowDownload"
                  checked={allowDownload}
                  onCheckedChange={setAllowDownload}
                  disabled={isCreating}
                />
                <Label htmlFor="allowDownload">Allow download</Label>
              </div>

              <Button
                onClick={handleCreateShare}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Share className="mr-2 h-4 w-4" />
                    Create Share Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Share link created successfully!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={shareLink.shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenInNewTab}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Expires:</span>
                  <Badge variant="outline">
                    {new Date(shareLink.expiresAt).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>Download:</span>
                  <Badge
                    variant={shareLink.allowDownload ? "default" : "secondary"}
                  >
                    {shareLink.allowDownload ? "Allowed" : "Not Allowed"}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
