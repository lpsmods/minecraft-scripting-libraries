import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for block culling rules. */
export const BlockCullingSchema = type({
  format_version: defaulted(string(), "1.21.80"),
  "minecraft:block_culling_rules": identifiedDataSchema(),
});

export const BlockCullingRulesSchema = BlockCullingSchema;

export type BlockCulling = Infer<typeof BlockCullingSchema>;
export type BlockCullingRules = BlockCulling;
