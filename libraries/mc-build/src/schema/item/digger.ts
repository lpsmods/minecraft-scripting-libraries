import { array, boolean, defaulted, Infer, number, object } from "superstruct";
import { BlockDescriptorSchema } from "../common";

/**
 * Superstruct schema for the item digger component.
 */
export const ItemDiggerComponentSchema = object({
  destroy_speeds: array(
    object({
      block: BlockDescriptorSchema,
      speed: number(),
    }),
  ),
  use_efficiency: defaulted(boolean(), false),
});

/**
 * Type for the item digger component definition.
 */
export type ItemDiggerComponent = Infer<typeof ItemDiggerComponentSchema>;
