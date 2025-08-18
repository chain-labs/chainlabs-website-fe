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
import { useGlobalStore } from "@/global-store";
import { ProcessSection } from "@/components/process/process-section";
import { OurMissions } from "@/components/missions/missions-section";
import InitialLoadingScreen from "@/components/ui/initial-loading-screen";
import { useChat } from "@/hooks/use-chat";
import PersonaliseHeroSection from "@/components/personalise/personalise-hero-section";

export default function Home() {
	const [showSplash, setShowSplash] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const { showPersonalized } = useUI();
	const handleSplashComplete = () => {
		setShowSplash(false);
	};
	const { getPersonalizedContent } = useChat();

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;

			// Consider scrolled if we've scrolled more than 10% of viewport height
			setIsScrolled(scrollPosition > windowHeight * 0.01);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		getPersonalizedContent();
	}, []);

	if (showSplash && showPersonalized) {
		return <SplashScreen onComplete={handleSplashComplete} />;
	}

	return (
		<main className="relative flex flex-col items-center justify-start overflow-x-hidden bg-background">
			<Header
				isScrolled={isScrolled}
				showPersonalized={showPersonalized}
			/>

			<div className="w-full">
				{showPersonalized ? (
					<div className="flex flex-col items-center justify-center pt-8">
						<PersonaliseHeroSection />
						<ProcessSection />
						<ScrollingCarouselTestimonials />
						<ResponsiveGridCasestudies />
						<OurMissions />
						<BookCallSection />
					</div>
				) : (
					<ChainLabsHero />
				)}
			</div>

			<Footer showPersonalized={showPersonalized} />
			<AIChatBubble />
		</main>
	);
}
