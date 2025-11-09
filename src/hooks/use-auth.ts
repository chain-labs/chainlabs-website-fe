import { apiClient } from "@/api-client";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await apiClient.initializeSession();
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize authentication:", err);
        setError("Failed to initialize session");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    apiClient.clearAuth();
    setIsInitialized(false);
  };

  return {
    isAuthenticated: apiClient.isAuthenticated(),
    isInitialized,
    isLoading,
    error,
    logout,
  };
};
