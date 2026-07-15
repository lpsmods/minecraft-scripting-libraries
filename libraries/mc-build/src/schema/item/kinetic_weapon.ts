import { defaulted, Infer, number, object } from "superstruct";
import { NumberRangeSchema } from "../common";

/**
 * Superstruct schema for the item kinetic weapon component.
 */
export const ItemKineticWeaponComponentSchema = object({
  creative_reach: NumberRangeSchema,
  damage_conditions: object({
    max_duration: defaulted(number(), -1),
    min_relative_speed: defaulted(number(), 0),
    min_speed: defaulted(number(), 0),
  }),
  damage_modifier: defaulted(number(), 0),
  damage_multiplier: defaulted(number(), 1),
  delay: defaulted(number(), 1),
  dismount_conditions: object({}),
  hitbox_margin: defaulted(number(), 0),
  knockback_conditions: object({}),
  reach: NumberRangeSchema,
});

/**
 * Type for the item kinetic weapon component definition.
 */
export type ItemKineticWeaponComponent = Infer<typeof ItemKineticWeaponComponentSchema>;
