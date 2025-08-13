"use client";

import React from "react";
import { motion } from "motion/react";
import { useGlobalStore } from "@/global-store";
import { Sparkles } from "lucide-react";

// ...existing code...
export const ProcessSection = () => {
	const store = useGlobalStore().personalised;
	if (store === null) return;

	const container = {
		hidden: {},
		show: {
			transition: { staggerChildren: 0.08, delayChildren: 0.1 },
		},
	};

	const item = {
		hidden: { opacity: 0, y: 12, scale: 0.98 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<section className="relative py-24">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
				className="relative text-center mb-16"
			>
				{/* Premium pill */}
				<div className="relative inline-flex mb-8">
					<div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30">
						<div className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-5 py-2 border border-primary/20 text-primary text-sm font-medium">
							<Sparkles className="w-4 h-4" />
							<span>Free AI Strategy Session</span>
						</div>
					</div>
				</div>

				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-br from-foreground via-primary to-foreground/70 bg-clip-text text-transparent"
				>
					{store.personalisation.hero.title}
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.35 }}
					className="text-lg  text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed mt-6"
				>
					{store.personalisation.hero.description}
				</motion.p>
				<motion.div
					initial={{ scaleX: 0, opacity: 0 }}
					whileInView={{ scaleX: 1, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
					style={{ originX: 0.5 }}
					className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
				/>

				{/* Floating sparkles */}
				<motion.div
					aria-hidden
					className="absolute -top-2 left-1/2 -translate-x-[8rem] text-primary/60"
					initial={{ opacity: 0, y: 6 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.45, duration: 0.6 }}
				>
					<Sparkles className="h-5 w-5" />
				</motion.div>
				<motion.div
					aria-hidden
					className="absolute top-1 right-1/2 translate-x-[9rem] text-primary/60"
					initial={{ opacity: 0, y: 6 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.55, duration: 0.6 }}
				>
					<Sparkles className="h-5 w-5" />
				</motion.div>
			</motion.div>

			{/* Subtle radial ambiance */}
			<div
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(800px circle at 10% 10%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%), radial-gradient(800px circle at 90% 90%, color-mix(in oklab, var(--color-primary, #7c3aed) 10%, transparent), transparent 40%)",
				}}
			/>

			<div className="container mx-auto px-6 max-w-6xl">
				{/* Grid */}
				<motion.div
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.15 }}
					variants={container}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{store.personalisation.process.map((step, idx) => (
						<motion.article
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
