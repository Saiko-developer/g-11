import { describe, expect, it } from "vitest";
import { safeAuthDestination } from "./auth-redirect";

describe("Post-login destination", () => {
  it("preserves the admin destination after Google authentication", () => {
    expect(safeAuthDestination("/admin")).toBe("/admin");
  });
  it("rejects external or browser-normalized external destinations", () => {
    for (const path of ["https://other.example", "//other.example", "/\\other.example", "/\n/other.example", null]) {
      expect(safeAuthDestination(path)).toBeNull();
    }
  });
});