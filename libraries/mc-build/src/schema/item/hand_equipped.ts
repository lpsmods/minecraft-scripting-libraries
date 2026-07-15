import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item hand equipped component.
 */
export const ItemHandEquippedComponentSchema = object({
  value: defaulted(boolean(), true),
});

/**
 * Type for the item hand equipped component definition.
 */
export type ItemHandEquippedComponent = Infer<typeof ItemHandEquippedComponentSchema>;
