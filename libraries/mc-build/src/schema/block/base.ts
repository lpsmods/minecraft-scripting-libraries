import { array, defaulted, Infer, object, optional, record, string, unknown } from "superstruct";
import { MenuCategorySchema } from "../common";

/**
 * Superstruct schema for the block data.
 */
export const BlockDataSchema = object({
  description: object({
    identifier: string(),
    menu_category: optional(MenuCategorySchema),
  }),
  components: optional(record(string(), unknown())),
  permutations: optional(array()),
});

/**
 * Superstruct schema for the block.
 */
export const BlockSchema = object({
  format_version: defaulted(string(), "1.26.20"),
  "minecraft:block": BlockDataSchema,
});

/**
 * Type definition for a block.
 */
export type Block = Infer<typeof BlockSchema>;

/**
 * Structured data for the block.
 */
export type BlockData = Infer<typeof BlockDataSchema>;
