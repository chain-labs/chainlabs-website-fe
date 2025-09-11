"use client";

import { useState, KeyboardEvent, FormEvent } from "react";
import { motion } from "motion/react";
import { Mic, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/global-store";

export default function GoalInputSection() {
  const inputValue = useGlobalStore((state) => state.inputValue);
  const isRecording = useGlobalStore((state) => state.isRecording);
  const isFocused = useGlobalStore((state) => state.isFocused);
  const setInputValue = useGlobalStore((state) => state.setInputValue);
  const toggleRecording = useGlobalStore((state) => state.toggleRecording);
  const setIsFocused = useGlobalStore((state) => state.setIsFocused);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Space" && inputValue.trim() === "") {
      e.preventDefault();
      toggleRecording();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Submitting goals:", inputValue);
      alert(`Thank you! Your request for a strategy session has been submitted.`);
      setInputValue("");
    }
  };

  return (
    <section className="bg-background w-full py-20 sm:py-24 md:py-32">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Ready to transform your business?
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            Tell us about your challenges for a personalized AI strategy session.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-12 w-full max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <div
            className={cn(
              "relative w-full rounded-xl bg-input transition-all duration-300 group",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,212,170,0.1)]"
            )}
          >
            <div
              className={cn(
                "absolute -inset-px rounded-xl border transition-all duration-300",
                isFocused ? "border-primary" : "border-primary/20 group-hover:border-primary/50"
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "absolute -inset-px rounded-xl transition-all duration-300",
                isFocused ? "shadow-[0_0_12px_theme(colors.primary)]" : "shadow-none"
              )}
              aria-hidden="true"
            />

            <Textarea
              placeholder="Describe your goals and challenges..."
              className="relative w-full bg-transparent border-0 rounded-xl p-5 pr-16 sm:p-6 sm:pr-20 text-base min-h-[140px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder:text-muted-foreground"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Describe your goals and challenges"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 flex items-center justify-center">
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300",
                  "text-primary hover:bg-primary/10",
                  isRecording && "bg-primary/20"
                )}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording && <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-75" />}
                <Mic className="h-6 w-6" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-secondary transition-opacity duration-300">
            {isRecording ? "Recording... press space or click the mic to stop." : "Press space to record, or type your message."}
          </p>

          {inputValue && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-8"
            >
              <Button type="submit" size="lg" className="font-semibold w-full sm:w-auto">
                Request Strategy Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}