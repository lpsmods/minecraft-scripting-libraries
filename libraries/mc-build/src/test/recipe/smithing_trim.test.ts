import { describe, expect, it } from "vitest";
import { recipeSmithingTrim } from "@lpsmods/mc-build";

describe("recipe smithing trim builder", () => {
  it("create a valid recipe smithing trim", () => {
    const result = recipeSmithingTrim("minecraft:smithing_diamond_boots_jungle_quartz_trim")
      .addition("minecraft:quartz")
      .base("minecraft:diamond_boots")
      .template("minecraft:jungle_temple_smithing_template")
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_smithing_trim": {
        description: {
          identifier: "minecraft:smithing_diamond_boots_jungle_quartz_trim",
        },
        addition: "minecraft:quartz",
        base: "minecraft:diamond_boots",
        tags: ["smithing_table"],
        template: "minecraft:jungle_temple_smithing_template",
      },
    });
  });
});
