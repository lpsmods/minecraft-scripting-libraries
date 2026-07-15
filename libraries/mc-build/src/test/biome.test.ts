import { describe, expect, it } from "vitest";
import { biome, clientBiome, defineBiome, defineClientBiome } from "@lpsmods/mc-build";

describe("biome builders", () => {
  it("creates and defines a behavior-pack biome", () => {
    const result = biome("demo:biome").set("components", { "demo:component": {} }).build();

    expect(result).toEqual({
      format_version: "1.21.40",
      "minecraft:biome": {
        description: { identifier: "demo:biome" },
        components: { "demo:component": {} },
      },
    });
    expect(defineBiome(result)).toBe(result);
  });

  it("creates and defines a resource-pack biome", () => {
    const result = clientBiome("demo:biome").set("components", { "demo:component": {} }).build();

    expect(result).toEqual({
      format_version: "1.21.40",
      "minecraft:client_biome": {
        description: { identifier: "demo:biome" },
        components: { "demo:component": {} },
      },
    });
    expect(defineClientBiome(result)).toBe(result);
  });
});
