import { Infer, string } from "superstruct";

/**
 * Superstruct schema for the block map color component.
 */
export const BlockMapColorComponentSchema = string();

/**
 * Type for the block map color component definition.
 */
export type BlockMapColorComponent = Infer<typeof BlockMapColorComponentSchema>;
