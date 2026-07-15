import { array, Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the item tags component.
 */
export const ItemTagsComponentSchema = object({
  tags: array(string()),
});

/**
 * Type for the item tags component definition.
 */
export type ItemTagsComponent = Infer<typeof ItemTagsComponentSchema>;
