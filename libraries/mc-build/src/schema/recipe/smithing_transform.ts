import { array, defaulted, Infer, object, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe smithing transform data.
 */
export const RecipeSmithingTransformDataSchema = object({
  description: CommonDescription,
  addition: IngredientSchema,
  base: IngredientSchema,
  result: IngredientSchema,
  template: IngredientSchema,

  tags: defaulted(array(string()), ["smithing_table"]),
});

/**
 * Superstruct schema for the recipe smithing transform.
 */
export const RecipeSmithingTransformSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_smithing_transform": RecipeSmithingTransformDataSchema,
});

/**
 * Structured data for the recipe smithing transform.
 */
export type RecipeSmithingTransformData = Infer<typeof RecipeSmithingTransformDataSchema>;

/**
 * Type definition for a recipe smithing transform.
 */
export type RecipeSmithingTransform = Infer<typeof RecipeSmithingTransformSchema>;
