# 🗂️ LegaBox – Decentralized Legal Document Storage & Sharing (Built on BlockDAG)

LegaBox is a **secure digital vault for storing, verifying, and sharing legal and personal documents**.  
Built on **BlockDAG** and powered by **Next.js**, **Node.js**, **MongoDB**, and **Solidity smart contracts**, LegaBox ensures that documents remain:

✅ Private  
✅ Untampered  
✅ Fully controlled by the owner  

Users manage documents and sharing permissions directly from a simple web interface — **no passwords**, just **wallet-based identity**.

---

## 🎯 Project Goal

To solve the problem of **fraudulent documents**, **loss of files**, and **unverified document exchanges** by providing:

- A trusted tamper-proof record of document authenticity (on chain)
- Secure storage and encrypted sharing (off chain)
- Clear tracking of who has access (audit trail)

---

## 💡 Core Features

| Feature | Description |
|--------|-------------|
| **Secure Document Upload** | Files are stored off-chain with encryption to protect private data. |
| **Document Hash Verification (On-Chain)** | A hash of each file is stored on BlockDAG so authenticity can be proven anytime. |
| **Wallet-Based Login** | Users connect using MetaMask (or any BlockDAG-compatible wallet). No passwords. |
| **Permission-Based Sharing** | Grant and revoke document access by wallet address. |
| **Audit Log** | All sharing events and revocations are logged on-chain for transparency. |
| **Document Preview & Metadata** | View name, type, owner, access list, upload date, and hash. |

---

## 🧩 System Architecture

- **Off-chain storage** = Keeps files private.
- **On-chain registry** = Provides proof of authenticity + access control.

---

## 🪙 Smart Contract Responsibilities

The smart contract manages:

| Responsibility | Stored On-Chain? |
|---------------|------------------|
| Document Hash & Owner | ✅ Yes |
| Who is allowed access | ✅ Yes |
| Upload or Sharing History Events | ✅ Yes |
| Actual Document File | ❌ No (too large & must stay private) |

### Smart Contract Functions (Simplified)
```solidity
function registerDocument(bytes32 docHash) public;
function grantAccess(address user, bytes32 docHash) public;
function revokeAccess(address user, bytes32 docHash) public;
function hasAccess(address user, bytes32 docHash) public view returns(bool);