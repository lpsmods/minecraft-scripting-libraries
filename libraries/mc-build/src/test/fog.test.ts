import { describe, expect, it } from "vitest";
import { defineFog, fog } from "@lpsmods/mc-build";

describe("fog builder", () => {
  it("creates and defines fog settings", () => {
    const result = fog("demo:fog")
      .set("distance", { air: { fog_start: 0, fog_end: 16 } })
      .build();

    expect(result).toEqual({
      format_version: "1.16.100",
      "minecraft:fog_settings": {
        description: { identifier: "demo:fog" },
        distance: { air: { fog_start: 0, fog_end: 16 } },
      },
    });
    expect(defineFog(result)).toBe(result);
  });
});
