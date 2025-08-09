"use client";

import React from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Clock,
  Star,
  Target,
  Users,
  BarChart,
  Rocket,
  Zap,
} from "lucide-react";

interface ServerMission {
  id: string;
  title: string;
  points: number;
  status: "pending" | "in-progress" | "completed";
}

// Sample mission data
const missionsData: ServerMission[] = [
  {
    id: "defineMetrics",
    title: "Define Success Metrics",
    points: 100,
    status: "completed",
  },
  {
    id: "sketchFlow",
    title: "Sketch User Flow",
    points: 150,
    status: "in-progress",
  },
  {
    id: "aiStrategy",
    title: "AI Implementation Strategy",
    points: 200,
    status: "pending",
  },
  {
    id: "innovation",
    title: "Innovation Workshop",
    points: 250,
    status: "pending",
  },
];

// Icon mapping for different mission types
const getIconByMissionId = (id: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    defineMetrics: BarChart,
    sketchFlow: Users,
    aiStrategy: Zap,
    innovation: Rocket,
    default: Target,
  };

  return iconMap[id] || iconMap.default;
};

const StatusBadge = ({ status }: { status: ServerMission["status"] }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          text: "Completed",
          className:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "in-progress":
        return {
          icon: Clock,
          text: "In Progress",
          className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      case "pending":
        return {
          icon: Star,
          text: "Pending",
          className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
    }
  };

  const config = getStatusConfig()!;
  const StatusIcon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${config.className}`}
    >
      <StatusIcon className="w-3.5 h-3.5" />
      <span>{config.text}</span>
    </div>
  );
};

const MissionCard = ({
  mission,
  index,
}: {
  mission: ServerMission;
  index: number;
}) => {
  const IconComponent = getIconByMissionId(mission.id);
  const isCompleted = mission.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative"
    >
      {/* subtle top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-border/60">
        {/* soft gradient glow on hover */}
        <div className="pointer-events-none absolute -inset-px opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(600px circle at var(--x,80%) var(--y,20%), color-mix(in oklab, var(--color-primary) 25%, transparent), transparent 40%)" }} />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center rounded-xl size-11 bg-primary/12 ring-1 ring-primary/25 text-primary">
                <IconComponent className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground leading-tight">
                  {mission.title}
                </h3>
                <div className="mt-2">
                  <StatusBadge status={mission.status} />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground">Points</div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary ring-1 ring-primary/20">
                <span className="text-sm font-bold">{mission.points}</span>
              </div>
              {isCompleted && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="size-3.5" />
                  <span className="text-xs">Done</span>
                </div>
              )}
            </div>
          </div>

          {/* subtle divider */}
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

          {/* tiny progress hint line under card based on status */}
          <div className="mt-4 h-1 w-full rounded-full bg-muted/40 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                mission.status === "completed"
                  ? "bg-emerald-400/70"
                  : mission.status === "in-progress"
                  ? "bg-primary/70"
                  : "bg-amber-400/70"
              }`}
              style={{
                width:
                  mission.status === "completed"
                    ? "100%"
                    : mission.status === "in-progress"
                    ? "55%"
                    : "20%",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OurMissions = () => {
  const totalPoints = missionsData.reduce(
    (sum, mission) => sum + mission.points,
    0
  );

  return (
    <section className="relative py-24 overflow-hidden">

      <div className="relative z-10 container max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Missions
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your AI transformation progress and earn rewards for every milestone.
          </p>
        </motion.div>

        {/* Mission List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {missionsData.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} index={index} />
          ))}
        </div>

        {/* Total Points */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/12 to-primary/5 px-7 py-4 shadow-lg backdrop-blur">
            <Star className="size-6 text-primary drop-shadow" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground font-medium">
                Total Points
              </div>
              <div className="text-2xl font-extrabold text-primary">
                {totalPoints}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};