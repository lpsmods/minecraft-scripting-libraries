import { Infer, union } from "superstruct";
import { LootFunctionExampleSchema } from "./example.ts";

/**
 * Superstruct schema for the loot function.
 */
export const LootFunctionSchema = union([LootFunctionExampleSchema]);

/**
 * Type definition for a loot function.
 */
export type LootFunction = Infer<typeof LootFunctionSchema>;
