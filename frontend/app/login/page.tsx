"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function LoginPage() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to LegalBox</h1>
          <p className="text-muted-foreground">
            Secure document storage on the blockDAG
          </p>
        </div>

        {!showWalletConnect ? (
          <div className="space-y-4">
            <LoginForm />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or connect wallet
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowWalletConnect(true)}
              className="w-full"
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to get started
              </p>
            </div>

            <div className="flex justify-center">
              <WalletConnect />
            </div>

            {isConnected && (
              <div className="text-center">
                <p className="text-sm text-green-600 mb-4">
                  Wallet connected! You can now register or login.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/register">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => setShowWalletConnect(false)}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
