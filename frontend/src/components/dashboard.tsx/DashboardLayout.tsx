import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Home,
  Upload,
  FileText,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import WalletConnect from "./WalletConnect";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Upload, label: "Upload", path: "/dashboard/upload" },
    { icon: FileText, label: "Documents", path: "/dashboard" },
    { icon: Search, label: "Verify", path: "/verify" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gradient">LegalBox</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <WalletConnect />

          <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">0x742d...f0bEb</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-5 h-5" />
            <span>Disconnect</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-gradient">
                  LegalBox
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
              <WalletConnect />

              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">0x742d...f0bEb</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => navigate("/")}
              >
                <LogOut className="w-5 h-5" />
                <span>Disconnect</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-border bg-card p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-gradient">LegalBox</span>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
