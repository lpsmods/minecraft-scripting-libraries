import { array, boolean, enums, Infer, number, object, optional, string, tuple, union } from "superstruct";
import { LootFunctionExampleSchema } from "./example.ts";
import { NumberRangeSchema } from "../common";

const amount = union([number(), NumberRangeSchema]);
const name = (value: string) => enums([value, `minecraft:${value}`]);

/**
 * Superstruct schema for the loot function.
 */
export const LootFunctionSchema = union([
  LootFunctionExampleSchema,
  object({ function: name("set_count"), count: amount, add: optional(boolean()) }),
  object({ function: name("set_damage"), damage: amount, add: optional(boolean()) }),
  object({ function: name("set_data"), data: amount }),
  object({ function: name("enchant_randomly"), treasure: optional(boolean()) }),
  object({ function: name("enchant_with_levels"), levels: amount, treasure: optional(boolean()) }),
  object({ function: name("exploration_map"), destination: string() }),
  object({
    function: name("specific_enchants"),
    enchants: array(union([string(), object({
      id: string(), level: optional(union([number(), tuple([number(), number()])])),
    })])),
  }),
]);

/**
 * Type definition for a loot function.
 */
export type LootFunction = Infer<typeof LootFunctionSchema>;
