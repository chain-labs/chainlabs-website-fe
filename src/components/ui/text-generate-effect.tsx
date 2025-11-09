"use client";
import React, { useEffect, ReactNode, isValidElement } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextGenerateEffectProps {
  text: string | ReactNode;
  className?: string;
  filter?: boolean;
  duration?: number;
  wordClassName?: string;
}

const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  text,
  className,
  filter = true,
  duration = 0.5,
  wordClassName,
}) => {
  const [scope, animate] = useAnimate();

  // Helper to check if text is string
  const isString = typeof text === "string";

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration,
        delay: isString ? stagger(0.1) : 0,
      },
    );
  }, [animate, filter, duration, text, isString]);

  return (
    <div className={cn(className)}>
      <div>
        <div className="leading-snug">
          <motion.div ref={scope}>
            {isString ? (
              // Split string into words and animate each
              (text as string).split(" ").map((word, idx) => (
                <motion.span
                  key={word + idx}
                  className={cn("opacity-0", wordClassName)}
                  style={{
                    filter: filter ? "blur(10px)" : "none",
                  }}
                >
                  {word}{" "}
                </motion.span>
              ))
            ) : (
              // Animate the whole ReactNode as a single span
              <motion.span
                className={cn("opacity-0", wordClassName)}
                style={{
                  filter: filter ? "blur(10px)" : "none",
                }}
              >
                {text}
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;
