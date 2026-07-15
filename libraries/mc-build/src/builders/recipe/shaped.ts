import { assert } from "superstruct";
import { type Ingredient, RecipeShapedSchema, type RecipeShaped, type RecipeShapedData } from "../../schema";

/**
 * Defines the recipe shaped asset.
 */
export function defineRecipeShaped(data: RecipeShaped): RecipeShaped {
  assert(data, RecipeShapedSchema);
  return data;
}

/**
 * Creates a recipe shaped definition.
 */
export function recipeShaped(identifier: string, pattern: string[]) {
  const data: Partial<RecipeShapedData> = {
    description: {
      identifier,
    },
    key: {},
    pattern,
  };

  return {
    tag(tag: string) {
      data.tags ??= [];
      data.tags.push(tag);
      return this;
    },
    key(k: string, item: Ingredient) {
      data.key ??= {};
      data.key[k] = item;
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
    build(): RecipeShaped {
      return RecipeShapedSchema.create({ "minecraft:recipe_shaped": data }) as RecipeShaped;
    },
  };
}
