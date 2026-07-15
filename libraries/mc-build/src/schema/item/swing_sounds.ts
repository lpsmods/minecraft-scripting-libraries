import { Infer, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the item swing sounds component.
 */
export const ItemSwingSoundsComponentSchema = object({
  attack_critical_hit: optional(string()),
  attack_hit: optional(string()),
  attack_miss: optional(string()),
});

/**
 * Type for the item swing sounds component definition.
 */
export type ItemSwingSoundsComponent = Infer<typeof ItemSwingSoundsComponentSchema>;
