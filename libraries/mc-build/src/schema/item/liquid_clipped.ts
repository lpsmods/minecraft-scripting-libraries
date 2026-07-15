import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item liquid clipped component.
 */
export const ItemLiquidClippedComponentSchema = object({
  max_duration: defaulted(number(), -1),
  min_relative_speed: defaulted(number(), 0),
  min_speed: defaulted(number(), 0),
});

/**
 * Type for the item liquid clipped component definition.
 */
export type ItemLiquidClippedComponent = Infer<typeof ItemLiquidClippedComponentSchema>;
