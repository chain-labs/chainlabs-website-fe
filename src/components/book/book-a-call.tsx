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

import Cal, { getCalApi } from "@calcom/embed-react";
import { cn } from "@/lib/utils";

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

	useEffect(() => {
		(async function () {
			const cal = await getCalApi({ namespace: "15min" });
			cal("ui", {
				cssVarsPerTheme: {
					light: { "cal-brand": "#5cfda2" },
					dark: { "cal-brand": "#5cfda2" },
				},
				hideEventTypeDetails: true,
				layout: "month_view",
			});

			cal("on", {
				action: "bookingSuccessful",
				callback: (e) => {
					// `data` is properties for the event.
					// `type` is the name of the action(You can also call it type of the action.) This would be same as "ANY_ACTION_NAME" except when ANY_ACTION_NAME="*" which listens to all the events.
					// `namespace` tells you the Cal namespace for which the event is fired/
					const { data } = e.detail;
					const { id, uid } = data.booking as {
						id: string;
						uid: string;
					};
					// https://app.cal.com/reschedule/pxi4NKNWRREcFxxrZda7RJ?rescheduledBy=pratham%40chainlabs.in
				},
			});
		})();
	}, []);

	return (
		<section className="relative py-8 sm:py-12 lg:py-16 w-full max-w-7xl min-h-screen flex flex-col justify-center items-center" id="book-a-call">
			{/* Confetti canvas overlay (manual start) */}
			<Confetti
				ref={confettiRef}
				manualstart
				className="pointer-events-none fixed inset-0 w-full h-full z-[60]"
			/>

			<div className="container max-w-7xl w-full mx-auto px-4 relative z-10">
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
					className={cn(
						!callUnlocked
							? "pointer-events-none select-none blur-sm opacity-60"
							: "",
						"w-full"
					)}
				>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center max-w-4xl mx-auto mb-18"
					>
						<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
							<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
							Get Started
						</p>
						<motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
							Book Your{" "}
							<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
								AI Strategy Session
							</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
						>
							A 15‑minute diagnostic to surface quick wins,
							clarify feasibility, and map an actionable pilot—no
							sales fluff, just value.
						</motion.p>
					</motion.div>

					{/* @ts-ignore */}
					<Cal
						namespace="15min"
						calLink="pratham-chudasama-bzmppi/15min"
						style={{
							width: "100%",
							height: "100%",
						}}
						config={{ layout: "month_view", theme: "auto" }}
					/>
				</div>
			</div>
		</section>
	);
};

export { BookCallSection };

{
	/* Bottom CTA */
}
{
	/* <motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 1 }}
						className="text-center"
					>
						<div className="w-full max-w-2xl mx-auto p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-surface/80 to-surface-muted/80 backdrop-blur-sm border border-border/50">
							<div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
								<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
								<span className="text-xs sm:text-sm font-medium text-muted-foreground">
									Available Monday - Friday, 9 AM - 6 PM EST
								</span>
							</div>
							<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2.5 sm:mb-3">
								Not sure which option is right for you?
							</h3>
							<p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
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
								className="w-full sm:w-auto justify-center border-primary/30 hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
							>
								Schedule Quick Chat
								<ArrowRight className="w-4 h-4 ml-1.5 sm:ml-2" />
							</Button>
						</div>
					</motion.div> */
}
