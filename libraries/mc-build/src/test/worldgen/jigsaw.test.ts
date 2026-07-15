import { describe, expect, it } from "vitest";
import { defineJigsaw, jigsawStructure } from "@lpsmods/mc-build";

describe("jigsaw structure builder", () => {
  it("creates and defines a jigsaw structure", () => {
    const result = jigsawStructure("demo:jigsaw").set("start_pool", "demo:start").build();

    expect(result).toEqual({
      format_version: "1.21.20",
      "minecraft:jigsaw": {
        description: { identifier: "demo:jigsaw" },
        start_pool: "demo:start",
      },
    });
    expect(defineJigsaw(result)).toBe(result);
  });
});
