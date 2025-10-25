"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/wallet/wallet-connect";

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

  console.log("ProtectedRoute state:", {
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    isLoading,
    isConnected,
  });

  useEffect(() => {
    // Only check for redirect when not loading
    if (!isLoading) {
      // If no user and not loading, redirect to login
      if (!user) {
        console.log("No user found, redirecting to login");
        // Use replace instead of push to avoid adding to history
        router.replace("/login");
        return;
      }

      // If wallet is required but not connected, we don't redirect
      // just show the wallet connection message
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
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

  // If no user after loading, show login prompt with wallet connect option
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access this page.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <WalletConnect />
            <button
              onClick={() => router.replace("/login")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt if required
  if (requireWallet && !isConnected) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to access this page.
            </p>
          </div>
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated (and wallet connected if required)
  return <>{children}</>;
}
