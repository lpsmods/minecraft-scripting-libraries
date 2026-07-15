import { array, defaulted, Infer, string, type } from "superstruct";
import { OpenObjectSchema } from "./resource";

/** Superstruct schema for the crafting item catalog. */
export const CraftingItemCatalogSchema = type({
  format_version: defaulted(string(), "1.26.20"),
  "minecraft:crafting_items_catalog": type({
    categories: defaulted(array(OpenObjectSchema), []),
  }),
});

export type CraftingItemCatalog = Infer<typeof CraftingItemCatalogSchema>;
