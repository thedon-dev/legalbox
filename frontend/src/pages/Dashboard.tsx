import { useState } from "react";
import { Upload, Search, Filter, Grid, List } from "lucide-react";
import DashboardLayout from "../components/dashboard.tsx/DashboardLayout";
import DocumentCard from "../components/dashboard.tsx/DocumentCard";
import DocumentTable from "../components/dashboard.tsx/DocumentTable";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Dummy data
const dummyDocuments = [
  {
    id: "doc-001",
    name: "Contract Agreement.pdf",
    hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    uploadedAt: "2024-01-15T10:30:00Z",
    size: "2.4 MB",
    status: "verified",
    sharedWith: 3,
    version: 2,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  },
  {
    id: "doc-002",
    name: "NDA Template.docx",
    hash: "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    uploadedAt: "2024-01-14T14:20:00Z",
    size: "1.1 MB",
    status: "verified",
    sharedWith: 1,
    version: 1,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  },
  {
    id: "doc-003",
    name: "Partnership Proposal.pdf",
    hash: "0x5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    uploadedAt: "2024-01-12T09:15:00Z",
    size: "3.8 MB",
    status: "verified",
    sharedWith: 5,
    version: 3,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  },
  {
    id: "doc-004",
    name: "Legal Opinion Letter.pdf",
    hash: "0xfcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    uploadedAt: "2024-01-10T16:45:00Z",
    size: "890 KB",
    status: "verified",
    sharedWith: 2,
    version: 1,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = dummyDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient">My Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and share your legal documents securely
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/upload")}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-primary">
              {dummyDocuments.length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total Documents
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-accent">
              {dummyDocuments.reduce((acc, doc) => acc + doc.sharedWith, 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Shared Links
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-green-400">
              {dummyDocuments.filter((doc) => doc.status === "verified").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Verified On-Chain
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "grid" | "list")}
            >
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Documents */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <DocumentTable documents={filteredDocuments} />
        )}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
