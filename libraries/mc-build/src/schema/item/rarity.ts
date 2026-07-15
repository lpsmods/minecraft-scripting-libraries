import { enums, Infer, object } from "superstruct";

/**
 * Allowed values for a rarity.
 */
export enum Rarity {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Epic = "epic",
}

/**
 * Superstruct schema for the item rarity component.
 */
export const ItemRarityComponentSchema = object({
  value: enums(Object.values(Rarity)),
});

/**
 * Type for the item rarity component definition.
 */
export type ItemRarityComponent = Infer<typeof ItemRarityComponentSchema>;
