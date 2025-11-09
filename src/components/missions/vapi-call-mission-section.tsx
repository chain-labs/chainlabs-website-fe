import { Mission } from "@/types/store";
import { Button } from "../ui/button";
import { useMissionComputed } from "./mission-card";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

export default function VapiCallMissionSection(props: {
  mission: Mission;
  state: ReturnType<typeof useMissionComputed>;
  onConfirm: () => void;
  callVapi: () => void;
}) {
  const { mission, state, onConfirm, callVapi } = props;
  const { completed, submitting, error, requiredSeconds, timeSpent } = state;

  const capped = Math.min(timeSpent, requiredSeconds);
  const pct = completed ? 1 : capped / requiredSeconds;
  const pctPct = Math.round(pct * 100);
  const remaining = Math.max(0, requiredSeconds - capped);
  const ready = !completed && pct >= 1;

  // --- Auto submit when in view & ready ---
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const autoSubmittedRef = useRef(false);
  useEffect(() => {
    if (
      inView &&
      ready &&
      !completed &&
      !submitting &&
      !autoSubmittedRef.current
    ) {
      autoSubmittedRef.current = true;
      onConfirm(); // triggers submitAnswer upstream
    }
  }, [inView, ready, completed, submitting, onConfirm]);

  return (
    <div
      ref={rootRef}
      className="mt-5 space-y-4 flex flex-col justify-between h-full"
    >
      <div
        className={`rounded-xl border bg-card/50 p-4 backdrop-blur-sm transition-colors border-border/40 ${
          completed ? "opacity-70" : "hover:border-border/60"
        }`}
      >
        <div className="space-y-3">
          <p className="text-sm font-medium">Interact with Vapi</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Spend {requiredSeconds}s with the Vapi Call. Progress updates
            automatically.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-h-5 text-xs">
          {error ? (
            <span className="text-red-500" id={`mission-error-${mission.id}`}>
              {error}
            </span>
          ) : (
            <span
              className="text-muted-foreground"
              id={`mission-help-${mission.id}`}
            >
              {completed
                ? "Step completed"
                : ready
                  ? "You can now confirm"
                  : "Keep reading..."}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={ready ? undefined : "outline"}
            onClick={completed || !ready ? callVapi : onConfirm}
            disabled={submitting}
          >
            {(() => {
              if (submitting) return "...";
              if (completed) return "Call Again";
              if (ready) return "Confirm";
              return capped > 0 ? "Continue" : "Call Vapi";
            })()}
          </Button>
        </div>
      </div>
    </div>
  );
}
