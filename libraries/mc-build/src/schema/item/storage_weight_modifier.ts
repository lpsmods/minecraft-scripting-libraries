import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item storage weight modifier component.
 */
export const ItemStorageWeightModifierComponentSchema = object({
  weight_in_storage_item: defaulted(number(), 4),
});

/**
 * Type for the item storage weight modifier component definition.
 */
export type ItemStorageWeightModifierComponent = Infer<typeof ItemStorageWeightModifierComponentSchema>;
