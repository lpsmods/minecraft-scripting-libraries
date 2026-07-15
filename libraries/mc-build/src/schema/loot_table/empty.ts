import { literal, object } from "superstruct";

/**
 * Superstruct schema for the loot empty entry.
 */
export const LootEmptyEntrySchema = object({
  type: literal("empty"),
});
