import { assert } from "superstruct";

import {
  RecipeBrewingContainerSchema,
  type Ingredient,
  type RecipeBrewingContainer,
  type RecipeBrewingContainerData,
} from "../../schema";

/**
 * Defines the recipe brewing container asset.
 */
export function defineRecipeBrewingContainer(data: RecipeBrewingContainer): RecipeBrewingContainer {
  assert(data, RecipeBrewingContainerSchema);
  return data;
}

/**
 * Creates a recipe brewing container definition.
 */
export function recipeBrewingContainer(identifier: string) {
  const data: Partial<RecipeBrewingContainerData> = {
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
    build(): RecipeBrewingContainer {
      return RecipeBrewingContainerSchema.create({
        "minecraft:recipe_brewing_container": data,
      }) as RecipeBrewingContainer;
    },
  };
}
