"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { authApi, User } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (
    name: string,
    email: string,
    password: string,
    walletAddress?: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage and cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("Initializing auth - stored data:", {
          storedToken,
          storedUser,
        });

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);

          // Also set cookie for middleware
          document.cookie = `token=${storedToken}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`; // 7 days

          console.log("Auth initialized with user:", userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Track when user state actually changes
  useEffect(() => {
    console.log("User state changed:", user);
    if (user) {
      console.log("User is now set:", {
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      console.log("User is null/undefined");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // For testing - let's see what the API actually returns
      console.log("Calling authApi.login with:", { email, password });
      const response = await authApi.login({ email, password });
      console.log("Login response: ", response);
      console.log("Response user:", response?.user);
      console.log("Response token:", response?.token);
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response || {}));

      if (!response?.user || !response?.token) {
        console.error("Invalid login response - missing user or token");
        throw new Error("Invalid login response");
      }

      // Update state
      console.log("Setting user state to:", response.user);
      setUser(response.user);
      setToken(response.token);

      // Force a re-render by logging the state after a microtask
      setTimeout(() => {
        console.log("State should be updated now");
      }, 0);

      // Update localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Also set cookie for middleware
      document.cookie = `token=${response.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`; // 7 days

      console.log("Login successful, user set:", response.user);
      console.log("localStorage user:", localStorage.getItem("user"));

      // Give a small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    walletAddress?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({
        name,
        email,
        password,
        walletAddress,
      });

      setUser(response.user);
      setToken(response.token);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Also set cookie for middleware
      document.cookie = `token=${response.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`; // 7 days
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Also clear cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
