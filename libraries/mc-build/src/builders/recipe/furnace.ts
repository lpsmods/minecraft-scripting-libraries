import { assert } from "superstruct";
import { type Ingredient, RecipeFurnaceSchema, type RecipeFurnace, type RecipeFurnaceData } from "../../schema";

/**
 * Defines the recipe furnace asset.
 */
export function defineRecipeFurnace(data: RecipeFurnace): RecipeFurnace {
  assert(data, RecipeFurnaceSchema);
  return data;
}

/**
 * Creates a recipe furnace definition.
 */
export function recipeFurnace(identifier: string) {
  const data: Partial<RecipeFurnaceData> = {
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
    output(output: Ingredient) {
      data.output = output;
      return this;
    },
    build(): RecipeFurnace {
      return RecipeFurnaceSchema.create({ "minecraft:recipe_furnace": data }) as RecipeFurnace;
    },
  };
}
