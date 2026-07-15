import { Infer, object } from "superstruct";
import { BlockGeometryComponentSchema } from "./geometry";
import { BlockMaterialInstancesComponentSchema } from "./material_instances";

/**
 * Superstruct schema for the block embedded visual component.
 */
export const BlockEmbeddedVisualComponentSchema = object({
  geometry: BlockGeometryComponentSchema,
  material_instances: BlockMaterialInstancesComponentSchema,
});

/**
 * Type for the block embedded visual component definition.
 */
export type BlockEmbeddedVisualComponent = Infer<typeof BlockEmbeddedVisualComponentSchema>;
