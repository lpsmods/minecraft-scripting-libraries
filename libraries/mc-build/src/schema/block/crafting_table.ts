import { array, Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the block crafting table component.
 */
export const BlockCraftingTableComponentSchema = object({
  crafting_tags: array(string()),
  table_name: string(),
});

/**
 * Type for the block crafting table component definition.
 */
export type BlockCraftingTableComponent = Infer<typeof BlockCraftingTableComponentSchema>;
