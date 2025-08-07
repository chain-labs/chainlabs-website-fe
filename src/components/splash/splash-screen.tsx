"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Code } from "lucide-react";
import Orb from "@/components/ui/orb";

interface SplashScreenProps {
	onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

  const DURATION = 5000;

  useEffect(() => {
    // Progress animation over DURATION ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / (DURATION / 16.67); // 60fps over DURATION ms
      });
    }, 16.67);

    // Hide splash screen after DURATION ms
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 800); // Wait for fade-out animation
    }, DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

	if (!isVisible) {
		return (
			<motion.div
				initial={{ opacity: 1 }}
				animate={{ opacity: 0 }}
				transition={{ duration: 0.8, ease: "easeInOut" }}
				className="fixed inset-0 z-50 bg-[#0F1419]"
				aria-hidden="true"
			/>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1419] overflow-hidden"
			role="presentation"
			aria-label="Chain Labs loading screen"
		>
			{/* Background Orb */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="w-[600px] h-[600px] opacity-60">
					<Orb
						hue={55}
						hoverIntensity={0.3}
						rotateOnHover={false}
						forceHoverState={true}
					/>
				</div>
			</div>

			{/* Subtle grid overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px),linear-gradient(180deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:60px_60px]" />

			{/* Main Content */}
			<div className="relative z-10 flex flex-col items-center justify-center">
				{/* Logo Container */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
					className="flex flex-col items-center mb-16"
				>
					{/* Logo Icon */}
					<motion.div
						animate={{
							boxShadow: [
								"0 0 40px rgba(0, 212, 170, 0.4)",
								"0 0 60px rgba(0, 212, 170, 0.6)",
								"0 0 40px rgba(0, 212, 170, 0.4)",
							],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="w-24 h-24 bg-gradient-to-br from-[#00D4AA] to-[#00A085] rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden"
					>
						{/* Inner glow effect */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
						<Code className="w-12 h-12 text-[#0F1419] relative z-10" />
					</motion.div>

					{/* Brand Text */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-center"
					>
						<h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-2 tracking-tight">
							Chain Labs
						</h1>
						<p className="text-[#94A3B8] text-lg font-light tracking-wide">
							Building the Future
						</p>
					</motion.div>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.2 }}
					className="flex flex-col items-center gap-6"
				>
					{/* Animated Status */}
					<motion.p
						className="text-[#00D4AA] text-sm font-medium tracking-wider uppercase"
						animate={{
							opacity: [0.6, 1, 0.6],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						Initializing Experience
					</motion.p>

					{/* Progress Indicator */}
					<div className="flex items-center gap-2">
						{Array.from({ length: 3 }, (_, i) => (
							<motion.div
								key={i}
								className="w-2 h-2 bg-[#00D4AA] rounded-full"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [0.3, 1, 0.3],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									delay: i * 0.2,
									ease: "easeInOut",
								}}
							/>
						))}
					</div>
				</motion.div>
			</div>

			{/* Bottom Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0">
				<div className="mx-8 mb-8">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 1 }}
						className="h-px bg-gradient-to-r from-transparent via-[#334155]/40 to-transparent relative overflow-hidden"
					>
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-[#00D4AA]/0 via-[#00D4AA] to-[#00D4AA]/0"
							style={{
								width: `${progress}%`,
								filter: "blur(1px)",
							}}
							transition={{ duration: 0.1, ease: "easeOut" }}
						/>
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4AA] to-transparent"
							style={{ width: `${progress}%` }}
							transition={{ duration: 0.1, ease: "easeOut" }}
						>
							<motion.div
								className="absolute right-0 top-0 w-8 h-full bg-gradient-to-r from-transparent to-white/30"
								animate={{
									x: [-10, 10],
									opacity: [0, 1, 0],
								}}
								transition={{
									duration: 1.2,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{Array.from({ length: 8 }, (_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-[#00D4AA]/20 rounded-full"
						style={{
							left: `${20 + i * 10}%`,
							top: `${30 + i * 5}%`,
						}}
						animate={{
							y: [-10, 10, -10],
							opacity: [0.2, 0.6, 0.2],
							scale: [0.8, 1.2, 0.8],
						}}
						transition={{
							duration: 3 + i * 0.3,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.4,
						}}
					/>
				))}
			</div>
		</motion.div>
	);
};
