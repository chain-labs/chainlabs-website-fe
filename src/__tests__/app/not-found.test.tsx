jest.mock("next/navigation", () => ({
	useRouter: () => ({
		back: jest.fn(),
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

import NotFound from "@/app/not-found";

describe("app/not-found", () => {
	it("exports a not-found component", () => {
		expect(typeof NotFound).toBe("function");
	});
});
