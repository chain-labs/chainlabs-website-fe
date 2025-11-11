"use client";

import { useEffect } from "react";
import { useGlobalStore } from "@/global-store";

declare global {
  interface Window {
    clarity?: (...args: any[]) => void & { q?: any[] };
  }
}

// Helper to ensure Clarity is loaded and ready
function isClarityReady(): boolean {
  return typeof window !== "undefined" && typeof window.clarity === "function";
}

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

// Helper to ensure Clarity is loaded before executing callback
function waitForClarity(callback: () => void, maxAttempts = 30, interval = 100) {
  let attempts = 0;
  const checkInterval = setInterval(() => {
    attempts++;
    if (isClarityReady()) {
      clearInterval(checkInterval);
      console.log(`[Clarity] ✓ Ready after ${attempts} attempts`);
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.error(
        `[Clarity] ✗ Failed to load after ${maxAttempts} attempts (${maxAttempts * interval}ms)`
      );
    }
  }, interval);
}

export default function ClarityAnalytics() {
  const store = useGlobalStore();

  // Initialize Clarity with session data once loaded
  useEffect(() => {
    waitForClarity(() => {
      console.log("[Clarity] 🚀 Initializing custom tracking");
      
      // Set initial session data
      const sessionId = store.personalised?.sid || "unknown";
      if (sessionId !== "unknown") {
        callClarity("identify", sessionId);
      }
      callClarity("set", "session_id", sessionId);
      callClarity("set", "has_goal", store.goal ? "true" : "false");
      
      console.log("[Clarity] ✓ Initialized with session:", sessionId);
    });
  }, [store.personalised?.sid, store.goal]);

  // Click tracking with improved data capture
  useEffect(() => {
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

      // Send custom tags to Clarity (one at a time for better reliability)
      Object.entries(customData).forEach(([key, value]) => {
        if (value) {
          callClarity("set", `click_${key}`, value);
        }
      });

      // Send the event
      callClarity("event", eventName);

      console.log("[Clarity] 🖱️ Click:", eventName, customData);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Track personalization status changes
  useEffect(() => {
    if (!isClarityReady()) {
      waitForClarity(() => {
        // Will be handled by subscribe callback once ready
      });
      return;
    }

    let lastStatus: string | undefined;

    const unsub = useGlobalStore.subscribe((state) => {
      if (!isClarityReady()) return;
      
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
        if (state.personalised && state.goal) {
          callClarity("set", "user_goal", state.goal);
        }
        if (state.headline) {
          callClarity("set", "user_headline", state.headline);
        }
      } else if (status === "GOAL_SET") {
        callClarity("event", "personalization_started");
      } else {
        callClarity("event", "personalization_status_changed");
      }

      console.log("[Clarity] 🎯 Personalization status:", status);
    });

    return () => unsub();
  }, []);

  // Track missions progress
  useEffect(() => {
    if (!isClarityReady()) {
      waitForClarity(() => {
        // Will be tracked once Clarity is ready
      });
      return;
    }

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

        // Send mission metrics
        callClarity("set", "missions_total", String(totalCount));
        callClarity("set", "missions_completed", String(completedCount));
        callClarity(
          "set",
          "missions_pending",
          String(totalCount - completedCount),
        );

        if (totalCount > 0) {
          const progressPercent = Math.round(
            (completedCount / totalCount) * 100,
          );
          callClarity(
            "set",
            "missions_progress_percent",
            String(progressPercent),
          );
        }

        callClarity("event", "missions_progress_updated");
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
  }, [store.missions]);

  // Track time spent on different sections
  useEffect(() => {
    if (!isClarityReady()) {
      waitForClarity(() => {
        // Will be tracked once Clarity is ready
      });
      return;
    }

    const reportedTimes: Record<string, number> = {};
    const REPORT_INTERVAL = 10; // Report every 10 seconds of activity

    const reportTime = (category: string, id: string, seconds: number) => {
      if (!isClarityReady()) return;
      
      const key = `${category}_${id}`;
      const lastReported = reportedTimes[key] || 0;

      if (seconds - lastReported >= REPORT_INTERVAL) {
        reportedTimes[key] = seconds;

        // Send time data to Clarity
        callClarity("set", `${category}_current_id`, id);
        callClarity("set", `${category}_time_seconds`, String(seconds));
        callClarity("event", `${category}_time_milestone`);

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
          callClarity("set", "vapi_time_minutes", String(vapiMinutes));
          callClarity("event", "vapi_time_milestone");
        }
      }
    });

    return () => unsub();
  }, []);

  // Track page engagement time
  useEffect(() => {
    if (!isClarityReady()) {
      waitForClarity(() => {
        // Will start tracking once Clarity is ready
      });
      return;
    }

    let totalSeconds = 0;
    let isActive = document.visibilityState === "visible";

    const handleVisibilityChange = () => {
      isActive = document.visibilityState === "visible";
      if (isActive && isClarityReady()) {
        callClarity("event", "page_reactivated");
      }
    };

    const interval = setInterval(() => {
      if (isActive && isClarityReady()) {
        totalSeconds++;

        // Report engagement milestones
        if (totalSeconds === 30) {
          callClarity("set", "engagement_30s", "true");
          callClarity("event", "engagement_30_seconds");
          console.log("[Clarity] ⏱️ Engagement: 30 seconds");
        } else if (totalSeconds === 60) {
          callClarity("set", "engagement_1m", "true");
          callClarity("event", "engagement_1_minute");
          console.log("[Clarity] ⏱️ Engagement: 1 minute");
        } else if (totalSeconds === 300) {
          callClarity("set", "engagement_5m", "true");
          callClarity("event", "engagement_5_minutes");
          console.log("[Clarity] ⏱️ Engagement: 5 minutes");
        } else if (totalSeconds % 300 === 0) {
          // Every 5 minutes after the first
          const minutes = totalSeconds / 60;
          callClarity("set", "engagement_minutes", String(Math.floor(minutes)));
          callClarity("event", "engagement_milestone");
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
  }, []);

  // Track scroll depth on important elements
  useEffect(() => {
    if (!isClarityReady()) {
      waitForClarity(() => {
        // Will start tracking once Clarity is ready
      });
      return;
    }

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

            callClarity("set", `viewed_${data.name}`, "true");
            callClarity("event", `${data.name}_viewed`);
            console.log(`[Clarity] 👁️ Element viewed: ${data.name}`);
          } else if (!entry.isIntersecting && data.viewStart > 0) {
            const viewTime = Math.floor((Date.now() - data.viewStart) / 1000);
            data.totalTime += viewTime;
            data.viewStart = 0;

            if (viewTime > 3) {
              // Only track if viewed for more than 3 seconds
              callClarity(
                "set",
                `${data.name}_view_time`,
                String(data.totalTime),
              );
              callClarity("event", `${data.name}_view_ended`);
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
  }, []);

  return null;
}
