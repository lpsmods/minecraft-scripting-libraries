import { defaulted, Infer, object, optional, record, string, unknown } from "superstruct";
import { MenuCategorySchema } from "../common";

/**
 * Superstruct schema for the item data.
 */
export const ItemDataSchema = object({
  description: object({
    identifier: string(),
    menu_category: optional(MenuCategorySchema),
  }),
  components: optional(record(string(), unknown())),
});

/**
 * Superstruct schema for the item.
 */
export const ItemSchema = object({
  format_version: defaulted(string(), "1.26.20"),
  "minecraft:item": ItemDataSchema,
});

/**
 * Type definition for an item.
 */
export type Item = Infer<typeof ItemSchema>;

/**
 * Structured data for the item.
 */
export type ItemData = Infer<typeof ItemDataSchema>;
