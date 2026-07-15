import { array, boolean, defaulted, Infer, number, object, string } from "superstruct";

/**
 * Superstruct schema for the item shooter component.
 */
export const ItemShooterComponentSchema = object({
  ammunition: array(
    object({
      item: string(),
      search_inventory: defaulted(boolean(), false),
      use_in_creative: defaulted(boolean(), false),
      use_offhand: defaulted(boolean(), false),
    }),
  ),
  charge_on_draw: defaulted(boolean(), false),
  max_draw_duration: defaulted(number(), 0),
  scale_power_by_draw_duration: defaulted(boolean(), false),
});

/**
 * Type for the item shooter component definition.
 */
export type ItemShooterComponent = Infer<typeof ItemShooterComponentSchema>;
