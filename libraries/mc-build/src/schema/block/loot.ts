import { Infer, string } from "superstruct";

/**
 * Superstruct schema for the block loot component.
 */
export const BlockLootComponentSchema = string();

/**
 * Type for the block loot component definition.
 */
export type BlockLootComponent = Infer<typeof BlockLootComponentSchema>;
