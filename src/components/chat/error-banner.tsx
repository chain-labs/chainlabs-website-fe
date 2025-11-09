"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorType = "goal" | "clarify" | "chat";

type Props = {
  type: ErrorType;
  message: string;
  onRetry: () => void;
  onRestart?: () => void; // not shown for chat, used as "Send New Message"
  loading?: boolean;
  className?: string;
};

export function ErrorBanner({
  type,
  message,
  onRetry,
  onRestart,
  loading,
  className,
}: Props) {
  const showRestart = type === "goal" || type === "clarify";
  const secondaryLabel = type === "chat" ? "Send New Message" : "Restart";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="alert"
      aria-live="polite"
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border",
        "bg-surface/50 backdrop-blur-xl border-destructive/20",
        "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {/* Top gradient accent */}
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-destructive/60 via-primary/40 to-transparent" /> */}

      <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
        <div className="flex items-center justify-center gap-3">
          <div
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full",
              "bg-destructive/15 border border-destructive/30",
              "shadow-[0_0_30px_rgba(255,60,60,0.25)]",
            )}
            aria-hidden="true"
          >
            <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
          </div>
          <div className="text-sm text-text-primary/90">
            <p className="leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            onClick={onRetry}
            disabled={!!loading}
            className={cn(
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "shadow-sm hover:shadow-md transition-all",
            )}
            aria-label="Try again"
          >
            {loading ? "Retrying..." : "Try Again"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onRestart}
            disabled={!!loading}
            className={cn(
              "border-border/60 hover:bg-primary/10",
              "text-text-primary",
            )}
            aria-label={type === "chat" ? "Send new message" : "Restart"}
          >
            {secondaryLabel}
          </Button>
        </div>
      </div>

      {/* Subtle background decorations */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-destructive/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
    </motion.div>
  );
}
