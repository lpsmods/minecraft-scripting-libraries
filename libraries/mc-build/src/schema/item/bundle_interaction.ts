import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item bundle interaction component.
 */
export const ItemBundleInteractionComponentSchema = object({
  num_viewable_slots: defaulted(number(), 12),
});

/**
 * Type for the item bundle interaction component definition.
 */
export type ItemBundleInteractionComponent = Infer<typeof ItemBundleInteractionComponentSchema>;
