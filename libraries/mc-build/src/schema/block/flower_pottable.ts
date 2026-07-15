import { Infer, object } from "superstruct";

/**
 * Superstruct schema for the block flower pottable component.
 */
export const BlockFlowerPottableComponentSchema = object({});

/**
 * Type for the block flower pottable component definition.
 */
export type BlockFlowerPottableComponent = Infer<typeof BlockFlowerPottableComponentSchema>;
