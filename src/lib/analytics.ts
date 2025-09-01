"use client";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void & { q?: any[] };
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(event: string, params: EventParams = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
    if (typeof window.clarity === "function") {
      // Map only safe, non-PII data to Clarity
      window.clarity("event", event);
    }
  } catch {}
}

export function setUserId(userId?: string) {
  if (!userId) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("set", { user_id: userId });
    }
    if (typeof window.clarity === "function") {
      window.clarity("identify", userId);
    }
  } catch {}
}

export function setUserProperties(props: EventParams) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("set", "user_properties", props);
    }
    if (typeof window.clarity === "function") {
      Object.entries(props).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          window.clarity!("set", k, String(v));
        }
      });
    }
  } catch {}
}

