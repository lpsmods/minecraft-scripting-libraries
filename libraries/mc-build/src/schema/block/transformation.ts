import { Infer, object, optional } from "superstruct";
import { Arr3 } from "../common";

/**
 * Superstruct schema for the block transformation component.
 */
export const BlockTransformationComponentSchema = object({
  rotation: optional(Arr3),
  rotation_pivot: optional(Arr3),
  scale: optional(Arr3),
  scale_pivot: optional(Arr3),
  translation: optional(Arr3),
});

/**
 * Type for the block transformation component definition.
 */
export type BlockTransformationComponent = Infer<typeof BlockTransformationComponentSchema>;
