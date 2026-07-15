import { describe, expect, it } from "vitest";
import { block } from "@lpsmods/mc-build";

describe("block builder", () => {
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
