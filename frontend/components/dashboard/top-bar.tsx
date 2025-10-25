"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useDisconnect } from "wagmi";
import { useAuth } from "@/lib/auth";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, logout } = useAuth();

  const handleDisconnectWallet = () => {
    disconnect();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>

        {/* Show wallet connect button when wallet is not connected */}
        {!isConnected && <WalletConnect />}

        {/* Show user dropdown when wallet is connected */}
        {isConnected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDisconnectWallet}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
