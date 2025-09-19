"use client";

import React, { useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence, useAnimate } from "motion/react";
import { Sparkles, Globe, Zap, Blocks, Code2, ArrowRight } from "lucide-react";
import ChatBubble from "./chat-bubble";
import ThinkingIndicator from "./think-indicator";
import InputContainer from "./input-container";
import RecordingStatus from "./recording-status";
import { useChat } from "@/hooks/use-chat";
import { useUI } from "@/hooks/use-ui";
import { useGlobalStore } from "@/global-store";
import { ErrorBanner } from "@/components/chat/error-banner";
import { apiClient } from "@/api-client";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import Orb from "@/components/ui/orb";
import { GradientBars } from "../ui/gradient-bars";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ChainLabsHero = () => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const wasListeningRef = useRef(false);

	// Global state hooks
	const {
		messages,
		isThinking,
		inputValue,
		voiceInputValue,
		hasMessages,
		isThisLatestAssistantMessage,
		sendMessage,
		setInputValue,
		setVoiceInputValue,
	} = useChat();

	// Error state and retry/restart handlers
	const lastError = useGlobalStore((s) => s.lastError);
	const lastRequestType = useGlobalStore((s) => s.lastRequestType);
	const lastRequestPayload = useGlobalStore((s) => s.lastRequestPayload);
	const clearErrorAndRequest = useGlobalStore((s) => s.clearErrorAndRequest);
	const resetSessionState = useGlobalStore((s) => s.resetSession);
	const personalisedStatus = useGlobalStore((s) => s.personalised?.status);
	const personalisedSiteRequested = useGlobalStore(
		(s) => s.personalisedSiteRequested
	);
	const setPersonalisedSiteRequested = useGlobalStore(
		(s) => s.setPersonalisedSiteRequested
	);
	const showPersonalisedCTA =
		personalisedStatus === "CLARIFIED" && !personalisedSiteRequested;

	const {
		isFocused,
		isRecording,
		setIsFocused,
		toggleRecording,
		stopRecording,
	} = useUI();

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, []);

	useEffect(() => {
		if (hasMessages || isThinking) {
			scrollToBottom();
		}
	}, [hasMessages, isThinking, scrollToBottom]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.ctrlKey && e.code === "Space") {
				e.preventDefault();
				toggleRecording();
			}
		},
		[inputValue, toggleRecording]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			// Combine text input and voice input
			const combinedInput = (inputValue + voiceInputValue).trim();

			if (combinedInput) {
				// Clear voice input when submitting
				setVoiceInputValue("");
				await sendMessage(combinedInput);
			}
		},
		[inputValue, voiceInputValue, sendMessage, setVoiceInputValue]
	);

	const handleRetry = useCallback(async () => {
		if (!lastRequestPayload) {
			clearErrorAndRequest();
			return;
		}
		clearErrorAndRequest();
		await sendMessage(lastRequestPayload, { skipUserMessage: true });
	}, [lastRequestPayload, sendMessage, clearErrorAndRequest]);

	const handleRestart = useCallback(async () => {
		// For chat flow, this acts as "Send New Message" (just clear error)
		if (lastRequestType === "chat") {
			clearErrorAndRequest();
			return;
		}
		try {
			// Reset backend session and local state
			await apiClient.resetSession().catch(() => {});
			apiClient.clearAuth();
			await apiClient.initializeSession().catch(() => {});
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (e) {
			// Non-fatal; continue to clear local state
			console.error("Session reset failed", e);
		}
		resetSessionState();
		clearErrorAndRequest();
	}, [lastRequestType, resetSessionState, clearErrorAndRequest]);

	const handleShowPersonalisedSite = useCallback(() => {
		setPersonalisedSiteRequested(true);
	}, [setPersonalisedSiteRequested]);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInputValue(e.target.value);
			SpeechRecognition.stopListening();
			resetTranscript();
			stopRecording();
		},
		[setInputValue]
	);

	const handleFocus = useCallback(() => setIsFocused(true), [setIsFocused]);
	const handleBlur = useCallback(() => setIsFocused(false), [setIsFocused]);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	// if (!browserSupportsSpeechRecognition) {
	// 	return <span>Browser doesn't support speech recognition.</span>;
	// }

	// Handle voice recognition state changes
	useEffect(() => {
		// When listening starts, clear previous voice input
		if (listening && !wasListeningRef.current) {
			setVoiceInputValue("");
			resetTranscript();
		}

		// While listening, update voice input value with live transcript
		if (listening) {
			setVoiceInputValue(transcript);
		}

		// When listening stops, merge voice into text input
		if (!listening && wasListeningRef.current) {
			const spokenText = transcript.trim();
			if (spokenText) {
				// Use functional update to avoid stale closure
				setInputValue(
					inputValue ? `${inputValue} ${spokenText}` : spokenText
				);
			}
			// Clear voice input and transcript
			setVoiceInputValue("");
			resetTranscript();
		}

		// Update ref for next comparison
		wasListeningRef.current = listening;
	}, [
		listening,
		transcript,
		setInputValue,
		setVoiceInputValue,
		resetTranscript,
	]);

	// Original hero/chat UI

	return (
		<section className="relative min-h-screen w-full py-16 flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
			{/* Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Main spherical gradient */}
				{/* <motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					className="absolute left-1/2 top-[15%] size-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-primary/25 to-primary/35 blur-3xl"
				/> */}

				{/* Secondary accent orbs */}
				<Orb
					hue={20}
					hoverIntensity={isThinking ? 0.35 : 0}
					rotateOnHover
					forceHoverState
				/>

				<GradientBars />

				{/* Grid pattern overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_1px,hsl(var(--muted))_1px)] bg-[length:40px_40px] opacity-[0.015]" />

				{/* Floating code elements - only show when no messages */}
				{!hasMessages && (
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 0.08, y: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 1,
							}}
							className="absolute left-[15%] top-[35%] font-mono text-xs text-primary"
						>
							{"<Website />"}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 0.08, y: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 1.5,
							}}
							className="absolute right-[20%] top-[30%] font-mono text-xs text-primary"
						>
							{"function buildSite() {"}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 0.08, x: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 2,
							}}
							className="absolute left-[12%] bottom-[35%] font-mono text-xs text-primary"
						>
							{"AI.analyze(requirements)"}
						</motion.div>
					</div>
				)}
			</div>

			<div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full">
				{/* Remove top spacer on mobile to pin hero text to top */}
				<div className="h-16" />

				<div className="flex-1 flex flex-col px-4 md:px-6 lg:px-8">
					{/* Distribute sections on mobile; center on md+ */}
					<div className="w-full max-w-4xl mx-auto flex flex-col flex-1 justify-between md:justify-center">
						{/* Hero Text - Only show when no messages */}
						<AnimatePresence mode="wait">
							{!hasMessages && (
								<motion.div
									key="hero-text"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.6,
										ease: "easeOut",
									}}
									className="text-center mb-8 md:mb-12 backdrop-blur-lg lg:backdrop-blur-none"
								>
									<motion.div
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeOut",
											delay: 0.2,
										}}
										className="flex items-center justify-center gap-2 mb-4"
									>
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-sm font-medium text-muted-foreground">
											AI & Blockchain Innovation Partner
										</span>
									</motion.div>

									<motion.h1
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeOut",
											delay: 0.3,
										}}
										className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight"
									>
										Unlock Growth with <br />
										<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
											AI & Blockchain
										</span>
										{"."}
									</motion.h1>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Chat Messages */}
						<AnimatePresence>
							{hasMessages && (
								<motion.div
									key="chat-messages"
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{
										duration: 0.5,
										ease: "easeOut",
									}}
									className="mb-4"
								>
									<div className="max-h-[55vh] overflow-y-auto space-y-4 px-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
										{messages.map((message, index) => (
											<ChatBubble
												key={message.timestamp}
												message={message}
												isLatest={
													index ===
														messages.length - 1 &&
													isThisLatestAssistantMessage
												}
											/>
										))}

										<AnimatePresence>
											{isThinking && (
												<ThinkingIndicator />
											)}
										</AnimatePresence>

										{/* Error banner moved to be rendered globally above input */}

										<div ref={messagesEndRef} />
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Input Form (center on mobile via parent justify-between) */}
						<AnimatePresence mode="wait">
							<motion.div
								key="input-section"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{
									duration: 0.4,
									ease: "easeOut",
								}}
								className="w-full"
							>
								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<AnimatePresence>
										{lastError && lastRequestType && (
											<div className="mb-3">
												<ErrorBanner
													type={lastRequestType}
													message={lastError}
													onRetry={handleRetry}
													onRestart={handleRestart}
													loading={isThinking}
												/>
											</div>
										)}
									</AnimatePresence>

									<AnimatePresence mode="wait">
										{showPersonalisedCTA ? (
											<motion.div
												key="personalised-cta"
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 12 }}
												transition={{
													duration: 0.25,
													ease: "easeOut",
												}}
												className="rounded-2xl border border-primary/40 backdrop-blur-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background/80 p-5 shadow-[0_18px_40px_-24px_rgb(59,130,246)]"
											>
												<div className="flex items-start gap-3">
													<span className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
														<Sparkles className="size-4" />
													</span>
													<div className="flex-1 space-y-2">
														<p className="text-sm font-medium text-foreground">
															Personalisation
															complete
														</p>
														<p className="text-sm text-muted-foreground">
															Preview
															recommendations,
															missions, and
															tailored messaging
															tuned to your goal.
														</p>
													</div>
												</div>
												<Button
													type="button"
													onClick={
														handleShowPersonalisedSite
													}
													size="lg"
													className="group mt-4 w-full justify-between bg-primary text-primary-foreground hover:bg-primary/90"
												>
													<span>
														Take me to my
														personalised site
													</span>
													<ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
												</Button>
											</motion.div>
										) : (
											<motion.div
												key="chat-input"
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 12 }}
												transition={{
													duration: 0.2,
													ease: "easeOut",
												}}
											>
												<InputContainer
													inputValue={
														inputValue +
														voiceInputValue
													}
													isFocused={isFocused}
													isRecording={isRecording}
													hasMessages={hasMessages}
													onInputChange={
														handleInputChange
													}
													onKeyDown={handleKeyDown}
													onFocus={handleFocus}
													onBlur={handleBlur}
													onToggleRecording={
														toggleRecording
													}
													removeVoiceInput={
														!browserSupportsSpeechRecognition
													}
													disabled={
														isThinking ||
														lastError !== null
													}
													browserSupportsSpeechRecognition={
														browserSupportsSpeechRecognition
													}
												/>
											</motion.div>
										)}
									</AnimatePresence>

									{browserSupportsSpeechRecognition &&
										!showPersonalisedCTA && (
											<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
												<RecordingStatus
													isRecording={isRecording}
												/>
											</div>
										)}
								</form>
							</motion.div>
						</AnimatePresence>

						{/* Generic site link at bottom on mobile */}
						<AnimatePresence>
							{!showPersonalisedCTA && (
								<div className="mt-6 md:mt-12 flex justify-center">
									<Link
										href="/generic-site"
										aria-label="View more case studies"
										className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 underline transition-colors flex justify-center items-center gap-[1ch]"
									>
										Explore our standard site (no
										personalisation).
									</Link>
								</div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Remove bottom spacer on mobile so link sits at bottom */}
				<div className="h-0 md:h-12" />
			</div>
		</section>
	);
};

export default ChainLabsHero;
