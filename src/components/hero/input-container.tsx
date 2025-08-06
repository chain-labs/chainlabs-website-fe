"use client";
import React, { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

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
    onSubmit: () => void;
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
        onSubmit,
    }: InputContainerProps) => {
        const hasInputValue = inputValue.trim().length > 0;

        const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
            // Handle Ctrl+Enter to submit
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                if (hasInputValue) {
                    onSubmit();
                }
                return;
            }
            
            // Call the original onKeyDown handler
            onKeyDown(e);
        };

        return (
            <div className="relative w-full group">
                <div
                    className={cn(
                        "relative w-full rounded-2xl bg-surface/50 backdrop-blur-sm border transition-all duration-300",
                        "shadow-[0_8px_30px_rgb(0,0,0,0.08),0_2px_8px_rgb(0,0,0,0.04)]",
                        isFocused
                            ? "border-primary shadow-[0_0_0_1px_rgb(var(--primary)),0_8px_30px_rgb(0,0,0,0.12)]"
                            : "border-border/50 group-hover:border-primary/50"
                    )}
                >
                    <Textarea
                        placeholder={
                            hasMessages
                                ? "Need any changes to your website?"
                                : "Describe your business and website needs... (e.g., 'I need an e-commerce site for my clothing brand with AI recommendations')"
                        }
                        className={cn(
                            "w-full bg-transparent border-0 rounded-2xl p-6 text-base min-h-[120px] md:min-h-[140px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder:text-muted-foreground leading-relaxed",
                            hasInputValue ? "pr-6 pb-16" : "pr-20 pb-6"
                        )}
                        value={inputValue}
                        onChange={onInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        aria-label="Describe your business and website needs"
                    />

                    {/* Mic button - top right */}
                    <div className="absolute top-6 right-6">
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
                            {isRecording && (
                                <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                            )}
                            <Mic className="h-4 w-4 relative z-10" />
                        </button>
                    </div>

                    {/* Bottom section */}
                    <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between">
                        {/* Helper text */}
                        <p className="text-xs text-muted-foreground/70">
                            Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Enter</kbd> to send
                        </p>

                        {/* Submit button - bottom right */}
                        <AnimatePresence>
                            {hasInputValue && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <Button
                                        type="submit"
                                        size="sm"
                                        onClick={onSubmit}
                                        className={cn(
                                            "h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground",
                                            "shadow-sm hover:shadow-md transition-all duration-200",
                                            "flex items-center gap-2 rounded-lg"
                                        )}
                                    >
                                        <Send className="h-4 w-4" />
                                        <span className="text-xs font-medium">Send</span>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    }
);
InputContainer.displayName = "InputContainer";
export default InputContainer;