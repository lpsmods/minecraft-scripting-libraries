import { boolean, defaulted, Infer, object } from "superstruct";

/**
 * Superstruct schema for the block redstone conductivity component.
 */
export const BlockRedstoneConductivityComponentSchema = object({
  allows_wire_to_step_down: defaulted(boolean(), true),
  redstone_conductor: defaulted(boolean(), false),
});

/**
 * Type for the block redstone conductivity component definition.
 */
export type BlockRedstoneConductivityComponent = Infer<typeof BlockRedstoneConductivityComponentSchema>;
