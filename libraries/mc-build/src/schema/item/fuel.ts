import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item fuel component.
 */
export const ItemFuelComponentSchema = object({
  duration: number(),
});

/**
 * Type for the item fuel component definition.
 */
export type ItemFuelComponent = Infer<typeof ItemFuelComponentSchema>;
