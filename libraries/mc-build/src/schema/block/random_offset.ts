import { Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block random offset component.
 */
export const BlockRandomOffsetComponentSchema = object({
  x: object({
    range: object({
      min: number(),
      max: number(),
    }),
    steps: number(),
  }),
  y: object({
    range: object({
      min: number(),
      max: number(),
    }),
    steps: number(),
  }),
  z: object({
    range: object({
      min: number(),
      max: number(),
    }),
    steps: number(),
  }),
});

/**
 * Type for the block random offset component definition.
 */
export type BlockRandomOffsetComponent = Infer<typeof BlockRandomOffsetComponentSchema>;
