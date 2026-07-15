import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item fire resistant component.
 */
export const ItemFireResistantComponentSchema = object({
  value: defaulted(boolean(), true),
});

/**
 * Type for the item fire resistant component definition.
 */
export type ItemFireResistantComponent = Infer<typeof ItemFireResistantComponentSchema>;
