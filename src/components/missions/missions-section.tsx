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
import { useGlobalStore } from "@/global-store";
import { Mission } from "@/types/store";

type Status = Mission extends { status: infer S } ? S : string;

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

const iconPool = [Target, Rocket, Users, BarChart, Zap];

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

const MissionCard = React.memo(
	({ mission, index }: { mission: Mission; index: number }) => {
		const containerRef = React.useRef<HTMLDivElement | null>(null);
		const IconComponent = iconPool[index % iconPool.length];
		// Replace 'status' with the correct property name if it differs, e.g., 'mission.state'
		const meta = prettyStatus(
			(mission as any).status ?? ("not-started" as Status)
		);

		const onMouseMove = (e: React.MouseEvent) => {
			const el = containerRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;
			el.style.setProperty("--x", `${x}%`);
			el.style.setProperty("--y", `${y}%`);
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
				className="group relative"
				role="listitem"
			>
				{/* Top accent line */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

				<motion.div
					ref={containerRef}
					onMouseMove={onMouseMove}
					whileHover={{ y: -2 }}
					transition={{ type: "spring", stiffness: 350, damping: 30 }}
					className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300 hover:shadow-2xl hover:border-border/60"
				>
					{/* Hover glow following cursor */}
					<div
						className="pointer-events-none absolute -inset-px opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
						style={{
							background:
								"radial-gradient(500px circle at var(--x,70%) var(--y,30%), color-mix(in oklab, var(--color-primary, #7c3aed) 28%, transparent), transparent 40%)",
						}}
					/>

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
										<StatusBadge
											status={
												(mission as any)
													.status as Status
											}
										/>
									</div>
								</div>
							</div>

							<div className="text-right">
								<div className="text-xs text-muted-foreground">
									Points
								</div>
								<div className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary ring-1 ring-primary/20">
									<span className="text-sm font-bold">
										{mission.points}
									</span>
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="mt-5 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

						{/* Progress */}
						<div className="mt-4 h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								whileInView={{ width: `${meta.progress}%` }}
								viewport={{ once: true }}
								transition={{ duration: 0.7, ease: "easeOut" }}
								className={`h-full rounded-full ${meta.bar}`}
							/>
						</div>
					</div>
				</motion.div>
			</motion.div>
		);
	}
);
MissionCard.displayName = "MissionCard";

// ...existing code...

export const OurMissions = () => {
	const store = useGlobalStore().personalised;

	if (store === null || store.personalisation.missions.length === 0)
		return null;

	const totalPoints = store.personalisation.missions.reduce(
		(sum, mission) => sum + mission.points,
		0
	);

	return (
		<section className="relative py-24 overflow-hidden">
			{/* Background glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(800px circle at 10% 10%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%), radial-gradient(800px circle at 90% 90%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%)",
				}}
			/>

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
						Track your AI transformation and earn rewards for every
						milestone.
					</p>
				</motion.div>

				{/* Mission List */}
				<div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
					role="list"
				>
					{store.personalisation.missions.map((mission, index) => (
						<MissionCard
							key={mission.id}
							mission={mission}
							index={index}
						/>
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
