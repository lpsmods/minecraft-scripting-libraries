import { Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the item hover text color component.
 */
export const ItemHoverTextColorComponentSchema = object({
  value: string(),
});

/**
 * Type for the item hover text color component definition.
 */
export type ItemHoverTextColorComponent = Infer<typeof ItemHoverTextColorComponentSchema>;
