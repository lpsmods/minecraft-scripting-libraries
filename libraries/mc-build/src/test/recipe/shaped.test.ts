import { describe, expect, it } from "vitest";
import { recipeShaped, RecipeShapedSchema, RecipeShapelessSchema } from "@lpsmods/mc-build";

describe("recipe shaped builder", () => {
  it.each([{ context: "AlwaysUnlocked" }, [{ item: "minecraft:stone", data: 0 }]])("validates recipe unlocks: %j", (unlock) => {
    const common = { description: { identifier: "demo:recipe" }, tags: ["crafting_table"], result: { item: "demo:item" }, unlock };
    const shaped = { format_version: "1.20.10", "minecraft:recipe_shaped": { ...common, key: { X: { item: "minecraft:stone" } }, pattern: ["X"] } };
    const shapeless = { format_version: "1.20.10", "minecraft:recipe_shapeless": { ...common, ingredients: [{ item: "minecraft:stone" }] } };
    expect(RecipeShapedSchema.is(shaped)).toBe(true);
    expect(RecipeShapelessSchema.is(shapeless)).toBe(true);
    expect(RecipeShapedSchema.is({ ...shaped, "minecraft:recipe_shaped": { ...shaped["minecraft:recipe_shaped"], unlock: { context: 123 } } })).toBe(false);
    expect(RecipeShapelessSchema.is({ ...shapeless, "minecraft:recipe_shapeless": { ...shapeless["minecraft:recipe_shapeless"], unlock: [{ item: false }] } })).toBe(false);
  });
  it("create a valid recipe shaped", () => {
    const result = recipeShaped("minecraft:acacia_boat", ["#P#", "###"])
      .key("#", { item: "minecraft:planks", data: 4 })
      .key("P", { item: "minecraft:wooden_shovel" })
      .result({ item: "minecraft:boat", data: 4 })
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_shaped": {
        description: {
          identifier: "minecraft:acacia_boat",
        },
        key: {
          "#": { item: "minecraft:planks", data: 4 },
          P: { item: "minecraft:wooden_shovel" },
        },
        pattern: ["#P#", "###"],
        result: { item: "minecraft:boat", data: 4 },
        tags: ["crafting_table"],
      },
    });
  });
});
