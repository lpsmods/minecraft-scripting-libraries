import { describe, expect, it } from "vitest";
import { item } from "@lpsmods/mc-build";

describe("item builder", () => {
  it("create a valid item", () => {
    const result = item("demo:stone").component("minecraft:max_stack_size", {}).build();

    expect(result).toEqual({
      format_version: "1.26.20",
      "minecraft:item": {
        components: {
          "minecraft:max_stack_size": {},
        },
        description: {
          identifier: "demo:stone",
        },
      },
    });
  });

  it("sets the menu category", () => {
    const result = item("demo:stone").menuCategory("equipment", "minecraft:itemGroup.name.sword", true).build();

    expect(result["minecraft:item"].description.menu_category).toEqual({
      category: "equipment",
      group: "minecraft:itemGroup.name.sword",
      is_hidden_in_commands: true,
    });
  });
});
