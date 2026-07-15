import { Infer, object } from "superstruct";

/**
 * Superstruct schema for the block replaceable component.
 */
export const BlockReplaceableComponentSchema = object({});

/**
 * Type for the block replaceable component definition.
 */
export type BlockReplaceableComponent = Infer<typeof BlockReplaceableComponentSchema>;
