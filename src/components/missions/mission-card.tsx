"use client";

import { Mission } from "@/types/store";
import { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useMissions } from "@/hooks/use-missions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CheckCircle, Clock, Target } from "lucide-react";
import { icons } from "lucide-react";
import { useGlobalStore } from "@/global-store";
import { motion, AnimatePresence } from "motion/react";
import InputMissionSection from "./input-mission-section";
import ReadCaseStudySection from "./read-case-study-section";
import InfoMissionSection from "./info-mission-section";
import ViewProcessSection from "./view-process-section";
import VapiCallMissionSection from "./vapi-call-mission-section";

type BaseStatus = Mission extends { status: infer S } ? S : never;
type Status = BaseStatus | "in-progress" | "not-started";

const statusMeta: Record<
  string,
  {
    label: string;
    bar: string;
    chip: string;
    icon: React.ComponentType<any>;
    progress: number;
  }
> = {
  completed: {
    label: "Completed",
    bar: "bg-emerald-400/80",
    chip: "text-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500/20",
    icon: CheckCircle,
    progress: 100,
  },
  "in-progress": {
    label: "In progress",
    bar: "bg-primary/80",
    chip: "text-primary bg-primary/10 ring-1 ring-primary/20",
    icon: Clock,
    progress: 55,
  },
  "not-started": {
    label: "Not started",
    bar: "bg-amber-400/80",
    chip: "text-amber-600 bg-amber-500/10 ring-1 ring-amber-500/20",
    icon: Clock,
    progress: 20,
  },
  pending: {
    label: "Pending",
    bar: "bg-amber-400/80",
    chip: "text-amber-600 bg-amber-500/10 ring-1 ring-amber-500/20",
    icon: Clock,
    progress: 20,
  },
};

const prettyStatus = (status: Status) =>
  statusMeta[String(status)] ?? statusMeta["pending"];

// ---------- Icon resolution helpers ----------
const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const toPascalCase = (s: string) =>
  s
    .replace(/[-_\s]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
const NORMALIZED_ICON_NAME_LOOKUP: Record<string, string> = Object.keys(
  icons,
).reduce(
  (acc, name) => {
    acc[normalizeKey(name)] = name;
    return acc;
  },
  {} as Record<string, string>,
);

function resolveIcon(raw?: string): React.ComponentType<any> {
  const val = (raw || "").trim();
  if (!val) return Target;
  const pascal = toPascalCase(val);
  if ((icons as any)[pascal]) return (icons as any)[pascal];
  const normalized = NORMALIZED_ICON_NAME_LOOKUP[normalizeKey(val)];
  if (normalized && (icons as any)[normalized])
    return (icons as any)[normalized];
  return Target;
}

// ---------- UI bits ----------
const StatusBadge = ({ status }: { status: Status }) => {
  const meta = prettyStatus(status);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${meta.chip}`}
    >
      <Icon className="size-3.5" />
      {meta.label}
    </span>
  );
};

// ---------- Derived mission state hook ----------
export function useMissionComputed(mission: Mission, answer: string) {
  const {
    submitAnswer,
    getMissionStatus,
    hasCompleted,
    isSubmitting,
    getError,
  } = useMissions();
  const personalised = useGlobalStore((s) => s.personalised);
  const caseStudyTimeSpent = useGlobalStore((s) => s.caseStudyTimeSpent);
  const processSectionTimeSpent = useGlobalStore(
    (s) => s.processSectionTimeSpent,
  );
  const vapiCallTimeSpent = useGlobalStore((s) => s.vapiTimeSpent);

  const missionType = mission.missionType;
  const isInputMission =
    (missionType === "ADDITIONAL_INPUT" || missionType === "CHAT") &&
    !!mission.input?.placeholder?.trim();

  const isViewProcessMission = missionType === "VIEW_PROCESS";

  const targetCaseStudyId =
    missionType === "READ_CASE_STUDY"
      ? mission.options?.targetCaseStudyId
      : undefined;

  const isReadCaseStudyMission = !!(
    missionType === "READ_CASE_STUDY" &&
    targetCaseStudyId &&
    targetCaseStudyId !== "N/A"
  );

  const isVapiCallMission = missionType === "VAPI_WEB_CALL";

  const targetCaseStudy = useMemo(() => {
    if (!isReadCaseStudyMission || !personalised) return null;
    return (
      personalised.personalisation.caseStudies?.find(
        (c) => c.id === targetCaseStudyId,
      ) || null
    );
  }, [isReadCaseStudyMission, targetCaseStudyId, personalised]);

  const requiredSeconds = 30;

  const caseStudyTime = (() => {
    if (!isReadCaseStudyMission) return 0;
    return caseStudyTimeSpent[targetCaseStudyId!] || 0;
  })();

  const processTime = (() => {
    if (!isViewProcessMission) return 0;
    return Object.values(processSectionTimeSpent).reduce(
      (sum, v) => sum + v,
      0,
    );
  })();

  const vapiCallTime = (() => {
    if (!isVapiCallMission) return 0;
    return vapiCallTimeSpent || 0;
  })();

  const timeSpent = isReadCaseStudyMission
    ? caseStudyTime
    : isViewProcessMission
      ? processTime
      : isVapiCallMission
        ? vapiCallTime
        : 0;

  const timedProgressPct =
    isReadCaseStudyMission || isViewProcessMission
      ? Math.min(100, (timeSpent / requiredSeconds) * 100)
      : 0;

  const completed = hasCompleted(mission.id);
  const submitting = isSubmitting(mission.id);
  const error = getError(mission.id);
  const currentStatus =
    (getMissionStatus(mission.id) as Status) ??
    ((mission as any).status as Status);

  const visualStatus: Status =
    isInputMission && answer.trim() && currentStatus !== "completed"
      ? "in-progress"
      : (isReadCaseStudyMission || isViewProcessMission) &&
          !completed &&
          timeSpent > 0 &&
          timeSpent < requiredSeconds
        ? "in-progress"
        : currentStatus;

  return {
    submitAnswer,
    completed,
    submitting,
    error,
    isInputMission,
    isReadCaseStudyMission,
    targetCaseStudy,
    targetCaseStudyId,
    requiredSeconds,
    timeSpent,
    visualStatus,
    timedProgressPct,
    isViewProcessMission,
    isVapiCallMission,
  };
}

// ---------- Main ----------
const MissionCard = memo(
  ({ mission, index }: { mission: Mission; index: number }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const IconComponent = useMemo(
      () => resolveIcon(mission.icon),
      [mission.icon],
    );

    const [answer, setAnswer] = useState("");

    const state = useMissionComputed(mission, answer);
    const {
      submitAnswer,
      visualStatus,
      isInputMission,
      isReadCaseStudyMission,
      isViewProcessMission,
      isVapiCallMission,
      timedProgressPct,
      completed,
    } = state;
    const visualMeta = prettyStatus(visualStatus);
    const statusColorStrip =
      visualStatus === "completed"
        ? "bg-emerald-500/60"
        : visualStatus === "in-progress"
          ? "bg-primary/70"
          : "bg-amber-500/60";

    const ariaLabel = `${mission.title ?? "Mission"} — ${
      visualMeta.label
    }. ${Number(mission.points ?? 0)} points`;

    // Subtle but powerful completion moment
    const prevCompletedRef = useRef(completed);
    const [justCompleted, setJustCompleted] = useState(false);
    useEffect(() => {
      if (!prevCompletedRef.current && completed) {
        setJustCompleted(true);
        const t = setTimeout(() => setJustCompleted(false), 1200);
        return () => clearTimeout(t);
      }
      prevCompletedRef.current = completed;
    }, [completed]);

    const handleConfirm = async () => {
      if (completed) return;
      if (
        (isReadCaseStudyMission || isViewProcessMission) &&
        state.timeSpent < state.requiredSeconds
      )
        return;
      try {
        await submitAnswer(
          mission.id,
          isReadCaseStudyMission
            ? "Viewed case study"
            : isViewProcessMission
              ? "Viewed process section"
              : "Confirmed",
        );
        setAnswer("");
      } catch {}
    };

    const openCaseStudy = useCallback(() => {
      if (!isReadCaseStudyMission || !state.targetCaseStudyId) return;
      requestAnimationFrame(() => {
        try {
          window.dispatchEvent(
            new CustomEvent("openCaseStudy", {
              detail: { caseStudyId: state.targetCaseStudyId },
            }),
          );
        } catch {}
        document
          .getElementById("case-studies")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }, [isReadCaseStudyMission, state.targetCaseStudyId]);

    const onMouseMove = (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty(
        "--x",
        `${((e.clientX - rect.left) / rect.width) * 100}%`,
      );
      el.style.setProperty(
        "--y",
        `${((e.clientY - rect.top) / rect.height) * 100}%`,
      );
    };

    const callVapi = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: "easeOut",
        }}
        className="group relative max-w-[400px] h-full mx-auto"
        role="listitem"
        id={mission.id}
        aria-label={ariaLabel}
        aria-describedby={`mission-status-${mission.id}`}
      >
        <motion.div
          ref={containerRef}
          onMouseMove={onMouseMove}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/60 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300 hover:shadow-2xl hover:border-border/60"
        >
          {/* Completion sheen + glow overlay */}
          <AnimatePresence>
            {justCompleted && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.9,
                    times: [0, 0.35, 1],
                  }}
                />
                {/* Sheen sweep */}
                <motion.div
                  className="absolute -inset-y-8 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{
                    x: "-40%",
                    rotate: 8,
                    opacity: 0,
                  }}
                  animate={{
                    x: "140%",
                    opacity: [0, 1, 0.6, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
                {/* Center check pulse */}
                <motion.div
                  className="absolute inset-0 grid place-items-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: [0.9, 1, 1.02, 1],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    times: [0, 0.2, 0.55, 1],
                  }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-3 rounded-full bg-emerald-400/15"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{
                        scale: [0.7, 1.2, 1.4],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 0.9,
                        times: [0, 0.5, 1],
                      }}
                    />
                    <motion.div
                      className="absolute -inset-1 rounded-full ring-2 ring-emerald-400/50"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{
                        scale: [0.7, 1.05, 1.25],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.9,
                        times: [0, 0.4, 1],
                      }}
                    />
                    <CheckCircle className="size-8 text-emerald-400 drop-shadow" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Status accent strip */}
          <div
            aria-hidden
            className={`absolute left-0 top-0 h-full w-1 ${statusColorStrip}`}
          />
          <div
            className="pointer-events-none absolute -inset-px opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(500px circle at var(--x,70%) var(--y,30%), color-mix(in oklab, var(--color-primary,#7c3aed) 28%, transparent), transparent 40%)",
            }}
          />
          <div className="relative p-5 h-full flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="grid items-center gap-4">
                <div className="grid place-items-center rounded-xl size-11 bg-primary/12 ring-1 ring-primary/25 text-primary">
                  <IconComponent className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {mission.title ?? "Untitled mission"}
                  </h3>
                  {mission.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mission.description}
                    </p>
                  )}
                  <div className="mt-2">
                    <span
                      id={`mission-status-${mission.id}`}
                      className="sr-only"
                    >
                      {visualMeta.label}
                    </span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={visualStatus}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{
                          duration: 0.18,
                          ease: "easeOut",
                        }}
                      >
                        <StatusBadge status={visualStatus} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Points</div>
                <div
                  className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary ring-1 ring-primary/20"
                  aria-label="Points for this mission"
                >
                  <span className="text-sm font-bold">
                    {Number(mission.points ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width:
                    isReadCaseStudyMission || isViewProcessMission
                      ? `${completed ? 100 : timedProgressPct}%`
                      : `${visualMeta.progress}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  (isReadCaseStudyMission || isViewProcessMission) && !completed
                    ? "bg-primary/80"
                    : visualMeta.bar
                }`}
              />
            </div>

            {isInputMission ? (
              <InputMissionSection
                mission={mission}
                answer={answer}
                setAnswer={setAnswer}
                state={state}
              />
            ) : isReadCaseStudyMission ? (
              <ReadCaseStudySection
                mission={mission}
                state={state}
                onConfirm={handleConfirm}
                openCaseStudy={openCaseStudy}
              />
            ) : isViewProcessMission ? (
              <ViewProcessSection
                mission={mission}
                state={state}
                onConfirm={handleConfirm}
              />
            ) : isVapiCallMission ? (
              <VapiCallMissionSection
                mission={mission}
                state={state}
                onConfirm={handleConfirm}
                callVapi={callVapi}
              />
            ) : (
              <InfoMissionSection
                mission={mission}
                state={state}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

export default MissionCard;
