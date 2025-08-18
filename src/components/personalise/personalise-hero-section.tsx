"use client";

import { useGlobalStore } from "@/global-store";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function PersonaliseHeroSection() {
	const store = useGlobalStore().personalised;
	if (store === null) return null;
	return (
		<section className="relative py-24 min-h-screen flex justify-center items-center">
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
		</section>
	);
}
