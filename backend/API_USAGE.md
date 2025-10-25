# API Usage — Decentralized Document Verification Backend

This document explains the backend API endpoints, expected requests, example responses, and recommended consumption patterns for the frontend.

Base URL
- For local dev: http://localhost:5000
- In production: your deployed host (e.g., https://api.example.com)

Authentication
- JWT tokens issued from /api/auth/login and /api/auth/register.
- Include header: Authorization: Bearer <token>

Common headers
- Content-Type: application/json (unless multipart/form-data for file upload)
- Authorization: Bearer <jwt>

Endpoints

1) Register
POST /api/auth/register
Body (application/json):
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "optional",
  "organization": "Acme",
  "roleType": "individual", // or "organization"
  "walletAddress": "0xabc"
}
Response: { user, token }

2) Login
POST /api/auth/login
Body: { email, password }
Response: { user, token }

3) Upload document
POST /api/documents/upload
Headers: Authorization
Body: multipart/form-data
- file: File (pdf/jpg/png/docx)
- name: optional
- description: optional
- isPublic: optional boolean

Response: { doc }
- doc fields include: _id, name, hash (sha256), ipfsCid, cloudUrl, ownerWallet, blockdagTxId, blockdagStatus

Frontend usage (example using fetch):
```js
const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('name', 'Contract');

fetch('/api/documents/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
  .then(r => r.json())
  .then(resp => console.log(resp));
```

4) Get documents for a wallet
GET /api/documents/:walletAddress
Headers: Authorization
Response: { docs: [...] }

5) Document details
GET /api/documents/details/:id
Headers: Authorization
Response: { doc }

6) Create share link
POST /api/share/:docId
Headers: Authorization
Body JSON: { accessCode?: '1234', expiresInHours?: 24 }
Response: { share }

7) Access share link
GET /api/share/:linkId?code=PIN
No auth required (if link public). Returns doc if allowed.

8) Revoke share
POST /api/share/:linkId/revoke
Headers: Authorization
Response: { link }

9) Verify document
POST /api/verify
Headers: Authorization
Body: multipart/form-data with file OR application/json { hash: '<hex>' }
Response: { authentic: true|false, document, blockdagRecord }

10) Logs
GET /api/logs/:docId
Headers: Authorization
Response: { logs: [...] }

11) Organization batch upload
POST /api/organization/batch-upload
Headers: Authorization (organization role)
Body JSON: { entries: [{ fileBase64, name, description, ownerWallet, ownerEmail, isPublic }] }

Response: { results: [{ success, docId|error }] }

Consumption patterns & tips for frontend engineer
- Use JWT stored in memory or secure httpOnly cookie; include in Authorization header for API calls.
- For file uploads, use fetch with FormData or axios (Content-Type set automatically).
- When uploading, the response contains `hash` and on-chain `blockdagTxId`; display confirmation and a small spinner while blockdag status is 'pending'. Poll `/api/documents/details/:id` to refresh `blockdagStatus`.
- For share links, show UI for optional PIN, and show revoke button only to owners.
- For verify flow, allow users to upload a file or paste a hash; the API returns `authentic` boolean and optional `blockdagRecord` for audit.

Security notes
- Frontend should never hold private keys or JWT secret; wallet interactions that require signatures must be handled client-side with the wallet provider.
- For read-only checks (verify), the frontend simply posts the file or its hash.

If you want, I can also generate:
- A Postman collection (or OpenAPI spec) for these endpoints.
- Example React hooks for each endpoint (useDocumentUpload, useVerify, etc.).

*** End of API_USAGE.md
