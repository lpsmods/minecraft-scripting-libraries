import { array, Infer, object, string, union } from "superstruct";
import { BlockDescriptorSchema } from "../common";

/**
 * Superstruct schema for the item entity placer component.
 */
export const ItemEntityPlacerComponentSchema = object({
  dispense_on: union([BlockDescriptorSchema, array(BlockDescriptorSchema)]),
  entity: string(),
  use_on: union([BlockDescriptorSchema, array(BlockDescriptorSchema)]),
});

/**
 * Type for the item entity placer component definition.
 */
export type ItemEntityPlacerComponent = Infer<typeof ItemEntityPlacerComponentSchema>;
