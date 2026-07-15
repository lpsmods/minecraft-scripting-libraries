import { array, boolean, defaulted, Infer, object, string } from "superstruct";
import { BlockDescriptorSchema } from "../common";

/**
 * Superstruct schema for the item block placer component.
 */
export const ItemBlockPlacerComponentSchema = object({
  aligned_placement: defaulted(boolean(), false),
  block: string(),
  replace_block_item: defaulted(boolean(), false),
  use_on: array(BlockDescriptorSchema),
});

/**
 * Type for the item block placer component definition.
 */
export type ItemBlockPlacerComponent = Infer<typeof ItemBlockPlacerComponentSchema>;
