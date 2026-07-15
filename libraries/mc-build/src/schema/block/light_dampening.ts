import { Infer, number } from "superstruct";

/**
 * Superstruct schema for the block light dampening component.
 */
export const BlockLightDampeningComponentSchema = number();

/**
 * Type for the block light dampening component definition.
 */
export type BlockLightDampeningComponent = Infer<typeof BlockLightDampeningComponentSchema>;
