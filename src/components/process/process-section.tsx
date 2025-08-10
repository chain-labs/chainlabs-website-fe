"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, Lightbulb, Wrench, Code, CheckCircle } from "lucide-react";
import { usePersonalized } from "@/hooks/use-personalized"; // added

const processSteps = [
	{
		number: 1,
		title: "Problem Framing",
		subtitle: "(Understand Why)",
		description:
			"Understanding specific challenges and defining the problem space through collaborative discovery.",
		icon: Search,
	},
	{
		number: 2,
		title: "Discovery",
		subtitle: "",
		description:
			"Exploring technical requirements and constraints to establish the foundation for solution design.",
		icon: Lightbulb,
	},
	{
		number: 3,
		title: "Solution Prototyping",
		subtitle: "",
		description:
			"Validating approach with proof-of-concept development and rapid iteration cycles.",
		icon: Wrench,
	},
	{
		number: 4,
		title: "Agile Development and Pilot",
		subtitle: "",
		description:
			"Building and testing iteratively with continuous feedback and refinement throughout.",
		icon: Code,
	},
	{
		number: 5,
		title: "Delivery",
		subtitle: "",
		description:
			"Ensuring successful deployment and handoff with comprehensive documentation and support.",
		icon: CheckCircle,
	},
];

export const ProcessSection = () => {
	// Fetch and hydrate personalized data (headline, goal, missions, case studies)
	const { data, isLoading, error, refresh } = usePersonalized();

	const title = data?.headline ?? "Our Process";
	const subtitle =
		data?.goal?.description ??
		"A refined methodology for delivering exceptional AI solutions";

	return (
		<section className="relative py-24">
			<div className="container mx-auto px-6 max-w-6xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="text-center mb-14"
				>
					<h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground text-base md:text-lg">
						{subtitle}
					</p>

					{/* Lightweight status UI */}
					{isLoading && (
						<p className="mt-2 text-xs text-muted-foreground">
							Loading personalized content…
						</p>
					)}
					{error && (
						<div className="mt-2 flex items-center justify-center gap-3">
							<p className="text-xs text-destructive/90">
								{error}
							</p>
							<button
								type="button"
								onClick={() => void refresh()}
								className="text-xs underline text-primary"
							>
								Retry
							</button>
						</div>
					)}
				</motion.div>

				{/* Grid */}
				<motion.div
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.15 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{processSteps.map((step) => (
						<motion.article
							key={step.number}
							className="group relative rounded-2xl border border-border/50 bg-surface/40 p-6 transition-all duration-300 hover:bg-surface/60 hover:-translate-y-0.5 hover:shadow-sm"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/20 text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
									<step.icon className="h-5 w-5" />
								</div>

								<div className="flex-1">
									<div className="flex items-baseline justify-between gap-3">
										<h3 className="text-base font-medium text-foreground transition-colors duration-300 group-hover:text-primary">
											{step.title}
										</h3>
									</div>

									{step.subtitle && (
										<p className="mt-1 text-xs text-muted-foreground/80">
											{step.subtitle}
										</p>
									)}

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
