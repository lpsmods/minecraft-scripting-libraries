import { Infer, object, string, union } from "superstruct";

/**
 * Superstruct schema for the item use animation component.
 */
export const ItemUseAnimationComponentSchema = union([
  string(),
  object({
    value: string(),
  }),
]);

/**
 * Type for the item use animation component definition.
 */
export type ItemUseAnimationComponent = Infer<typeof ItemUseAnimationComponentSchema>;
