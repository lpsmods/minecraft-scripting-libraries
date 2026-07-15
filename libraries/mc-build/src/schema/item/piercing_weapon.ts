import { defaulted, Infer, number, object } from "superstruct";
import { NumberRangeSchema } from "../common";

/**
 * Superstruct schema for the item piercing weapon component.
 */
export const ItemPiercingWeaponComponentSchema = object({
  creative_reach: NumberRangeSchema,
  hitbox_margin: defaulted(number(), 0),
  reach: NumberRangeSchema,
});

/**
 * Type for the item piercing weapon component definition.
 */
export type ItemPiercingWeaponComponent = Infer<typeof ItemPiercingWeaponComponentSchema>;
