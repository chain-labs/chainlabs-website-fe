import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { AuthProvider } from "@/providers/Auth";
import Script from "next/script";
import RouteAnalytics from "@/providers/RouteAnalytics";
import ClarityAnalytics from "@/providers/ClarityAnalytics";
import React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chain Labs",
    template: "%s | Chain Labs",
  },
  description:
    "AI-driven web experiences and high-performance sites. Build faster with Chain Labs.",
  applicationName: "Chain Labs",
  keywords: [
    "Chain Labs",
    "web development",
    "AI websites",
    "Next.js",
    "React",
    "performance",
    "SEO",
  ],
  authors: [{ name: "Chain Labs" }],
  creator: "Chain Labs",
  publisher: "Chain Labs",
  referrer: "strict-origin-when-cross-origin",
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Chain Labs",
    siteName: "Chain Labs",
    description:
      "AI-driven web experiences and high-performance sites. Build faster with Chain Labs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Chain Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chain Labs",
    description:
      "AI-driven web experiences and high-performance sites. Build faster with Chain Labs.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"],
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-P3BWGBBD";
    const GA_ID =  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2TXCJ3VJ1B";
    const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "t2fz0iawei";
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/assets/logo.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#0B0B0F" />
				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Chain Labs",
							url: siteUrl,
							logo: `${siteUrl}/assets/logo.svg`,
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: "Chain Labs",
							url: siteUrl,
							inLanguage: "en",
						}),
					}}
				/>
				{/* Analytics (GTM + GA4) gated by env and consent */}
				{enableAnalytics && (
					<>
						<Script id="gtm" strategy="afterInteractive">
							{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${GTM_ID}');`}
						</Script>
						<Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
						<Script id="gtag-init" strategy="afterInteractive">
							{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('consent', 'default', {
							  'ad_user_data': 'denied',
							  'ad_personalization': 'denied',
							  'ad_storage': 'denied',
							  'analytics_storage': 'granted'
							});
							gtag('js', new Date());
							gtag('config', '${GA_ID}', {
							  anonymize_ip: true,
							  allow_google_signals: false,
							  allow_ad_personalization_signals: false
							});
							`}
						</Script>
					</>
				)}

				{/* Microsoft Clarity (gated) */}
				{enableAnalytics && CLARITY_ID && (
					<Script id="clarity" strategy="afterInteractive">
						{`
						(function(c,l,a,r,i,t,y){
							c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
							t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
							y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
						})(window, document, 'clarity', 'script', '${CLARITY_ID}');
						try {
						  var raw = localStorage.getItem('chainlabs-session-store');
						  if (raw) {
						    var parsed = JSON.parse(raw);
						    var sid = parsed && parsed.state && parsed.state.personalised && parsed.state.personalised.sid;
						    if (sid) {
						      window.clarity && window.clarity('identify', sid);
						      window.clarity && window.clarity('set', 'sessionId', sid);
						    }
						  }
						} catch {}
						`}
					</Script>
				)}
				{/* amplitude - google analytics */}
				{/* <Script type="text/javascript">
					{`!function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:{}};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var n=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,r){return function(n){e._q.push({name:t,args:Array.prototype.slice.call(r,0),resolve:n})}},o=function(e,t,r){e[t]=function(){if(r)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<m.length;t++)o(e,m[t],!1);for(var r=0;r<y.length;r++)o(e,y[r],!0)};r.invoked=!0;var a=t.createElement("script");a.type="text/javascript",a.crossOrigin="anonymous",a.src="https://cdn.amplitude.com/libs/plugin-ga-events-forwarder-browser-0.4.2-min.js.gz",a.onload=function(){e.gaEventsForwarder&&e.gaEventsForwarder.plugin&&e.amplitude.add(e.gaEventsForwarder.plugin())};var c=t.createElement("script");c.type="text/javascript",c.integrity="sha384-pY2pkwHaLM/6UIseFHVU3hOKr6oAvhLcdYkoRZyaMDWLjpM6B7nTxtOdE823WAOQ",c.crossOrigin="anonymous",c.async=!0,c.src="https://cdn.amplitude.com/libs/analytics-browser-2.11.0-min.js.gz",c.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var u=t.getElementsByTagName("script")[0];u.parentNode.insertBefore(a,u),u.parentNode.insertBefore(c,u);for(var p=function(){return this._q=[],this},d=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],l=0;l<d.length;l++)n(p,d[l]);r.Identify=p;for(var g=function(){return this._q=[],this},v=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],f=0;f<v.length;f++)n(g,v[f]);r.Revenue=g;var m=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset","extendSession"],y=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(r),r.createInstance=function(e){return r._iq[e]={_q:[]},i(r._iq[e]),r._iq[e]},e.amplitude=r}}(window,document)}();

  					amplitude.init('f455e270b57f7a26880f05be5449e42c');`}
				</Script> */}
				{/* End amplitude - google analytics */}
				{/* amplitude - session replay */}
				{/* <Script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></Script> */}
				{/* <Script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"></Script> */}
				{/* End amplitude - session replay */}
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
                {enableAnalytics && (
                  <Suspense fallback={null}>
                    <RouteAnalytics />
                  </Suspense>
                )}
                {enableAnalytics && CLARITY_ID && <ClarityAnalytics />}
				{/* Google Tag Manager (noscript) */}
				{enableAnalytics && (
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
						></iframe>
					</noscript>
				)}
				{/* <Script>{`window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));window.amplitude.init('xxx', {"autocapture":{"elementInteractions":true}});`}</Script> */}
				{enableAnalytics && <RouteAnalytics />}
			</body>
		</html>
	);
}
