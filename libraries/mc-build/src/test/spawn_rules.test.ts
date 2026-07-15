import { describe, expect, it } from "vitest";
import { spawnRules } from "@lpsmods/mc-build";

describe("spawn rules builder", () => {
  it("create a valid spawn rules", () => {
    const result = spawnRules("demo:stone").condition({ "minecraft:example": {} }).build();

    expect(result).toEqual({
      format_version: "1.8.0",
      "minecraft:spawn_rules": {
        conditions: [
          {
            "minecraft:example": {},
          },
        ],
        description: {
          identifier: "demo:stone",
          population_control: "monster",
        },
      },
    });
  });
});
