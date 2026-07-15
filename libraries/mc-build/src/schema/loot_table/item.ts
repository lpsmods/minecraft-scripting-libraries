import { array, literal, object, optional, string } from "superstruct";
import { LootFunctionSchema } from "../loot_function";
import { LootConditionSchema } from "../loot_condition";

/**
 * Superstruct schema for the loot item entry.
 */
export const LootItemEntrySchema = object({
  type: literal("item"),
  name: string(),
  functions: optional(array(LootFunctionSchema)),
  conditions: optional(array(LootConditionSchema)),
});
