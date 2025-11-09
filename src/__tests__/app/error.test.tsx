jest.mock("next/navigation", () => ({
	useRouter: () => ({
		back: jest.fn(),
		push: jest.fn(),
	}),
}));

jest.mock("motion/react", () => ({
	motion: new Proxy(
		{},
		{
			get: () => (props: any) => <div {...props} />,
		}
	),
}));

jest.mock("@/components/ui/metalic-paint", () => ({
	__esModule: true,
	default: () => <div data-testid="metallic-paint" />,
	parseLogoImage: jest.fn(),
}));

import GlobalError from "@/app/error";

describe("app/error", () => {
	it("exports a callable error boundary", () => {
		expect(typeof GlobalError).toBe("function");
	});
});
