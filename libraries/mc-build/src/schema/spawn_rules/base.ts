import { array, defaulted, record, unknown, Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the spawn rules data.
 */
export const SpawnRulesDataSchema = object({
  description: object({
    identifier: string(),
    population_control: string(),
  }),
  conditions: array(record(string(), unknown())),
});

/**
 * Superstruct schema for the spawn rules.
 */
export const SpawnRulesSchema = object({
  format_version: defaulted(string(), "1.8.0"),
  "minecraft:spawn_rules": SpawnRulesDataSchema,
});

/**
 * Structured data for the spawn rules.
 */
export type SpawnRulesData = Infer<typeof SpawnRulesDataSchema>;

/**
 * Type definition for a spawn rules.
 */
export type SpawnRules = Infer<typeof SpawnRulesSchema>;
