import { boolean, defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block redstone consumer component.
 */
export const BlockRedstoneConsumerComponentSchema = object({
  min_power: defaulted(number(), 0),
  propagates_power: defaulted(boolean(), false),
});

/**
 * Type for the block redstone consumer component definition.
 */
export type BlockRedstoneConsumerComponent = Infer<typeof BlockRedstoneConsumerComponentSchema>;
