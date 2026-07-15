import { describe, expect, it } from "vitest";
import { defineFeature, feature } from "@lpsmods/mc-build";

describe("feature builder", () => {
  it("creates and defines a feature with a normalized root key", () => {
    const result = feature("aggregate_feature", "demo:feature").set("features", ["demo:child"]).build();

    expect(result).toEqual({
      format_version: "1.13.0",
      "minecraft:aggregate_feature": {
        description: { identifier: "demo:feature" },
        features: ["demo:child"],
      },
    });
    expect(defineFeature(result)).toBe(result);
  });

  it("preserves an explicitly namespaced root key", () => {
    const result = feature("minecraft:single_block_feature", "demo:feature").build();

    expect(result).toHaveProperty("minecraft:single_block_feature");
  });
});
