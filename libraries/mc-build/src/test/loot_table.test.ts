import { describe, expect, it } from "vitest";
import { lootTable, lootPool, LootTableSchema, LootFunctionSchema } from "@lpsmods/mc-build";

describe("loot table builder", () => {
  it("supports ranged rolls, weighted items and loot functions", () => {
    const result = lootTable().pool(lootPool({ min: 2, max: 8 }).entry({
      type: "item", name: "minecraft:coal", weight: 10, quality: 1,
      functions: [{ function: "minecraft:set_count", count: { min: 1, max: 4 } }],
    }).build()).build();
    expect(LootTableSchema.is(result)).toBe(true);
    expect(result.pools[0].rolls).toEqual({ min: 2, max: 8 });
    expect(LootTableSchema.is({ pools: [{ ...result.pools[0], rolls: { min: "bad", max: 8 } }] })).toBe(false);
  });

  it.each([
    { function: "set_count", count: 2, add: false },
    { function: "set_damage", damage: { min: 0.8, max: 1 }, add: false },
    { function: "minecraft:set_data", data: 30 },
    { function: "enchant_randomly" },
    { function: "enchant_with_levels", levels: { min: 30, max: 50 }, treasure: true },
    { function: "exploration_map", destination: "buriedtreasure" },
    { function: "specific_enchants", enchants: [{ id: "swift_sneak", level: [1, 3] }] },
  ])("validates loot function %j", (data) => {
    expect(LootFunctionSchema.is(data)).toBe(true);
  });

  it("rejects malformed and unsupported loot functions", () => {
    expect(LootFunctionSchema.is({ function: "set_count", count: "many" })).toBe(false);
    expect(LootFunctionSchema.is({ function: "set_damage" })).toBe(false);
    expect(LootFunctionSchema.is({ function: "unknown_function" })).toBe(false);
  });
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
