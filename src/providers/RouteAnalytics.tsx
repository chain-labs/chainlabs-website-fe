"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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

	useEffect(() => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		const pagePath = `${pathname}${
			searchParams?.toString() ? `?${searchParams.toString()}` : ""
		}`;

		try {
			// GA4 via gtag
			if (typeof window.gtag === "function") {
				window.gtag("event", "page_view", {
					page_title: document.title,
					page_location: url,
					page_path: pagePath,
				});
			}
			// GTM dataLayer (in case GA is routed via GTM)
			if (Array.isArray(window.dataLayer)) {
				window.dataLayer.push({
					event: "page_view",
					page_path: pagePath,
					page_location: url,
					page_title: document.title,
				});
			}
			// Clarity soft page change
			if (typeof window.clarity === "function") {
				window.clarity("set", "page", pagePath);
			}
		} catch {
			// no-op
		}
	}, [pathname, searchParams]);

	return null;
}

export default function RouteAnalytics() {
	return (
		<Suspense fallback={null}>
			<RouteAnalyticsInner />
		</Suspense>
	);
}
