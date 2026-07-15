import { Infer, string } from "superstruct";

/**
 * Superstruct schema for the block display name component.
 */
export const BlockDisplayNameComponentSchema = string();

/**
 * Type for the block display name component definition.
 */
export type BlockDisplayNameComponent = Infer<typeof BlockDisplayNameComponentSchema>;
