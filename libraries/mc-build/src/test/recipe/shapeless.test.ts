import { describe, expect, it } from "vitest";
import { recipeShapeless } from "@lpsmods/mc-build";

describe("recipe shapeless builder", () => {
  it("create a valid recipe shapeless", () => {
    const result = recipeShapeless("minecraft:firecharge_coal_sulphur")
      .ingredient({ item: "minecraft:fireball", data: 0, count: 4 })
      .result({ item: "minecraft:blaze_powder", data: 4 })
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_shapeless": {
        description: {
          identifier: "minecraft:firecharge_coal_sulphur",
        },
        ingredients: [{ item: "minecraft:fireball", data: 0, count: 4 }],
        result: { item: "minecraft:blaze_powder", data: 4 },
        tags: ["crafting_table"],
      },
    });
  });
});
