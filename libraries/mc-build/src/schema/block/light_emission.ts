import { defaulted, Infer, number } from "superstruct";

/**
 * Superstruct schema for the block light emission component.
 */
export const BlockLightEmissionComponentSchema = defaulted(number(), 15);

/**
 * Type for the block light emission component definition.
 */
export type BlockLightEmissionComponent = Infer<typeof BlockLightEmissionComponentSchema>;
