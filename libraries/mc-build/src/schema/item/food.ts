import { boolean, Infer, number, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the item food component.
 */
export const ItemFoodComponentSchema = object({
  can_always_eat: optional(boolean()),
  cooldown_time: optional(number()),
  cooldown_type: optional(string()),
  is_meat: optional(boolean()),
  nutrition: optional(number()),
  saturation_modifier: optional(number()),
  using_converts_to: optional(string()),
});

/**
 * Type for the item food component definition.
 */
export type ItemFoodComponent = Infer<typeof ItemFoodComponentSchema>;
