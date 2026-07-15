import { array, Infer, object } from "superstruct";
import { BlockFilterSchema, Direction2Schema } from "../common";

/**
 * Superstruct schema for the block placement filter component.
 */
export const BlockPlacementFilterComponentSchema = object({
  conditions: array(
    object({
      allowed_faces: array(Direction2Schema),
      block_filter: array(BlockFilterSchema),
    }),
  ),
});

/**
 * Type for the block placement filter component definition.
 */
export type BlockPlacementFilterComponent = Infer<typeof BlockPlacementFilterComponentSchema>;
