"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useAccount } from "wagmi";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

export function ProtectedRoute({
  children,
  requireWallet = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (requireWallet && !isConnected) {
        // Don't redirect, just show a message or prompt to connect wallet
        return;
      }
    }
  }, [user, isLoading, isConnected, requireWallet, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requireWallet && !isConnected) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground mb-4">
            Please connect your wallet to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
