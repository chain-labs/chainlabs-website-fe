"use client";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useMemo } from "react";
import { Mic } from "lucide-react";
import { useVapi } from "@/hooks/use-vapi";
import { useGlobalStore } from "@/global-store";

function Waveform({ level, bars }: { level: number; bars: number }) {
	const seeds = useRef(
		Array.from({ length: bars }, () => 0.4 + Math.random() * 0.9)
	);
	return (
		<div className="flex h-10 items-end justify-center gap-[3px]">
			{seeds.current.map((m, i) => {
				const h = 4 + level * 52 * m;
				return (
					<motion.span
						key={i}
						aria-hidden
						className="w-[4px] md:w-[5px] rounded-full bg-gradient-to-b from-black/80 to-black/30"
						style={{ height: h }}
						animate={{
							scaleY: [
								0.6,
								1 + level * m,
								0.7 + level * 0.5,
								1 + level * m,
							],
						}}
						transition={{
							duration: 0.9 + m * 0.25,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.012,
						}}
					/>
				);
			})}
		</div>
	);
}

export function VoiceAssistantUI() {
	const {
		ready,
		phase,
		inCall,
		connecting,
		audioLevel,
		toggle,
		transcripts,
	} = useVapi();
	const { personalised } = useGlobalStore(); // adapt to actual store fields

	const isSpeaking =
		phase === "speaking" || phase === "thinking" || connecting;

	// Build personalization text from available data
	const personalizationText = useMemo(() => {
		if (!personalised) return "";
		const p = personalised.personalisation;
		const parts: string[] = [];
		if (p.goal) parts.push(`Goal: ${p.goal}`);
		if (p.hero?.title)
			parts.push(
				`Hero: ${p.hero.title}${
					p.hero.description ? " — " + p.hero.description : ""
				}`
			);
		if (p.process?.length)
			parts.push(
				"Process steps: " + p.process.map((st) => st.name).join(", ")
			);
		if (p.caseStudies?.length)
			parts.push(
				"Case studies: " + p.caseStudies.map((c) => c.title).join("; ")
			);
		if (p.missions?.length)
			parts.push(
				"Missions: " +
					p.missions.map((m) => `${m.title} (${m.status})`).join(", ")
			);
		if (p.why) parts.push("Why: " + p.why);
		if (p.whyThisCaseStudiesWereSelected)
			parts.push(
				"Case study rationale: " + p.whyThisCaseStudiesWereSelected
			);
		return parts.join("\n");
	}, [personalised]);

	// Section synonyms map (add/remove as needed)
	const sectionMap = useMemo(
		() =>
			({
				hero: ["home", "top", "start"],
				process: ["process", "how it works", "steps"],
				testimonials: ["testimonials", "reviews", "feedback"],
				cases: ["case studies", "cases", "portfolio"],
				missions: ["missions", "tasks", "next steps"],
				booking: ["book", "call", "schedule", "meeting"],
			} as Record<string, string[]>),
		[]
	);

	// Scroll trigger on user final transcript
	useEffect(() => {
		if (!transcripts?.length) return;
		const latest = transcripts[transcripts.length - 1];
		if (!latest.final || latest.role !== "user") return;

		const text = latest.text.toLowerCase();

		for (const [id, synonyms] of Object.entries(sectionMap)) {
			if (
				synonyms.some((s) => text.includes(s)) ||
				text.includes(id.replace(/[-_]/g, " "))
			) {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "start" });
				}
				break;
			}
		}
	}, [transcripts, sectionMap]);

	const handleClick = () => {
		toggle({
			personalizationText,
			sections: sectionMap,
			templateVariables: {
				user_goal: personalised?.personalisation?.goal || "",
			},
		});
	};

	return (
		<AnimatePresence>
			{ready && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<motion.button
						onClick={handleClick}
						className="relative flex items-center justify-center bg-white text-black rounded-full shadow-xl border border-neutral-200 transition focus:outline-none"
						style={{
							width: "320px",
							height: "90px",
							fontSize: "1.5rem",
							fontWeight: 600,
							letterSpacing: "0.01em",
						}}
						aria-label="Talk with AI"
					>
						{isSpeaking ? (
							<span className="absolute left-8">
								<Waveform level={audioLevel} bars={8} />
							</span>
						) : (
							<span className="absolute left-8">
								<Mic className="h-8 w-8 opacity-70" />
							</span>
						)}
						<span className="mx-auto">Talk with AI</span>
					</motion.button>
				</div>
			)}
		</AnimatePresence>
	);
}
