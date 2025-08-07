"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChainLabsHero from "@/components/hero/chain-labs-hero";
import AIChatBubble from "@/components/chat/ai-chat-bubble";
import { SplashScreen } from "@/components/splash/splash-screen";
import { useUI } from "@/hooks/use-ui";

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-x-hidden bg-background">
      <Header isScrolled={isScrolled} showPersonalized={showPersonalized} />
      
      <div className="w-full">
        <ChainLabsHero />
      </div>
      
      <Footer showPersonalized={showPersonalized} />
      <AIChatBubble />
    </main>
  );
}