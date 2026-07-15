import { array, defaulted, Infer, object, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe brewing container data.
 */
export const RecipeBrewingContainerDataSchema = object({
  description: CommonDescription,
  input: IngredientSchema,
  reagent: IngredientSchema,
  output: IngredientSchema,

  tags: defaulted(array(string()), ["brewing_stand"]),
});

/**
 * Superstruct schema for the recipe brewing container.
 */
export const RecipeBrewingContainerSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_brewing_container": RecipeBrewingContainerDataSchema,
});

/**
 * Structured data for the recipe brewing container.
 */
export type RecipeBrewingContainerData = Infer<typeof RecipeBrewingContainerDataSchema>;

/**
 * Type definition for a recipe brewing container.
 */
export type RecipeBrewingContainer = Infer<typeof RecipeBrewingContainerSchema>;
