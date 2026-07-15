import { Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the item display name component.
 */
export const ItemDisplayNameComponentSchema = object({
  value: string(),
});

/**
 * Type for the item display name component definition.
 */
export type ItemDisplayNameComponent = Infer<typeof ItemDisplayNameComponentSchema>;
