import { enums, Infer, number, object, string } from "superstruct";

/**
 * Allowed values for an item cooldown type.
 */
export enum ItemCooldownType {
  Attack = "attack",
  Use = "use",
}

/**
 * Superstruct schema for the item cooldown component.
 */
export const ItemCooldownComponentSchema = object({
  category: string(),
  duration: number(),
  type: enums(Object.values(ItemCooldownType)),
});

/**
 * Type for the item cooldown component definition.
 */
export type ItemCooldownComponent = Infer<typeof ItemCooldownComponentSchema>;
