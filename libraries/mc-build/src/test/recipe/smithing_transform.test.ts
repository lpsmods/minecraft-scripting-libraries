import { describe, expect, it } from "vitest";
import { recipeSmithingTransform } from "@lpsmods/mc-build";

describe("recipe smithing transform builder", () => {
  it("create a valid recipe smithing transform", () => {
    const result = recipeSmithingTransform("minecraft:smithing_netherite_boots")
      .addition("minecraft:netherite_ingot")
      .base("minecraft:diamond_boots")
      .result("minecraft:netherite_boots")
      .template("minecraft:netherite_upgrade_smithing_template")
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_smithing_transform": {
        description: {
          identifier: "minecraft:smithing_netherite_boots",
        },
        addition: "minecraft:netherite_ingot",
        base: "minecraft:diamond_boots",
        result: "minecraft:netherite_boots",
        tags: ["smithing_table"],
        template: "minecraft:netherite_upgrade_smithing_template",
      },
    });
  });
});
