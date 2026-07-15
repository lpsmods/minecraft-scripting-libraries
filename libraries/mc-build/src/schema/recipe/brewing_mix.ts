import { array, defaulted, Infer, object, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe brewing mix data.
 */
export const RecipeBrewingMixDataSchema = object({
  description: CommonDescription,
  input: IngredientSchema,
  reagent: IngredientSchema,
  output: IngredientSchema,

  tags: defaulted(array(string()), ["brewing_stand"]),
});

/**
 * Superstruct schema for the recipe brewing mix.
 */
export const RecipeBrewingMixSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_brewing_mix": RecipeBrewingMixDataSchema,
});

/**
 * Structured data for the recipe brewing mix.
 */
export type RecipeBrewingMixData = Infer<typeof RecipeBrewingMixDataSchema>;

/**
 * Type definition for a recipe brewing mix.
 */
export type RecipeBrewingMix = Infer<typeof RecipeBrewingMixSchema>;
