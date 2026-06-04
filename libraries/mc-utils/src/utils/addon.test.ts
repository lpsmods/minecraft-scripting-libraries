import { describe, expect, it } from "vitest";
import { AddonUtils } from "./addon";

describe("Addon Utils", () => {
  AddonUtils.addonId = "namespace";
  it("makeId", () => {
    const result = AddonUtils.makeId("path");
    expect(result).toBe("namespace:path");
  });
});
