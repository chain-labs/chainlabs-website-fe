"use client";

import { useEffect } from "react";
import { useGlobalStore } from "@/global-store";

declare global {
	interface Window {
		clarity?: (...args: any[]) => void & { q?: any[] };
	}
}

function callClarity(fn: string, ...args: any[]) {
	try {
		if (
			typeof window !== "undefined" &&
			typeof window.clarity === "function"
		) {
			// Wait for Clarity to be fully loaded
			if (window.clarity && typeof window.clarity === "function") {
				// @ts-ignore
				window.clarity(fn, ...args);
				console.log(`[Clarity] Called: ${fn}`, args); // Debug log
			}
		}
	} catch (error) {
		console.error("[Clarity] Error:", error);
	}
}

// Helper to ensure Clarity is loaded before sending events
function waitForClarity(callback: () => void, maxAttempts = 20) {
	let attempts = 0;
	const interval = setInterval(() => {
		if (
			typeof window !== "undefined" &&
			typeof window.clarity === "function"
		) {
			clearInterval(interval);
			callback();
		} else if (attempts >= maxAttempts) {
			clearInterval(interval);
			console.warn("[Clarity] Failed to load after maximum attempts");
		}
		attempts++;
	}, 500);
}

export default function ClarityAnalytics() {
	const store = useGlobalStore();

	// Initialize Clarity custom data once loaded
	useEffect(() => {
		waitForClarity(() => {
			// Set initial session data
			const sessionId = store.personalised?.sid || "unknown";
			callClarity("set", "session_id", sessionId);
			callClarity("set", "has_goal", String(!!store.goal));
			console.log("[Clarity] Initialized with session:", sessionId);
		});
	}, []);

	// Click tracking with improved data capture
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;

			const el =
				(target.closest(
					'[data-clarity-event], [data-analytics], a, button, [role="button"]'
				) as HTMLElement) || target;

			// Get event name and metadata
			const eventName =
				el.getAttribute("data-clarity-event") ||
				el.getAttribute("data-analytics") ||
				"ui_click";

			// Collect all data attributes
			const customData: Record<string, string> = {};

			// Standard attributes
			customData.element_type = el.tagName.toLowerCase();
			customData.element_id = el.id || "none";
			customData.element_class = el.className || "none";

			// Custom data attributes
			if (el.getAttribute("data-component")) {
				customData.component = el.getAttribute("data-component")!;
			}
			if (el.getAttribute("data-case-study-id")) {
				customData.case_study_id =
					el.getAttribute("data-case-study-id")!;
			}
			if (el.getAttribute("data-mission-id")) {
				customData.mission_id = el.getAttribute("data-mission-id")!;
			}

			// Link specific
			if (el instanceof HTMLAnchorElement && el.href) {
				customData.link_href = el.href;
				customData.link_target = el.target || "self";
			}

			// Text content (sanitized)
			const text = (el.textContent || "").trim().slice(0, 50);
			if (text) {
				customData.element_text = text;
			}

			// Send custom data to Clarity
			Object.entries(customData).forEach(([key, value]) => {
				if (value && value !== "none") {
					callClarity("set", `click_${key}`, value);
				}
			});

			// Send the event
			callClarity("event", eventName);

			console.log("[Clarity] Click event:", eventName, customData);
		};

		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, { capture: true });
	}, []);

	// Track personalization status changes
	useEffect(() => {
		let lastStatus: string | undefined;

		const unsub = useGlobalStore.subscribe((state) => {
			const status = state.personalised?.status;
			if (!status || status === lastStatus) return;

			lastStatus = status;

			// Send status update to Clarity
			callClarity("set", "personalization_status", status);
			callClarity("set", "has_personalization", "true");

			// Send specific events based on status
			if (status === "CLARIFIED") {
				callClarity("event", "personalization_completed");
				// Also send the personalized data
				if (state.personalised) {
					callClarity("set", "user_goal", state.goal || "none");
					callClarity(
						"set",
						"user_headline",
						state.headline || "none"
					);
				}
			} else if (status === "GOAL_SET") {
				callClarity("event", "personalization_started");
			} else {
				callClarity("event", "personalization_status_changed");
			}

			console.log("[Clarity] Personalization status:", status);
		});

		return () => unsub();
	}, []);

	// Track missions progress
	useEffect(() => {
		let lastCompletedCount = -1;

		const checkMissions = () => {
			const missions = store.missions;
			const completedCount = missions.filter(
				(m) => m.status === "completed"
			).length;
			const totalCount = missions.length;

			if (completedCount !== lastCompletedCount) {
				lastCompletedCount = completedCount;

				// Send mission metrics
				callClarity("set", "missions_total", String(totalCount));
				callClarity(
					"set",
					"missions_completed",
					String(completedCount)
				);
				callClarity(
					"set",
					"missions_pending",
					String(totalCount - completedCount)
				);

				if (totalCount > 0) {
					const progressPercent = Math.round(
						(completedCount / totalCount) * 100
					);
					callClarity(
						"set",
						"missions_progress_percent",
						String(progressPercent)
					);
				}

				callClarity("event", "missions_progress_updated");
				console.log(
					"[Clarity] Missions updated:",
					completedCount,
					"/",
					totalCount
				);
			}
		};

		// Check immediately
		checkMissions();

		// Subscribe to changes
		const unsub = useGlobalStore.subscribe((state) => {
			if (state.missions) {
				checkMissions();
			}
		});

		return () => unsub();
	}, [store.missions]);

	// Track time spent on different sections
	useEffect(() => {
		const reportedTimes: Record<string, number> = {};
		const REPORT_INTERVAL = 10; // Report every 10 seconds of activity

		const reportTime = (category: string, id: string, seconds: number) => {
			const key = `${category}_${id}`;
			const lastReported = reportedTimes[key] || 0;

			if (seconds - lastReported >= REPORT_INTERVAL) {
				reportedTimes[key] = seconds;

				// Send time data to Clarity
				callClarity("set", `${category}_current_id`, id);
				callClarity("set", `${category}_time_seconds`, String(seconds));
				callClarity("event", `${category}_time_milestone`);

				console.log(
					`[Clarity] Time tracked: ${category} ${id} = ${seconds}s`
				);
			}
		};

		const unsub = useGlobalStore.subscribe((state) => {
			// Track case study time
			if (state.caseStudyTimeSpent) {
				Object.entries(state.caseStudyTimeSpent).forEach(
					([id, seconds]) => {
						if (seconds > 0) {
							reportTime("case_study", id, seconds);
						}
					}
				);
			}

			// Track process section time
			if (state.processSectionTimeSpent) {
				Object.entries(state.processSectionTimeSpent).forEach(
					([id, seconds]) => {
						if (seconds > 0) {
							reportTime("process_section", id, seconds);
						}
					}
				);
			}

			// Track VAPI (voice) time
			if (state.vapiTimeSpent > 0) {
				const vapiMinutes = Math.floor(state.vapiTimeSpent / 60);
				if (vapiMinutes > 0 && state.vapiTimeSpent % 60 === 0) {
					callClarity(
						"set",
						"vapi_time_minutes",
						String(vapiMinutes)
					);
					callClarity("event", "vapi_time_milestone");
				}
			}
		});

		return () => unsub();
	}, []);

	// Track page engagement time
	useEffect(() => {
		let totalSeconds = 0;
		let isActive = document.visibilityState === "visible";

		const handleVisibilityChange = () => {
			isActive = document.visibilityState === "visible";
			if (isActive) {
				callClarity("event", "page_reactivated");
			}
		};

		const interval = setInterval(() => {
			if (isActive) {
				totalSeconds++;

				// Report engagement milestones
				if (totalSeconds === 30) {
					callClarity("set", "engagement_30s", "true");
					callClarity("event", "engagement_30_seconds");
				} else if (totalSeconds === 60) {
					callClarity("set", "engagement_1m", "true");
					callClarity("event", "engagement_1_minute");
				} else if (totalSeconds === 300) {
					callClarity("set", "engagement_5m", "true");
					callClarity("event", "engagement_5_minutes");
				} else if (totalSeconds % 300 === 0) {
					// Every 5 minutes after the first
					const minutes = totalSeconds / 60;
					callClarity(
						"set",
						"engagement_minutes",
						String(Math.floor(minutes))
					);
					callClarity("event", "engagement_milestone");
				}
			}
		}, 1000);

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			);
		};
	}, []);

	// Track scroll depth on important elements
	useEffect(() => {
		const trackedElements = new Map<
			Element,
			{
				name: string;
				hasViewed: boolean;
				viewStart: number;
				totalTime: number;
			}
		>();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const data = trackedElements.get(entry.target);
					if (!data) return;

					if (entry.isIntersecting && !data.hasViewed) {
						data.hasViewed = true;
						data.viewStart = Date.now();

						callClarity("set", `viewed_${data.name}`, "true");
						callClarity("event", `${data.name}_viewed`);
						console.log(`[Clarity] Element viewed: ${data.name}`);
					} else if (!entry.isIntersecting && data.viewStart > 0) {
						const viewTime = Math.floor(
							(Date.now() - data.viewStart) / 1000
						);
						data.totalTime += viewTime;
						data.viewStart = 0;

						if (viewTime > 3) {
							// Only track if viewed for more than 3 seconds
							callClarity(
								"set",
								`${data.name}_view_time`,
								String(data.totalTime)
							);
							callClarity("event", `${data.name}_view_ended`);
						}
					}
				});
			},
			{ threshold: 0.5 } // Element must be 50% visible
		);

		// Scan for trackable elements
		const scanElements = () => {
			// Track elements with data-clarity-track attribute
			document.querySelectorAll("[data-clarity-track]").forEach((el) => {
				if (!trackedElements.has(el)) {
					const name =
						el.getAttribute("data-clarity-track") || "element";
					trackedElements.set(el, {
						name,
						hasViewed: false,
						viewStart: 0,
						totalTime: 0,
					});
					observer.observe(el);
				}
			});

			// Auto-track certain important sections
			const importantSelectors = [
				{ selector: "#hero-section", name: "hero" },
				{ selector: "#booking-section", name: "booking" },
				{ selector: "#case-studies", name: "case_studies" },
				{ selector: "#process-section", name: "process" },
				{ selector: "#testimonials", name: "testimonials" },
			];

			importantSelectors.forEach(({ selector, name }) => {
				const el = document.querySelector(selector);
				if (el && !trackedElements.has(el)) {
					trackedElements.set(el, {
						name,
						hasViewed: false,
						viewStart: 0,
						totalTime: 0,
					});
					observer.observe(el);
				}
			});
		};

		// Initial scan
		scanElements();

		// Rescan periodically for dynamic content
		const rescanInterval = setInterval(scanElements, 5000);

		return () => {
			clearInterval(rescanInterval);
			observer.disconnect();
		};
	}, []);

	return null;
}
