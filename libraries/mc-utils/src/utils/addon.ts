/**
 * Generic add-on functions.
 */

import {
  BlockType,
  BlockTypes,
  DimensionType,
  DimensionTypes,
  EffectType,
  EffectTypes,
  EnchantmentType,
  EnchantmentTypes,
  EntityType,
  EntityTypes,
  ItemType,
  ItemTypes,
  world,
} from "@minecraft/server";

export abstract class AddonUtils {
  static addonId: string = "mcutils";
  static addons: string[] = [];

  /**
   * Checks if the add-on is installed.
   * @param {string} addonId
   * @returns {string[]}
   */
  static hasAddon(addonId: string): boolean {
    return this.addons.includes(addonId);
  }

  /**
   * Returns a identifier with the addonId as the namespace.
   * @param {string} path
   * @returns {string}
   */
  static makeId(path: string): string {
    return `${this.addonId}:${path}`;
  }

  /**
   * All blocks added by this add-on.
   * @returns {BlockType[]}
   */
  static getBlockTypes(): BlockType[] {
    return BlockTypes.getAll().filter((block) => block.id.startsWith(`${this.addonId}:`));
  }

  /**
   * All blocks added by this add-on.
   * @returns {ItemType[]}
   */
  static getItemTypes(): ItemType[] {
    return ItemTypes.getAll().filter((item) => item.id.startsWith(`${this.addonId}:`));
  }

  /**
   * All entities added by this add-on.
   * @returns {EntityType[]}
   */
  static getEntityTypes(): EntityType[] {
    return EntityTypes.getAll().filter((entity) => entity.id.startsWith(`${this.addonId}:`));
  }

  /**
   * All dimensions added by this add-on.
   * @returns {DimensionType[]}
   */
  static getDimensionTypes(): DimensionType[] {
    return DimensionTypes.getAll().filter((dim) => dim.typeId.startsWith(`${this.addonId}:`));
  }

  /**
   * All effects added by this add-on.
   * @returns {DimensionType[]}
   */
  static getEffectTypes(): EffectType[] {
    return EffectTypes.getAll().filter((effect) => effect.getName().startsWith(`${this.addonId}:`));
  }

  /**
   * All enchantments added by this add-on.
   * @returns {EnchantmentType[]}
   */
  static getEnchantmentTypes(): EnchantmentType[] {
    return EnchantmentTypes.getAll().filter((enchant) => enchant.id.startsWith(`${this.addonId}:`));
  }
}

world.afterEvents.worldLoad.subscribe(() => {
  const result: Set<string> = new Set();
  for (const block of BlockTypes.getAll()) {
    result.add(block.id);
  }
  for (const item of ItemTypes.getAll()) {
    result.add(item.id);
  }
  for (const entity of EntityTypes.getAll()) {
    result.add(entity.id);
  }
  for (const dimension of DimensionTypes.getAll()) {
    result.add(dimension.typeId);
  }
  for (const effect of EffectTypes.getAll()) {
    result.add(effect.getName());
  }
  for (const enchant of EnchantmentTypes.getAll()) {
    result.add(enchant.id);
  }
  AddonUtils.addons = [...result];
});
