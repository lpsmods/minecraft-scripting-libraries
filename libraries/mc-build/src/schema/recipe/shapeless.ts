import { array, defaulted, Infer, number, object, optional, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe shapeless data.
 */
export const RecipeShapelessDataSchema = object({
  description: CommonDescription,
  ingredients: array(IngredientSchema),
  result: IngredientSchema,

  tags: defaulted(array(string()), ["crafting_table"]),
  priority: optional(number()),
});

/**
 * Superstruct schema for the recipe shapeless.
 */
export const RecipeShapelessSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_shapeless": RecipeShapelessDataSchema,
});

/**
 * Structured data for the recipe shapeless.
 */
export type RecipeShapelessData = Infer<typeof RecipeShapelessDataSchema>;

/**
 * Type definition for a recipe shapeless.
 */
export type RecipeShapeless = Infer<typeof RecipeShapelessSchema>;
