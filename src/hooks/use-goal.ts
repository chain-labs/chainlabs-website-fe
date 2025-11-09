"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../api-client";

export type GoalMessage = {
  role: "user" | "assistant";
  message: string;
  timestamp: string;
};

type UseGoalOptions = {
  autoInit?: boolean; // ensure session on first send (default: true)
};

export function useGoal(options: UseGoalOptions = { autoInit: true }) {
  const { autoInit = true } = options;

  const [messages, setMessages] = useState<GoalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const ensureSession = useCallback(async () => {
    try {
      await apiClient.ensureSession();
    } catch (e) {
      // fall back to explicit start if ensure failed
      await apiClient.startSession();
    }
  }, []);

  useEffect(() => {
    // Optionally ensure a session the first time this hook is used
    if (!initializedRef.current && autoInit && typeof window !== "undefined") {
      initializedRef.current = true;
      ensureSession().catch(() => {
        // swallow here; will retry on first send
      });
    }
  }, [autoInit, ensureSession]);

  const sendGoal = useCallback(
    async (input: string): Promise<GoalMessage | null> => {
      if (!input?.trim()) return null;

      setError(null);
      setLoading(true);

      const userMessage: GoalMessage = {
        role: "user",
        message: input,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      let triedReauth = false;

      const submit = async () => {
        try {
          // Make sure we have a session before calling
          await ensureSession();
          const assistant = await apiClient.submitGoal(input);
          const assistantMessage: GoalMessage = {
            role: assistant.role as "user" | "assistant",
            message: assistant.message,
            timestamp: assistant.timestamp,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          return assistantMessage;
        } catch (err: any) {
          // If auth failed, try one re-auth then retry once
          if (
            !triedReauth &&
            (err?.message === "AUTHENTICATION_FAILED" ||
              err?.message === "SESSION_INIT_FAILED")
          ) {
            triedReauth = true;
            await apiClient.startSession();
            return submit();
          }
          const message = err?.message || "Failed to submit goal";
          setError(message);
          throw err;
        } finally {
          setLoading(false);
        }
      };

      return submit();
    },
    [ensureSession],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setLoading(false);
  }, []);

  const lastAssistantMessage =
    [...messages].reverse().find((m) => m.role === "assistant") || null;

  return {
    messages,
    loading,
    error,
    sendGoal,
    reset,
    lastAssistantMessage,
  };
}
