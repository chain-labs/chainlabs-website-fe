"use client";
import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { buildPersonalizationText } from "@/components/vapi/vapi";
import { useGlobalStore } from "@/global-store";
import { Mic, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

export default function VapiSection() {
	const [vapi, setVapi] = useState<Vapi | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isEnding, setIsEnding] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [transcript, setTranscript] = useState<
		Array<{ role: string; text: string; id: string }>
	>([]);
	const personalizedContent = buildPersonalizationText(
		useGlobalStore((s) => s.personalised)
	);

	const initatingVapi = () => {
		const vapiInstance = new Vapi(apiKey);
		setVapi(vapiInstance);
		// Event listeners
		vapiInstance.on("call-start", () => {
			setIsConnected(true);
			setIsConnecting(false);
			setIsEnding(false);
		});
		vapiInstance.on("call-end", () => {
			setIsConnected(false);
			setIsSpeaking(false);
			setIsConnecting(false);
			setIsEnding(false);
		});
		vapiInstance.on("speech-start", () => {
			setIsSpeaking(true);
		});
		vapiInstance.on("speech-end", () => {
			setIsSpeaking(false);
		});
		vapiInstance.on("message", (message) => {
			if (message.type === "conversation-update") {
				setTranscript(
					message.messages
						.filter(
							(m: {
								role: "system" | "user" | "bot";
								message: string;
								secondsFromStart: number;
								time: number;
							}) => m.role !== "system"
						)
						.map(
							(m: {
								role: string;
								message: string;
								time: number;
							}) => ({
								role: m.role,
								text: m.message,
								id: m.time.toString(),
							})
						)
				);
			}
		});

		vapiInstance.on("error", (error) => {
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
			vapi.start(assistantId, {
				variableValues: {
					personalizedContent,
				},
			});
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

	// Derived conversation states for UI
	const lastRole = transcript.length > 0 ? transcript[transcript.length - 1].role : null;
	const speaking = isConnected && isSpeaking;
	const thinking = isConnected && !isSpeaking && lastRole === "user";
	const listening = isConnected && !isSpeaking && lastRole !== "user";

	const StatusBars = ({ active }: { active: boolean }) => (
		<div className="ml-2 flex items-end gap-1 h-3" aria-hidden>
			<motion.span
				className="w-1 rounded-sm"
				style={{ backgroundColor: active ? "#ef4444" : "#94a3b8", height: 4 }}
				animate={active ? { height: [4, 12, 6, 10, 4] } : { height: 4 }}
				transition={{ duration: 0.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
		/>
			<motion.span
				className="w-1 rounded-sm"
				style={{ backgroundColor: active ? "#fb7185" : "#94a3b8", height: 6 }}
				animate={active ? { height: [6, 8, 14, 6, 10] } : { height: 6 }}
				transition={{ duration: 0.8, repeat: active ? Infinity : 0, ease: "easeInOut", delay: 0.1 }}
		/>
			<motion.span
				className="w-1 rounded-sm"
				style={{ backgroundColor: active ? "#fca5a5" : "#94a3b8", height: 5 }}
				animate={active ? { height: [5, 10, 8, 12, 5] } : { height: 5 }}
				transition={{ duration: 0.8, repeat: active ? Infinity : 0, ease: "easeInOut", delay: 0.2 }}
		/>
		</div>
	);

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
									(speaking
										? "bg-rose-500 animate-pulse"
										: thinking
										? "bg-amber-500 animate-pulse"
										: "bg-emerald-500")
								}
								aria-hidden="true"
							/>
							<span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
								{speaking ? "Speaking" : thinking ? "Thinking" : "Listening"}
							</span>
							<StatusBars active={speaking} />
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
						data-scroll-guard
						className="rounded-md bg-neutral-50 dark:bg-neutral-800/60 p-3 min-h-14 max-h-72 overflow-y-auto"
					>
						<AnimatePresence mode="popLayout">
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
								transcript.map((msg, idx) => {
									const isUser = msg.role === "user";
									return (
										<motion.div
											key={msg.id}
											className={
												"flex mb-2 " +
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
												duration: 0.2,
												ease: "easeOut",
											}}
											layout
										>
											<div className="max-w-[85%]">
												<motion.p
													className={cn(
														"mb-1 text-[10px] uppercase tracking-wide text-neutral-500",
														isUser
															? "text-right"
															: "text-left"
													)}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{
														duration: 0.12,
													}}
												>
													{isUser
														? "You"
														: "Assistant"}
												</motion.p>
												<motion.div
													className={
														"inline-block rounded-xl px-3 py-2 text-xs leading-relaxed" +
														(isUser
															? " bg-emerald-600 text-white text-right"
															: " bg-neutral-900 text-white dark:bg-neutral-700 text-left")
													}
													initial={{
														filter: "brightness(1.05)",
													}}
													animate={{
														filter: "brightness(1)",
													}}
													transition={{
														duration: 0.4,
													}}
												>
													<span>{msg.text}</span>
												</motion.div>
											</div>
										</motion.div>
									);
								})
							)}
						</AnimatePresence>
					</div>
				</div>
			)}
		</div>
	);
}
