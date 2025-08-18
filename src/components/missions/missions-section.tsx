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
import { useMissions } from "@/hooks/use-missions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

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

		// Local UI state for this card's input
		const [answer, setAnswer] = React.useState("");

		// Hook: centralize submit, status, errors
		const {
			submitAnswer,
			getMissionStatus,
			hasCompleted,
			isSubmitting,
			getError,
		} = useMissions();

		// Detect mission interaction type from id prefix
		const id = String(mission.id);
		const isClickMission =
			id.startsWith("cs_mission_") || id.startsWith("view_process_");
		const isInputMission = id.startsWith("input_") || !isClickMission;

		const onMouseMove = (e: React.MouseEvent) => {
			const el = containerRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;
			el.style.setProperty("--x", `${x}%`);
			el.style.setProperty("--y", `${y}%`);
		};

		const completed = hasCompleted(mission.id);
		const submitting = isSubmitting(mission.id);
		const error = getError(mission.id);

		// Use latest status from store (falls back to prop)
		const currentStatus =
			(getMissionStatus(mission.id) as Status) ??
			((mission as any).status as Status);

		// Treat typing as "in-progress" visually for input-type missions only
		const visualStatus =
			isInputMission &&
			answer.trim().length > 0 &&
			currentStatus !== "completed"
				? ("in-progress" as Status)
				: (currentStatus as Status);
		const visualMeta = prettyStatus(visualStatus);

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			if (!answer.trim() || submitting) return;

			try {
				await submitAnswer(mission.id, answer.trim());
				setAnswer("");
			} catch {
				// Error state is set inside the hook; no-op here
			}
		};

		const handleClickComplete = async () => {
			if (completed || submitting) return;
			try {
				// For click-only missions, a simple action marks completion
				await submitAnswer(mission.id, "");
			} catch {
				// Error is handled by the hook
			}
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
				className="group relative max-w-7xl"
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
							<div className="grid items-center gap-4">
								<div className="grid place-items-center rounded-xl size-11 bg-primary/12 ring-1 ring-primary/25 text-primary">
									<IconComponent
										className="size-5"
										aria-hidden="true"
										focusable="false"
									/>
								</div>
								<div>
									<h3 className="text-base font-semibold text-foreground leading-tight">
										{mission.title ?? "Untitled mission"}
									</h3>
									{mission.description ? (
										<p className="mt-1 text-sm text-muted-foreground">
											{mission.description}
										</p>
									) : null}
									<div className="mt-2">
										<StatusBadge status={visualStatus} />
									</div>
								</div>
							</div>

							<div className="text-right">
								<div className="text-xs text-muted-foreground">
									Points
								</div>
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

						{/* Divider */}
						<div className="mt-5 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

						{/* Progress */}
						<div className="mt-4 h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								whileInView={{
									width: `${visualMeta.progress}%`,
								}}
								viewport={{ once: true }}
								transition={{ duration: 0.7, ease: "easeOut" }}
								className={`h-full rounded-full ${visualMeta.bar}`}
							/>
						</div>

						{/* Interaction */}
						{isInputMission ? (
							<form
								onSubmit={handleSubmit}
								className="mt-5 space-y-3"
							>
								<label
									htmlFor={`mission-answer-${mission.id}`}
									className="sr-only"
								>
									Answer for mission {mission.title}
								</label>

								<div
									className={`relative rounded-2xl border transition-colors focus-within:ring-2 ${
										error
											? "border-red-500/60 focus-within:ring-red-500/30"
											: "border-border/40 focus-within:ring-primary/30 focus-within:border-primary/50"
									} bg-black/5 backdrop-blur-xl ${
										completed ? "opacity-70" : ""
									}`}
								>
									<Textarea
										id={`mission-answer-${mission.id}`}
										value={answer}
										onChange={(e) =>
											setAnswer(e.target.value)
										}
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												(e.metaKey || e.ctrlKey)
											) {
												e.preventDefault();
												(
													e.currentTarget
														.form as HTMLFormElement | null
												)?.requestSubmit();
											}
										}}
										placeholder={
											completed
												? "This mission is completed."
												: "Share your thoughts, links, or notes…"
										}
										disabled={completed || submitting}
										maxLength={280}
										aria-invalid={!!error}
										aria-describedby={`mission-help-${
											mission.id
										} ${
											error
												? `mission-error-${mission.id}`
												: ""
										}`}
										className="w-full rounded-2xl bg-transparent  py-3 min-h-24 resize-y text-base leading-relaxed placeholder:text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed"
									/>
								</div>

								<div className="flex items-center justify-between gap-3">
									<div className="min-h-5 text-xs">
										{error ? (
											<span
												id={`mission-error-${mission.id}`}
												className="text-red-500"
												aria-live="polite"
											>
												{error}
											</span>
										) : (
											<span
												id={`mission-help-${mission.id}`}
												className="text-muted-foreground"
											>
												This will help us to understand
												you more
											</span>
										)}
									</div>

									<div className="flex items-center gap-2">
										<span
											className={`text-xs tabular-nums ${
												answer.length > 260
													? "text-amber-600"
													: "text-muted-foreground"
											}`}
										>
											{answer.length}/280
										</span>
										{answer && !completed && !submitting ? (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => setAnswer("")}
											>
												Clear
											</Button>
										) : null}
										<Button
											type="submit"
											size="sm"
											disabled={
												completed ||
												submitting ||
												!answer.trim()
											}
										>
											{completed
												? "Completed"
												: submitting
												? "Submitting..."
												: "Submit"}
										</Button>
									</div>
								</div>
							</form>
						) : (
							<div className="mt-5 flex items-center justify-between gap-3">
								<div className="min-h-5 text-xs">
									{error ? (
										<span
											id={`mission-error-${mission.id}`}
											className="text-red-500"
											aria-live="polite"
										>
											{error}
										</span>
									) : (
										<span
											className="text-muted-foreground"
											id={`mission-help-${mission.id}`}
										>
											Click to complete this step
										</span>
									)}
								</div>
								<Button
									type="button"
									size="sm"
									onClick={handleClickComplete}
									disabled={completed || submitting}
								>
									{completed
										? "Completed"
										: submitting
										? "Submitting..."
										: "Complete"}
								</Button>
							</div>
						)}
					</div>
				</motion.div>
			</motion.div>
		);
	}
);

export const OurMissions = () => {
	const store = useGlobalStore().personalised;

	if (store === null || store.personalisation.missions.length === 0)
		return null;

	const totalPoints = 50;

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
					className="mt-12 md:mt-16 text-center max-w-fit mx-auto"
				>
					<div className="flex w-full flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/12 to-primary/5 px-5 sm:px-7 py-4 sm:py-5 shadow-lg backdrop-blur">
						<div className="flex w-full items-center gap-3 sm:gap-4">
							<Star
								className="size-5 sm:size-6 text-primary drop-shadow shrink-0"
								fill={
									store.personalisation.points_total >= totalPoints
										? "currentColor"
										: "none"
								}
							/>
							<div className="min-w-0 flex-1 text-left">
								<div className="text-sm text-muted-foreground font-medium">
									Points Earned to Unlock Call
								</div>
								<div className="mt-1 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
									<div className="text-2xl font-extrabold text-primary leading-tight whitespace-nowrap">
										{store.personalisation.points_total}
										<span className="ml-1 text-foreground/60 text-base font-semibold">
											/ {totalPoints}
										</span>
									</div>
									<div className="w-full sm:w-56">
										<div
											className="h-2 rounded-full bg-muted/40 overflow-hidden"
											role="progressbar"
											aria-label="Points progress to unlock call"
											aria-valuemin={0}
											aria-valuemax={totalPoints}
											aria-valuenow={store.personalisation.points_total}
										>
											<div
												className="h-full rounded-full bg-primary/80"
												style={{
													width: `${
														Math.min(
															100,
															(store.personalisation.points_total /
																Math.max(totalPoints, 1)) *
																100
														)
													}%`,
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
