import type { ReactNode } from "react";

jest.mock("next/font/google", () => ({
	Geist: () => ({ variable: "--font-geist-sans" }),
	Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

jest.mock("next-themes", () => ({
	ThemeProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("next/script", () => (props: any) => <script {...props} />);

jest.mock("@/providers/Auth", () => ({
	AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("@/providers/RouteAnalytics", () => ({
	__esModule: true,
	default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("@/providers/ClarityAnalytics", () => ({
	__esModule: true,
	default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import RootLayout, { metadata } from "@/app/layout";

describe("app/layout", () => {
	it("exports metadata", () => {
		expect(metadata.title?.default).toBe("Chain Labs");
		expect(metadata.title?.template).toBe("%s | Chain Labs");
	});

	it("returns html markup with provided children", () => {
		const element = RootLayout({ children: <main>content</main> });
		expect(element).toBeTruthy();
		if (!element || typeof element !== "object") {
			throw new Error("RootLayout did not return a React element");
		}
		expect(
			element?.type
		).toBe("html");
	});
});
