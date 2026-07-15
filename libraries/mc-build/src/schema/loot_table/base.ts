import { array, defaulted, Infer, number, object, optional, string } from "superstruct";
import { LootEntrySchema } from "./types";

/**
 * Superstruct schema for the loot pool.
 */
export const LootPoolSchema = object({
  rolls: defaulted(number(), 1),
  entries: array(LootEntrySchema),
});

/**
 * Superstruct schema for the loot table.
 */
export const LootTableSchema = object({
  type: optional(string()),
  pools: array(LootPoolSchema),
});

/**
 * Type definition for a loot table.
 */
export type LootTable = Infer<typeof LootTableSchema>;

/**
 * Type definition for a loot pool.
 */
export type LootPool = Infer<typeof LootPoolSchema>;
