import { assert } from "superstruct";
import {
  RecipeSmithingTrimSchema,
  type Ingredient,
  type RecipeSmithingTrim,
  type RecipeSmithingTrimData,
} from "../../schema";

/**
 * Defines the recipe smithing trim asset.
 */
export function defineRecipeSmithingTrim(data: RecipeSmithingTrim): RecipeSmithingTrim {
  assert(data, RecipeSmithingTrimSchema);
  return data;
}

/**
 * Creates a recipe smithing trim definition.
 */
export function recipeSmithingTrim(identifier: string) {
  const data: Partial<RecipeSmithingTrimData> = {
    description: {
      identifier,
    },
  };

  return {
    tag(tag: string) {
      data.tags ??= [];
      data.tags.push(tag);
      return this;
    },
    addition(addition: Ingredient) {
      data.addition = addition;
      return this;
    },
    base(base: Ingredient) {
      data.base = base;
      return this;
    },
    template(template: Ingredient) {
      data.template = template;
      return this;
    },
    build(): RecipeSmithingTrim {
      return RecipeSmithingTrimSchema.create({ "minecraft:recipe_smithing_trim": data }) as RecipeSmithingTrim;
    },
  };
}
