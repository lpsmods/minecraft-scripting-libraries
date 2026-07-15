import { Infer, number } from "superstruct";

/**
 * Superstruct schema for the block friction component.
 */
export const BlockFrictionComponentSchema = number();

/**
 * Type for the block friction component definition.
 */
export type BlockFrictionComponent = Infer<typeof BlockFrictionComponentSchema>;
