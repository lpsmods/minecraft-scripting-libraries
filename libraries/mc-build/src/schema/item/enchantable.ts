import { enums, Infer, number, object } from "superstruct";

/**
 * Allowed values for an enchant slot.
 */
export enum EnchantSlot {
  None = "none",
  All = "all",
  GArmor = "g_armor",
  ArmorHead = "armor_head",
  ArmorTorso = "armor_torso",
  ArmorFeet = "armor_feet",
  ArmorLegs = "armor_legs",
  Sword = "sword",
  Bow = "bow",
  Spear = "spear",
  Crossbow = "crossbow",
  MeleeSpear = "melee_spear",
  GTool = "g_tool",
  Hoe = "hoe",
  Shears = "shears",
  Flintsteel = "flintsteel",
  Shield = "shield",
  GDigging = "g_digging",
  Axe = "axe",
  Pickaxe = "pickaxe",
  Shovel = "shovel",
  FishingRod = "fishing_rod",
  CarrotStick = "carrot_stick",
  Elytra = "elytra",
  CosmeticHead = "cosmetic_head",
}

/**
 * Superstruct schema for the item enchantable component.
 */
export const ItemEnchantableComponentSchema = object({
  slot: enums(Object.values(EnchantSlot)),
  value: number(),
});

/**
 * Type for the item enchantable component definition.
 */
export type ItemEnchantableComponent = Infer<typeof ItemEnchantableComponentSchema>;
