import { describe, expect, it } from "vitest";
import { recipeShaped } from "@lpsmods/mc-build";

describe("recipe shaped builder", () => {
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
