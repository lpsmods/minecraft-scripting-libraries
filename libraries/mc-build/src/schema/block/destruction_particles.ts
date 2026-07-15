import { Infer, number, object, string } from "superstruct";
import { TintMethodSchema } from "../common";

/**
 * Superstruct schema for the block destruction particles component.
 */
export const BlockDestructionParticlesComponentSchema = object({
  particle_count: number(),
  texture: string(),
  tint_method: TintMethodSchema,
});

/**
 * Type for the block destruction particles component definition.
 */
export type BlockDestructionParticlesComponent = Infer<typeof BlockDestructionParticlesComponentSchema>;
