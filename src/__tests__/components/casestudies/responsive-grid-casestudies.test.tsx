import * as ComponentModule from "@/components/casestudies/responsive-grid-casestudies";

describe("casestudies/responsive-grid-casestudies", () => {
  it("exports at least one React component", () => {
    const exportsArray = Object.values(ComponentModule);
    const hasReactExport = exportsArray.some((exported) => {
      if (typeof exported === "function") {
        return true;
      }
      if (exported && typeof exported === "object" && "$$typeof" in exported) {
        return true;
      }
      return false;
    });
    expect(hasReactExport).toBe(true);
  });
});
