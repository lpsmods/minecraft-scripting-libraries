import { describe, expect, it } from "vitest";
import { recipeBrewingContainer } from "@lpsmods/mc-build";

describe("recipe brewing container builder", () => {
  it("create a valid recipe brewing container", () => {
    const result = recipeBrewingContainer("minecraft:brew_potion_sulphur")
      .input("minecraft:potion")
      .output("minecraft:splash_potion")
      .reagent("minecraft:gunpowder")
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_brewing_container": {
        description: {
          identifier: "minecraft:brew_potion_sulphur",
        },
        input: "minecraft:potion",
        output: "minecraft:splash_potion",
        reagent: "minecraft:gunpowder",
        tags: ["brewing_stand"],
      },
    });
  });
});
