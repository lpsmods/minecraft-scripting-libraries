import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item compostable component.
 */
export const ItemCompostableComponentSchema = object({
  composting_chance: number(),
});

/**
 * Type for the item compostable component definition.
 */
export type ItemCompostableComponent = Infer<typeof ItemCompostableComponentSchema>;
