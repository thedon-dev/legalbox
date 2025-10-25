"use client";

import { useAuth } from "@/lib/auth";

export function DebugAuth() {
  const { user, token, isLoading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {isLoading ? "true" : "false"}</div>
      <div>User: {user ? `${user.name} (${user.email})` : "null"}</div>
      <div>Token: {token ? "exists" : "null"}</div>
      <div>
        localStorage token:{" "}
        {typeof window !== "undefined"
          ? localStorage.getItem("token")
            ? "exists"
            : "null"
          : "N/A"}
      </div>
      <div>
        localStorage user:{" "}
        {typeof window !== "undefined"
          ? localStorage.getItem("user")
            ? "exists"
            : "null"
          : "N/A"}
      </div>
    </div>
  );
}
