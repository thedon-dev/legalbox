import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

import abi from "./LegalBoxAccessControl.json" assert { type: "json" };

export const contract = new ethers.Contract(
  process.env.LEGALBOX_CONTRACT_ADDRESS,
  abi,
  wallet
);
