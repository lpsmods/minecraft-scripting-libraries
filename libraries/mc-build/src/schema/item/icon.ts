import { Infer, object, record, string } from "superstruct";

/**
 * Superstruct schema for the item icon component.
 */
export const ItemIconComponentSchema = object({
  texture: string(),
  textures: record(string(), string()),
});

/**
 * Type for the item icon component definition.
 */
export type ItemIconComponent = Infer<typeof ItemIconComponentSchema>;
