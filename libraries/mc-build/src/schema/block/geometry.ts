import { boolean, defaulted, Infer, object, optional, record, string, union } from "superstruct";

/**
 * Superstruct schema for the block geometry component.
 */
export const BlockGeometryComponentSchema = union([
  string(),
  object({
    bone_visibility: optional(record(string(), union([string(), boolean()]))),
    culling: optional(string()),
    culling_layer: defaulted(string(), "minecraft:culling_layer.undefined"),
    culling_shape: defaulted(string(), "minecraft:empty"),
    identifier: string(),
    uv_lock: union([boolean(), record(string(), boolean())]),
  }),
]);

/**
 * Type for the block geometry component definition.
 */
export type BlockGeometryComponent = Infer<typeof BlockGeometryComponentSchema>;
