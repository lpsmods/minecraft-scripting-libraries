import { boolean, defaulted, Infer, number, object } from "superstruct";
import { EquippableSlotSchema } from "../common";

/**
 * Superstruct schema for the item wearable component.
 */
export const ItemWearableComponentSchema = object({
  hides_player_location: defaulted(boolean(), false),
  protection: defaulted(number(), 1),
  slot: EquippableSlotSchema,
  dispensable: boolean(),
});

/**
 * Type for the item wearable component definition.
 */
export type ItemWearableComponent = Infer<typeof ItemWearableComponentSchema>;
