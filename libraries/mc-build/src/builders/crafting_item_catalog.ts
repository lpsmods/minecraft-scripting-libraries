import { CraftingItemCatalogSchema, type CraftingItemCatalog, type OpenResourceData } from "../schema";
import { defineResource } from "./resource";

/** Defines a crafting item catalog. */
export function defineCraftingItemCatalog(data: CraftingItemCatalog): CraftingItemCatalog {
  return defineResource(data, CraftingItemCatalogSchema);
}

/** Creates a crafting item catalog. */
export function craftingItemCatalog(categories: OpenResourceData[] = []) {
  const data = {
    "minecraft:crafting_items_catalog": {
      categories,
    },
  };
  return {
    category(category: OpenResourceData) {
      data["minecraft:crafting_items_catalog"].categories.push(category);
      return this;
    },
    set(key: string, value: unknown) {
      (data as OpenResourceData)[key] = value;
      return this;
    },
    build(): CraftingItemCatalog {
      return CraftingItemCatalogSchema.create(data);
    },
  };
}
