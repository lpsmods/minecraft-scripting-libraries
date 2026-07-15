import { array, defaulted, Infer, number, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the item durability component.
 */
export const ItemDurabilityComponentSchema = object({
  durability: number(),
  durability_thresholds: array(
    object({
      durability: defaulted(number(), 0),
      particle_type: optional(string()),
      sound_event: optional(string()),
    }),
  ),
  particle_type: optional(string()),
  sound_event: optional(string()),
});

/**
 * Type for the item durability component definition.
 */
export type ItemDurabilityComponent = Infer<typeof ItemDurabilityComponentSchema>;
