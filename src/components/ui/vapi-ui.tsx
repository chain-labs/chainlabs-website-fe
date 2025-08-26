"use client";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState, useMemo } from "react";
import {
	Mic,
	Volume2,
	VolumeX,
	PhoneOff,
	Bot,
	Loader2,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import { useVapi } from "@/hooks/use-vapi";

function useIsMobile() {
	const [m, setM] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 640px)");
		const fn = () => setM(mq.matches);
		fn();
		mq.addEventListener("change", fn);
		return () => mq.removeEventListener("change", fn);
	}, []);
	return m;
}

function formatDuration(ms: number) {
	if (!ms) return "00:00";
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

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
						className="w-[4px] md:w-[5px] rounded-full bg-gradient-to-b from-primary/90 to-primary/30"
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
		transcripts,
		toggle,
		mute,
		muted,
		durationMs,
		error,
	} = useVapi();
	const latestRef = useRef<HTMLDivElement | null>(null);
	const isMobile = useIsMobile();

	// MOVE useMemo ABOVE early return
	const recentTranscripts = useMemo(
		() => transcripts.slice(-8),
		[transcripts]
	);

	useEffect(() => {
		latestRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [transcripts]);

	const [open, setOpen] = useState(!isMobile);
	useEffect(() => {
		setOpen(!isMobile);
	}, [isMobile]);

	// Instead of early return, render nothing later if not ready
	const phaseLabels = {
		connecting: "Connecting",
		listening: "Listening",
		thinking: "Thinking",
		speaking: "Speaking",
		live: "Live",
		ended: "Ended",
		error: "Error",
		idle: "Idle",
	} as const;
	type PhaseKey = keyof typeof phaseLabels;
	const phaseLabel = phaseLabels[phase as PhaseKey] ?? "Idle";

	return (
		<AnimatePresence initial={false}>
			{ready && (
				<motion.div
					key="assistant-shell"
					className={[
						"fixed z-40",
						isMobile
							? "bottom-4 right-4 left-4"
							: "bottom-8 right-8 w-[400px] max-w-[90vw]",
					].join(" ")}
					initial={{ opacity: 0, scale: 0.92, y: 12 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.92, y: 12 }}
					transition={{ duration: 0.3 }}
				>
					{/* Collapsed pill */}
					{!open && (
						<motion.button
							layout
							onClick={() => setOpen(true)}
							className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-background/75 backdrop-blur-md border border-primary/25 shadow-lg hover:border-primary/40 transition"
							aria-expanded={open}
							aria-label="Expand voice assistant"
						>
							<span className="flex items-center gap-2">
								<span
									className={[
										"h-2 w-2 rounded-full",
										inCall
											? "bg-primary animate-pulse"
											: phase === "error"
											? "bg-red-500"
											: "bg-muted",
									].join(" ")}
								/>
								<span className="text-sm font-medium">
									{inCall ? phaseLabel : "Voice Assistant"}
								</span>
							</span>
							<span className="flex items-center gap-2">
								{connecting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : inCall ? (
									<Bot className="h-4 w-4" />
								) : (
									<Mic className="h-4 w-4" />
								)}
								<ChevronUp className="h-4 w-4 opacity-70" />
							</span>
						</motion.button>
					)}

					{/* Expanded Panel */}
					{open && (
						<motion.div
							layout
							key="panel"
							className="relative rounded-2xl bg-background/80 backdrop-blur-xl border border-primary/25 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)] flex flex-col"
							initial={{ opacity: 0, y: 10, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.96 }}
							transition={{ duration: 0.28, ease: "easeOut" }}
						>
							{/* Header */}
							<div className="flex items-center gap-3 px-4 py-3 border-b border-primary/15">
								<div className="relative">
									<div
										className={[
											"h-10 w-10 rounded-xl flex items-center justify-center",
											inCall
												? "bg-gradient-to-br from-primary to-emerald-400 text-black"
												: "bg-primary/15 text-primary",
										].join(" ")}
									>
										{connecting ? (
											<Loader2 className="h-5 w-5 animate-spin" />
										) : (
											<Bot className="h-5 w-5" />
										)}
									</div>
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-sm font-semibold leading-tight">
										AI Voice Assistant
									</span>
									<span className="text-[11px] tracking-wide uppercase flex items-center gap-1 text-primary/80">
										<span
											className={[
												"h-1.5 w-1.5 rounded-full",
												inCall
													? "bg-primary animate-pulse"
													: phase === "error"
													? "bg-red-500"
													: "bg-muted",
											].join(" ")}
										/>
										{phaseLabel}
										{inCall && (
											<span className="ml-1 text-[10px] font-medium text-muted-foreground">
												{formatDuration(durationMs)}
											</span>
										)}
									</span>
								</div>
								<div className="ml-auto flex items-center gap-2">
									<button
										onClick={() => mute(!muted)}
										className={[
											"rounded-lg px-2.5 py-2 text-[11px] font-medium flex items-center gap-1.5 border transition",
											muted
												? "border-primary/30 bg-primary/10 text-primary"
												: "border-primary/20 hover:border-primary/40 text-primary",
										].join(" ")}
										aria-pressed={muted}
										aria-label={
											muted
												? "Unmute audio"
												: "Mute audio"
										}
									>
										{muted ? (
											<>
												<VolumeX className="h-3.5 w-3.5" />{" "}
												Unmute
											</>
										) : (
											<>
												<Volume2 className="h-3.5 w-3.5" />{" "}
												Mute
											</>
										)}
									</button>
									<button
										onClick={toggle}
										className={[
											"rounded-lg px-3 py-2 text-[11px] font-semibold flex items-center gap-1.5 transition",
											inCall
												? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow hover:shadow-md"
												: "bg-gradient-to-r from-primary to-emerald-400 text-black shadow hover:shadow-md",
										].join(" ")}
										aria-label={
											inCall
												? "End session"
												: "Start session"
										}
									>
										{inCall ? (
											<>
												<PhoneOff className="h-3.5 w-3.5" />{" "}
												End
											</>
										) : connecting ? (
											<>
												<Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
												Connecting
											</>
										) : (
											<>
												<Mic className="h-3.5 w-3.5" />{" "}
												Start
											</>
										)}
									</button>
									<button
										onClick={() => setOpen(false)}
										className="rounded-lg px-2 py-2 text-muted-foreground hover:text-foreground transition"
										aria-label="Collapse assistant"
									>
										<ChevronDown className="h-4 w-4" />
									</button>
								</div>
							</div>

							{/* Waveform + transcript */}
							<div className="flex flex-col gap-3 px-4 py-3">
								<div className="flex items-center justify-center">
									<Waveform level={audioLevel} bars={10} />
								</div>
								{error && (
									<div className="text-[11px] text-red-400 font-medium">
										{error}
									</div>
								)}
								<div
									className="relative max-h-40 overflow-y-auto rounded-lg bg-primary/5 border border-primary/10 p-3 space-y-2 text-xs leading-relaxed"
									aria-live="polite"
								>
									{recentTranscripts.length === 0 && (
										<div className="text-muted-foreground text-center">
											Tap Start and speak…
										</div>
									)}
									{recentTranscripts.map((t) => (
										<div
											key={t.id}
											className={[
												"flex flex-col gap-0.5 rounded-md px-2 py-1",
												t.role === "user"
													? "bg-primary/10 border border-primary/15 self-start"
													: "bg-emerald-400/10 border border-emerald-400/15 self-end",
											].join(" ")}
										>
											<span className="text-[9px] uppercase tracking-wide opacity-70">
												{t.role === "user"
													? "You"
													: "AI"}
												{!t.final && " …"}
											</span>
											<span className="whitespace-pre-wrap">
												{t.text || (t.final ? "" : "…")}
											</span>
										</div>
									))}
									<div ref={latestRef} />
								</div>
							</div>
						</motion.div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
