import { array, boolean, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block tick component.
 */
export const BlockTickComponentSchema = object({
  interval_range: array(number()),
  looping: boolean(),
});

/**
 * Type for the block tick component definition.
 */
export type BlockTickComponent = Infer<typeof BlockTickComponentSchema>;
