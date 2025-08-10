"use client";

import React, { useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Globe, Zap, Blocks, Code2 } from "lucide-react";
import ChatBubble from "./chat-bubble";
import ThinkingIndicator from "./think-indicator";
import InputContainer from "./input-container";
import RecordingStatus from "./recording-status";
import { useChat } from "@/hooks/use-chat";
import { useUI } from "@/hooks/use-ui";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import Orb from "@/components/ui/orb";
import { GradientBars } from "../ui/gradient-bars";

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

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

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
		<section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
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
				{/* <motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
					className="absolute left-[10%] top-[60%] size-24 rounded-full bg-gradient-to-r from-primary/8 to-transparent blur-2xl"
				/>

				<motion.div
					initial={{ opacity: 0, x: 100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
					className="absolute right-[15%] top-[25%] size-20 rounded-full bg-gradient-to-l from-primary/12 to-transparent blur-xl"
				/> */}

				<GradientBars />

				{/* Grid pattern overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_1px,hsl(var(--muted))_1px)] bg-[length:40px_40px] opacity-[0.015]" />

				{/* Thinking Orb - appears only while AI is thinking */}
				<AnimatePresence>
					{isThinking && (
						<motion.div
							key="thinking-orb"
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.45 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
							className="absolute inset-0 pointer-events-none"
						>
							{/* Slightly larger than viewport for soft edges */}
							<div className="absolute -inset-16">
								<Orb
									hue={20}
									hoverIntensity={0.35}
									rotateOnHover
									forceHoverState
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
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
				<div className="h-12 md:h-16" />

				<div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8">
					<div className="w-full max-w-4xl mx-auto flex flex-col">
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
									className="text-center mb-8 md:mb-12"
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
											AI-Powered Website Builder
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
										Build Your{" "}
										<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
											Dream Website
										</span>
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
									className="flex-1 mb-6"
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

										<div ref={messagesEndRef} />
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Input Form */}
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
									<InputContainer
										inputValue={
											inputValue + voiceInputValue
										}
										isFocused={isFocused}
										isRecording={isRecording}
										hasMessages={hasMessages}
										onInputChange={handleInputChange}
										onKeyDown={handleKeyDown}
										onFocus={handleFocus}
										onBlur={handleBlur}
										onToggleRecording={toggleRecording}
										removeVoiceInput={
											!browserSupportsSpeechRecognition
										}
										disabled={isThinking}
									/>

									{browserSupportsSpeechRecognition && (
										<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
											<RecordingStatus
												isRecording={isRecording}
											/>
										</div>
									)}
								</form>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				<div className="h-8 md:h-12" />
			</div>
		</section>
	);
};

export default ChainLabsHero;
