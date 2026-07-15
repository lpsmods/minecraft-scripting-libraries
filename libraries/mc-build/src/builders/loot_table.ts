import { assert } from "superstruct";
import { LootPoolSchema, LootTableSchema, type LootEntry, type LootPool, type LootTable } from "../schema";

/**
 * Defines the loot table asset.
 */
export function defineLootTable(data: LootTable): LootTable {
  assert(data, LootTableSchema);
  return data;
}

/**
 * Creates a loot pool definition.
 */
export function lootPool(rolls?: number) {
  const data: Partial<LootPool> = {
    entries: [],
    rolls,
  };
  return {
    entry(entry: LootEntry) {
      data.entries ??= [];
      data.entries.push(entry);
      return this;
    },
    build(): LootPool {
      return LootPoolSchema.create(data) as LootPool;
    },
  };
}

/**
 * Creates a loot table definition.
 */
export function lootTable(type?: string) {
  const data: Partial<LootTable> = {
    pools: [],
  };
  if (type) data.type = type;

  return {
    pool(pool: LootPool) {
      data.pools ??= [];
      data.pools.push(pool);
      return this;
    },
    build(): LootTable {
      return LootTableSchema.create(data) as LootTable;
    },
  };
}
