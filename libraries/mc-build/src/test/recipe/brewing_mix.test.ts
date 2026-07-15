import { describe, expect, it } from "vitest";
import { recipeBrewingMix } from "@lpsmods/mc-build";

describe("recipe brewing mix builder", () => {
  it("create a valid recipe brewing mix", () => {
    const result = recipeBrewingMix("minecraft:brew_awkward_blaze_powder")
      .input("minecraft:potion_type:awkward")
      .output("minecraft:potion_type:strength")
      .reagent("minecraft:blaze_powder")
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_brewing_mix": {
        description: {
          identifier: "minecraft:brew_awkward_blaze_powder",
        },
        input: "minecraft:potion_type:awkward",
        output: "minecraft:potion_type:strength",
        reagent: "minecraft:blaze_powder",
        tags: ["brewing_stand"],
      },
    });
  });
});
