import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for a feature rule. */
export const FeatureRuleSchema = type({
  format_version: defaulted(string(), "1.13.0"),
  "minecraft:feature_rules": identifiedDataSchema(),
});

export type FeatureRule = Infer<typeof FeatureRuleSchema>;
