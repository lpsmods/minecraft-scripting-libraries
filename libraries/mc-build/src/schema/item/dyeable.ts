import { array, Infer, number, object, string, union } from "superstruct";

/**
 * Superstruct schema for the item dyeable component.
 */
export const ItemDyeableComponentSchema = object({
  default_color: union([string(), array(number())]),
});

/**
 * Type for the item dyeable component definition.
 */
export type ItemDyeableComponent = Infer<typeof ItemDyeableComponentSchema>;
