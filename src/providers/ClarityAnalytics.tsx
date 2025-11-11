"use client";

import { useEffect } from "react";
import { useGlobalStore } from "@/global-store";
import Clarity from "@microsoft/clarity";

// Helper to ensure Clarity is initialized
function isClarityReady(): boolean {
  return typeof window !== "undefined" && typeof window.clarity === "function";
}

// Safe wrapper for Clarity API calls
function callClarity(fn: string, ...args: any[]) {
  try {
    if (isClarityReady()) {
      // @ts-ignore - Clarity function is dynamic
      window.clarity(fn, ...args);
      console.log(`[Clarity] ✓ ${fn}`, args.length > 0 ? args : "");
    } else {
      console.warn(`[Clarity] ⚠ Not ready for: ${fn}`, args);
    }
  } catch (error) {
    console.error(`[Clarity] ✗ Error calling ${fn}:`, error);
  }
}

export default function ClarityAnalytics() {
  const store = useGlobalStore();
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "t2fz0iawei";
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

  // Initialize Clarity
  useEffect(() => {
    if (!enableAnalytics || !CLARITY_ID) {
      console.log("[Clarity] Analytics disabled or no project ID");
      return;
    }

    try {
      // Initialize Clarity with project ID
      Clarity.init(CLARITY_ID);
      console.log("[Clarity] 🚀 Initialized with project ID:", CLARITY_ID);

      // Set initial session data once Clarity is ready
      const checkAndSetSession = () => {
        if (isClarityReady()) {
          const sessionId = store.personalised?.sid;
          if (sessionId) {
            Clarity.identify(sessionId);
            Clarity.setTag("session_id", sessionId);
            console.log("[Clarity] ✓ Identified with session:", sessionId);
          }
          Clarity.setTag("has_goal", store.goal ? "true" : "false");
        } else {
          // Retry after a short delay
          setTimeout(checkAndSetSession, 100);
        }
      };

      checkAndSetSession();
    } catch (error) {
      console.error("[Clarity] ✗ Initialization error:", error);
    }
  }, [CLARITY_ID, enableAnalytics, store.personalised?.sid, store.goal]);

  // Click tracking with improved data capture
  useEffect(() => {
    if (!enableAnalytics) return;

    const onClick = (e: MouseEvent) => {
      if (!isClarityReady()) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const el =
        (target.closest(
          '[data-clarity-event], [data-analytics], a, button, [role="button"]',
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
      if (el.id) customData.element_id = el.id;
      if (el.className) customData.element_class = el.className;

      // Custom data attributes
      if (el.getAttribute("data-component")) {
        customData.component = el.getAttribute("data-component")!;
      }
      if (el.getAttribute("data-case-study-id")) {
        customData.case_study_id = el.getAttribute("data-case-study-id")!;
      }
      if (el.getAttribute("data-mission-id")) {
        customData.mission_id = el.getAttribute("data-mission-id")!;
      }

      // Link specific
      if (el instanceof HTMLAnchorElement && el.href) {
        customData.link_href = el.href;
        if (el.target) customData.link_target = el.target;
      }

      // Text content (sanitized, first 50 chars)
      const text = (el.textContent || "").trim().slice(0, 50);
      if (text) {
        customData.element_text = text;
      }

      // Send custom tags to Clarity using setTag API
      Object.entries(customData).forEach(([key, value]) => {
        if (value) {
          Clarity.setTag(`click_${key}`, value);
        }
      });

      // Send the event using event API
      Clarity.event(eventName);

      console.log("[Clarity] 🖱️ Click:", eventName, customData);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [enableAnalytics]);

  // Track personalization status changes
  useEffect(() => {
    if (!enableAnalytics || !isClarityReady()) return;

    let lastStatus: string | undefined;

    const unsub = useGlobalStore.subscribe((state) => {
      if (!isClarityReady()) return;
      
      const status = state.personalised?.status;
      if (!status || status === lastStatus) return;

      lastStatus = status;

      // Send status update to Clarity using setTag API
      Clarity.setTag("personalization_status", status);
      Clarity.setTag("has_personalization", "true");

      // Send specific events based on status
      if (status === "CLARIFIED") {
        Clarity.event("personalization_completed");
        // Also send the personalized data
        if (state.personalised && state.goal) {
          Clarity.setTag("user_goal", state.goal);
        }
        if (state.headline) {
          Clarity.setTag("user_headline", state.headline);
        }
      } else if (status === "GOAL_SET") {
        Clarity.event("personalization_started");
      } else {
        Clarity.event("personalization_status_changed");
      }

      console.log("[Clarity] 🎯 Personalization status:", status);
    });

    return () => unsub();
  }, [enableAnalytics]);

  // Track missions progress
  useEffect(() => {
    if (!enableAnalytics || !isClarityReady()) return;

    let lastCompletedCount = -1;

    const checkMissions = () => {
      if (!isClarityReady()) return;
      
      const missions = store.missions;
      const completedCount = missions.filter(
        (m) => m.status === "completed",
      ).length;
      const totalCount = missions.length;

      if (completedCount !== lastCompletedCount) {
        lastCompletedCount = completedCount;

        // Send mission metrics using setTag API
        Clarity.setTag("missions_total", String(totalCount));
        Clarity.setTag("missions_completed", String(completedCount));
        Clarity.setTag("missions_pending", String(totalCount - completedCount));

        if (totalCount > 0) {
          const progressPercent = Math.round(
            (completedCount / totalCount) * 100,
          );
          Clarity.setTag("missions_progress_percent", String(progressPercent));
        }

        Clarity.event("missions_progress_updated");
        console.log(
          "[Clarity] 🎯 Missions:",
          `${completedCount}/${totalCount}`,
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
  }, [store.missions, enableAnalytics]);

  // Track time spent on different sections
  useEffect(() => {
    if (!enableAnalytics || !isClarityReady()) return;

    const reportedTimes: Record<string, number> = {};
    const REPORT_INTERVAL = 10; // Report every 10 seconds of activity

    const reportTime = (category: string, id: string, seconds: number) => {
      if (!isClarityReady()) return;
      
      const key = `${category}_${id}`;
      const lastReported = reportedTimes[key] || 0;

      if (seconds - lastReported >= REPORT_INTERVAL) {
        reportedTimes[key] = seconds;

        // Send time data to Clarity using setTag API
        Clarity.setTag(`${category}_current_id`, id);
        Clarity.setTag(`${category}_time_seconds`, String(seconds));
        Clarity.event(`${category}_time_milestone`);

        console.log(`[Clarity] ⏱️ Time: ${category} ${id} = ${seconds}s`);
      }
    };

    const unsub = useGlobalStore.subscribe((state) => {
      if (!isClarityReady()) return;
      
      // Track case study time
      if (state.caseStudyTimeSpent) {
        Object.entries(state.caseStudyTimeSpent).forEach(([id, seconds]) => {
          if (seconds > 0) {
            reportTime("case_study", id, seconds);
          }
        });
      }

      // Track process section time
      if (state.processSectionTimeSpent) {
        Object.entries(state.processSectionTimeSpent).forEach(
          ([id, seconds]) => {
            if (seconds > 0) {
              reportTime("process_section", id, seconds);
            }
          },
        );
      }

      // Track VAPI (voice) time
      if (state.vapiTimeSpent > 0) {
        const vapiMinutes = Math.floor(state.vapiTimeSpent / 60);
        if (vapiMinutes > 0 && state.vapiTimeSpent % 60 === 0) {
          Clarity.setTag("vapi_time_minutes", String(vapiMinutes));
          Clarity.event("vapi_time_milestone");
        }
      }
    });

    return () => unsub();
  }, [enableAnalytics]);

  // Track page engagement time
  useEffect(() => {
    if (!enableAnalytics || !isClarityReady()) return;

    let totalSeconds = 0;
    let isActive = document.visibilityState === "visible";

    const handleVisibilityChange = () => {
      isActive = document.visibilityState === "visible";
      if (isActive && isClarityReady()) {
        Clarity.event("page_reactivated");
      }
    };

    const interval = setInterval(() => {
      if (isActive && isClarityReady()) {
        totalSeconds++;

        // Report engagement milestones
        if (totalSeconds === 30) {
          Clarity.setTag("engagement_30s", "true");
          Clarity.event("engagement_30_seconds");
          console.log("[Clarity] ⏱️ Engagement: 30 seconds");
        } else if (totalSeconds === 60) {
          Clarity.setTag("engagement_1m", "true");
          Clarity.event("engagement_1_minute");
          console.log("[Clarity] ⏱️ Engagement: 1 minute");
        } else if (totalSeconds === 300) {
          Clarity.setTag("engagement_5m", "true");
          Clarity.event("engagement_5_minutes");
          console.log("[Clarity] ⏱️ Engagement: 5 minutes");
        } else if (totalSeconds % 300 === 0) {
          // Every 5 minutes after the first
          const minutes = totalSeconds / 60;
          Clarity.setTag("engagement_minutes", String(Math.floor(minutes)));
          Clarity.event("engagement_milestone");
          console.log(
            `[Clarity] ⏱️ Engagement: ${Math.floor(minutes)} minutes`
          );
        }
      }
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enableAnalytics]);

  // Track scroll depth on important elements
  useEffect(() => {
    if (!enableAnalytics || !isClarityReady()) return;

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
        if (!isClarityReady()) return;
        
        entries.forEach((entry) => {
          const data = trackedElements.get(entry.target);
          if (!data) return;

          if (entry.isIntersecting && !data.hasViewed) {
            data.hasViewed = true;
            data.viewStart = Date.now();

            Clarity.setTag(`viewed_${data.name}`, "true");
            Clarity.event(`${data.name}_viewed`);
            console.log(`[Clarity] 👁️ Element viewed: ${data.name}`);
          } else if (!entry.isIntersecting && data.viewStart > 0) {
            const viewTime = Math.floor((Date.now() - data.viewStart) / 1000);
            data.totalTime += viewTime;
            data.viewStart = 0;

            if (viewTime > 3) {
              // Only track if viewed for more than 3 seconds
              Clarity.setTag(`${data.name}_view_time`, String(data.totalTime));
              Clarity.event(`${data.name}_view_ended`);
              console.log(
                `[Clarity] 👁️ Element view ended: ${data.name} (${data.totalTime}s)`
              );
            }
          }
        });
      },
      { threshold: 0.5 }, // Element must be 50% visible
    );

    // Scan for trackable elements
    const scanElements = () => {
      // Track elements with data-clarity-track attribute
      document.querySelectorAll("[data-clarity-track]").forEach((el) => {
        if (!trackedElements.has(el)) {
          const name = el.getAttribute("data-clarity-track") || "element";
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
  }, [enableAnalytics]);

  return null;
}
