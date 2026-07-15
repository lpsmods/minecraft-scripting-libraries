import { literal, number, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the loot loot entry.
 */
export const LootLootEntrySchema = object({
  type: literal("loot_table"),
  name: string(),
  quality: optional(number()),
});
