import { defaulted, Infer, number, object, string } from "superstruct";

/**
 * Superstruct schema for the item projectile component.
 */
export const ItemProjectileComponentSchema = object({
  minimum_critical_power: defaulted(number(), 1),
  projectile_entity: string(),
});

/**
 * Type for the item projectile component definition.
 */
export type ItemProjectileComponent = Infer<typeof ItemProjectileComponentSchema>;
