"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useGlobalStore } from "@/global-store";
import { Sparkles } from "lucide-react";
import { Process } from "@/types/store";

export const ProcessSection = () => {
	const store = useGlobalStore().personalised;
	const addProcessSectionTime = useGlobalStore(
		(s) => s.addProcessSectionTime
	);
	if (store === null || addProcessSectionTime === null) return;

	// refs for timing
	const visibleStepRef = useRef<string | null>(null);
	const timerStartRef = useRef<number | null>(null);
	const prevStepRef = useRef<string | null>(null);

	const Process: Process[] = [
		...store.personalisation.process,
		{
			name: "Happy Completion 🎉",
			description:
				"We celebrate your results, reflect on wins, and align on next steps with a smile.",
		},
	];

	// intersection-based per-step time tracking
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Find the entry with highest intersection currently visible
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) => b.intersectionRatio - a.intersectionRatio
					)[0];

				const newStepId = visible
					? (visible.target as HTMLElement).dataset.processStepId ||
					  null
					: null;

				// If step changed or none visible
				if (newStepId !== visibleStepRef.current) {
					// Flush previous
					if (prevStepRef.current && timerStartRef.current) {
						const elapsedMs = Date.now() - timerStartRef.current;
						const seconds = Math.floor(elapsedMs / 1000);
						if (seconds > 0)
							addProcessSectionTime(prevStepRef.current, seconds);
					}

					// Start new timer if a step is visible
					if (newStepId) {
						prevStepRef.current = newStepId;
						visibleStepRef.current = newStepId;
						timerStartRef.current = Date.now();
					} else {
						// Nothing visible
						prevStepRef.current = null;
						visibleStepRef.current = null;
						timerStartRef.current = null;
					}
				}
			},
			{
				threshold: [0.25, 0.5, 0.75],
				root: null,
				rootMargin: "0px",
			}
		);

		// Observe all step cards
		const stepEls = document.querySelectorAll("[data-process-step-id]");
		stepEls.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
			// Final flush
			if (prevStepRef.current && timerStartRef.current) {
				const elapsedMs = Date.now() - timerStartRef.current;
				const seconds = Math.floor(elapsedMs / 1000);
				if (seconds > 0)
					addProcessSectionTime(prevStepRef.current, seconds);
			}
		};
	}, [addProcessSectionTime, Process.length]);

	return (
		<section
			className="relative py-16 sm:py-24 lg:py-32 w-full max-w-7xl min-h-fit flex flex-col justify-center items-center"
			id="processes"
		>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 22 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="text-center mb-14"
			>
				<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
					<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
					Process
				</p>
				<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
					Our Proven{" "}
					<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
						AI Delivery Framework
					</span>
				</h2>
				<p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
					A transparent 6‑step path from opportunity discovery to
					scalable deployment— engineered to de‑risk your AI
					investment and accelerate time‑to‑value.
				</p>
			</motion.div>
			{/* Subtle radial ambiance */}
			<div
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(800px circle at 10% 10%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%), radial-gradient(800px circle at 90% 90%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%)",
				}}
			/>

			<div className="container mx-auto px-6 max-w-7xl">
				{/* Grid */}
				<motion.div
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.15 }}
					className="grid gap-6"
					style={{
						gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
					}}
				>
					{Process.map((step, idx) => (
						<motion.article
							id={`process-step-${idx}`}
							data-process-step-id={`process-${idx}`}
							key={`personalised-${idx}`}
							whileHover={{ y: -3, scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							onMouseMove={(e) => {
								const el = e.currentTarget as HTMLDivElement;
								const r = el.getBoundingClientRect();
								const x =
									((e.clientX - r.left) / r.width) * 100;
								const y =
									((e.clientY - r.top) / r.height) * 100;
								el.style.setProperty("--x", `${x}%`);
								el.style.setProperty("--y", `${y}%`);
							}}
							className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300"
						>
							{/* Hover glow */}
							<div
								className="pointer-events-none absolute -inset-px opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
								style={{
									background:
										"radial-gradient(500px circle at var(--x,70%) var(--y,30%), color-mix(in oklab, var(--color-primary, #7c3aed) 24%, transparent), transparent 40%)",
								}}
							/>
							{/* Top accent line */}
							<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

							<div className="relative flex items-start gap-4">
								{/* Step badge */}
								<div className="grid place-items-center size-10 shrink-0 rounded-xl bg-primary/12 ring-1 ring-primary/25 text-primary font-semibold">
									{String(idx + 1).padStart(2, "0")}
								</div>

								<div className="flex-1">
									<div className="flex items-baseline justify-between gap-3">
										<h3 className="text-base font-medium text-foreground transition-colors duration-300 group-hover:text-primary">
											{step.name}
										</h3>
									</div>

									<div className="mt-3 h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />

									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										{step.description}
									</p>
								</div>
							</div>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	);
};
