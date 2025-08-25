"use client";
import { useEffect } from "react";
import { ResponsiveGridCasestudies } from "@/components/casestudies/responsive-grid-casestudies";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import PersonaliseHeroSection from "@/components/personalise/personalise-hero-section";
import { ScrollingCarouselTestimonials } from "@/components/testimonials/scrolling-carousel-testimonials";
import { useChat } from "@/hooks/use-chat";

export default function GenericSite() {
	const { getPersonalizedContent } = useChat();

	useEffect(() => {
		getPersonalizedContent();
	}, []);
	return (
		<main className="relative flex flex-col items-center justify-start overflow-x-hidden bg-background">
			<Header isScrolled={true} showPersonalized={true} />

			<div className="w-full">
				<div className="flex flex-col items-center justify-center pt-8">
					<PersonaliseHeroSection />
					<ScrollingCarouselTestimonials />
					<ResponsiveGridCasestudies />
				</div>
			</div>

			<Footer showPersonalized={true} />
		</main>
	);
}
