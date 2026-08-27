import { array, boolean, defaulted, Infer, integer, object, optional, record, string, union, unknown } from "superstruct";
import { MenuCategorySchema } from "../common";

/** Allowed values for a custom block state, including an inclusive integer range. */
export const BlockStateSchema = union([
  array(boolean()), array(integer()), array(string()),
  object({ values: object({ min: integer(), max: integer() }) }),
]);

/**
 * Superstruct schema for the block data.
 */
export const BlockDataSchema = object({
  description: object({
    identifier: string(),
    menu_category: optional(MenuCategorySchema),
    states: optional(record(string(), BlockStateSchema)),
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
