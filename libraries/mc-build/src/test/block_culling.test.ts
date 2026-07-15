import { describe, expect, it } from "vitest";
import { blockCullingRules, defineBlockCulling } from "@lpsmods/mc-build";

describe("block culling builder", () => {
  it("creates and defines block culling rules", () => {
    const result = blockCullingRules("demo:culling").set("rules", []).build();

    expect(result).toEqual({
      format_version: "1.21.80",
      "minecraft:block_culling_rules": {
        description: { identifier: "demo:culling" },
        rules: [],
      },
    });
    expect(defineBlockCulling(result)).toBe(result);
  });
});
