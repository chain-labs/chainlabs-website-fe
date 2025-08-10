import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api-client";
import { useGlobalStore } from "@/global-store";
import type { PersonalizedContentResponse, PersonalizedContent, UsePersonalizedReturn } from "@/types";

type Options = {
  fetchOnMount?: boolean
};

function mapResponse(res: PersonalizedContentResponse): PersonalizedContent {
  return {
    headline: res.headline,
    goal: {
      description: res.goal.description,
      category: res.goal.category,
      priority: res.goal.priority,
    },
    missions: (res.missions || []).map(m => ({
      id: m.id,
      title: m.title,
      points: m.points,
      // Narrow unknown values to app-level union
      status: m.status === "completed" ? "completed" : "pending",
    })),
    recommendedCaseStudies: (res.recommended_case_studies || []).map(cs => ({
      id: cs.id,
      title: cs.title,
      summary: cs.summary,
    })),
  };
}

/**
 * Fetches personalized data and hydrates the global store:
 * - headline, goal, missions, recommendedCaseStudies
 */
export function usePersonalized(options: Options = {}): UsePersonalizedReturn {
  const { fetchOnMount = true } = options;
  const store = useGlobalStore();
  const [data, setData] = useState<PersonalizedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<PersonalizedContent | null> => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.ensureSession();
      const res = await apiClient.getPersonalizedContent();
      const mapped = mapResponse(res);

      // Hydrate global store
      store.setHeadline(mapped.headline);
      store.setGoal(mapped.goal);
      store.setMissions(mapped.missions);
      store.setRecommendedCaseStudies(mapped.recommendedCaseStudies);
      store.setShowPersonalized(true);

      setData(mapped);
      return mapped;
    } catch (e: any) {
      const msg =
        e?.message === "AUTHENTICATION_FAILED"
          ? "Session expired. Please refresh."
          : e?.message || "Failed to load personalized content.";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (fetchOnMount) {
      void refresh();
    }
  }, [fetchOnMount, refresh]);

  return { data, isLoading, error, refresh };
}

export default usePersonalized;