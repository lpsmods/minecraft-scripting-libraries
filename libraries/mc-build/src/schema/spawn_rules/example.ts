import { Infer, object } from "superstruct";

/**
 * Superstruct schema for the spawn rule example component.
 */
export const SpawnRuleExampleComponentSchema = object({});

/**
 * Type for the spawn rule example component definition.
 */
export type SpawnRuleExampleComponent = Infer<typeof SpawnRuleExampleComponentSchema>;
