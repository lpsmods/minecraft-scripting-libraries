import { assert } from "superstruct";
import { ItemComponentTypes, ItemData, ItemSchema, type Item } from "../schema";

/**
 * Defines the item asset.
 */
export function defineItem(data: Item): Item {
  assert(data, ItemSchema);
  return data;
}

/**
 * Creates an item definition.
 */
export function item(identifier: string) {
  const data: Partial<ItemData> = {
    description: {
      identifier,
    },
  };

  return {
    component<K extends keyof ItemComponentTypes>(id: K, value: ItemComponentTypes[K]) {
      data.components ??= {};
      data.components[id] = value;
      return this;
    },

    // Helpers

    food(nutrition?: number, saturation_modifier?: number, can_always_eat?: boolean) {
      data.components ??= {};
      data.components["minecraft:food"] = { nutrition, saturation_modifier, can_always_eat };
      return this;
    },
    maxCount(maxCount: number) {
      data.components ??= {};
      data.components["minecraft:max_stack_size"] = maxCount;
      return this;
    },
    maxDamage(maxDamage: number) {
      data.components ??= {};
      data.components["minecraft:durability"] = {
        max_durability: maxDamage,
      };
      return this;
    },
    rarity(rarity: string) {
      data.components ??= {};
      data.components["minecraft:rarity"] = rarity;
      return this;
    },
    displayName(value: string) {
      data.components ??= {};
      data.components["minecraft:display_name"] = { value };
      return this;
    },
    menuCategory(category: string, group?: string, isHiddenInCommands?: boolean) {
      data.description!.menu_category = { category };
      if (group !== undefined) {
        data.description!.menu_category.group = group;
      }
      if (isHiddenInCommands !== undefined) {
        data.description!.menu_category.is_hidden_in_commands = isHiddenInCommands;
      }
      return this;
    },

    build(): Item {
      return ItemSchema.create({ "minecraft:item": data }) as Item;
    },
  };
}
