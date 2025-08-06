"use client";

import { FloatingNavbar } from "@/components/navbars/floating-navbar";
import ChainLabsHero from "@/components/hero/chain-labs-hero";
import { ResponsiveGridCasestudies } from "@/components/casestudies/responsive-grid-casestudies";
import { ScrollingCarouselTestimonials } from "@/components/testimonials/scrolling-carousel-testimonials";
import AIChatBubble from "@/components/chat/ai-chat-bubble";
import { useState } from "react";
import { SplashScreen } from "@/components/splash/splash-screen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-background">
      <ChainLabsHero />
      {/* <ResponsiveGridCasestudies /> */}
      {/* <ScrollingCarouselTestimonials /> */}
      <AIChatBubble />
    </main>
  );
}