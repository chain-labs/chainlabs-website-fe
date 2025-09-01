"use client";
import React, { useState, useEffect, useMemo } from "react";
import Vapi from "@vapi-ai/web";
import { buildPersonalizationText } from "@/components/vapi/vapi";
import { useGlobalStore } from "@/global-store";
import { Mic, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";

export default function VapiSection() {
	const [vapi, setVapi] = useState<Vapi | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isEnding, setIsEnding] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [transcript, setTranscript] = useState<
		Array<{ role: string; text: string; ts: number }>
	>([]);
	const personalizedContent = buildPersonalizationText(
		useGlobalStore((s) => s.personalised)
	);

	// Compose an optimized voice-oriented system prompt using personalization
	const voiceSystemPrompt = useMemo(() => {
		return `You are ChainLabs Voice Assistant — a helpful, friendly AI consultant for website visitors.

				Goals
				- Understand the user's business goals and constraints.
				- Offer clear, practical next steps tailored to their context.
				- Keep responses concise for voice: 1–3 short sentences or a 3-point list.

				Voice Guidelines
				- Speak clearly and naturally; avoid long monologues.
				- If user interrupts, adapt and finish the most relevant point.
				- Convert links, numbers, and jargon into listener-friendly descriptions.

				When Navigating
				- If the user asks to view a section (e.g., testimonials), reply briefly like: "Sure — showing testimonials now." The UI handles scrolling/navigation.

				If Uncertain
				- Be honest. Offer a short suggestion for how to proceed.

				Personalization Context
				${personalizedContent || "(No personalization provided)"}

				Response Pattern
				- Brief acknowledgement → direct answer → 1–2 suggested next steps.
				- Prefer numbered lists when listing options.
				`;
	}, [personalizedContent]);

	const initatingVapi = () => {
		const vapiInstance = new Vapi(apiKey);
		setVapi(vapiInstance);
		// Event listeners
		vapiInstance.on("call-start", () => {
			console.log("Call started");
			setIsConnected(true);
			setIsConnecting(false);
			setIsEnding(false);
		});
		vapiInstance.on("call-end", () => {
			console.log("Call ended");
			setIsConnected(false);
			setIsSpeaking(false);
			setIsConnecting(false);
			setIsEnding(false);
		});
		vapiInstance.on("speech-start", () => {
			console.log("Assistant started speaking");
			setIsSpeaking(true);
		});
		vapiInstance.on("speech-end", () => {
			console.log("Assistant stopped speaking");
			setIsSpeaking(false);
		});
		vapiInstance.on("message", (message) => {
			if (message.type === "transcript") {
				setTranscript((prev) => [
					...prev,
					{
						role: message.role,
						text: message.transcript,
						ts: Date.now(),
					},
				]);
			}
		});
		vapiInstance.on("error", (error) => {
			console.error("Vapi error:", error);
			setIsConnecting(false);
			setIsEnding(false);
		});
	};

	useEffect(() => {
		initatingVapi();
		return () => {
			vapi?.stop();
		};
	}, [apiKey]);

	// Track time spent on active Vapi call and store in session
	useEffect(() => {
		let interval: number | null = null;
		// Only track time if call has started and isConnected is true
		if (isConnected && transcript.length > 0) {
			interval = window.setInterval(() => {
				try {
					useGlobalStore.getState().addVapiTime(1);
				} catch {}
			}, 1000);
		}
		return () => {
			if (interval) window.clearInterval(interval);
		};
	}, [isConnected, transcript.length]);

	const startCall = () => {
		if (vapi) {
			// Close AI chat bubble if open (avoid UI overlap)
			try {
				window.dispatchEvent(new Event("chainlabs:close-ai-chat"));
			} catch {}
			setIsConnecting(true);
			vapi.start({
				// Basic assistant configuration

				model: {
					provider: "openai",
					model: "gpt-4o",
					maxTokens: 250,
					temperature: 0.5,
					messages: [
						{
							role: "system",
							content: voiceSystemPrompt,
						},
					],
				},
				// Voice configuration
				voice: {
					provider: "vapi",
					voiceId: "Elliot",
				},

				// Transcriber configuration
				transcriber: {
					provider: "deepgram",
					model: "nova-2",
					language: "en-US",
				},
				// Call settings
				firstMessage:
					"Hi there! I am ChainLabs Voice Assistant. How can I assist you today?",
				endCallMessage: "Thank you for the conversation. Goodbye!",
				endCallPhrases: ["goodbye", "bye", "end call", "hang up"],
				// Max call duration (in seconds) - 10 minutes
				maxDurationSeconds: 600,
			});

			// vapi.start("mdekwl", {
			// 	variableValues: {

			// 	}
			// })
		}
	};
	const endCall = () => {
		if (vapi) {
			setIsEnding(true);
			vapi.stop();
		}
	};

	// auto scroll bottom as new messages arrive
	useEffect(() => {
		const container = document.getElementById("transcript-container");
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [transcript]);

	return (
		<div
			className={cn(
				"z-50 font-sans",
				isConnected && "fixed bottom-4 left-4 sm:bottom-6 sm:left-6"
			)}
		>
			{!isConnected ? (
				<button
					onClick={startCall}
					disabled={isConnecting}
					className="inline-flex items-center gap-2 rounded-full bg-emerald-600 enabled:hover:bg-emerald-500 text-white px-5 py-3 shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
					aria-label="Talk to assistant"
				>
					{isConnecting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Mic className="h-4 w-4" />
					)}
					<span className="font-semibold">
						{isConnecting
							? "Connecting..."
							: "Talk to Vapi Assistant"}
					</span>
				</button>
			) : (
				<div className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-xs rounded-xl border border-neutral-200/70 bg-white shadow-xl p-4 dark:border-neutral-800 dark:bg-neutral-900">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<span
								className={
									"inline-block h-2.5 w-2.5 rounded-full " +
									(isSpeaking
										? "bg-rose-500 animate-pulse"
										: "bg-emerald-500")
								}
								aria-hidden="true"
							/>
							<span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
								{isSpeaking
									? "Assistant speaking"
									: "Listening"}
							</span>
						</div>
						<button
							onClick={endCall}
							disabled={isEnding}
							className="inline-flex items-center gap-1 rounded-md bg-rose-600 enabled:hover:bg-rose-500 text-white text-xs px-2.5 py-1.5 font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{isEnding ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<PhoneOff className="h-3.5 w-3.5" />
							)}
							End
						</button>
					</div>

					<div
						id="transcript-container"
						className="rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-3 min-h-14"
					>
						<AnimatePresence mode="wait">
							{transcript.length === 0 ? (
								<motion.p
									key="empty"
									className="text-xs text-neutral-500 m-0"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									Say something to get started…
								</motion.p>
							) : (
								(() => {
									const last =
										transcript[transcript.length - 1];
									const isUser = last.role === "user";
									return (
										<motion.div
											key={last.ts}
											className={
												"flex " +
												(isUser
													? "justify-end"
													: "justify-start")
											}
											initial={{
												opacity: 0,
												y: 8,
												scale: 0.98,
											}}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1,
											}}
											exit={{
												opacity: 0,
												y: -8,
												scale: 0.98,
											}}
											transition={{
												duration: 0.25,
												ease: "easeOut",
											}}
											layout
										>
											<div className="max-w-[85%]">
												<motion.p
													className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{
														duration: 0.15,
													}}
												>
													{isUser
														? "You"
														: "Assistant"}
												</motion.p>
												<motion.span
													className={
														"inline-block rounded-xl px-3 py-2 text-xs leading-relaxed " +
														(isUser
															? "bg-emerald-600 text-white"
															: "bg-neutral-900 text-white dark:bg-neutral-700")
													}
													initial={{
														filter: "brightness(1.05)",
													}}
													animate={{
														filter: "brightness(1)",
													}}
													transition={{
														duration: 0.6,
													}}
												>
													{last.text}
												</motion.span>
											</div>
										</motion.div>
									);
								})()
							)}
						</AnimatePresence>
					</div>
				</div>
			)}
		</div>
	);
}
