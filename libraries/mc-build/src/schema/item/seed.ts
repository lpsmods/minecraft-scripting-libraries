import { array, boolean, defaulted, Infer, object, string } from "superstruct";

/**
 * Superstruct schema for the item seed component.
 */
export const ItemSeedComponentSchema = object({
  crop_result: string(),
  plant_at: array(string()),
  plant_at_any_solid_surface: defaulted(boolean(), false),
  plant_at_face: string(),
});

/**
 * Type for the item seed component definition.
 */
export type ItemSeedComponent = Infer<typeof ItemSeedComponentSchema>;
