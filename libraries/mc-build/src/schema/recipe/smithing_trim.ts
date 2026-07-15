import { array, defaulted, Infer, object, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe smithing trim data.
 */
export const RecipeSmithingTrimDataSchema = object({
  description: CommonDescription,
  addition: IngredientSchema,
  base: IngredientSchema,
  template: IngredientSchema,

  tags: defaulted(array(string()), ["smithing_table"]),
});

/**
 * Superstruct schema for the recipe smithing trim.
 */
export const RecipeSmithingTrimSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_smithing_trim": RecipeSmithingTrimDataSchema,
});

/**
 * Structured data for the recipe smithing trim.
 */
export type RecipeSmithingTrimData = Infer<typeof RecipeSmithingTrimDataSchema>;

/**
 * Type definition for a recipe smithing trim.
 */
export type RecipeSmithingTrim = Infer<typeof RecipeSmithingTrimSchema>;
