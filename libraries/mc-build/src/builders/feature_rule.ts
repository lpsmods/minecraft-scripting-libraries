import { FeatureRuleSchema, type FeatureRule, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a feature rule. */
export function defineFeatureRule(data: FeatureRule): FeatureRule {
  return defineResource(data, FeatureRuleSchema);
}

/** Creates a feature rule. */
export function featureRule(identifier: string, data?: OpenResourceData) {
  return identifiedResource(FeatureRuleSchema, "minecraft:feature_rules", identifier, data);
}
