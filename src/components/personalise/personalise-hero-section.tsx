"use client";

import { useGlobalStore } from "@/global-store";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import LightRays from "../ui/light-rays";
import { useEffect } from "react";
import { VoiceAssistantUI } from "../ui/vapi-ui";
import VapiSection from "../vapi/vapi-section";

export default function PersonaliseHeroSection() {
	const store = useGlobalStore().personalised;
	if (store === null) return null;

	// Subtle auto-scroll demo after 5s of no user interaction
	useEffect(() => {
		if (typeof window === "undefined") return;

		const sessionKey = "scroll-demo-shown";
		if (sessionStorage.getItem(sessionKey) === "1") return;

		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		if (prefersReduced.matches) return;

		let canceled = false;
		let demoStarted = false;
		let timers: number[] = [];

		const clearTimers = () => {
			timers.forEach((id) => clearTimeout(id));
			timers = [];
		};

		const cancel = () => {
			canceled = true;
			clearTimers();
			removeListeners();
		};

		const onKey = (e: KeyboardEvent) => {
			// Any key commonly used to scroll cancels the demo
			const keys = [
				"ArrowDown",
				"ArrowUp",
				"PageDown",
				"PageUp",
				"Home",
				"End",
				" ",
			];
			if (keys.includes(e.key)) cancel();
		};

		const onUserInteract = () => cancel();

		const addListeners = () => {
			window.addEventListener("wheel", onUserInteract, { passive: true });
			window.addEventListener("touchstart", onUserInteract, {
				passive: true,
			});
			window.addEventListener("pointerdown", onUserInteract, {
				passive: true,
			});
			window.addEventListener("keydown", onKey);
			prefersReduced.addEventListener?.("change", cancel as any);
		};

		const removeListeners = () => {
			window.removeEventListener("wheel", onUserInteract);
			window.removeEventListener("touchstart", onUserInteract);
			window.removeEventListener("pointerdown", onUserInteract);
			window.removeEventListener("keydown", onKey);
			prefersReduced.removeEventListener?.("change", cancel as any);
		};

		addListeners();

		timers.push(
			window.setTimeout(() => {
				if (canceled || demoStarted) return;
				demoStarted = true;

				const startY = window.scrollY || 0;
				const maxScroll =
					Math.max(
						document.documentElement.scrollHeight,
						document.body.scrollHeight
					) - window.innerHeight;

				// Only run if at (or near) top and page can scroll
				if (startY > 2 || maxScroll <= 0) {
					cancel();
					return;
				}

				const offset = Math.min(160, Math.max(0, maxScroll - startY));
				if (offset < 24) {
					cancel();
					return;
				}

				// Scroll down subtly, then back up
				window.scrollTo({ top: startY + offset, behavior: "smooth" });
				timers.push(
					window.setTimeout(() => {
						if (!canceled) {
							window.scrollTo({
								top: startY,
								behavior: "smooth",
							});
						}
						sessionStorage.setItem(sessionKey, "1");
						removeListeners();
					}, 900) // allow time to move down before returning
				);
			}, 5000)
		);

		return () => {
			clearTimers();
			removeListeners();
		};
	}, []);

	return (
		<section
			className="relative px-4 font-sans antialiased z-0 w-full"
			id="hero"
		>
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<LightRays
					raysOrigin="top-center"
					raysColor="#5cfda2"
					raysSpeed={1.5}
					lightSpread={0.8}
					rayLength={1}
					followMouse={true}
					mouseInfluence={0.1}
					noiseAmount={0.1}
					distortion={0.01}
					className="absolute w-screen h-auto"
				/>
			</div>
			<div className="py-24 min-h-screen flex flex-col justify-center items-center mx-auto max-w-sm md:max-w-6xl md:px-8 lg:px-12">
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
						className="text-4xl md:text-5xl font-bold leading-tight text-white"
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
						transition={{
							duration: 0.7,
							delay: 0.35,
							ease: "easeOut",
						}}
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
				{/* <VoiceAssistantUI /> */}
				<VapiSection />
			</div>
		</section>
	);
}
