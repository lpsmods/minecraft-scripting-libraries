import { assert } from "superstruct";
import {
  RecipeBrewingMixSchema,
  type Ingredient,
  type RecipeBrewingMix,
  type RecipeBrewingMixData,
} from "../../schema";

/**
 * Defines the recipe brewing mix asset.
 */
export function defineRecipeBrewingMix(data: RecipeBrewingMix): RecipeBrewingMix {
  assert(data, RecipeBrewingMixSchema);
  return data;
}

/**
 * Creates a recipe brewing mix definition.
 */
export function recipeBrewingMix(identifier: string) {
  const data: Partial<RecipeBrewingMixData> = {
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
    input(input: Ingredient) {
      data.input = input;
      return this;
    },
    reagent(reagent: Ingredient) {
      data.reagent = reagent;
      return this;
    },
    output(output: Ingredient) {
      data.output = output;
      return this;
    },
    build(): RecipeBrewingMix {
      return RecipeBrewingMixSchema.create({ "minecraft:recipe_brewing_mix": data }) as RecipeBrewingMix;
    },
  };
}
