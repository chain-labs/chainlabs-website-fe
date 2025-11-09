import * as ComponentModule from "@/components/chat/ai-chat-bubble";

describe("chat/ai-chat-bubble", () => {
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
