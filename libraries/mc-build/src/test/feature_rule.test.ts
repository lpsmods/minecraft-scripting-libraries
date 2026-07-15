import { describe, expect, it } from "vitest";
import { defineFeatureRule, featureRule } from "@lpsmods/mc-build";

describe("feature rule builder", () => {
  it("creates and defines a feature rule", () => {
    const result = featureRule("demo:rule").set("places_feature", "demo:feature").build();

    expect(result).toEqual({
      format_version: "1.13.0",
      "minecraft:feature_rules": {
        description: { identifier: "demo:rule" },
        places_feature: "demo:feature",
      },
    });
    expect(defineFeatureRule(result)).toBe(result);
  });
});
