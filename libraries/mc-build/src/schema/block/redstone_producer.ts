import { array, boolean, defaulted, Infer, number, object } from "superstruct";
import { Direction2Schema } from "../common";

/**
 * Superstruct schema for the block redstone producer component.
 */
export const BlockRedstoneProducerComponentSchema = object({
  connected_faces: array(Direction2Schema),
  power: number(),
  strongly_powered_face: Direction2Schema,
  transform_relative: defaulted(boolean(), false),
});

/**
 * Type for the block redstone producer component definition.
 */
export type BlockRedstoneProducerComponent = Infer<typeof BlockRedstoneProducerComponentSchema>;
