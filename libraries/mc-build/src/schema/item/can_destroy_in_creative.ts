import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item can destroy in creative component.
 */
export const ItemCanDestroyInCreativeComponentSchema = object({
  value: defaulted(boolean(), true),
});

/**
 * Type for the item can destroy in creative component definition.
 */
export type ItemCanDestroyInCreativeComponent = Infer<typeof ItemCanDestroyInCreativeComponentSchema>;
