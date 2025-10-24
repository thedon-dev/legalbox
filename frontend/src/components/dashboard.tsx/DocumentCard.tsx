import { FileText, Shield, Users, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type Document = {
  id: string;
  name: string;
  hash: string;
  uploadedAt: string;
  size: string;
  status: string;
  sharedWith: number;
  version: number;
};

type DocumentCardProps = {
  document: Document;
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent
        className="p-6"
        onClick={() => navigate(`/dashboard/document/${document.id}`)}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {document.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {document.size}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
            <Badge variant="secondary">v{document.version}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{document.sharedWith} shares</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono block truncate">
              {document.hash}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
