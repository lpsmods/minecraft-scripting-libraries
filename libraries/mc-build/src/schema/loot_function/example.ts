import { literal, object } from "superstruct";

/**
 * Superstruct schema for the loot function example.
 */
export const LootFunctionExampleSchema = object({
  function: literal("example"),
});
