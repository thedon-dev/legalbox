import { FileText, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

type Version = {
  version: number;
  hash: string;
  uploadedAt: string;
  uploadedBy: string;
  changes: string;
  current: boolean;
};

const dummyVersions: Version[] = [
  {
    version: 2,
    hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    uploadedAt: "2024-01-15T10:30:00Z",
    uploadedBy: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    changes: "Updated terms and conditions section",
    current: true,
  },
  {
    version: 1,
    hash: "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    uploadedAt: "2024-01-10T14:20:00Z",
    uploadedBy: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    changes: "Initial version",
    current: false,
  },
];

const VersionHistory = ({ documentId }: { documentId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Version History
        </CardTitle>
        <CardDescription>
          All versions are linked on the BlockDAG ledger for complete
          traceability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyVersions.map((version) => (
            <div
              key={version.version}
              className="p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-card rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">
                        Version {version.version}
                      </h4>
                      {version.current && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {version.changes}
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        Uploaded:{" "}
                        {new Date(version.uploadedAt).toLocaleString()}
                      </p>
                      <p>
                        By: {version.uploadedBy.slice(0, 10)}...
                        {version.uploadedBy.slice(-8)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <code className="text-xs bg-card px-2 py-1 rounded font-mono block truncate">
                        {version.hash}
                      </code>
                    </div>
                  </div>
                </div>
                {!version.current && (
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionHistory;
