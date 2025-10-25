import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Document {
  id: string;
  name: string;
  hash: string;
  cloudUrl: string;
  ipfsCid?: string;
  blockdagTxId?: string;
  blockdagStatus?: "pending" | "confirmed" | "failed";
  isPublic: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareLink {
  id: string;
  shareUrl: string;
  token: string;
  expiresAt: string;
  documentId: string;
  allowDownload: boolean;
}

export interface VerificationResult {
  verified: boolean;
  match: {
    inDb: boolean;
    blockdag: {
      txId: string;
      status: string;
      match: boolean;
    };
  };
  details: any;
}

// API functions
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    walletAddress?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
};

export const documentsApi = {
  upload: async (
    file: File,
    options: {
      name?: string;
      description?: string;
      isPublic?: boolean;
      ownerWallet?: string;
    } = {}
  ): Promise<{ document: Document }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options.name) formData.append("name", options.name);
    if (options.description)
      formData.append("description", options.description);
    if (options.isPublic !== undefined)
      formData.append("isPublic", options.isPublic.toString());
    if (options.ownerWallet)
      formData.append("ownerWallet", options.ownerWallet);

    const response = await api.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getByWallet: async (walletAddress: string): Promise<Document[]> => {
    try {
      const response = await api.get(`/api/documents/wallet/${walletAddress}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Document> => {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },
};

export const shareApi = {
  create: async (data: {
    documentId: string;
    expiresInSeconds?: number;
    allowDownload?: boolean;
  }): Promise<ShareLink> => {
    const response = await api.post("/api/share", data);
    return response.data;
  },

  getById: async (shareId: string): Promise<Document> => {
    const response = await api.get(`/api/share/${shareId}`);
    return response.data;
  },

  revoke: async (shareId: string): Promise<void> => {
    await api.delete(`/api/share/${shareId}`);
  },
};

export const verifyApi = {
  byFile: async (file: File): Promise<VerificationResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  byHash: async (hash: string): Promise<VerificationResult> => {
    const response = await api.post("/api/verify", { hash });
    return response.data;
  },
};

export const blockdagApi = {
  getTxStatus: async (txId: string): Promise<{ status: string }> => {
    const response = await api.get(`/api/blockdag/tx/${txId}`);
    return response.data;
  },

  getDocumentStatus: async (
    documentId: string
  ): Promise<{ status: string }> => {
    const response = await api.get(`/api/documents/${documentId}/blockdag`);
    return response.data;
  },
};

export const blockchainApi = {
  getStatus: async (): Promise<{
    success: boolean;
    network: any;
    contract: any;
    stats: any;
  }> => {
    const response = await api.get("/api/blockchain/status");
    return response.data;
  },

  uploadDocument: async (data: {
    docHash: string;
    title: string;
    description: string;
    ownerAddress: string;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post("/api/blockchain/documents/upload", data);
    return response.data;
  },

  grantPermission: async (
    documentId: number,
    toAddress: string
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(
      `/api/blockchain/documents/${documentId}/grant-permission`,
      { toAddress }
    );
    return response.data;
  },

  revokePermission: async (
    documentId: number,
    fromAddress: string
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(
      `/api/blockchain/documents/${documentId}/revoke-permission`,
      { fromAddress }
    );
    return response.data;
  },

  transferOwnership: async (
    documentId: number,
    newOwnerAddress: string
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(
      `/api/blockchain/documents/${documentId}/transfer-ownership`,
      { newOwnerAddress }
    );
    return response.data;
  },

  getMyDocuments: async (
    userAddress: string
  ): Promise<{
    success: boolean;
    documents: any[];
  }> => {
    const response = await api.get(
      `/api/blockchain/documents/my/${userAddress}`
    );
    return response.data;
  },

  getSharedDocuments: async (
    userAddress: string
  ): Promise<{
    success: boolean;
    documents: any[];
  }> => {
    const response = await api.get(
      `/api/blockchain/documents/shared/${userAddress}`
    );
    return response.data;
  },

  getDocument: async (
    documentId: number
  ): Promise<{
    success: boolean;
    document: any;
  }> => {
    const response = await api.get(`/api/blockchain/documents/${documentId}`);
    return response.data;
  },

  checkPermission: async (
    documentId: number,
    userAddress: string
  ): Promise<{ success: boolean; hasPermission: boolean }> => {
    const response = await api.get(
      `/api/blockchain/documents/${documentId}/permission/${userAddress}`
    );
    return response.data;
  },
};

export const logsApi = {
  get: async (
    params: { documentId?: string; limit?: number; skip?: number } = {}
  ): Promise<any[]> => {
    try {
      const response = await api.get("/api/logs", { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },
};

export const sharedApi = {
  getSharedWithMe: async (): Promise<any[]> => {
    try {
      const response = await api.get("/api/shared/me");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },
};

export default api;
