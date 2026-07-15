import { boolean, defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item throwable component.
 */
export const ItemThrowableComponentSchema = object({
  do_swing_animation: defaulted(boolean(), false),
  launch_power_scale: defaulted(number(), 1),
  max_draw_duration: defaulted(number(), 0),
  max_launch_power: defaulted(number(), 1),
  min_draw_duration: defaulted(number(), 0),
  scale_power_by_draw_duration: defaulted(boolean(), false),
});

/**
 * Type for the item throwable component definition.
 */
export type ItemThrowableComponent = Infer<typeof ItemThrowableComponentSchema>;
