"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Code } from "lucide-react";
import Orb from "@/components/ui/orb";

interface SplashScreenProps {
	onComplete?: () => void;
	exitWhen?: boolean;
}

export const SplashScreen = ({ onComplete, exitWhen }: SplashScreenProps) => {
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	const bars = 20;

	const DURATION = 5000;

	// Track when the default duration has elapsed (used when exitWhen is undefined)
	const [timerDone, setTimerDone] = useState(false);

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

		// Mark default timer as done after DURATION ms
		const durationTimer = setTimeout(() => setTimerDone(true), DURATION);

		return () => {
			clearInterval(progressInterval);
			clearTimeout(durationTimer);
		};
	}, []);

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

	useEffect(() => {
		const shouldHide = exitWhen !== undefined ? exitWhen : timerDone;

		if (shouldHide && isVisible) {
			setIsVisible(false);
			const completeTimer = setTimeout(() => {
				onComplete?.();
			}, 800); // Wait for fade-out animation
			return () => clearTimeout(completeTimer);
		}
	}, [exitWhen, timerDone, isVisible, onComplete]);

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
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="absolute inset-0 flex items-center justify-center origin-center"
					>
						<div className="w-[600px] h-[600px] opacity-60">
							<Orb
								hue={55}
								hoverIntensity={0.3}
								rotateOnHover={false}
								forceHoverState={true}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Subtle grid overlay */}
			<motion.div
				className="absolute inset-0 z-0 overflow-hidden"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.7, ease: "easeInOut" }}
			>
				<div className="flex h-full w-full">
					<AnimatePresence>
						{isVisible &&
							Array.from({ length: bars }).map((_, index) => {
								const position = index / (bars - 1);
								const center = 0.5;
								const distance = Math.abs(position - center);
								const scale =
									0.3 + 0.7 * Math.pow(distance * 2, 1.2);

								return (
									<motion.div
										key={`bg-bar-${index}`}
										className="flex-1 origin-bottom bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-1000"
										initial={{ scaleY: 0, opacity: 0 }}
										animate={{
											scaleY: scale,
											opacity: 1 - distance * 0.1,
										}}
										exit={{ scaleY: 0, opacity: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeInOut",
											// delay: index * 0.02,
										}}
										style={{
											transformOrigin: "bottom",
										}}
									/>
								);
							})}
					</AnimatePresence>
				</div>
			</motion.div>

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
					<AnimatePresence>
						{isVisible && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden"
							>
								<div className="rounded-lg text-[#5cfda2] flex items-center justify-center scale-200">
									<svg
										width="42"
										height="43"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M41.99 21.513c0 11.348-9.396 20.548-20.988 20.548C9.41 42.06.013 32.86.013 21.513.013 10.165 9.41.966 21.002.966s20.989 9.2 20.989 20.547zm-31.435 8.434c.953.267 1.94.398 2.93.39 1.54.066 3.076-.192 4.505-.757 2.453-1.066 3.485-3.083 3.833-5.55.035-.256-.11-.232-.235-.21-.033.005-.064.01-.09.01h-3.801c-.32-.004-.433.085-.514.394-.447 1.694-1.547 2.428-3.35 2.212a1.538 1.538 0 01-1.104-.471 1.478 1.478 0 01-.402-1.113c-.004-.21.008-.42.036-.628l.197-1.172c.272-1.622.54-3.225.853-4.834.348-1.76 1.497-2.591 3.301-2.459a7.086 7.086 0 002.813-.385 6.986 6.986 0 002.422-1.455c.23-.194.19-.309 0-.495a4.601 4.601 0 00-1.669-1.061 10.79 10.79 0 00-4.923-.38c-3.305.362-5.564 2.255-6.313 5.421-.278 1.177-.488 2.378-.697 3.57-.107.605-.212 1.208-.326 1.804a13.922 13.922 0 00-.365 3.512c.121 1.888 1.064 3.087 2.899 3.657zM24.41 19.249c-1.497 1.41-3.363 1.65-5.266 1.809-.16.013-.32.02-.48.026-.162.007-.322.014-.48.027-.316.027-.424 0-.357-.363.23-1.185.451-2.379.64-3.573.043-.254.185-.258.362-.262l.09-.003a6.645 6.645 0 003.778-1.248 5.876 5.876 0 002.083-2.985.436.436 0 01.185-.307.455.455 0 01.356-.073h4.4c.38 0 .416.11.357.442a7348.037 7348.037 0 00-3.062 17.124c-.058.328-.17.412-.496.407h-3.755c-.348 0-.451-.057-.366-.442.55-2.822 1.086-5.65 1.62-8.476l.355-1.873c.014-.049.023-.12.036-.23zm4.617 11.008h2.286c.767 0 1.53 0 2.314.008.351 0 .468-.119.518-.442a149.3 149.3 0 01.645-3.799c.054-.314-.068-.34-.33-.34h-4.626c-.324 0-.405.115-.45.376-.096.515-.186 1.03-.277 1.546-.13.749-.262 1.497-.409 2.244-.063.318-.018.407.33.407z"
											fill="currentColor"
										></path>
									</svg>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Brand Text */}

					<AnimatePresence>
						{isVisible && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="text-center"
							>
								<h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-2 tracking-tight">
									Chain Labs
								</h1>
								<p className="text-[#94A3B8] text-lg font-light tracking-wide">
									Building the Future
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.2 }}
					className="flex flex-col items-center gap-6"
				>
					{/* Animated Status */}
					{/* <motion.p
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
					</motion.p> */}

					{/* Progress Indicator */}
					{/* <div className="flex items-center gap-2">
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
					</div> */}
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
