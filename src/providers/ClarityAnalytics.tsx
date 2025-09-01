"use client";

import { useEffect, useMemo, useRef } from "react";
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
			// @ts-ignore
			window.clarity(fn, ...args);
		}
	} catch {}
}

export default function ClarityAnalytics() {
	const store = useGlobalStore();

	// Click tracking: attribute-first, fall back to safe text
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			const el =
				(target.closest(
					'[data-clarity-event], [data-analytics], a, button, [role="button"]'
				) as HTMLElement) || target;

			const eventName =
				el.getAttribute("data-clarity-event") || "ui_click";
			const meta: Record<string, string> = {};
			const attr = (k: string) => el.getAttribute(k) || "";
			meta.component = attr("data-component") || el.tagName.toLowerCase();
			meta.case_study_id = attr("data-case-study-id") || "";
			meta.mission_id = attr("data-mission-id") || "";
			meta.href =
				(el as HTMLAnchorElement).href || attr("data-href") || "";
			meta.role = el.getAttribute("role") || "";
			const label = attr("aria-label") || attr("data-label") || "";
			const text = label || (el.textContent || "").trim();
			meta.text = text.slice(0, 48);

			// Set safe metadata then fire event
			Object.entries(meta).forEach(
				([k, v]) => v && callClarity("set", k, v)
			);
			callClarity("event", eventName);
		};
		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, {
				capture: true,
			} as any);
	}, []);

	// Personalization status events
	useEffect(() => {
		let lastStatus: string | undefined;
		const unsub = useGlobalStore.subscribe((s) => {
			const status = s.personalised?.status;
			if (!status || status === lastStatus) return;
			lastStatus = status;
			callClarity("set", "personalization_status", status);
			callClarity(
				"event",
				status === "CLARIFIED"
					? "personalization_created"
					: "personalization_status_change"
			);
		});
		return () => unsub();
	}, []);

	// Missions completed count
	useEffect(() => {
		let lastCompleted = -1;
		const getCompleted = () =>
			store.missions.filter((m) => m.status === "completed").length;
		const handler = () => {
			const c = getCompleted();
			if (c === lastCompleted) return;
			lastCompleted = c;
			callClarity("set", "missions_completed", String(c));
			callClarity("event", "missions_completed_update");
		};
		handler();
		const unsub = useGlobalStore.subscribe((s) => {
			if (s.missions) handler();
		});
		return () => unsub();
	}, [store]);

	// Time trackers: case studies, process, vapi (speech)
	useEffect(() => {
		const lastReported: Record<string, number> = {};
		const reportThreshold = 5; // seconds

		const tryReportMap = (prefix: string, map: Record<string, number>) => {
			Object.entries(map || {}).forEach(([id, seconds]) => {
				const key = `${prefix}:${id}`;
				if (
					!lastReported[key] ||
					seconds - lastReported[key] >= reportThreshold
				) {
					lastReported[key] = seconds;
					callClarity("set", `${prefix}_seconds`, String(seconds));
					callClarity("set", `${prefix}_id`, id);
					callClarity("event", `${prefix}_time_update`);
				}
			});
		};

		let lastCaseStudyTimeSpent: Record<string, number> | undefined;
		let lastProcessSectionTimeSpent: Record<string, number> | undefined;
		let lastVapiTimeSpent: number | undefined;

		const unsub1 = useGlobalStore.subscribe((s) => {
			if (s.caseStudyTimeSpent !== lastCaseStudyTimeSpent) {
				lastCaseStudyTimeSpent = s.caseStudyTimeSpent;
				tryReportMap("case_study", s.caseStudyTimeSpent);
			}
			if (s.processSectionTimeSpent !== lastProcessSectionTimeSpent) {
				lastProcessSectionTimeSpent = s.processSectionTimeSpent;
				tryReportMap("process", s.processSectionTimeSpent);
			}
			if (s.vapiTimeSpent !== lastVapiTimeSpent) {
				lastVapiTimeSpent = s.vapiTimeSpent;
				if (
					s.vapiTimeSpent &&
					s.vapiTimeSpent % reportThreshold === 0
				) {
					callClarity("set", "vapi_seconds", String(s.vapiTimeSpent));
					callClarity("event", "vapi_time_update");
				}
			}
		});

		return () => {
			unsub1();
		};
	}, []);

	// Engagement heartbeat (active time while page visible)
	useEffect(() => {
		let active = document.visibilityState === "visible";
		let seconds = 0;
		let iv: number | undefined;
		const onVis = () => {
			active = document.visibilityState === "visible";
		};
		const tick = () => {
			if (active) {
				seconds += 1;
				if (seconds % 15 === 0) {
					callClarity("set", "engagement_seconds", String(seconds));
					callClarity("event", "engagement_heartbeat");
				}
			}
		};
		iv = window.setInterval(tick, 1000) as unknown as number;
		document.addEventListener("visibilitychange", onVis);
		return () => {
			if (iv) window.clearInterval(iv);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);

	// Generic timers for elements with data-clarity-timer="name" (e.g., booking)
	useEffect(() => {
		const elements = new Map<
			Element,
			{ name: string; visible: boolean; starts: number; total: number }
		>();

		const onIntersect = (entries: IntersectionObserverEntry[]) => {
			const now = Date.now();
			entries.forEach((entry) => {
				const el = entry.target;
				const rec = elements.get(el);
				if (!rec) return;
				if (entry.isIntersecting && !rec.visible) {
					rec.visible = true;
					rec.starts = now;
				} else if (!entry.isIntersecting && rec.visible) {
					rec.visible = false;
					if (rec.starts)
						rec.total += Math.max(
							0,
							Math.floor((now - rec.starts) / 1000)
						);
					rec.starts = 0;
				}
			});
		};
		const io = new IntersectionObserver(onIntersect, { threshold: 0.25 });

		const scan = () => {
			document
				.querySelectorAll<HTMLElement>("[data-clarity-timer]")
				.forEach((el) => {
					const name =
						el.getAttribute("data-clarity-timer") || "timer";
					if (!elements.has(el)) {
						elements.set(el, {
							name,
							visible: false,
							starts: 0,
							total: 0,
						});
						io.observe(el);
					}
				});
		};
		scan();
		const scanIv = window.setInterval(scan, 3000);

		const flushIv = window.setInterval(() => {
			const now = Date.now();
			elements.forEach((rec) => {
				let total = rec.total;
				if (rec.visible && rec.starts)
					total += Math.floor((now - rec.starts) / 1000);
				if (total > 0) {
					callClarity("set", `${rec.name}_seconds`, String(total));
					callClarity("event", `${rec.name}_time_update`);
				}
			});
		}, 10000);

		return () => {
			window.clearInterval(scanIv);
			window.clearInterval(flushIv);
			io.disconnect();
		};
	}, []);

	return null;
}
