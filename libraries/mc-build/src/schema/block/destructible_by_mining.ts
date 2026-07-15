import { array, Infer, number, object, optional, string, union } from "superstruct";

/**
 * Superstruct schema for the block destructible by mining component.
 */
export const BlockDestructibleByMiningComponentSchema = object({
  seconds_to_destroy: number(),
  item_specific_speeds: optional(
    array(
      object({
        destroy_speed: number(),
        item: union([string(), array(string())]),
      }),
    ),
  ),
});

/**
 * Type for the block destructible by mining component definition.
 */
export type BlockDestructibleByMiningComponent = Infer<typeof BlockDestructibleByMiningComponentSchema>;
