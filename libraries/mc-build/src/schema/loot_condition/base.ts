import { Infer, union } from "superstruct";
import { LootConditionExampleSchema } from "./example.ts";

/**
 * Superstruct schema for the loot condition.
 */
export const LootConditionSchema = union([LootConditionExampleSchema]);

/**
 * Type definition for a loot condition.
 */
export type LootCondition = Infer<typeof LootConditionSchema>;
