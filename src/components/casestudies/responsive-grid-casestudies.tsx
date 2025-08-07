"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/lib/hooks/use-outside-click";

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
                        We partnered with a leading e-commerce platform to implement AI-powered personalization that revolutionized their customer experience.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Low conversion rates due to generic product recommendations and poor user engagement.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Implemented machine learning algorithms to analyze user behavior, purchase history, and preferences to deliver personalized product recommendations in real-time.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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
                        Transformed customer service operations with an intelligent AI chatbot system that handles complex queries and provides instant support.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                High support ticket volume causing delayed responses and decreased customer satisfaction.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Developed an AI-powered chatbot with natural language processing capabilities, integrated with existing CRM systems for seamless customer interactions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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
                        Built a comprehensive predictive analytics platform that transforms raw business data into actionable insights for strategic decision-making.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Inaccurate demand forecasting leading to inventory issues and missed revenue opportunities.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Created advanced machine learning models that analyze historical data, market trends, and external factors to provide accurate forecasting.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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
                        Revolutionized supply chain operations through AI-powered optimization algorithms that streamline logistics and reduce operational costs.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Inefficient routing and inventory management causing high operational costs and delivery delays.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Implemented AI algorithms for route optimization, demand forecasting, and automated inventory management across the entire supply chain.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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
                        Developed an advanced AI content generation system that produces high-quality, brand-consistent content across multiple formats and platforms.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Time-consuming content creation process limiting marketing campaign scale and consistency.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Built a custom AI system trained on brand guidelines that generates blog posts, social media content, and marketing copy with human-level quality.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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
                        Implemented a sophisticated AI-powered fraud detection system that provides real-time protection against financial crimes and cyber threats.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Challenge</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Rising fraud rates causing significant financial losses and decreased customer trust.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Solution</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Developed machine learning models that analyze transaction patterns, user behavior, and risk factors to detect fraudulent activities in milliseconds.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Results</h4>
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

const ResponsiveGridCasestudies = () => {
    const [active, setActive] = useState<
        (typeof casestudyCards)[number] | boolean | null
    >(null);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

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
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        AI Solutions in Action
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        See how we've transformed businesses across industries
                    </p>
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

                {/* Modal */}
                <AnimatePresence>
                    {active && typeof active === "object" ? (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]" style={{ zIndex: 70 }}>
                            <motion.div
                                layoutId={`card-${active.title}-${id}`}
                                ref={ref}
                                className="relative w-full max-w-4xl max-h-[95vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            >
                                {/* Close Button */}
                                <motion.button
                                    className="absolute top-4 right-4 z-10 flex items-center justify-center bg-white/10 backdrop-blur-sm dark:bg-black/20 rounded-full h-10 w-10 hover:bg-white/20 transition-colors"
                                    onClick={() => setActive(null)}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <CloseIcon />
                                </motion.button>

                                {/* Modal Content - Scrollable */}
                                <div className="flex flex-col h-full max-h-[95vh]">
                                    {/* Header Image */}
                                    <motion.div 
                                        layoutId={`image-${active.title}-${id}`}
                                        className="relative h-64 md:h-80 flex-shrink-0"
                                    >
                                        <img
                                            src={active.src}
                                            alt={active.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        
                                        {/* Logo and Title Overlay */}
                                        <div className="absolute bottom-6 left-6 right-16">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                                    <img
                                                        src={active.logo}
                                                        alt={active.logoAlt}
                                                        className="h-6 w-6 brightness-0 invert"
                                                    />
                                                </div>
                                                <motion.h3
                                                    layoutId={`title-${active.title}-${id}`}
                                                    className="font-bold text-white text-xl md:text-2xl"
                                                >
                                                    {active.title}
                                                </motion.h3>
                                            </div>
                                            <motion.p
                                                layoutId={`description-${active.description}-${id}`}
                                                className="text-white/90 text-lg font-semibold"
                                            >
                                                {active.description}
                                            </motion.p>
                                        </div>
                                    </motion.div>

                                    {/* Scrollable Content Area */}
                                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                        <div className="p-6 md:p-8">
                                            {/* CTA Button */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="mb-6"
                                            >
                                                <a
                                                    href={active.ctaLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                                                >
                                                    {active.ctaText}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </motion.div>

                                            {/* Main Content */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="prose prose-neutral dark:prose-invert max-w-none"
                                            >
                                                {typeof active.content === "function"
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

                {/* Cards Grid */}
                <div className="mx-auto grid max-w-2xl gap-6 lg:max-w-6xl lg:grid-cols-2">
                    {casestudyCards.map((card, index) => {
                        const isLargeCard = index === 0 || index === 4; // First and fifth cards are large
                        
                        return (
                            <motion.div
                                layoutId={`card-${card.title}-${id}`}
                                key={card.title}
                                onClick={() => setActive(card)}
                                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg ${
                                    isLargeCard 
                                        ? "row-span-2 aspect-square lg:aspect-auto h-full min-h-[400px]" 
                                        : "aspect-3/2 md:aspect-2/1 min-h-[250px]"
                                }`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
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

                                {/* Logo */}
                                <div className="relative z-10 p-6">
                                    <div className="inline-block p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                        <img
                                            src={card.logo}
                                            alt={card.logoAlt}
                                            className="h-6 w-6 brightness-0 invert"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-6 pt-0">
                                    <motion.h3
                                        layoutId={`title-${card.title}-${id}`}
                                        className="text-xl font-bold text-white mb-3 lg:text-2xl group-hover:text-primary transition-colors"
                                    >
                                        {card.title}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={`description-${card.description}-${id}`}
                                        className="text-white/90 text-base font-medium max-w-sm"
                                    >
                                        {card.description}
                                    </motion.p>
                                    
                                    {/* Hover indicator */}
                                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <span className="text-sm font-semibold mr-2">View Details</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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