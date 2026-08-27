import { array, defaulted, Infer, number, object, optional, string, union } from "superstruct";
import { LootEntrySchema } from "./types";
import { NumberRangeSchema } from "../common";
import { LootConditionSchema } from "../loot_condition";
import { LootFunctionSchema } from "../loot_function";

/**
 * Superstruct schema for the loot pool.
 */
export const LootPoolSchema = object({
  rolls: defaulted(union([number(), NumberRangeSchema]), 1),
  bonus_rolls: optional(union([number(), NumberRangeSchema])),
  conditions: optional(array(LootConditionSchema)),
  functions: optional(array(LootFunctionSchema)),
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
