import { describe, expect, it } from "vitest";
import { defineSpawnGroup, spawnGroup } from "@lpsmods/mc-build";

describe("spawn group builder", () => {
  it("creates and defines a spawn group", () => {
    const result = spawnGroup()
      .set("conditions", [{ weight: 1 }])
      .build();

    expect(result).toEqual({
      conditions: [{ weight: 1 }],
    });
    expect(defineSpawnGroup(result)).toBe(result);
  });
});
