"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Confetti } from "@/components/ui/confetti";
import type { ConfettiRef } from "@/components/ui/confetti";
// ...existing code...
import {
	Calendar,
	ArrowRight,
	Sparkles,
	MessageSquare,
	Phone,
	Video,
	Clock,
	Zap,
	Users,
	CheckCircle,
	// ...existing code...
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/global-store";

const BookCallSection = () => {
	const callUnlocked =
		useGlobalStore().personalised?.personalisation.call_unlocked;

	const confettiRef = useRef<ConfettiRef>(null);
	const prevUnlockedRef = useRef<boolean>(callUnlocked);

	// Big celebration: multiple waves + multiple origins for full coverage
	const fireCelebration = () => {
		if (!confettiRef.current) return;

		const origins = [
			{ x: 0.1, y: 0.15 },
			{ x: 0.3, y: 0.1 },
			{ x: 0.5, y: 0.08 },
			{ x: 0.7, y: 0.1 },
			{ x: 0.9, y: 0.15 },
		];

		const waves = 1; // increase for even more confetti
		const interval = 220;

		for (let w = 0; w < waves; w++) {
			setTimeout(() => {
				origins.forEach((origin) => {
					confettiRef.current?.fire({
						particleCount: 120, // increase for denser burst
						spread: 85,
						startVelocity: 55,
						scalar: 0.9,
						origin,
					});
				});
			}, w * interval);
		}

		// Finale burst
		setTimeout(() => {
			confettiRef.current?.fire({
				particleCount: 320,
				spread: 360,
				startVelocity: 60,
				scalar: 1,
				origin: { x: 0.5, y: 0.25 },
			});
		}, waves * interval + 80);
	};

	useEffect(() => {
		// Fire confetti only on transition false -> true
		if (!prevUnlockedRef.current && callUnlocked) {
			fireCelebration();
		}
		prevUnlockedRef.current = callUnlocked;
	}, [callUnlocked]);

	const handleBookCall = (calendarLink: string, callType: string) => {
		// Block interaction when locked
		if (!callUnlocked) return;

		// Track the call booking event
		// if (typeof window !== "undefined" && window.gtag) {
		// 	window.gtag("event", "book_call_click", {
		// 		call_type: callType,
		// 		source: "book_call_section",
		// 	});
		// }

		window.open(calendarLink, "_blank");
	};

	return (
		<section className="relative py-24 overflow-visible">
			{/* Confetti canvas overlay (manual start) */}
			<Confetti
				ref={confettiRef}
				manualstart
				className="pointer-events-none fixed inset-0 w-full h-full z-[60]"
			/>

			<div className="container max-w-7xl mx-auto px-4 relative z-10">
				{/* Locked overlay */}
				{!callUnlocked && (
					<div className="absolute inset-0 z-20 flex items-center justify-center">
						<div className="rounded-2xl bg-background/70 backdrop-blur-md border border-border/50 px-4 py-2 text-sm text-muted-foreground">
							Booking is locked. Complete the required steps to
							unlock.
						</div>
					</div>
				)}

				{/* Wrap content to blur and disable when locked */}
				<div
					className={
						!callUnlocked
							? "pointer-events-none select-none blur-sm opacity-60"
							: ""
					}
				>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
						>
							Ready to{" "}
							<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
								Transform
							</span>{" "}
							Your Business?
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
						>
							Book a free consultation with our AI experts. No
							sales pitch, just valuable insights and a custom
							roadmap tailored to your business goals.
						</motion.p>
					</motion.div>

					{/* Features Grid */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.5 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
					>
						{/* ...existing code... */}
					</motion.div>

					{/* Bottom CTA */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 1 }}
						className="text-center"
					>
						<div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-surface/80 to-surface-muted/80 backdrop-blur-sm border border-border/50">
							<div className="flex items-center justify-center gap-2 mb-4">
								<Calendar className="w-5 h-5 text-primary" />
								<span className="text-sm font-medium text-muted-foreground">
									Available Monday - Friday, 9 AM - 6 PM EST
								</span>
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								Not sure which option is right for you?
							</h3>
							<p className="text-muted-foreground mb-6">
								Start with a quick chat and we'll recommend the
								best next steps for your specific needs.
							</p>
							<Button
								onClick={() =>
									handleBookCall(
										"https://cal.com/chainlabs/quick-chat",
										"General Consultation"
									)
								}
								variant="outline"
								size="lg"
								disabled={!callUnlocked}
								aria-disabled={!callUnlocked}
								className="border-primary/30 hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
							>
								Schedule Quick Chat
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export { BookCallSection };
