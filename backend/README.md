# Decentralized Document Verification & Sharing — Backend

This repository contains a Node.js (Express) backend for a decentralized document verification and sharing system. It stores document hashes on an append-only DAG (BlockDAG) and document files off-chain (Cloudinary/IPFS).

 - BlockDAG integration (placeholder helpers included)

Quick start
1. Copy `.env.example` -> `.env` and set variables.
2. Install dependencies: npm install
3. Run dev: npm run dev

Project layout
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── .env.example
├── package.json
└── README.md
```

Notes
- BlockDAG integration requires a reachable BlockDAG node and API key. `src/config/blockdag.js` and `src/utils/blockdagUtils.js` provide a minimal wrapper; replace with your network-specific client/SDK if needed. The backend supports batching transactions and reading confirmation status from the DAG node.
- IPFS helper uses `ipfs-http-client`. For production consider pinning services (Pinata, Infura pinning, or your own IPFS node).

Security & production
- Use a secure JWT secret and HTTPS in production.
- Use proper rate limiting and input sanitization (not fully covered in this scaffold).

Contact
Add your project-specific documentation and contract details.
