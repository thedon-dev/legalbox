# Frontend Consumption Guide

This guide explains how frontend developers should consume the Hackathon-backend API. It contains examples (fetch and axios), required headers, request shapes, and notes about polling BlockDAG status and file uploads.

## Base information
- Base URL: set per environment, e.g. `http://localhost:3000` or `https://api.example.com`.
- Auth: JWT. Obtain with `POST /api/auth/login` (or `POST /api/auth/register`). Include in protected requests with `Authorization: Bearer <token>`.
- Uploads: endpoints that accept files expect `multipart/form-data`. Use FormData and do not set Content-Type manually.
- Storage: files are stored off-chain (Cloudinary). Optional IPFS CIDs are returned by the API.
- BlockDAG: recording is asynchronous in many cases — endpoints return `blockdagTxId` and `blockdagStatus` (pending|confirmed|failed).

---

## Common headers
- Authorization: `Bearer <JWT>` (when required)
- Content-Type: `application/json` for JSON; let browser set `multipart/form-data` boundary for FormData uploads.
- Accept: `application/json`

---

## Authentication

### Register
- Method: `POST`
- Path: `/api/auth/register`
- Body (JSON): `{ name, email, password, walletAddress? }`
- Response: `{ user, token }`

### Login
- Method: `POST`
- Path: `/api/auth/login`
- Body (JSON): `{ email, password }`
- Response: `{ user, token }`

Use the returned `token` with `Authorization: Bearer <token>`.

Example (login + store token):
```js
const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('token', data.token);
  return data.user;
};
```

---

## Documents

### Upload a document
- Method: `POST`
- Path: `/api/documents/upload`
- Auth: required
- Body: `multipart/form-data`
  - `file` (binary)
  - `name` (optional)
  - `description` (optional)
  - `isPublic` (optional boolean)
- Response: `{ document: { id, name, hash, cloudUrl, ipfsCid, blockdagTxId, blockdagStatus, ... } }
`

Example (fetch + FormData):
```js
const uploadDocument = async (file, opts = {}) => {
  const token = localStorage.getItem('token');
  const fd = new FormData();
  fd.append('file', file);
  if (opts.name) fd.append('name', opts.name);
  if (opts.description) fd.append('description', opts.description);
  if (opts.isPublic !== undefined) fd.append('isPublic', opts.isPublic);

  const res = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data.document;
};
```

### List documents for a wallet
- Method: `GET`
- Path: `/api/documents/wallet/:walletAddress`
- Auth: required
- Response: array of document objects

### Get document details
- Method: `GET`
- Path: `/api/documents/:id`
- Auth: optional for public docs; required for private
- Response: document object including `cloudUrl`, `ipfsCid`, `blockdagTxId`, and `blockdagStatus`

### Download / View
- Use `document.cloudUrl` (Cloudinary) to display or download the file.

---

## Share links

### Create share link
- Method: `POST`
- Path: `/api/share`
- Auth: required
- Body (JSON): `{ documentId, expiresInSeconds?, allowDownload? }`
- Response: `{ shareUrl, id, token, expiresAt }
`

### Access share link
- Method: `GET`
- Path: `/api/share/:shareId` or a short path like `/s/:token`
- Auth: not required when using token-based share link.

### Revoke
- Method: `DELETE`
- Path: `/api/share/:shareId`
- Auth: required (owner only)

---

## Verify

### Verify by file or hash
- Method: `POST`
- Path: `/api/verify`
- Body (either):
  - `multipart/form-data` with `file`, OR
  - JSON `{ hash: '<sha256hex>' }`
- Response: `{ verified: boolean, match: { inDb, blockdag: { txId, status, match } }, details }
`

Example (verify by hash):
```js
const verifyByHash = async (hash) => {
  const res = await fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash }),
  });
  return res.json();
};
```

If `blockdagStatus` is `pending`, poll a BlockDAG status endpoint (see next section).

---

## Polling BlockDAG status

- If a response includes `blockdagStatus: "pending"`, poll a status endpoint such as:
  - `GET /api/blockdag/tx/:txId` or `GET /api/documents/:id/blockdag` (confirm exact path in server)
- Polling strategy: exponential backoff or fixed intervals (e.g., 3s, 3s, 5s, 10s, stop after N attempts).
- UX: show a spinner and update the document item when status becomes `confirmed` or `failed`.

---

## Organization batch upload
- Method: `POST`
- Path: `/api/organization/batch-upload`
- Auth: required (org admin)
- Body: JSON array or multipart where each entry includes base64 file or URL + metadata
- Response: per-document success/failure array

---

## Logs / Audit
- Endpoint: `GET /api/logs?documentId=<id>&limit=50&skip=0`
- Auth: required (owner or admin)
- Response: list of events (upload, verify, share, access), timestamps, actor

---

## Error handling
- Non-2xx responses return JSON like: `{ message: 'Human message', error: 'Detailed', code: 'SOME_CODE' }`.
- Always check `res.ok` or `response.status` and parse error JSON to show friendly messages.
- Typical status codes:
  - 400 — validation/bad request
  - 401 — unauthorized
  - 403 — forbidden
  - 404 — not found
  - 500 — server error

Example fetch wrapper:
```js
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}
```

---

## File upload tips
- Use a progress indicator (axios `onUploadProgress` or XHR progress events).
- Do not set `Content-Type` when sending `FormData` (browser will set boundary).
- Validate file type/size client-side for UX but always validate server-side as well.

Axios example with progress:
```js
import axios from 'axios';
const token = localStorage.getItem('token');
const form = new FormData();
form.append('file', file);
const res = await axios.post(`${API_BASE}/api/documents/upload`, form, {
  headers: { Authorization: `Bearer ${token}` },
  onUploadProgress: (ev) => setProgress(Math.round((ev.loaded * 100) / ev.total)),
});
```

---

## CORS
- If you encounter preflight errors, ensure backend CORS allows your frontend origin and headers (Authorization, Content-Type).

---

## Local development and mocks
- Use MSW (Mock Service Worker) or simple mock functions if backend is unavailable. For uploads, return a placeholder `cloudUrl` and `hash`.

---

## Env variables (frontend)
- `API_BASE` — backend base URL (e.g., `http://localhost:3000`)
- `POLL_INTERVAL` — optional polling interval for BlockDAG

---

## Recommended next steps
- I can generate a Postman collection (added in this repo), or:
  - scaffold a TypeScript axios client with typed models (User, Document, ShareLink), or
  - create MSW mocks for the main flows.

---

If you want this file committed to the repository as a markdown file, it has already been created in the project root as `FRONTEND_CONSUMPTION.md`.
