"use client";
import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextGenerateEffectProps {
	text: string;
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
	const wordsArray = text.split(" ");

	useEffect(() => {
		animate(
			"span",
			{
				opacity: 1,
				filter: filter ? "blur(0px)" : "none",
			},
			{
				duration: duration,
				delay: stagger(0.1),
			}
		);
	}, [animate, filter, duration, text]);

	return (
		<div className={cn(className)}>
			<div className="">
				<div className="leading-snug">
					<motion.div ref={scope}>
						{wordsArray.map((word, idx) => (
							<motion.span
								key={word + idx}
								className={cn("opacity-0", wordClassName)}
								style={{
									filter: filter ? "blur(10px)" : "none",
								}}
							>
								{word}{" "}
							</motion.span>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default TextGenerateEffect;
