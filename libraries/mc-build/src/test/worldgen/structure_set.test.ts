import { describe, expect, it } from "vitest";
import { defineStructureSet, structureSet } from "@lpsmods/mc-build";

describe("structure set builder", () => {
  it("creates and defines a structure set", () => {
    const result = structureSet("demo:set").set("structures", []).build();

    expect(result).toEqual({
      format_version: "1.21.20",
      "minecraft:structure_set": {
        description: { identifier: "demo:set" },
        structures: [],
      },
    });
    expect(defineStructureSet(result)).toBe(result);
  });
});
