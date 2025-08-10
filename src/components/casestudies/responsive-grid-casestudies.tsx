"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/lib/hooks/use-outside-click";
import usePersonalized from "@/hooks/use-personalized";

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

const casestudyCards = [
	{
		title: "E-commerce Personalization",
		description: "300% increase in conversion rates",
		src: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/shopify.svg",
		logoAlt: "Shopify logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/ecommerce",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						We partnered with a leading e-commerce platform to
						implement AI-powered personalization that revolutionized
						their customer experience.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Low conversion rates due to generic product
								recommendations and poor user engagement.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Implemented machine learning algorithms to
								analyze user behavior, purchase history, and
								preferences to deliver personalized product
								recommendations in real-time.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>300% increase in conversion rates</li>
								<li>45% improvement in average order value</li>
								<li>60% reduction in cart abandonment</li>
								<li>2.5x increase in customer retention</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "Automated Customer Support",
		description: "85% reduction in response time",
		src: "https://images.unsplash.com/photo-1558137343-d482613b191b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/zendesk.svg",
		logoAlt: "Zendesk logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/customer-support",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						Transformed customer service operations with an
						intelligent AI chatbot system that handles complex
						queries and provides instant support.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								High support ticket volume causing delayed
								responses and decreased customer satisfaction.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Developed an AI-powered chatbot with natural
								language processing capabilities, integrated
								with existing CRM systems for seamless customer
								interactions.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>85% reduction in response time</li>
								<li>70% of queries resolved automatically</li>
								<li>90% customer satisfaction rate</li>
								<li>50% reduction in support costs</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "Predictive Analytics Platform",
		description: "40% improvement in forecasting accuracy",
		src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/tableau.svg",
		logoAlt: "Tableau logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/predictive-analytics",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						Built a comprehensive predictive analytics platform that
						transforms raw business data into actionable insights
						for strategic decision-making.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Inaccurate demand forecasting leading to
								inventory issues and missed revenue
								opportunities.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Created advanced machine learning models that
								analyze historical data, market trends, and
								external factors to provide accurate
								forecasting.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>40% improvement in forecasting accuracy</li>
								<li>30% reduction in inventory costs</li>
								<li>25% increase in revenue</li>
								<li>Real-time dashboard with 99.9% uptime</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "Supply Chain Optimization",
		description: "25% cost reduction",
		src: "https://images.unsplash.com/photo-1577562479868-6f099684a0d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/dhl.svg",
		logoAlt: "DHL logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/supply-chain",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						Revolutionized supply chain operations through
						AI-powered optimization algorithms that streamline
						logistics and reduce operational costs.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Inefficient routing and inventory management
								causing high operational costs and delivery
								delays.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Implemented AI algorithms for route
								optimization, demand forecasting, and automated
								inventory management across the entire supply
								chain.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>25% reduction in operational costs</li>
								<li>40% faster delivery times</li>
								<li>95% on-time delivery rate</li>
								<li>50% reduction in inventory waste</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "Content Generation AI",
		description: "10x faster content creation",
		src: "https://images.unsplash.com/photo-1677756119517-756a188d2d9b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/notion.svg",
		logoAlt: "Notion logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/content-generation",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						Developed an advanced AI content generation system that
						produces high-quality, brand-consistent content across
						multiple formats and platforms.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Time-consuming content creation process limiting
								marketing campaign scale and consistency.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Built a custom AI system trained on brand
								guidelines that generates blog posts, social
								media content, and marketing copy with
								human-level quality.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>10x faster content creation</li>
								<li>95% brand consistency score</li>
								<li>60% increase in content output</li>
								<li>80% reduction in content costs</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "Fraud Detection System",
		description: "99.9% accuracy rate",
		src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/cloudflare.svg",
		logoAlt: "Cloudflare logo",
		ctaText: "View Case Study",
		ctaLink: "https://chainlabs.com/case-studies/fraud-detection",
		content: () => {
			return (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						Implemented a sophisticated AI-powered fraud detection
						system that provides real-time protection against
						financial crimes and cyber threats.
					</p>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Challenge
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Rising fraud rates causing significant financial
								losses and decreased customer trust.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Solution
							</h4>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Developed machine learning models that analyze
								transaction patterns, user behavior, and risk
								factors to detect fraudulent activities in
								milliseconds.
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
								Results
							</h4>
							<ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
								<li>99.9% fraud detection accuracy</li>
								<li>90% reduction in false positives</li>
								<li>$2M+ prevented fraud losses</li>
								<li>Sub-100ms response time</li>
							</ul>
						</div>
					</div>
				</div>
			);
		},
	},
];

type CaseStudyCard = (typeof casestudyCards)[number]; // added

const ResponsiveGridCasestudies = () => {
	const [active, setActive] = useState<CaseStudyCard | boolean | null>(null); // typed
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);

	// Fetch personalized data
	const { data, isLoading, error, refresh } = usePersonalized(); // added

	// Map personalized recommendations to card shape with safe defaults
	const personalizedCards: CaseStudyCard[] = React.useMemo(() => {
		const recs = data?.recommendedCaseStudies ?? [];
		if (!recs.length) return [];
		const placeholders = [
			"https://images.unsplash.com/photo-1677756119517-756a188d2d9b?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1558137343-d482613b191b?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1577562479868-6f099684a0d3?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
		];
		return recs.map((cs, idx) => ({
			title: cs.title,
			description: cs.summary,
			src: placeholders[idx % placeholders.length],
			logo: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/notion.svg",
			logoAlt: "Case study",
			ctaText: "View Case Study",
			ctaLink: `/case-studies/${encodeURIComponent(cs.id)}`,
			content: () => (
				<div className="space-y-4">
					<p className="text-neutral-600 dark:text-neutral-400">
						{cs.summary}
					</p>
				</div>
			),
		}));
	}, [data]);

	// Prefer personalized; fill with defaults to maintain grid size
	const cards: CaseStudyCard[] = React.useMemo(() => {
		if (!personalizedCards.length) return casestudyCards;
		const merged = [...personalizedCards, ...casestudyCards];
		const seen = new Set<string>();
		return merged
			.filter((c) =>
				seen.has(c.title) ? false : (seen.add(c.title), true)
			)
			.slice(0, casestudyCards.length);
	}, [personalizedCards]);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setActive(false);
			}
		}
		if (active && typeof active === "object") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [active]);

	useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
		setActive(null)
	);

	return (
		<section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto">
				{/* Header - Mobile optimized */}
				<div className="mb-8 sm:mb-12 text-center">
					<h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
						{data?.headline ?? "AI Solutions in Action"}
					</h2>
					<p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
						{data?.goal?.description ??
							"See how we've transformed businesses across industries"}
					</p>

					{/* Status UI */}
					{isLoading && (
						<p className="mt-2 text-xs text-muted-foreground">
							Loading personalized case studies…
						</p>
					)}
					{error && (
						<div className="mt-2 flex items-center justify-center gap-3">
							<p className="text-xs text-destructive/90">
								{error}
							</p>
							<button
								type="button"
								onClick={() => void refresh()}
								className="text-xs underline text-primary"
							>
								Retry
							</button>
						</div>
					)}
				</div>

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
							className="fixed inset-0 flex items-start sm:items-center justify-center p-1 sm:p-4 z-[70] overflow-y-auto"
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
											src={active.src}
											alt={active.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

										{/* Logo and Title Overlay - Mobile responsive */}
										<div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-12 sm:right-16">
											<div className="flex items-center gap-2 sm:gap-3 mb-2">
												<div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
													<img
														src={active.logo}
														alt={active.logoAlt}
														className="h-4 w-4 sm:h-6 sm:w-6 brightness-0 invert"
													/>
												</div>
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
												{active.description}
											</motion.p>
										</div>
									</motion.div>

									{/* Scrollable Content Area - Mobile optimized */}
									<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
										<div className="p-4 sm:p-6 lg:p-8">
											{/* CTA Button - Mobile responsive */}
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.2 }}
												className="mb-4 sm:mb-6"
											>
												<a
													href={active.ctaLink}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl touch-manipulation"
												>
													{active.ctaText}
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
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</a>
											</motion.div>

											{/* Main Content - Mobile typography */}
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 }}
												className="prose prose-sm sm:prose prose-neutral dark:prose-invert max-w-none"
											>
												{typeof active.content ===
												"function"
													? active.content()
													: active.content}
											</motion.div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					) : null}
				</AnimatePresence>

				{/* Cards Grid - Mobile first approach */}
				<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:max-w-6xl lg:mx-auto">
					{cards.map((card, index) => {
						// On mobile: all cards are same size
						// On desktop: maintain the large card layout
						const isLargeCard = index === 0 || index === 4;

						return (
							<motion.div
								layoutId={`card-${card.title}-${id}`}
								key={card.title}
								onClick={() => setActive(card)}
								className={`group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg touch-manipulation ${
									isLargeCard
										? "aspect-[4/3] sm:row-span-2 sm:aspect-square lg:aspect-auto sm:h-full sm:min-h-[400px]"
										: "aspect-[4/3] sm:aspect-3/2 md:aspect-2/1 sm:min-h-[250px]"
								}`}
								whileHover={{ y: -5 }}
								whileTap={{ scale: 0.98 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<motion.div
									layoutId={`image-${card.title}-${id}`}
									className="absolute inset-0"
								>
									<img
										src={card.src}
										alt={card.title}
										className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-all duration-500"></div>
								</motion.div>

								{/* Logo - Mobile responsive */}
								<div className="relative z-10 p-3 sm:p-6">
									<div className="inline-block p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
										<img
											src={card.logo}
											alt={card.logoAlt}
											className="h-4 w-4 sm:h-6 sm:w-6 brightness-0 invert"
										/>
									</div>
								</div>

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
										{card.description}
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
		</section>
	);
};

export { ResponsiveGridCasestudies };
