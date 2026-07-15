import { Infer, number, object } from "superstruct";
import { NumberRangeSchema } from "../common";

/**
 * Superstruct schema for the item durability sensor component.
 */
export const ItemDurabilitySensorComponentSchema = object({
  damage_chance: NumberRangeSchema,
  max_durability: number(),
});

/**
 * Type for the item durability sensor component definition.
 */
export type ItemDurabilitySensorComponent = Infer<typeof ItemDurabilitySensorComponentSchema>;
