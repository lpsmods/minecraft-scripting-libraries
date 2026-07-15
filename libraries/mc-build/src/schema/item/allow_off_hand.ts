import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item allow off hand component.
 */
export const ItemAllowOffHandComponentSchema = object({
  value: defaulted(boolean(), true),
});

/**
 * Type for the item allow off hand component definition.
 */
export type ItemAllowOffHandComponent = Infer<typeof ItemAllowOffHandComponentSchema>;
