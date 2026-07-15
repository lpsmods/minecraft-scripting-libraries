import { boolean, Infer, object } from "superstruct";

/**
 * Superstruct schema for the item should despawn component.
 */
export const ItemShouldDespawnComponentSchema = object({
  value: boolean(),
});

/**
 * Type for the item should despawn component definition.
 */
export type ItemShouldDespawnComponent = Infer<typeof ItemShouldDespawnComponentSchema>;
