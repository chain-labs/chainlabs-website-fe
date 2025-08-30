"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/lib/hooks/use-outside-click";
import { useGlobalStore } from "@/global-store";
import { CaseStudy } from "@/types/store";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const CloseIcon = () => {
	return (
		<motion.svg
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			exit={{
				opacity: 0,
				transition: {
					duration: 0.05,
				},
			}}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-4 w-4text-white"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M18 6l-12 12" />
			<path d="M6 6l12 12" />
		</motion.svg>
	);
};

const ResponsiveGridCasestudies = () => {
	const [active, setActive] = useState<CaseStudy | boolean | null>(null);
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);

	const timerStartRef = useRef<number | null>(null);
	const prevCaseStudyRef = useRef<CaseStudy | null>(null);

	const caseStudies = useGlobalStore(
		(s) => s.personalised?.personalisation.caseStudies
	);
	const addCaseStudyTime = useGlobalStore((s) => s.addCaseStudyTime);

	if (!caseStudies || caseStudies.length === 0) return null;

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setActive(false);
			}
		}

		// Handle body scroll lock
		if (active && typeof active === "object") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [active]);

	// Listen for external openCaseStudy events (from missions)
    useEffect(() => {
        const handler = (e: Event) => {
            try {
                const detail = (e as CustomEvent).detail;
                const id = detail?.caseStudyId;
                if (!id) return;
                const cs = caseStudies?.find((c) => c.id === id);
                if (cs) setActive(cs);
            } catch {}
        };
        window.addEventListener("openCaseStudy", handler as EventListener);
        return () =>
            window.removeEventListener(
                "openCaseStudy",
                handler as EventListener
            );
    }, [caseStudies]);

	useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
		setActive(null)
	);

	useEffect(() => {
		// If a previous case study was open, record its time when closing or switching
		const prev = prevCaseStudyRef.current;
		if (
			prev &&
			(!active ||
				(typeof active === "object" && active.id !== prev.id)) &&
			timerStartRef.current
		) {
			const elapsedMs = Date.now() - timerStartRef.current;
			const seconds = Math.floor(elapsedMs / 1000);
			if (seconds > 0) addCaseStudyTime(prev.id, seconds);
			timerStartRef.current = null;
		}

		// When a new case study opens
		if (active && typeof active === "object") {
			prevCaseStudyRef.current = active;
			timerStartRef.current = Date.now();
		}

		return () => {
			// On unmount: flush any active timing
			if (timerStartRef.current && prevCaseStudyRef.current) {
				const elapsedMs = Date.now() - timerStartRef.current;
				const seconds = Math.floor(elapsedMs / 1000);
				if (seconds > 0)
					addCaseStudyTime(prevCaseStudyRef.current.id, seconds);
			}
		};
	}, [active, addCaseStudyTime]);

	// dynamic grid columns based on count (up to 4 cols on xl)
	const total = caseStudies.length;
	const gridColsClass =
		total <= 1
			? "grid-cols-1"
			: total === 2
			? "grid-cols-1 sm:grid-cols-2"
			: total === 3
			? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
			: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

	return (
		<section
			className="relative py-16 sm:py-24 lg:py-32 w-full max-w-7xl min-h-fit flex flex-col justify-center items-center"
			id="case-studies"
		>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="text-center mb-12 md:mb-16"
			>
				<p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium tracking-wider text-primary ring-1 ring-primary/25">
					<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
					Case Studies
				</p>
				<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
					Real‑World{" "}
					<span className="relative inline-block">
						<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
							Impact
						</span>
						<span
							aria-hidden
							className="pointer-events-none absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
						/>
					</span>
				</h2>
				<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					Snapshot outcomes: faster operations, new revenue streams,
					and elevated customer experiences delivered through applied
					AI.
				</p>
			</motion.div>
			<div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-7xl">
				{/* Modal Overlay */}
				<AnimatePresence>
					{active && typeof active === "object" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
							style={{ zIndex: 60 }}
						/>
					)}
				</AnimatePresence>

				{/* Modal - Mobile optimized */}
				<AnimatePresence>
					{active && typeof active === "object" ? (
						<div
							className="fixed inset-0 flex items-start sm:items-center justify-center p-4 z-[70] overflow-y-auto"
							style={{ zIndex: 70 }}
						>
							<motion.div
								layoutId={`card-${active.title}-${id}`}
								ref={ref}
								className="relative w-full max-w-sm sm:max-w-lg lg:max-w-4xl my-4 sm:my-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
								initial={{ scale: 0.9, opacity: 0, y: 20 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.9, opacity: 0, y: 20 }}
								transition={{
									type: "spring",
									damping: 25,
									stiffness: 300,
								}}
							>
								{/* Close Button - Mobile optimized */}
								<motion.button
									className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-black/50 transition-colors touch-manipulation"
									onClick={() => setActive(null)}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ delay: 0.1 }}
								>
									<CloseIcon />
								</motion.button>

								{/* Modal Content - Mobile optimized scrolling */}
								<div className="flex flex-col max-h-[90vh] sm:max-h-[95vh]">
									{/* Header Image - Mobile responsive height */}
									<motion.div
										layoutId={`image-${active.title}-${id}`}
										className="relative h-48 sm:h-64 lg:h-80 flex-shrink-0"
									>
										<img
											src={active.thumbnail}
											alt={active.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

										{/* Logo and Title Overlay - Mobile responsive */}
										<div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-12 sm:right-16">
											<div className="flex items-center gap-2 sm:gap-3 mb-2">
												<motion.h3
													layoutId={`title-${active.title}-${id}`}
													className="font-bold text-white text-lg sm:text-xl lg:text-2xl leading-tight"
												>
													{active.title}
												</motion.h3>
											</div>
											<motion.p
												layoutId={`description-${active.description}-${id}`}
												className="text-white/90 text-sm sm:text-base lg:text-lg font-semibold leading-tight"
											>
												{active.shortDescription}
											</motion.p>
										</div>
									</motion.div>

									{/* Scrollable Content Area - Mobile optimized */}
									<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
										<div className="p-4 sm:p-6 lg:p-8">
											{/* Main Content - Mobile typography */}
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 }}
												className="prose prose-sm sm:prose prose-neutral dark:prose-invert max-w-none"
											>
												<ReactMarkdown>
													{active.description}
												</ReactMarkdown>
											</motion.div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					) : null}
				</AnimatePresence>

				{/* Cards Grid - Mobile first approach */}
				<div className={`grid gap-4 sm:gap-6 ${gridColsClass} w-full `}>
					{caseStudies.map((card, index) => {
						return (
							<motion.div
								layoutId={`card-${card.title}-${id}`}
								key={card.title}
								onClick={() => setActive(card)}
								className={[
									"group relative flex flex-col justify-end overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg touch-manipulation",
									// unified aspect ratios so layout stays clean for any count
									"aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]",
								].join(" ")}
							>
								<motion.div
									layoutId={`image-${card.title}-${id}`}
									className="absolute inset-0"
								>
									<img
										src={card.thumbnail}
										alt={card.title}
										className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-all duration-500"></div>
								</motion.div>

								{/* Content - Mobile responsive */}
								<div className="relative z-10 p-3 sm:p-6 pt-0">
									<motion.h3
										layoutId={`title-${card.title}-${id}`}
										className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight"
									>
										{card.title}
									</motion.h3>
									<motion.p
										layoutId={`description-${card.description}-${id}`}
										className="text-white/90 text-sm sm:text-base font-medium max-w-sm leading-tight"
									>
										{card.shortDescription}
									</motion.p>

									{/* Hover indicator - Hidden on touch devices */}
									<div className="mt-3 sm:mt-4 items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex">
										<span className="text-xs sm:text-sm font-semibold mr-2">
											View Details
										</span>
										<svg
											className="w-3 h-3 sm:w-4 sm:h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>

									{/* Mobile tap indicator */}
									<div className="mt-3 flex items-center text-primary/70 sm:hidden">
										<span className="text-xs font-medium">
											Tap to view details
										</span>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
			<div className="mt-12 flex justify-center">
				<Link
					href="/case-studies"
					aria-label="View more case studies"
					className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 underline transition-colors flex justify-center items-center gap-[1ch]"
				>
					View more case studies <ArrowUpRight />
				</Link>
			</div>
		</section>
	);
};

export { ResponsiveGridCasestudies };
