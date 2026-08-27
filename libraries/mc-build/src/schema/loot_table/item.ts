import { array, literal, number, object, optional, string } from "superstruct";
import { LootFunctionSchema } from "../loot_function";
import { LootConditionSchema } from "../loot_condition";

/**
 * Superstruct schema for the loot item entry.
 */
export const LootItemEntrySchema = object({
  type: literal("item"),
  name: string(),
  weight: optional(number()),
  quality: optional(number()),
  functions: optional(array(LootFunctionSchema)),
  conditions: optional(array(LootConditionSchema)),
});
