import { Infer, union } from "superstruct";
import { LootItemEntrySchema } from "./item.ts";
import { LootLootEntrySchema } from "./loot.ts";
import { LootEmptyEntrySchema } from "./empty.ts";

/**
 * Superstruct schema for the loot entry.
 */
export const LootEntrySchema = union([LootItemEntrySchema, LootLootEntrySchema, LootEmptyEntrySchema]);

/**
 * Type definition for a loot entry.
 */
export type LootEntry = Infer<typeof LootEntrySchema>;
