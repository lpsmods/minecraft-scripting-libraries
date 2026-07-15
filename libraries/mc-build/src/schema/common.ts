import { any, array, boolean, enums, Infer, number, object, optional, record, string, union } from "superstruct";

/**
 * Shared vec3 value.
 */
export const Vec3 = object({ x: number(), y: number(), z: number() });

/**
 * Shared vec2 value.
 */
export const Vec2 = object({ x: number(), y: number() });

/**
 * Shared arr3 value.
 */
export const Arr3 = array(number());

/**
 * Shared arr2 value.
 */
export const Arr2 = array(number());

/**
 * Allowed values for a direction.
 */
export enum Direction {
  North = "north",
  East = "east",
  South = "south",
  West = "west",
}

/**
 * Superstruct schema for the direction.
 */
export const DirectionSchema = enums(Object.values(Direction));

/**
 * Allowed values for a direction2.
 */
export enum Direction2 {
  North = "north",
  East = "east",
  South = "south",
  West = "west",
  Up = "up",
  Down = "down",
}

/**
 * Superstruct schema for the direction2.
 */
export const Direction2Schema = enums(Object.values(Direction2));

/**
 * Allowed values for a tint method.
 */
export enum TintMethod {
  None = "none",
  DefaultFoliage = "default_foliage",
  BirchFoliage = "birch_foliage",
  EvergreenFoliage = "evergreen_foliage",
  DryFoliage = "dry_foliage",
  Grass = "grass",
  Water = "water",
}

/**
 * Superstruct schema for the tint method.
 */
export const TintMethodSchema = enums(Object.values(TintMethod));

/**
 * Allowed values for an equippable slot.
 */
export enum EquippableSlot {
  Body = "slot.armor.body",
  Chest = "slot.armor.chest",
  Feet = "slot.armor.feet",
  Head = "slot.armor.head",
  Legs = "slot.armor.legs",
  Mainhand = "slot.armor.mainhand",
  Offhand = "slot.armor.offhand",
}

/**
 * Superstruct schema for the equippable slot.
 */
export const EquippableSlotSchema = enums(Object.values(EquippableSlot));

/**
 * Shared common description value.
 */
export const CommonDescription = object({
  identifier: string(),
});

/**
 * Shared creative inventory menu category.
 */
export const MenuCategorySchema = object({
  category: string(),
  group: optional(string()),
  is_hidden_in_commands: optional(boolean()),
});

/**
 * Superstruct schema for the ingredient.
 */
export const IngredientSchema = union([
  string(),
  object({
    item: string(),
    count: optional(number()),
    data: optional(number()),
  }),
]);

/**
 * Superstruct schema for the item stack.
 */
export const ItemStackSchema = object({
  item: string(),
  count: optional(number()),
  data: optional(number()),
});

/**
 * Superstruct schema for the block filter.
 */
export const BlockFilterSchema = object({
  name: string(),
  states: optional(record(string(), any())),
  tags: optional(string()),
});

/**
 * Superstruct schema for the block descriptor.
 */
export const BlockDescriptorSchema = union([
  string(),
  object({
    name: string(),
    states: optional(record(string(), any())),
    tags: optional(string()),
  }),
]);

/**
 * Superstruct schema for the number range.
 */
export const NumberRangeSchema = object({
  min: number(),
  max: number(),
});

/**
 * Superstruct schema for the molang.
 */
export const MolangSchema = union([
  string(),
  number(),
  object({
    expression: string(),
    version: union([string(), number()]),
  }),
]);

/**
 * Type definition for an ingredient.
 */
export type Ingredient = Infer<typeof IngredientSchema>;

/**
 * Type definition for an item stack.
 */
export type ItemStack = Infer<typeof ItemStackSchema>;

/**
 * Type definition for a block filter.
 */
export type BlockFilter = Infer<typeof BlockFilterSchema>;

/**
 * Type definition for a block descriptor.
 */
export type BlockDescriptor = Infer<typeof BlockDescriptorSchema>;

/**
 * Type definition for a number range.
 */
export type NumberRange = Infer<typeof NumberRangeSchema>;

/**
 * Type definition for a molang.
 */
export type Molang = Infer<typeof MolangSchema>;

/**
 * Creative inventory menu category.
 */
export type MenuCategory = Infer<typeof MenuCategorySchema>;
