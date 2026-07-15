import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item glint component.
 */
export const ItemGlintComponentSchema = object({
  value: defaulted(boolean(), true),
});

/**
 * Type for the item glint component definition.
 */
export type ItemGlintComponent = Infer<typeof ItemGlintComponentSchema>;
