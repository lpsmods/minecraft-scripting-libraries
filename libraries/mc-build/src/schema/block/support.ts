import { enums, Infer, object } from "superstruct";

/**
 * Allowed values for a support shape.
 */
export enum SupportShape {
  Fence = "fence",
  Stair = "stair",
}

/**
 * Superstruct schema for the block support component.
 */
export const BlockSupportComponentSchema = object({
  shape: enums(Object.values(SupportShape)),
});

/**
 * Type for the block support component definition.
 */
export type BlockSupportComponent = Infer<typeof BlockSupportComponentSchema>;
