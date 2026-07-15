import { describe, expect, it } from "vitest";
import { lootTable, lootPool } from "@lpsmods/mc-build";

describe("loot table builder", () => {
  it("create a valid loot table", () => {
    const result = lootTable()
      .pool(lootPool().entry({ type: "item", name: "minecraft:stone" }).build())
      .build();

    expect(result).toEqual({
      pools: [
        {
          rolls: 1,
          entries: [
            {
              type: "item",
              name: "minecraft:stone",
            },
          ],
        },
      ],
    });
  });
});
