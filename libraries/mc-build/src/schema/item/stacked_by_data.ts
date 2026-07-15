import { boolean, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item stacked by data component.
 */
export const ItemStackedByDataComponentSchema = object({
  value: boolean(),
});

/**
 * Type for the item stacked by data component definition.
 */
export type ItemStackedByDataComponent = Infer<typeof ItemStackedByDataComponentSchema>;
