import { literal, object } from "superstruct";

/**
 * Superstruct schema for the loot condition example.
 */
export const LootConditionExampleSchema = object({
  condition: literal("example"),
});
