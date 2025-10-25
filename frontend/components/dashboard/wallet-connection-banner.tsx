"use client";

import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet } from "lucide-react";

export function WalletConnectionBanner() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <Wallet className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Connect your wallet to access all features</span>
        <WalletConnect />
      </AlertDescription>
    </Alert>
  );
}
