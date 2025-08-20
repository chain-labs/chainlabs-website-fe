"use client";

import React from "react";
import { motion } from "motion/react";
import { useGlobalStore } from "@/global-store";
import { Sparkles } from "lucide-react";
import { Process } from "@/types/store";

// ...existing code...
export const ProcessSection = () => {
	const store = useGlobalStore().personalised;
	if (store === null) return;

	const Process: Process[] = [
		...store.personalisation.process,
		{
			name: "Happy Completion 🎉",
			description:
				"We celebrate your results, reflect on wins, and align on next steps with a smile.",
		},
	];

	return (
		<section className="relative py-24 w-full max-w-7xl" id="process">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-center mb-16"
			>
				<h2 className="text-center text-4xl font-bold text-foreground lg:text-5xl mb-4">
					Our{" "}
					<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
						Process
					</span>{" "}
				</h2>
				<p className="mx-auto text-base sm:text-lg text-muted-foreground max-w-2xl">
					A clear, collaborative path from discovery to
					delivery—tailored to your goals.
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
// ...existing code...
