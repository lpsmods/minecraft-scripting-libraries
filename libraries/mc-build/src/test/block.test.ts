import { describe, expect, it } from "vitest";
import { block, BlockSchema } from "@lpsmods/mc-build";

describe("block builder", () => {
  it("validates typed custom states and integer ranges", () => {
    const data = block("demo:stateful").build();
    data["minecraft:block"].description.states = {
      "demo:enabled": [true, false], "demo:count": [0, 1, 2],
      "demo:style": ["plain", "striped"], "demo:range": { values: { min: 0, max: 3 } },
    };
    expect(BlockSchema.is(data)).toBe(true);
    const invalid = { ...data, "minecraft:block": { ...data["minecraft:block"], description: {
      identifier: "demo:stateful", states: { "demo:enabled": { unsupported: true } },
    } } };
    expect(BlockSchema.is(invalid)).toBe(false);
  });
  it("create a valid block", () => {
    const result = block("demo:stone").texture("stone").geometry().build();

    expect(result).toEqual({
      format_version: "1.26.20",
      "minecraft:block": {
        components: {
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:material_instances": {
            "*": {
              texture: "stone",
            },
          },
        },
        description: {
          identifier: "demo:stone",
        },
      },
    });
  });

  it("sets the menu category", () => {
    const result = block("demo:stone").menuCategory("construction").build();

    expect(result["minecraft:block"].description.menu_category).toEqual({
      category: "construction",
    });
  });
});
