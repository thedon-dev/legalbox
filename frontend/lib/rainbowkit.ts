"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "LegalBox",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your_project_id_here",
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
