"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useGlobalStore } from "@/global-store";

declare global {
	interface Window {
		dataLayer?: any[];
		gtag?: (...args: any[]) => void;
		clarity?: (...args: any[]) => void & { q?: any[] };
	}
}

function RouteAnalyticsInner() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const store = useGlobalStore();

	useEffect(() => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		const pagePath = `${pathname}${
			searchParams?.toString() ? `?${searchParams.toString()}` : ""
		}`;

		try {
			// Enhanced GA4 tracking with custom dimensions
			if (typeof window.gtag === "function") {
				// Send page view with custom data
				window.gtag("event", "page_view", {
					page_title: document.title,
					page_location: url,
					page_path: pagePath,
					// Custom dimensions for GA4
					custom_dimensions: {
						has_goal: store.goal ? "yes" : "no",
						is_personalized: store.personalised ? "yes" : "no",
						personalization_status: store.personalised?.status || "none",
						missions_completed: store.missions.filter(m => m.status === "completed").length,
						missions_total: store.missions.length,
						call_unlocked: store.callUnlocked ? "yes" : "no",
						user_points: store.pointsTotal,
						has_session: store.hasSession ? "yes" : "no",
						theme: store.theme
					}
				});

				// Send user properties if personalized
				if (store.personalised?.sid) {
					window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2TXCJ3VJ1B", {
						user_id: store.personalised.sid,
						user_properties: {
							goal_set: store.goal ? "true" : "false",
							personalization_status: store.personalised.status,
							total_points: store.pointsTotal
						}
					});
				}

				console.log("[GA4] Page view sent:", pagePath);
			}

			// Enhanced GTM dataLayer push
			if (Array.isArray(window.dataLayer)) {
				window.dataLayer.push({
					event: "page_view_enhanced",
					page_path: pagePath,
					page_location: url,
					page_title: document.title,
					// Custom data for GTM
					user_data: {
						has_goal: !!store.goal,
						goal_text: store.goal || undefined,
						is_personalized: !!store.personalised,
						personalization_status: store.personalised?.status || undefined,
						session_id: store.personalised?.sid || undefined,
						missions_completed: store.missions.filter(m => m.status === "completed").length,
						missions_total: store.missions.length,
						missions_progress_percent: store.missions.length > 0 
							? Math.round((store.missions.filter(m => m.status === "completed").length / store.missions.length) * 100)
							: 0,
						call_unlocked: store.callUnlocked,
						user_points: store.pointsTotal,
						has_session: store.hasSession,
						theme: store.theme,
						has_completed_onboarding: store.hasCompletedOnboarding
					},
					timestamp: new Date().toISOString()
				});

				console.log("[GTM] Enhanced page view pushed to dataLayer");
			}

			// Clarity page tracking with metadata
			if (typeof window.clarity === "function") {
				// Set page-specific data
				window.clarity("set", "page_path", pagePath);
				window.clarity("set", "page_title", document.title);
				
				// Set user state for this page view
				if (store.personalised?.sid) {
					window.clarity("set", "user_session_id", store.personalised.sid);
				}
				window.clarity("set", "user_has_goal", store.goal ? "true" : "false");
				window.clarity("set", "user_points", String(store.pointsTotal));
				
				// Track page change event
				window.clarity("event", "spa_navigation");
				
				console.log("[Clarity] Page navigation tracked:", pagePath);
			}
		} catch (error) {
			console.error("[Analytics] Error tracking page view:", error);
		}
	}, [pathname, searchParams, store.goal, store.personalised, store.missions, store.pointsTotal]);

	// Track route-specific events
	useEffect(() => {
		// Track specific page interactions
		const trackPageSpecificEvents = () => {
			try {
				// Track landing on specific pages
				if (pathname === "/" && typeof window.gtag === "function") {
					window.gtag("event", "homepage_view", {
						has_goal: !!store.goal,
						is_returning_user: !!store.hasCompletedOnboarding
					});
				} else if (pathname.includes("/case-study") && typeof window.gtag === "function") {
					const caseStudyId = pathname.split("/").pop();
					window.gtag("event", "case_study_view", {
						case_study_id: caseStudyId,
						has_goal: !!store.goal
					});
				} else if (pathname === "/book" && typeof window.gtag === "function") {
					window.gtag("event", "booking_page_view", {
						call_unlocked: store.callUnlocked,
						user_points: store.pointsTotal
					});
				}
			} catch (error) {
				console.error("[Analytics] Error tracking page-specific events:", error);
			}
		};

		trackPageSpecificEvents();
	}, [pathname, store]);

	return null;
}

export default function RouteAnalytics() {
	return (
		<Suspense fallback={null}>
			<RouteAnalyticsInner />
		</Suspense>
	);
}