import { assert } from "superstruct";
import {
  RecipeSmithingTransformSchema,
  type Ingredient,
  type RecipeSmithingTransform,
  type RecipeSmithingTransformData,
} from "../../schema";

/**
 * Defines the recipe smithing transform asset.
 */
export function defineRecipeSmithingTransform(data: RecipeSmithingTransform): RecipeSmithingTransform {
  assert(data, RecipeSmithingTransformSchema);
  return data;
}

/**
 * Creates a recipe smithing transform definition.
 */
export function recipeSmithingTransform(identifier: string) {
  const data: Partial<RecipeSmithingTransformData> = {
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
    result(result: Ingredient) {
      data.result = result;
      return this;
    },
    template(template: Ingredient) {
      data.template = template;
      return this;
    },
    build(): RecipeSmithingTransform {
      return RecipeSmithingTransformSchema.create({
        "minecraft:recipe_smithing_transform": data,
      }) as RecipeSmithingTransform;
    },
  };
}
