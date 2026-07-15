import { assert } from "superstruct";
import { type Ingredient, RecipeShapelessSchema, type RecipeShapeless, type RecipeShapelessData } from "../../schema";

/**
 * Defines the recipe shapeless asset.
 */
export function defineRecipeShapeless(data: RecipeShapeless): RecipeShapeless {
  assert(data, RecipeShapelessSchema);
  return data;
}

/**
 * Creates a recipe shapeless definition.
 */
export function recipeShapeless(identifier: string) {
  const data: Partial<RecipeShapelessData> = {
    description: {
      identifier,
    },
    ingredients: [],
  };

  return {
    tag(tag: string) {
      data.tags ??= [];
      data.tags.push(tag);
      return this;
    },
    ingredient(ingredient: Ingredient) {
      data.ingredients ??= [];
      data.ingredients.push(ingredient);
      return this;
    },
    priority(priority: number) {
      data.priority = priority;
      return this;
    },
    result(result: Ingredient) {
      data.result = result;
      return this;
    },
    build(): RecipeShapeless {
      return RecipeShapelessSchema.create({ "minecraft:recipe_shapeless": data }) as RecipeShapeless;
    },
  };
}

/**
 * Creates a recipe stonecutter definition.
 */
export function recipeStonecutter(identifier: string) {
  const data: Partial<RecipeShapelessData> = {
    description: {
      identifier,
    },
    tags: ["stonecutter"],
    ingredients: [],
  };

  return {
    tag(tag: string) {
      data.tags ??= [];
      data.tags.push(tag);
      return this;
    },
    input(ingredient: Ingredient) {
      data.ingredients = [ingredient];
      return this;
    },
    result(result: Ingredient) {
      data.result = result;
      return this;
    },
    build(): RecipeShapeless {
      return RecipeShapelessSchema.create({ "minecraft:recipe_shapeless": data }) as RecipeShapeless;
    },
  };
}
