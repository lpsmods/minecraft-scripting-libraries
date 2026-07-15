import { describe, expect, it } from "vitest";
import { craftingItemCatalog, defineCraftingItemCatalog } from "@lpsmods/mc-build";

describe("crafting item catalog builder", () => {
  it("creates and defines a crafting item catalog", () => {
    const result = craftingItemCatalog().category({ category_name: "construction", groups: [] }).build();

    expect(result).toEqual({
      format_version: "1.26.20",
      "minecraft:crafting_items_catalog": {
        categories: [{ category_name: "construction", groups: [] }],
      },
    });
    expect(defineCraftingItemCatalog(result)).toBe(result);
  });
});
