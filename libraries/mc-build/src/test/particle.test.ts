import { describe, expect, it } from "vitest";
import { defineParticle, particle } from "@lpsmods/mc-build";

describe("particle builder", () => {
  it("creates and defines a particle effect", () => {
    const result = particle("demo:particle").set("components", { "minecraft:emitter_rate_instant": {} }).build();

    expect(result).toEqual({
      format_version: "1.10.0",
      particle_effect: {
        description: { identifier: "demo:particle" },
        components: { "minecraft:emitter_rate_instant": {} },
      },
    });
    expect(defineParticle(result)).toBe(result);
  });
});
