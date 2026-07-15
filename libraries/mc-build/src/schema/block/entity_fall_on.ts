import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block entity fall on component.
 */
export const BlockEntityFallOnComponentSchema = object({
  minimum_fall_distance: number(),
});

/**
 * Type for the block entity fall on component definition.
 */
export type BlockEntityFallOnComponent = Infer<typeof BlockEntityFallOnComponentSchema>;
