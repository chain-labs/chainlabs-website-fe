"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/api-client";
import { useGlobalStore } from "@/global-store";
import type { Mission } from "@/types/store";
import { isErrored } from "stream";
import { useChat } from "./use-chat";

export type CompleteMissionResult = {
  points_awarded: number;
  points_total: number;
  call_unlocked: boolean;
  next_mission?: {
    id: string;
    title: string;
    description: string; // updated to match usage below
    points: number;
    status: string;
  } | null;
};

type UseMissionsOptions = {
  autoInit?: boolean; // ensure session on mount (default: true)
};

export function useMissions(options: UseMissionsOptions = { autoInit: true }) {
  const { autoInit = true } = options;
  const personalised = useGlobalStore((s) => s.personalised);
  const setPersonalised = useGlobalStore((s) => s.setPersonalised);

  const { getPersonalizedContent } = useChat();

  const [submittingById, setSubmittingById] = useState<Record<string, boolean>>(
    {},
  );
  const [errorById, setErrorById] = useState<Record<string, string | null>>({});
  const initializedRef = useRef(false);

  const ensureSession = useCallback(async () => {
    try {
      await apiClient.ensureSession();
    } catch {
      await apiClient.startSession();
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current && autoInit && typeof window !== "undefined") {
      initializedRef.current = true;
      ensureSession().catch(() => {
        // ignore; will retry on first submit
      });
    }
  }, [autoInit, ensureSession]);

  const setSubmitting = (id: string, val: boolean) =>
    setSubmittingById((m) => ({ ...m, [id]: val }));
  const setError = (id: string, msg: string | null) =>
    setErrorById((m) => ({ ...m, [id]: msg }));

  const getMissionById = useCallback(
    (id: string): Mission | undefined =>
      personalised?.personalisation?.missions.find((m) => m.id === id),
    [personalised],
  );

  const getMissionStatus = useCallback(
    (id: string): string | undefined => getMissionById(id)?.status as any,
    [getMissionById],
  );

  const hasCompleted = useCallback(
    (id: string) => getMissionStatus(id) === "completed",
    [getMissionStatus],
  );

  const isSubmitting = useCallback(
    (id: string) => !!submittingById[id],
    [submittingById],
  );

  const getError = useCallback(
    (id: string) => errorById[id] ?? null,
    [errorById],
  );

  const submitAnswer = useCallback(
    async (
      missionId: string,
      answer?: string,
    ): Promise<CompleteMissionResult> => {
      const id = String(missionId);

      // Use mission data instead of id prefixes
      const mission = getMissionById(id);
      const missionType = mission?.missionType;
      const isInputMission = missionType === "ADDITIONAL_INPUT";
      const isClickMission =
        missionType === "READ_CASE_STUDY" || missionType === "VIEW_PROCESS";
      const isRequired = mission?.input?.required ?? true;

      const trimmed = (answer ?? "").trim();

      if (isSubmitting(missionId)) {
        const err = new Error("Already submitting");
        setError(missionId, err.message);
        throw err;
      }

      // For input missions, require non-empty only if required
      if (isInputMission && isRequired && !trimmed) {
        const err = new Error("Answer cannot be empty");
        setError(missionId, err.message);
        throw err;
      }

      setSubmitting(missionId, true);
      setError(missionId, null);

      let triedReauth = false;

      // Click missions send empty payload; input missions send trimmed (can be empty if optional)
      const payload = isClickMission ? "Completed the mission" : trimmed;

      const doSubmit = async (): Promise<CompleteMissionResult> => {
        try {
          await ensureSession();
          const res = await apiClient.completeMission(missionId, payload);
          getPersonalizedContent();

          // Update mission status -> completed; append next_mission if provided
          if (personalised) {
            const current = personalised.personalisation.missions;
            const updated: Mission[] = current.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              points: m.points,
              status:
                m.id === missionId
                  ? "completed"
                  : m.status === "completed"
                    ? "completed"
                    : "pending",
              // keep other fields as-is if needed by your UI
              icon: (m as any).icon,
              input: (m as any).input,
              missionType: (m as any).missionType,
              options: (m as any).options,
              artifact: (m as any).artifact,
            }));

            const next = res.next_mission;
            const nextNormalized: Mission | null = next
              ? {
                  id: next.id,
                  title: next.title,
                  description: next.description,
                  points: next.points,
                  status: next.status === "completed" ? "completed" : "pending",
                  // defaults for newly appended missions
                  icon: (mission as any)?.icon ?? "",
                  input: (mission as any)?.input ?? {
                    required: true,
                    type: "text",
                    placeholder: "",
                  },
                  missionType:
                    (mission as any)?.missionType ?? "READ_CASE_STUDY",
                  options: (mission as any)?.options ?? {
                    targetCaseStudyId: "N/A",
                  },
                  artifact: (mission as any)?.artifact ?? {
                    answer: "",
                  },
                }
              : null;

            const hasNext =
              !!nextNormalized &&
              !updated.some((m) => m.id === nextNormalized.id);

            setPersonalised({
              ...personalised,
              personalisation: {
                ...personalised.personalisation,
                missions: hasNext ? [...updated, nextNormalized!] : updated,
              },
            });
          }

          return res;
        } catch (e: any) {
          const authFail =
            e?.message === "AUTHENTICATION_FAILED" ||
            e?.message === "SESSION_INIT_FAILED";
          if (!triedReauth && authFail) {
            triedReauth = true;
            await apiClient.startSession();
            return doSubmit();
          }
          setError(missionId, e?.message || "Failed to submit mission");
          throw e;
        } finally {
          setSubmitting(missionId, false);
        }
      };

      return doSubmit();
    },
    [
      ensureSession,
      isSubmitting,
      personalised,
      setPersonalised,
      getMissionById,
    ],
  );

  return {
    // actions
    submitAnswer,

    // selectors
    getMissionById,
    getMissionStatus,
    hasCompleted,

    // per-mission UI state
    isSubmitting,
    getError,
  };
}
