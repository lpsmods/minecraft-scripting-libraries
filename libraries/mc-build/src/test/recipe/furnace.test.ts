import { describe, expect, it } from "vitest";
import { recipeFurnace } from "@lpsmods/mc-build";

describe("recipe furnace builder", () => {
  it("create a valid recipe furnace", () => {
    const result = recipeFurnace("minecraft:furnace_beef")
      .input("minecraft:beef")
      .output("minecraft:cooked_beef")
      .build();
    expect(result).toEqual({
      format_version: "1.12",
      "minecraft:recipe_furnace": {
        description: {
          identifier: "minecraft:furnace_beef",
        },
        input: "minecraft:beef",
        output: "minecraft:cooked_beef",
        tags: ["furnace", "smoker", "campfire", "soul_campfire"],
      },
    });
  });
});
