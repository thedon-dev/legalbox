import { Shield, Users, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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

type DocumentTableProps = {
  documents: Document[];
};

const DocumentTable = ({ documents }: DocumentTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{doc.sharedWith}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">v{doc.version}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/dashboard/document/${doc.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
