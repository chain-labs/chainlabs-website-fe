"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Bot,
	Minus,
	SendHorizontal,
	Calendar,
	Mic,
	MicOff,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { useGlobalStore } from "@/global-store";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import TextGenerateEffect from "../ui/text-generate-effect";
import { useUI } from "@/hooks/use-ui";
import { Textarea } from "../ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

const conversationStarters = [
	"Tell me more about your services",
	"How can you help my business grow?",
	"What's the next step?",
	"Schedule a consultation",
];

const AIChatBubble = () => {
	// Progress bar state
	const [progress, setProgress] = useState(0);

	const showBookCall =
		useGlobalStore().personalised?.personalisation.call_unlocked;

	const scrollRef = useRef<HTMLDivElement>(null);
	const wasListeningRef = useRef(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Use the chat hook for all message operations
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
		placeHolder,
		aiChatBubbleIsOpen: isOpen,
		setAiChatBubbleIsOpen: setIsOpen,
	} = useChat();

	// Track last seen assistant message timestamp
	const [lastSeenAiTimestamp, setLastSeenAiTimestamp] = useState<
		string | null
	>(null);

	// Determine if there are unseen AI replies (only matters when closed)
	const unreadAi =
		!isOpen &&
		messages.some(
			(m) =>
				m.role === "assistant" &&
				(!lastSeenAiTimestamp ||
					new Date(m.timestamp).getTime() >
						new Date(lastSeenAiTimestamp).getTime())
		);

	// UI + recording controls (shared with hero)
	const { showPersonalized, isRecording, toggleRecording, stopRecording } =
		useUI();
	const shouldShow = showPersonalized;

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	// Mobile detection for keyboard behavior
	const isMobile = useIsMobile();

	// Auto-resize the textarea like InputContainer
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const autoResize = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		// Keep it compact in the chat bubble
		const maxPx = isMobile
			? 0.35 * window.innerHeight
			: 0.4 * window.innerHeight;
		const next = Math.min(el.scrollHeight, Math.max(100, maxPx));
		el.style.height = `${next}px`;
		el.style.overflowY = el.scrollHeight > next ? "auto" : "hidden";
	};

	useEffect(() => {
		autoResize();
	}, [inputValue, voiceInputValue, isMobile]);

	// Mark all current AI messages as seen whenever the chat is open and messages change
	useEffect(() => {
		if (!isOpen) return;
		const latestAi = [...messages]
			.filter((m) => m.role === "assistant")
			.at(-1);
		if (latestAi?.timestamp) {
			setLastSeenAiTimestamp(latestAi.timestamp);
		}
	}, [messages, isOpen]);

	// Click outside to close (and Esc to close)
	useEffect(() => {
		if (!isOpen) return;

		const handleOutside = (e: MouseEvent | TouchEvent) => {
			const target = e.target as Node;
			if (
				chatRef.current &&
				!chatRef.current.contains(target) &&
				triggerRef.current &&
				!triggerRef.current.contains(target)
			) {
				setIsOpen(false);
				// stop any recording/transcript when closing
				stopRecording();
				SpeechRecognition.stopListening();
				resetTranscript();
			}
		};

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOpen(false);
				stopRecording();
				SpeechRecognition.stopListening();
				resetTranscript();
			}
		};

		document.addEventListener("mousedown", handleOutside);
		document.addEventListener("touchstart", handleOutside, {
			passive: true,
		});
		document.addEventListener("keydown", handleEsc);

		return () => {
			document.removeEventListener("mousedown", handleOutside);
			document.removeEventListener("touchstart", handleOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [isOpen, stopRecording, resetTranscript]);

	// Keyboard shortcuts: Mobile Enter to send; Desktop Ctrl+Enter to send; Ctrl+Space toggle mic
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (isThinking) {
			// Disable typing/shortcuts while thinking
			e.preventDefault();
			return;
		}

		const combined = (inputValue + voiceInputValue).trim();

		// Mobile: Enter to send (Shift+Enter for newline)
		if (isMobile && e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (combined) handleSendMessage(combined);
			return;
		}

		// Desktop: Ctrl+Enter to send
		if (!isMobile && e.ctrlKey && e.key === "Enter") {
			e.preventDefault();
			if (combined) handleSendMessage(combined);
			return;
		}

		// Desktop: Ctrl+Space to toggle mic
		if (!isMobile && e.ctrlKey && e.code === "Space") {
			e.preventDefault();
			toggleRecording();
			return;
		}
	};

	// Handle voice recognition state changes (align with hero)
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

	// Initialize with a greeting when first opened
	useEffect(() => {
		if (isOpen && !hasMessages) {
			setTimeout(() => {
				const defaultGreeting = {
					role: "assistant" as const,
					message:
						"Hi! I'm your AI assistant. How can I help you today?",
					timestamp: new Date().toISOString(),
				};
				const store = useGlobalStore.getState();
				store.addChatMessage(defaultGreeting);
			}, 1200);
		}
	}, [isOpen, hasMessages]);

	// Progress bar effect when AI is thinking
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isThinking) {
			setProgress(0);
			interval = setInterval(() => {
				setProgress((prev) => {
					if (prev < 100) {
						if (prev < 60) return prev + 2.5;
						if (prev < 95) return prev + 1.2;
						return prev + 0.5;
					}
					return 100;
				});
			}, 30);
		} else {
			setProgress(0);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isThinking]);

	// Stop any ongoing recording while thinking and clear voice input
	useEffect(() => {
		if (isThinking) {
			stopRecording();
			SpeechRecognition.stopListening();
			resetTranscript();
			setVoiceInputValue("");
		}
	}, [isThinking, stopRecording, resetTranscript, setVoiceInputValue]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (scrollRef.current && isOpen) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isThinking, scrollRef, isOpen]);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleSendMessage = async (
		e: React.FormEvent<HTMLFormElement> | string
	) => {
		if (isThinking) return;

		if (typeof e !== "string") {
			e.preventDefault();
		}

		const content =
			typeof e === "string" ? e : (inputValue + voiceInputValue).trim();
		if (!content) return;

		// Clear voice input when submitting
		setVoiceInputValue("");
		await sendMessage(content);
	};

	// Allow external components (like VapiSection) to close the chat bubble
	useEffect(() => {
		const close = () => {
			setIsOpen(false);
			stopRecording();
			SpeechRecognition.stopListening();
			resetTranscript();
		};
		window.addEventListener("chainlabs:close-ai-chat", close as any);
		return () => window.removeEventListener("chainlabs:close-ai-chat", close as any);
	}, [setIsOpen, stopRecording, resetTranscript]);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(e.target.value);
		// Stop voice capture when typing (mirrors hero behavior)
		SpeechRecognition.stopListening();
		resetTranscript();
		stopRecording();
	};

	// Don't render if shouldn't show
	if (!shouldShow || !showPersonalized) {
		return null;
	}

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={chatRef}
						initial={{ opacity: 0, scale: 0.8, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 20 }}
						transition={{
							type: "spring",
							damping: 20,
							stiffness: 250,
						}}
						className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[28rem] lg:w-[32rem] h-[80vh] sm:h-[75vh] z-50 flex flex-col bg-card border border-border rounded-lg shadow-2xl"
						style={{ transformOrigin: "bottom right" }}
					>
						{/* Header */}
						<header className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-lg flex-shrink-0">
							<div className="flex items-center gap-3">
								<div className="relative">
									<Bot className="w-8 h-8 text-primary" />
									<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-foreground">
										AI Assistant
									</h3>
									<p className="text-xs text-muted-foreground">
										{hasMessages
											? "Continue our conversation"
											: "Ready to help"}
									</p>
								</div>
							</div>
						</header>

						{/* Progress bar */}
						{/* <AnimatePresence>
							{isThinking && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 8 }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className="w-full px-4 pt-2"
								>
									<div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
										<motion.div
											className="absolute left-0 top-0 h-2 bg-gradient-to-r from-primary to-primary/70 rounded-full"
											style={{ width: `${progress}%` }}
											initial={{ width: 0 }}
											animate={{ width: `${progress}%` }}
											transition={{
												duration: 0.2,
												ease: "easeOut",
											}}
										/>
									</div>
								</motion.div>
							)}
						</AnimatePresence> */}

						{/* Messages */}
						<div
							ref={scrollRef}
							className="flex-1 overflow-y-auto p-4 space-y-4"
						>
							{messages.map((message, index) => (
								<MessageBubble
									key={`message-${index}-${message.timestamp}`}
									message={message}
									isLatest={
										index === messages.length - 1 &&
										isThisLatestAssistantMessage
									}
								/>
							))}

							{isThinking && <TypingIndicator />}

							{/* Conversation starters */}
							{messages.length <= 3 && !isThinking && (
								<div className="pt-2">
									<p className="text-sm text-muted-foreground mb-3 text-center">
										{hasMessages
											? "What would you like to know more about?"
											: "Or, you can start with..."}
									</p>
									<div className="flex flex-col items-center gap-2">
										{conversationStarters.map((starter) => (
											<Button
												key={starter}
												variant="outline"
												size="sm"
												className="w-full text-left justify-start h-auto py-2 text-xs"
												onClick={() =>
													handleSendMessage(starter)
												}
											>
												{starter}
											</Button>
										))}
									</div>
								</div>
							)}

							{/* Book a Call button while thinking */}
							{/* <AnimatePresence>
								{showBookCall && isThinking && (
									<motion.div
										initial={{
											opacity: 0,
											y: 20,
											scale: 0.95,
										}}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{
											opacity: 0,
											y: 20,
											scale: 0.95,
										}}
										transition={{
											duration: 0.4,
											ease: "easeOut",
										}}
										className="flex justify-center mt-4"
									>
										<Button
											variant="default"
											size="lg"
											className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
											onClick={() =>
												window.open(
													"https://cal.com/",
													"_blank"
												)
											}
										>
											<Calendar className="w-5 h-5" />
											Book a Strategy Call
										</Button>
									</motion.div>
								)}
							</AnimatePresence> */}
						</div>

						{/* Input */}
						<footer className="p-4 border-t border-border bg-card rounded-b-lg flex-shrink-0">
							<form
								onSubmit={handleSendMessage}
								className="flex items-end gap-2"
							>
								<div className="flex-1 items-end relative">
									<Textarea
										value={inputValue + voiceInputValue}
										onChange={handleInputChange}
										onKeyDown={handleKeyDown}
										onInput={autoResize}
										placeholder={placeHolder}
										ref={textareaRef}
										enterKeyHint="send"
										spellCheck
										autoCapitalize="sentences"
										autoCorrect="on"
										inputMode="text"
										disabled={isThinking}
										className="flex-1 bg-input min-h-[48px] max-h-[40vh] max-w-full overflow-y-auto resize-none disabled:opacity-60 disabled:cursor-not-allowed"
										aria-label="Chat input"
									/>
									{/* Voice input indicator */}
									{voiceInputValue && (
										<div className="absolute right-12 top-1/2 -translate-y-1/2">
											<motion.div
												animate={{
													opacity: [0.5, 1, 0.5],
												}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: "easeInOut",
												}}
												className="w-2 h-2 bg-red-500 rounded-full"
											/>
										</div>
									)}
								</div>

								{/* Voice toggle button */}
								{browserSupportsSpeechRecognition && (
									<Button
										type="button"
										variant={
											isRecording ? "default" : "outline"
										}
										size="icon"
										onClick={toggleRecording}
										aria-label={
											isRecording
												? "Stop recording"
												: "Start recording"
										}
										disabled={isThinking}
										className={cn(
											"transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
											isRecording &&
												"bg-red-500 hover:bg-red-600"
										)}
									>
										{isRecording ? (
											<MicOff className="w-5 h-5" />
										) : (
											<Mic className="w-5 h-5" />
										)}
									</Button>
								)}

								<Button
									type="submit"
									size="icon"
									disabled={
										isThinking ||
										!(inputValue + voiceInputValue).trim()
									}
									aria-label="Send message"
								>
									<SendHorizontal className="w-5 h-5" />
								</Button>
							</form>

							{/* Recording status */}
							{isRecording && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
								>
									<motion.div
										animate={{ scale: [1, 1.2, 1] }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="w-2 h-2 bg-red-500 rounded-full"
									/>
									Listening... (Ctrl+Space to toggle)
								</motion.div>
							)}
						</footer>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Button */}
			<AnimatePresence>
				{shouldShow && showPersonalized && (
					<motion.button
						ref={triggerRef}
						onClick={handleToggle}
						className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[60px] h-[60px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 z-50"
						aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 15,
						}}
						initial={{ opacity: 0, scale: 0, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0, y: 20 }}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={isOpen ? "minus" : "bot"}
								initial={{
									rotate: -45,
									opacity: 0,
									scale: 0.5,
								}}
								animate={{ rotate: 0, opacity: 1, scale: 1 }}
								exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 25,
									duration: 0.2,
								}}
							>
								{isOpen ? (
									<Minus className="w-8 h-8" />
								) : (
									<Bot className="w-8 h-8" />
								)}
							</motion.div>
						</AnimatePresence>

						{/* Notification dot if there are unread messages */}
						{!isOpen && unreadAi && (
							<motion.div
								className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.5 }}
							/>
						)}
					</motion.button>
				)}
			</AnimatePresence>
		</>
	);
};

// Updated MessageBubble component
const MessageBubble = ({
	message,
	isLatest,
}: {
	message: any;
	isLatest: boolean;
}) => {
	const isAi = message.role === "ai" || message.role === "assistant";
	const content = message.content || message.message || "";
	const hasAnimated = useRef(false);
	const [shouldAnimate, setShouldAnimate] = useState(false);

	// Only animate if this is the latest assistant message and hasn't animated yet
	useEffect(() => {
		if (isAi && isLatest && !hasAnimated.current) {
			setShouldAnimate(true);
			hasAnimated.current = true;
		}
	}, [isAi, isLatest]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={cn(
				"flex items-end gap-2 w-full",
				!isAi && "justify-end"
			)}
		>
			{/* AI Avatar */}
			{isAi && (
				<div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-secondary">
					<Bot className="w-5 h-5 text-primary" />
				</div>
			)}

			{/* Message Content */}
			<div
				className={cn(
					"px-3.5 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[80%] text-sm leading-relaxed",
					isAi
						? "bg-secondary text-foreground rounded-bl-sm"
						: "bg-primary text-primary-foreground rounded-br-sm"
				)}
			>
				<p className="leading-relaxed w-full break-words whitespace-pre-wrap">
					{!isAi ? (
						message.message
					) : shouldAnimate ? (
						<TextGenerateEffect text={content} />
					) : (
						content
					)}
				</p>
			</div>

			{/* User Avatar */}
			{!isAi && (
				<div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary">
					<User className="w-5 h-5 text-primary-foreground" />
				</div>
			)}
		</motion.div>
	);
};

// Typing Indicator Component
const TypingIndicator = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0 }}
		className="flex items-end gap-2"
	>
		<div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
			<Bot className="w-5 h-5 text-primary" />
		</div>
		<div className="flex items-center space-x-1.5 px-3.5 py-[1.125rem] bg-secondary rounded-2xl rounded-bl-sm">
			<motion.span
				className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
				animate={{ y: [0, -4, 0] }}
				transition={{
					duration: 0.9,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0,
				}}
			/>
			<motion.span
				className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
				animate={{ y: [0, -4, 0] }}
				transition={{
					duration: 0.9,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.15,
				}}
			/>
			<motion.span
				className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
				animate={{ y: [0, -4, 0] }}
				transition={{
					duration: 0.9,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.3,
				}}
			/>
		</div>
	</motion.div>
);

export default AIChatBubble;
