import { Infer, object } from "superstruct";
import { BlockGeometryComponentSchema } from "./geometry";
import { BlockMaterialInstancesComponentSchema } from "./material_instances";

/**
 * Superstruct schema for the block item visual component.
 */
export const BlockItemVisualComponentSchema = object({
  geometry: BlockGeometryComponentSchema,
  material_instances: BlockMaterialInstancesComponentSchema,
});

/**
 * Type for the block item visual component definition.
 */
export type BlockItemVisualComponent = Infer<typeof BlockItemVisualComponentSchema>;
