import { array, defaulted, Infer, object, string } from "superstruct";
import { CommonDescription, IngredientSchema } from "../common";

/**
 * Superstruct schema for the recipe furnace data.
 */
export const RecipeFurnaceDataSchema = object({
  description: CommonDescription,
  input: IngredientSchema,
  output: IngredientSchema,
  tags: defaulted(array(string()), ["furnace", "smoker", "campfire", "soul_campfire"]),
});

/**
 * Superstruct schema for the recipe furnace.
 */
export const RecipeFurnaceSchema = object({
  format_version: defaulted(string(), "1.12"),
  "minecraft:recipe_furnace": RecipeFurnaceDataSchema,
});

/**
 * Structured data for the recipe furnace.
 */
export type RecipeFurnaceData = Infer<typeof RecipeFurnaceDataSchema>;

/**
 * Type definition for a recipe furnace.
 */
export type RecipeFurnace = Infer<typeof RecipeFurnaceSchema>;
