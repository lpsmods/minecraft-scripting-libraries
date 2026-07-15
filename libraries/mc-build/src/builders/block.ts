import { assert } from "superstruct";
import { BlockComponentTypes, BlockData, BlockSchema, type Block } from "../schema";

/**
 * Defines the block asset.
 */
export function defineBlock(data: Block): Block {
  assert(data, BlockSchema);
  return data;
}

/**
 * Creates a block definition.
 */
export function block(identifier: string) {
  const data: Partial<BlockData> = {
    description: {
      identifier,
    },
  };

  return {
    component<K extends keyof BlockComponentTypes>(id: K, value: BlockComponentTypes[K]) {
      data.components ??= {};
      data.components[id] = value;
      return this;
    },

    // Helpers

    geometry(identifier?: string) {
      data.components ??= {};
      data.components["minecraft:geometry"] = identifier ?? "minecraft:geometry.full_block";
      return this;
    },
    texture(texture: string) {
      data.components ??= {};
      data.components["minecraft:material_instances"] = { "*": { texture } };
      return this;
    },
    air() {
      data.components ??= {};
      data.components["minecraft:selection_box"] = false;
      this.noCollision();
      this.replaceable();
      return this;
    },
    destroyTime(value: number) {
      data.components ??= {};
      data.components["minecraft:destructible_by_mining"] = { seconds_to_destroy: value };
      return this;
    },
    friction(value: number) {
      data.components ??= {};
      data.components["minecraft:friction"] = value;
      return this;
    },
    ignitedByLava() {
      data.components ??= {};
      data.components["minecraft:flammable"] = {};
      return this;
    },
    instabreak() {
      return this.strength(0, 0);
    },
    isRedstoneConductor() {
      data.components ??= {};
      data.components["minecraft:redstone_consumer"] = {};
      return this;
    },
    lightEmission(value: number) {
      data.components ??= {};
      data.components["minecraft:light_emission"] = value;
      return this;
    },
    lootFrom(value: string) {
      data.components ??= {};
      data.components["minecraft:loot"] = value;
      return this;
    },
    mapColor(value: string) {
      data.components ??= {};
      data.components["minecraft:map_color"] = value;
      return this;
    },
    noCollision() {
      data.components ??= {};
      data.components["minecraft:collision_box"] = false;
      return this;
    },
    pushReaction(movement_type: string) {
      data.components ??= {};
      data.components["minecraft:movable"] = { movement_type };
      return this;
    },
    ticks() {
      data.components ??= {};
      data.components["minecraft:tick"] = { interval_range: [0, 0], looping: true };
      return this;
    },
    replaceable() {
      data.components ??= {};
      data.components["minecraft:replaceable"] = {};
      return this;
    },
    strength(mining: number, explosion?: number) {
      data.components ??= {};
      data.components["minecraft:destructible_by_mining"] = { seconds_to_destroy: mining };
      data.components["minecraft:destructible_by_explosion"] = { explosion_resistance: explosion ?? mining };
      return this;
    },
    explosionResistance(value: number) {
      data.components ??= {};
      data.components["minecraft:destructible_by_explosion"] = { explosion_resistance: value };
      return this;
    },
    displayName(value: string) {
      data.components ??= {};
      data.components["minecraft:display_name"] = value;
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

    build(): Block {
      return BlockSchema.create({ "minecraft:block": data }) as Block;
    },
  };
}
