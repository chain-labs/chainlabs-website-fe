"use client";
import React, { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat } from "@/hooks/use-chat";

interface InputContainerProps {
	inputValue: string;
	isFocused: boolean;
	isRecording: boolean;
	hasMessages: boolean;
	onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
	onFocus: () => void;
	onBlur: () => void;
	onToggleRecording: () => void;
	removeVoiceInput: boolean;
	disabled: boolean;
}

const InputContainer = React.memo(
	({
		inputValue,
		isFocused,
		isRecording,
		hasMessages,
		onInputChange,
		onKeyDown,
		onFocus,
		onBlur,
		onToggleRecording,
		removeVoiceInput,
		disabled,
	}: InputContainerProps) => {
		const hasInputValue = inputValue.trim().length > 0;
		const submitButtonRef = React.useRef<HTMLButtonElement>(null);
		const isMobile = useIsMobile();
		const { placeHolder } = useChat();

		// Auto-resize the textarea
		const textareaRef = React.useRef<HTMLTextAreaElement>(null);
		const autoResize = React.useCallback(() => {
			const el = textareaRef.current;
			if (!el) return;
			el.style.height = "auto";
			const maxPx = isMobile
				? 0.4 * window.innerHeight
				: 0.5 * window.innerHeight;
			const next = Math.min(el.scrollHeight, Math.max(160, maxPx));
			el.style.height = `${next}px`;
			el.style.overflowY = el.scrollHeight > next ? "auto" : "hidden";
		}, [isMobile]);

		React.useEffect(() => {
			autoResize();
		}, [inputValue, isMobile, autoResize]);

		const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
			// Mobile: Enter to send, Shift+Enter for newline
			if (isMobile && e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				if (hasInputValue) submitButtonRef.current?.click();
				return;
			}

			// Desktop: Ctrl+Enter to submit
			if (!isMobile && e.ctrlKey && e.key === "Enter") {
				e.preventDefault();
				if (hasInputValue) submitButtonRef.current?.click();
				return;
			}

			onKeyDown(e);
		};

		const showSendButton = isMobile || hasInputValue;

		return (
			<div className="relative w-full group">
				<div
					className={cn(
						"relative w-full rounded-2xl bg-surface/50 backdrop-blur-lg border transition-all duration-300",
						"shadow-[0_8px_30px_rgb(0,0,0,0.08),0_2px_8px_rgb(0,0,0,0.04)]",
						isFocused
							? "border-primary shadow-[0_0_0_1px_rgb(var(--primary)),0_8px_30px_rgb(0,0,0,0.12)]"
							: "border-border/50 group-hover:border-primary/50"
					)}
				>
					<Textarea
						// Avoid auto focus on mobile to prevent keyboard popup
						autoFocus={!isMobile}
						placeholder={placeHolder}
						ref={textareaRef}
						rows={isMobile ? 1 : 3}
						enterKeyHint="send"
						spellCheck
						autoCapitalize="sentences"
						autoCorrect="on"
						inputMode="text"
						className={cn(
							"w-full bg-black/10 backdrop-blur-xl border-0 rounded-2xl text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder:text-muted-foreground leading-relaxed",
							// Mobile friendly padding/heights + scroll when tall
							isMobile
								? "p-4 pb-20 min-h-[52px] max-h-[40vh] overflow-y-auto"
								: "p-6 pb-16 min-h-[120px] md:min-h-[140px] max-h-[50vh] overflow-y-auto",
							// Right padding
							isMobile ? "pr-4" : hasInputValue ? "pr-6" : "pr-20"
						)}
						value={inputValue}
						onChange={onInputChange}
						onInput={autoResize}
						onKeyDown={handleKeyDown}
						onFocus={onFocus}
						onBlur={onBlur}
						aria-label="Describe your business and website needs"
					/>

					{/* Bottom section */}
					<div
						className={cn(
							"absolute bottom-3 flex items-end",
							isMobile
								? "left-4 right-4 justify-end gap-2"
								: "left-6 right-6 justify-between"
						)}
					>
						{/* Helper text - desktop only */}
						{!isMobile && (
							<p className="text-xs text-muted-foreground/70">
								Press{" "}
								<kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
									Ctrl
								</kbd>{" "}
								+{" "}
								<kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
									Enter
								</kbd>{" "}
								to send
								{!removeVoiceInput && (
									<>
										<span className="pl-3">Press </span>
										<kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
											Ctrl
										</kbd>{" "}
										+{" "}
										<kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
											Space
										</kbd>{" "}
										to toggle mic
									</>
								)}
							</p>
						)}

						{/* Mobile: Mic button */}
						{isMobile && !removeVoiceInput && (
							<button
								type="button"
								onClick={onToggleRecording}
								className={cn(
									"relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
									"text-primary hover:bg-primary/10 hover:scale-105",
									"touch-manipulation", // Better touch handling
									isRecording && "bg-primary/20 scale-105"
								)}
								aria-label={
									isRecording
										? "Stop recording"
										: "Start recording"
								}
							>
								{isRecording && (
									<span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-60" />
								)}
								<Mic className="h-3.5 w-3.5 relative z-10" />
							</button>
						)}

						<div className="flex justify-center items-center gap-4">
							{/* Mic button - top right (desktop only) */}
							{!isMobile && (
								<button
									type="button"
									onClick={onToggleRecording}
									className={cn(
										"relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
										"text-primary hover:bg-primary/10 hover:scale-105",
										isRecording && "bg-primary/20 scale-105"
									)}
									aria-label={
										isRecording
											? "Stop recording"
											: "Start recording"
									}
								>
									{isRecording && !removeVoiceInput && (
										<span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-60" />
									)}
									<Mic className="h-4 w-4 relative z-10" />
								</button>
							)}
							{/* Submit button */}
							<AnimatePresence>
								{hasInputValue && (
									<motion.div
										initial={{
											opacity: 0,
											scale: 0.8,
											y: 10,
										}}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.8, y: 10 }}
										transition={{
											duration: 0.2,
											ease: "easeOut",
										}}
									>
										<Button
											type="submit"
											size="sm"
											ref={submitButtonRef}
											className={cn(
												"bg-primary hover:bg-primary/90 text-primary-foreground",
												"shadow-sm hover:shadow-md transition-all duration-200",
												"flex items-center gap-2 rounded-lg touch-manipulation",
												// Mobile responsive sizing
												isMobile
													? "h-9 px-3"
													: "h-9 px-4",
												disabled &&
													"opacity-50 cursor-not-allowed pointer-events-none"
											)}
											disabled={disabled}
										>
											<Send
												className={cn(
													isMobile
														? "h-3.5 w-3.5"
														: "h-4 w-4"
												)}
											/>
											{!isMobile && (
												<span className="text-xs font-medium">
													Send
												</span>
											)}
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

InputContainer.displayName = "InputContainer";
export default InputContainer;
