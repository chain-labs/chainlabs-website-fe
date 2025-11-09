process.env.NEXT_PRIVATE_SKIP_SWC_BINARY_LOAD = "1";
require("@testing-library/jest-dom");

class MockResizeObserver {
	constructor(callback) {
		this.callback = callback;
	}
	disconnect() {
		/* noop */
	}
	observe() {
		/* noop */
	}
	unobserve() {
		/* noop */
	}
}

class MockIntersectionObserver {
	constructor(callback) {
		this.callback = callback;
		this.root = null;
		this.rootMargin = "";
		this.thresholds = [];
	}
	disconnect() {
		/* noop */
	}
	observe() {
		/* noop */
	}
	takeRecords() {
		return [];
	}
	unobserve() {
		/* noop */
	}
}

if (typeof window !== "undefined") {
	if (!("ResizeObserver" in window)) {
		window.ResizeObserver = MockResizeObserver;
	}
	if (!("IntersectionObserver" in window)) {
		window.IntersectionObserver = MockIntersectionObserver;
	}
}

if (
	typeof HTMLCanvasElement !== "undefined" &&
	!HTMLCanvasElement.prototype.getContext
) {
	HTMLCanvasElement.prototype.getContext = () => null;
}
