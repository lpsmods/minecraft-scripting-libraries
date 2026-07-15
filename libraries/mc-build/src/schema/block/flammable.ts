import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the block flammable component.
 */
export const BlockFlammableComponentSchema = object({
  catch_chance_modifier: defaulted(number(), 5),
  destroy_chance_modifier: defaulted(number(), 20),
});

/**
 * Type for the block flammable component definition.
 */
export type BlockFlammableComponent = Infer<typeof BlockFlammableComponentSchema>;
