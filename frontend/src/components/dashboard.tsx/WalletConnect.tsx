import { useState } from "react";
import { Wallet, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const WalletConnect = () => {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(true); // Mock as connected

  const wallets = [
    {
      name: "BlockDAG Wallet",
      icon: "🔷",
      description: "Official BlockDAG wallet",
    },
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Popular browser extension",
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Mobile wallet connection",
    },
  ];

  const handleConnect = (walletName: string) => {
    // Mock connection
    setTimeout(() => {
      setConnected(true);
      setOpen(false);
    }, 1000);
  };

  if (connected) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-500 font-medium">
          Wallet Connected
        </span>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to LegalBox
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className="w-full flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <div className="text-left flex-1">
                <p className="font-medium">{wallet.name}</p>
                <p className="text-sm text-muted-foreground">
                  {wallet.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;
