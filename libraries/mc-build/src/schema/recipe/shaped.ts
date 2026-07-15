import { array, boolean, defaulted, Infer, number, object, optional, record, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe shaped data.
 */
export const RecipeShapedDataSchema = object({
  description: CommonDescription,
  key: record(string(), IngredientSchema),
  pattern: array(string()),
  result: IngredientSchema,
  priority: optional(number()),
  tags: defaulted(array(string()), ["crafting_table"]),
  assume_symmetry: optional(boolean()),
});

/**
 * Superstruct schema for the recipe shaped.
 */
export const RecipeShapedSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_shaped": RecipeShapedDataSchema,
});

/**
 * Structured data for the recipe shaped.
 */
export type RecipeShapedData = Infer<typeof RecipeShapedDataSchema>;

/**
 * Type definition for a recipe shaped.
 */
export type RecipeShaped = Infer<typeof RecipeShapedSchema>;
