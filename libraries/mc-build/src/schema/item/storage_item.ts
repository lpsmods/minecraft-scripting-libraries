import { array, boolean, defaulted, Infer, number, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the item storage item component.
 */
export const ItemStorageItemComponentSchema = object({
  allow_nested_storage_items: defaulted(boolean(), true),
  allowed_items: array(string()),
  banned_items: array(string()),
  max_slots: defaulted(number(), 64),
  max_weight_limit: optional(number()),
  weight_in_storage_item: optional(number()),
});

/**
 * Type for the item storage item component definition.
 */
export type ItemStorageItemComponent = Infer<typeof ItemStorageItemComponentSchema>;
