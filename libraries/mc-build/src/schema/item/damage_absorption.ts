import { array, Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the item damage absorption component.
 */
export const ItemDamageAbsorptionComponentSchema = object({
  absorbable_causes: array(string()),
});

/**
 * Type for the item damage absorption component definition.
 */
export type ItemDamageAbsorptionComponent = Infer<typeof ItemDamageAbsorptionComponentSchema>;
