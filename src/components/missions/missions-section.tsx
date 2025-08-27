"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useGlobalStore } from "@/global-store";
import MissionCard from "./mission-card";

export const OurMissions = () => {
	const store = useGlobalStore().personalised;

	if (store === null || store.personalisation.missions.length === 0)
		return null;

	const totalPoints = 50;

	return (
		<section
			className="relative py-8 sm:py-12 lg:py-16 w-full max-w-7xl min-h-screen flex flex-col justify-center items-center"
			id="missions"
		>
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
					<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
						<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
						Readiness Missions
					</p>
					<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
						Accelerate Your{" "}
						<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
							AI Readiness
						</span>
					</h2>
					<p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
						Complete quick, focused missions to personalize
						recommendations and unlock tailored next steps toward
						tangible AI outcomes.
					</p>
				</motion.div>

				{/* Total Points */}
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
					className="my-12 md:mt-16 text-center mx-auto w-fit"
				>
					<div className="flex w-full flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/12 to-primary/5 px-5 sm:px-7 py-4 sm:py-5 shadow-lg backdrop-blur">
						<div className="flex w-full items-center gap-3 sm:gap-4">
							<Star
								className="size-5 sm:size-6 text-primary drop-shadow shrink-0"
								fill={
									store.personalisation.points_total >=
									totalPoints
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
											aria-valuenow={
												store.personalisation
													.points_total
											}
										>
											<motion.div
												initial={{ width: 0 }}
												whileInView={{
													width: `${Math.min(
														100,
														(store.personalisation
															.points_total /
															Math.max(
																totalPoints,
																1
															)) *
															100
													)}%`,
												}}
												viewport={{ once: true }}
												transition={{
													duration: 0.7,
													ease: "easeOut",
												}}
												className={`h-full rounded-full bg-primary/80`}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Mission List */}
				<div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
			</div>
		</section>
	);
};
