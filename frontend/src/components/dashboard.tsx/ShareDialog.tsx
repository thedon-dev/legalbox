import { useState } from "react";
import { Copy, Check, Link as LinkIcon, Eye, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useToast } from "../../hooks/use-toast";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
  };
};

const ShareDialog = ({ open, onOpenChange, document }: ShareDialogProps) => {
  const { toast } = useToast();
  const [permission, setPermission] = useState<"view" | "download">("view");
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `https://legalbox.app/share/${document.id}?permission=${permission}`;

  const generateLink = () => {
    setLinkGenerated(true);
    toast({
      title: "Share link generated",
      description: "Link has been created and recorded on BlockDAG",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Generate a secure access link for {document.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Permission Level</Label>
            <RadioGroup
              value={permission}
              onValueChange={(v) => setPermission(v as "view" | "download")}
            >
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-medium">View Only</p>
                      <p className="text-xs text-muted-foreground">
                        Recipient can only view the document
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="font-medium">Download</p>
                      <p className="text-xs text-muted-foreground">
                        Recipient can view and download
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {!linkGenerated ? (
            <Button onClick={generateLink} className="w-full gap-2">
              <LinkIcon className="w-4 h-4" />
              Generate Share Link
            </Button>
          ) : (
            <div className="space-y-3">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border"
                />
                <Button size="icon" variant="outline" onClick={copyLink}>
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link will be recorded on BlockDAG. All access attempts will
                be logged in the audit trail.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
