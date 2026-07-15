import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block destructible by explosion component.
 */
export const BlockDestructibleByExplosionComponentSchema = object({
  explosion_resistance: number(),
});

/**
 * Type for the block destructible by explosion component definition.
 */
export type BlockDestructibleByExplosionComponent = Infer<typeof BlockDestructibleByExplosionComponentSchema>;
