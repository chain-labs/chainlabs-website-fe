import { useEffect, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

export const useSession = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = useGlobalStore();

  const initializeSession = async () => {
    try {
      let accessToken = store.accessToken;

      // Create session if no tokens exist
      if (!accessToken) {
        await apiClient.createSession();
        accessToken = store.accessToken;
      }

      // Try to hydrate from existing session
      if (accessToken) {
        try {
          await apiClient.getFullSession();
        } catch (sessionError) {
          // If session fetch fails, we still have tokens for other operations
          console.warn("Failed to hydrate session:", sessionError);
        }
      }

      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize session:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize session");
      setIsInitialized(true); // Still mark as initialized to prevent infinite loops
    }
  };

  useEffect(() => {
    initializeSession();
  }, []);

  const refreshSession = async () => {
    if (store.refreshToken) {
      try {
        await apiClient.refreshTokens(store.refreshToken);
        await apiClient.getFullSession();
        setError(null);
      } catch (err) {
        console.error("Failed to refresh session:", err);
        setError("Session expired. Please start over.");
        store.resetSession();
      }
    }
  };

  return {
    isInitialized,
    error,
    refreshSession,
    hasGoal: store.hasGoal(),
    canShowPersonalized: store.canShowPersonalized(),
    completedMissions: store.completedMissionsCount(),
    totalMissions: store.missions.length,
    progressPercentage: store.progressPercentage(),
    callUnlocked: store.callUnlocked,
  };
};