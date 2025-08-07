"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChainLabsHero from "@/components/hero/chain-labs-hero";
import AIChatBubble from "@/components/chat/ai-chat-bubble";
import { SplashScreen } from "@/components/splash/splash-screen";
import { useUI } from "@/hooks/use-ui";
import { ScrollingCarouselTestimonials } from "@/components/testimonials/scrolling-carousel-testimonials";
import { ResponsiveGridCasestudies } from "@/components/casestudies/responsive-grid-casestudies";
import { BookCallSection } from "@/components/book/book-a-call";
import { motion } from "motion/react";

export default function Home() {
	const [showSplash, setShowSplash] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const { showPersonalized } = useUI();

	const handleSplashComplete = () => {
		setShowSplash(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;

			// Consider scrolled if we've scrolled more than 80% of viewport height
			setIsScrolled(scrollPosition > windowHeight * 0.8);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (showPersonalized && showSplash) {
		return <SplashScreen onComplete={handleSplashComplete} />;
	}

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-start overflow-x-hidden bg-background">
			<Header
				isScrolled={isScrolled}
				showPersonalized={showPersonalized}
			/>

			<div className="w-full">
				{showPersonalized ? (
					<section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
						<div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-16">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<ScrollingCarouselTestimonials />
								<ResponsiveGridCasestudies />
								<BookCallSection />
							</motion.div>
						</div>
					</section>
				) : (
					<ChainLabsHero />
				)}
			</div>

			<Footer showPersonalized={showPersonalized} />
			<AIChatBubble />
		</main>
	);
}
