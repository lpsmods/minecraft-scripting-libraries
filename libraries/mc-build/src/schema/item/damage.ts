import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item damage component.
 */
export const ItemDamageComponentSchema = object({
  value: number(),
});

/**
 * Type for the item damage component definition.
 */
export type ItemDamageComponent = Infer<typeof ItemDamageComponentSchema>;
